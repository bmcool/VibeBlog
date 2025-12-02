# deapi-txt2img MCP Server

这是一个 FastMCP server，提供调用 deapi.ai Text-to-Image API 的 MCP 工具。

## 功能

- **generate_image**: 完整的图片生成工具，支持所有参数
- **generate_image_quick**: 快速生成工具，使用默认参数

## 安装和配置

### 1. 设置 API Key

创建 `.env` 文件（基于 `.env.example`）：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 deapi.ai API key：

```
DEAPI_API_KEY=your_actual_api_key_here
```

或者设置环境变量：

```bash
export DEAPI_API_KEY=your_actual_api_key_here
```

### 2. 运行 Server

```bash
# 激活虚拟环境
source ../venv/bin/activate

# 运行 server（stdio 模式，用于 Cursor）
python deapi_txt2img.py

# 或使用 fastmcp CLI
fastmcp run deapi_txt2img.py
```

### 3. 在 Cursor 中配置

#### 方法 1: 使用环境变量（推荐）

在 Cursor 的 MCP 配置文件中添加（通常位于 `~/.cursor/mcp.json` 或 Cursor 设置中）：

```json
{
  "mcpServers": {
    "deapi-txt2img": {
      "command": "python",
      "args": [
        "/Users/zephyrlin/Desktop/VibeBlog/mcp_servers/deapi_txt2img.py"
      ],
      "env": {
        "DEAPI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**注意**: 将路径 `/Users/zephyrlin/Desktop/VibeBlog` 替换为你实际的项目路径。

#### 方法 2: 使用绝对路径和虚拟环境

如果你想使用项目的虚拟环境：

```json
{
  "mcpServers": {
    "deapi-txt2img": {
      "command": "/Users/zephyrlin/Desktop/VibeBlog/venv/bin/python",
      "args": [
        "/Users/zephyrlin/Desktop/VibeBlog/mcp_servers/deapi_txt2img.py"
      ],
      "env": {
        "DEAPI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### 方法 3: 使用 shell 脚本（更灵活）

创建一个启动脚本 `mcp_servers/run_deapi.sh`:

```bash
#!/bin/bash
cd /Users/zephyrlin/Desktop/VibeBlog
source venv/bin/activate
python mcp_servers/deapi_txt2img.py
```

然后在 Cursor 配置中：

```json
{
  "mcpServers": {
    "deapi-txt2img": {
      "command": "/bin/bash",
      "args": [
        "/Users/zephyrlin/Desktop/VibeBlog/mcp_servers/run_deapi.sh"
      ],
      "env": {
        "DEAPI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## API 参数说明

### generate_image

- **prompt** (必填): 图片生成提示词
- **model** (可选): 模型名称，默认 "Flux1schnell"
- **width** (可选): 图片宽度，默认 768
- **height** (可选): 图片高度，默认 768
- **seed** (可选): 随机种子，用于复现结果
- **steps** (可选): 生成步数，默认 4
- **negative_prompt** (可选): 负面提示词
- **api_key** (可选): API 密钥，如果不提供则使用环境变量

### generate_image_quick

- **prompt** (必填): 图片生成提示词
- **api_key** (可选): API 密钥

## 使用示例

在 Cursor 中，你可以这样使用：

```
请使用 deapi-txt2img 生成一张关于"一只可爱的猫咪在花园里"的图片
```

或者更详细的请求：

```
请使用 generate_image 工具生成图片：
- prompt: "一只可爱的猫咪在花园里，阳光明媚"
- width: 1024
- height: 1024
- steps: 8
```

## 测试 Server

运行测试脚本（需要设置 DEAPI_API_KEY）：

```bash
cd mcp_servers
source ../venv/bin/activate
export DEAPI_API_KEY=your_api_key_here
python test_server.py
```

## 故障排除

### Server 无法启动

1. 检查 Python 路径是否正确
2. 确认虚拟环境已激活
3. 检查 FastMCP 是否已安装：`pip list | grep fastmcp`

### API 调用失败

1. 确认 API key 已正确设置
2. 检查网络连接
3. 查看错误信息中的详细错误描述

### Cursor 无法连接

1. 确认 Cursor 的 MCP 配置路径正确
2. 检查脚本是否有执行权限：`chmod +x run_deapi.sh`
3. 查看 Cursor 的日志文件获取详细错误信息

## 相关链接

- [deapi.ai 官方网站](https://deapi.ai)
- [FastMCP 文档](https://fastmcp.wiki)

