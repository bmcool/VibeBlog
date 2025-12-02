"""
测试 deapi-txt2img MCP server

运行此脚本来测试 server 是否正常工作（需要设置 DEAPI_API_KEY 环境变量）
"""

import os
import sys
from deapi_txt2img import generate_image, generate_image_quick

def test_server():
    """测试 server 功能"""
    print("🧪 测试 deapi-txt2img MCP Server\n")
    
    # 检查 API key
    api_key = os.getenv("DEAPI_API_KEY")
    if not api_key or api_key == "YOUR_API_KEY":
        print("❌ 错误: 请设置 DEAPI_API_KEY 环境变量")
        print("   例如: export DEAPI_API_KEY=your_api_key_here")
        return False
    
    print(f"✓ API Key 已设置: {api_key[:10]}...")
    
    # 测试快速生成（不实际调用 API，只测试函数结构）
    print("\n📝 测试工具函数结构...")
    
    try:
        # 测试参数验证
        result = generate_image_quick(
            prompt="test prompt",
            api_key=api_key
        )
        print("✓ generate_image_quick 函数正常")
    except Exception as e:
        print(f"❌ generate_image_quick 错误: {e}")
        return False
    
    try:
        result = generate_image(
            prompt="test prompt",
            model="Flux1schnell",
            width=768,
            height=768,
            steps=4,
            api_key=api_key
        )
        print("✓ generate_image 函数正常")
    except Exception as e:
        print(f"❌ generate_image 错误: {e}")
        return False
    
    print("\n✅ 所有测试通过！Server 已准备就绪。")
    print("\n💡 提示: 要在 Cursor 中使用，请参考 README.md 中的配置说明")
    
    return True

if __name__ == "__main__":
    success = test_server()
    sys.exit(0 if success else 1)

