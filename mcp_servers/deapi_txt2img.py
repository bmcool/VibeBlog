"""
FastMCP Server for deapi.ai Text-to-Image API

This server provides MCP tools for generating images using deapi.ai's txt2img API.
"""

import os
import json
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import datetime
from fastmcp import FastMCP
import httpx
from dotenv import load_dotenv

# 加载 .env 文件
# 获取当前文件所在目录（mcp_servers），然后向上找到项目根目录
current_file = Path(__file__).resolve()
project_root = current_file.parent.parent  # mcp_servers -> 项目根目录
env_file = project_root / ".env"

# 如果 .env 文件存在，加载它
if env_file.exists():
    load_dotenv(env_file)
else:
    # 如果找不到 .env，也尝试从当前工作目录加载
    load_dotenv()

# 创建 FastMCP server 实例
mcp = FastMCP(name="deapi-txt2img")

# 从环境变量获取 API key，如果没有则使用默认值
DEAPI_API_KEY = os.getenv("DEAPI_API_KEY", "YOUR_API_KEY")
DEAPI_BASE_URL = "https://api.deapi.ai"
TXT2IMG_URL = f"{DEAPI_BASE_URL}/api/v1/client/txt2img"
REQUEST_STATUS_URL = f"{DEAPI_BASE_URL}/api/v1/client/request-status"

# Metadata 存储目录
METADATA_DIR = project_root / "static" / "images" / "ai-generated" / ".metadata"
METADATA_DIR.mkdir(parents=True, exist_ok=True)

# 临时存储生成参数的内存缓存（request_id -> metadata）
_generation_cache: Dict[str, Dict[str, Any]] = {}


def save_image_metadata(
    request_id: str,
    prompt: str,
    model: str,
    width: int,
    height: int,
    seed: int,
    steps: int,
    guidance: float,
    loras: List[Dict[str, Any]],
    negative_prompt: Optional[str],
    result_url: str,
    file_path: str
) -> None:
    """
    保存图片生成的 metadata 到 JSON 文件
    
    Args:
        request_id: 请求 ID
        prompt: 提示词
        model: 模型名称
        width: 图片宽度
        height: 图片高度
        seed: 随机种子
        steps: 步数
        guidance: Guidance scale
        loras: LoRA 模型数组
        negative_prompt: 负面提示词
        result_url: 结果 URL
        file_path: 保存的文件路径
    """
    metadata = {
        "request_id": request_id,
        "prompt": prompt,
        "model": model,
        "width": width,
        "height": height,
        "seed": seed,
        "steps": steps,
        "guidance": guidance,
        "loras": loras,
        "negative_prompt": negative_prompt,
        "result_url": result_url,
        "file_path": file_path,
        "generated_at": datetime.now().isoformat(),
        "tags": [],  # 可以后续添加标签用于搜索
        "description": "",  # 可以后续添加描述
    }
    
    # 保存到 metadata 目录
    metadata_file = METADATA_DIR / f"{request_id}.json"
    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    
    # 同时更新索引文件（所有图片的列表）
    index_file = METADATA_DIR / "index.json"
    if index_file.exists():
        with open(index_file, "r", encoding="utf-8") as f:
            index = json.load(f)
    else:
        index = {"images": []}
    
    # 检查是否已存在，如果存在则更新，否则添加
    existing = next((img for img in index["images"] if img["request_id"] == request_id), None)
    if existing:
        existing.update(metadata)
    else:
        index["images"].append(metadata)
    
    # 按生成时间排序（最新的在前）
    index["images"].sort(key=lambda x: x.get("generated_at", ""), reverse=True)
    
    with open(index_file, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)


def _get_request_status_internal(request_id: str, api_key: Optional[str] = None) -> dict:
    """
    内部函数：查询图片生成请求的状态（不经过 MCP 工具装饰器）
    """
    # 使用提供的 api_key 或环境变量中的 key
    auth_key = api_key or DEAPI_API_KEY
    
    if auth_key == "YOUR_API_KEY":
        return {
            "error": "API key not configured",
            "message": "Please set DEAPI_API_KEY environment variable or provide api_key parameter"
        }
    
    # 准备请求头
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {auth_key}"
    }
    
    try:
        # 发送 GET 请求
        with httpx.Client(timeout=30.0) as client:
            response = client.get(
                f"{REQUEST_STATUS_URL}/{request_id}",
                headers=headers
            )
            response.raise_for_status()
            return response.json()
    
    except httpx.HTTPStatusError as e:
        return {
            "error": f"HTTP {e.response.status_code}",
            "message": e.response.text,
            "details": str(e)
        }
    except httpx.RequestError as e:
        return {
            "error": "Request failed",
            "message": str(e)
        }
    except Exception as e:
        return {
            "error": "Unexpected error",
            "message": str(e)
        }


@mcp.tool
def generate_image(
    prompt: str,
    model: str = "Flux1schnell",
    width: int = 768,
    height: int = 768,
    seed: int = -1,
    steps: int = 4,
    guidance: float = 7.5,
    loras: Optional[List[Dict[str, Any]]] = None,
    negative_prompt: Optional[str] = None,
    api_key: Optional[str] = None
) -> dict:
    """
    使用 deapi.ai API 生成图片
    
    根据 deapi.ai API 规范，此工具会发送图片生成请求并返回 request_id。
    注意：这是一个异步 API，返回的是请求 ID，需要使用其他端点查询生成结果。
    
    Args:
        prompt: 图片生成提示词（必填）- 描述想要生成的图片内容
        model: 使用的模型名称，默认为 "Flux1schnell"。可用模型可通过 GET /api/v1/client/models 端点查询
        width: 图片宽度（像素），默认为 768
        height: 图片高度（像素），默认为 768
        seed: 随机种子，用于复现结果。默认为 -1 表示使用随机种子
        steps: 推理步数，默认为 4。更多步数通常质量更好但速度更慢
        guidance: Guidance scale（引导强度），控制生成图片与提示词的匹配程度。默认为 7.5。值越高越遵循提示词
        loras: LoRA 模型数组，用于应用额外的风格或特征。默认为空数组 []。
               每个元素应为字典格式：{"name": "lora_name", "weight": 0.5}
               - name: LoRA 模型名称（字符串）
               - weight: LoRA 权重（数字，必须 >= 0）
        negative_prompt: 负面提示词，用于排除不想要的内容（可选）
        api_key: API 密钥，如果不提供则使用环境变量 DEAPI_API_KEY
    
    Returns:
        包含生成结果的字典，格式为：
        {
            "data": {
                "request_id": "string"  # 用于查询生成结果的请求 ID
            }
        }
        如果出错，返回包含 "error" 和 "message" 字段的字典
    """
    # 使用提供的 api_key 或环境变量中的 key
    auth_key = api_key or DEAPI_API_KEY
    
    if auth_key == "YOUR_API_KEY":
        return {
            "error": "API key not configured",
            "message": "Please set DEAPI_API_KEY environment variable or provide api_key parameter"
        }
    
    # 准备请求数据（根据 API 规范，所有字段都是必需的）
    payload = {
        "prompt": prompt,
        "model": model,
        "width": width,
        "height": height,
        "steps": steps,
        "seed": seed,
        "guidance": guidance,
        "loras": loras if loras is not None else []
    }
    
    # 如果提供了 negative_prompt，添加到 payload
    if negative_prompt is not None:
        payload["negative_prompt"] = negative_prompt
    
    # 准备请求头
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {auth_key}"
    }
    
    try:
        # 发送 POST 请求
        with httpx.Client(timeout=60.0) as client:
            response = client.post(
                TXT2IMG_URL,
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            result = response.json()
            
            # 如果成功获取 request_id，缓存生成参数
            if "data" in result and "request_id" in result["data"]:
                request_id = result["data"]["request_id"]
                _generation_cache[request_id] = {
                    "prompt": prompt,
                    "model": model,
                    "width": width,
                    "height": height,
                    "seed": seed,
                    "steps": steps,
                    "guidance": guidance,
                    "loras": loras if loras is not None else [],
                    "negative_prompt": negative_prompt
                }
            
            return result
    
    except httpx.HTTPStatusError as e:
        return {
            "error": f"HTTP {e.response.status_code}",
            "message": e.response.text,
            "details": str(e)
        }
    except httpx.RequestError as e:
        return {
            "error": "Request failed",
            "message": str(e)
        }
    except Exception as e:
        return {
            "error": "Unexpected error",
            "message": str(e)
        }


@mcp.tool
def generate_image_quick(
    prompt: str,
    api_key: Optional[str] = None
) -> dict:
    """
    快速生成图片（使用默认参数）
    
    这是 generate_image 的简化版本，使用以下默认参数：
    - model: "Flux1schnell"
    - width: 768
    - height: 768
    - seed: -1 (随机)
    - steps: 4
    - guidance: 7.5
    - loras: [] (空数组)
    - negative_prompt: None
    
    Args:
        prompt: 图片生成提示词（必填）- 描述想要生成的图片内容
        api_key: API 密钥，如果不提供则使用环境变量 DEAPI_API_KEY
    
    Returns:
        包含生成结果的字典，格式为：
        {
            "data": {
                "request_id": "string"  # 用于查询生成结果的请求 ID
            }
        }
        如果出错，返回包含 "error" 和 "message" 字段的字典
    """
    return generate_image(
        prompt=prompt,
        api_key=api_key
    )


@mcp.tool
def get_request_status(
    request_id: str,
    api_key: Optional[str] = None
) -> dict:
    """
    查询图片生成请求的状态
    
    根据 deapi.ai API 规范，此工具会查询指定 request_id 的生成状态。
    
    Args:
        request_id: 生成请求的 ID（从 generate_image 返回的 request_id）
        api_key: API 密钥，如果不提供则使用环境变量 DEAPI_API_KEY
    
    Returns:
        包含请求状态的字典，格式为：
        {
            "data": {
                "status": "pending" | "processing" | "done" | "failed",
                "progress": 0.0-100.0,  # 进度百分比
                "preview": "string" | null,  # 预览 URL（如果可用）
                "result_url": "string" | null,  # 结果图片 URL（status 为 "done" 时可用）
                "result": "string" | null  # 生成的文本（如果有）
            }
        }
        如果出错，返回包含 "error" 和 "message" 字段的字典
    """
    return _get_request_status_internal(request_id, api_key)


@mcp.tool
def download_image(
    request_id: str,
    save_path: Optional[str] = None,
    api_key: Optional[str] = None,
    prompt: Optional[str] = None,
    model: Optional[str] = None,
    width: Optional[int] = None,
    height: Optional[int] = None,
    seed: Optional[int] = None,
    steps: Optional[int] = None,
    guidance: Optional[float] = None,
    loras: Optional[List[Dict[str, Any]]] = None,
    negative_prompt: Optional[str] = None
) -> dict:
    """
    下载生成的图片到本地
    
    此工具会先查询请求状态，如果图片已生成完成，则下载到指定路径。
    如果不指定 save_path，会保存到项目根目录的 static/images/ai-generated/ 目录。
    如果提供了生成参数（prompt, model 等），会自动保存 metadata 以便未来搜索和再利用。
    
    Args:
        request_id: 生成请求的 ID（从 generate_image 返回的 request_id）
        save_path: 保存图片的路径（可选）。如果不提供，会使用默认路径：static/images/ai-generated/{request_id}.png
        api_key: API 密钥，如果不提供则使用环境变量 DEAPI_API_KEY
        prompt: 图片生成提示词（可选，用于保存 metadata）
        model: 使用的模型（可选，用于保存 metadata）
        width: 图片宽度（可选，用于保存 metadata）
        height: 图片高度（可选，用于保存 metadata）
        seed: 随机种子（可选，用于保存 metadata）
        steps: 推理步数（可选，用于保存 metadata）
        guidance: Guidance scale（可选，用于保存 metadata）
        loras: LoRA 模型数组（可选，用于保存 metadata）
        negative_prompt: 负面提示词（可选，用于保存 metadata）
    
    Returns:
        包含下载结果的字典，格式为：
        {
            "success": true,
            "file_path": "保存的文件路径",
            "status": "done"
        }
        如果图片还未生成完成，返回：
        {
            "success": false,
            "status": "pending" | "processing",
            "progress": 0.0-100.0,
            "message": "图片还在生成中，请稍后再试"
        }
        如果出错，返回包含 "error" 和 "message" 字段的字典
    """
    # 先查询状态（使用内部函数，避免工具调用问题）
    status_result = _get_request_status_internal(request_id, api_key)
    
    if "error" in status_result:
        return status_result
    
    # 检查状态数据
    if "data" not in status_result:
        return {
            "error": "Invalid response",
            "message": "响应中缺少 data 字段"
        }
    
    data = status_result["data"]
    status = data.get("status")
    
    # 如果还未完成，返回状态信息
    if status not in ["done"]:
        return {
            "success": False,
            "status": status,
            "progress": data.get("progress", 0.0),
            "message": f"图片还在生成中（状态：{status}），请稍后再试"
        }
    
    # 获取图片 URL
    result_url = data.get("result_url")
    if not result_url:
        return {
            "error": "No result URL",
            "message": "状态为 done 但未找到 result_url"
        }
    
    # 确定保存路径
    if save_path:
        save_file = Path(save_path)
    else:
        # 使用默认路径：static/images/ai-generated/{request_id}.png
        save_file = project_root / "static" / "images" / "ai-generated" / f"{request_id}.png"
    
    # 确保目录存在
    save_file.parent.mkdir(parents=True, exist_ok=True)
    
    # 使用提供的 api_key 或环境变量中的 key
    auth_key = api_key or DEAPI_API_KEY
    
    # 准备请求头（下载图片可能需要认证）
    headers = {
        "Authorization": f"Bearer {auth_key}"
    }
    
    try:
        # 下载图片
        with httpx.Client(timeout=60.0, follow_redirects=True) as client:
            response = client.get(result_url, headers=headers)
            response.raise_for_status()
            
            # 保存文件
            save_file.write_bytes(response.content)
            
            # 尝试从缓存获取生成参数，如果缓存中没有则使用传入的参数
            cached_params = _generation_cache.get(request_id, {})
            gen_prompt = prompt or cached_params.get("prompt")
            
            # 如果找到了生成参数（从缓存或传入），保存 metadata
            if gen_prompt:
                save_image_metadata(
                    request_id=request_id,
                    prompt=gen_prompt,
                    model=model or cached_params.get("model") or "Flux1schnell",
                    width=width or cached_params.get("width") or 768,
                    height=height or cached_params.get("height") or 768,
                    seed=seed if seed is not None else cached_params.get("seed", -1),
                    steps=steps or cached_params.get("steps") or 4,
                    guidance=guidance or cached_params.get("guidance") or 7.5,
                    loras=loras or cached_params.get("loras", []),
                    negative_prompt=negative_prompt or cached_params.get("negative_prompt"),
                    result_url=result_url,
                    file_path=str(save_file)
                )
                # 清理缓存
                _generation_cache.pop(request_id, None)
            
            return {
                "success": True,
                "file_path": str(save_file),
                "status": "done",
                "url": result_url,
                "metadata_saved": prompt is not None
            }
    
    except httpx.HTTPStatusError as e:
        return {
            "error": f"HTTP {e.response.status_code}",
            "message": f"下载图片失败: {e.response.text}",
            "details": str(e)
        }
    except httpx.RequestError as e:
        return {
            "error": "Download failed",
            "message": str(e)
        }
    except Exception as e:
        return {
            "error": "Unexpected error",
            "message": str(e)
        }


@mcp.tool
def search_generated_images(
    query: Optional[str] = None,
    model: Optional[str] = None,
    tags: Optional[List[str]] = None,
    limit: int = 10
) -> dict:
    """
    搜索已生成的图片 metadata
    
    根据提示词、模型、标签等条件搜索已生成的图片，方便未来再利用。
    
    Args:
        query: 搜索关键词（会在 prompt 和 description 中搜索）
        model: 模型名称过滤
        tags: 标签过滤（列表）
        limit: 返回结果数量限制，默认为 10
    
    Returns:
        包含搜索结果的字典，格式为：
        {
            "count": 结果数量,
            "images": [
                {
                    "request_id": "string",
                    "prompt": "string",
                    "model": "string",
                    "file_path": "string",
                    "generated_at": "string",
                    ...
                }
            ]
        }
    """
    index_file = METADATA_DIR / "index.json"
    
    if not index_file.exists():
        return {
            "count": 0,
            "images": [],
            "message": "还没有保存任何图片 metadata"
        }
    
    try:
        with open(index_file, "r", encoding="utf-8") as f:
            index = json.load(f)
        
        images = index.get("images", [])
        results = []
        
        for img in images:
            # 关键词搜索
            if query:
                query_lower = query.lower()
                prompt_match = query_lower in img.get("prompt", "").lower()
                desc_match = query_lower in img.get("description", "").lower()
                if not (prompt_match or desc_match):
                    continue
            
            # 模型过滤
            if model and img.get("model") != model:
                continue
            
            # 标签过滤
            if tags:
                img_tags = img.get("tags", [])
                if not any(tag in img_tags for tag in tags):
                    continue
            
            results.append(img)
        
        # 限制结果数量
        results = results[:limit]
        
        return {
            "count": len(results),
            "images": results
        }
    
    except Exception as e:
        return {
            "error": "Search failed",
            "message": str(e)
        }


# 如果直接运行此文件，启动 MCP server
if __name__ == "__main__":
    mcp.run()

