"""
检查 MCP server 中注册的所有工具
"""
import sys
from pathlib import Path

# 添加当前目录到路径
sys.path.insert(0, str(Path(__file__).parent))

from deapi_txt2img import mcp

print("🔍 检查已注册的 MCP 工具\n")

# 获取所有工具
# 尝试使用 _tool_manager
if hasattr(mcp, '_tool_manager'):
    tool_manager = mcp._tool_manager
    if hasattr(tool_manager, '_tools'):
        tools = tool_manager._tools
        print(f"从 _tool_manager._tools 找到 {len(tools)} 个工具:\n")
        for name, tool_info in tools.items():
            print(f"  ✓ {name}")
            if hasattr(tool_info, 'name'):
                print(f"    工具名: {tool_info.name}")
            if hasattr(tool_info, 'description'):
                desc = tool_info.description[:80] if tool_info.description else "无描述"
                print(f"    描述: {desc}...")
            print()
    else:
        print("_tool_manager 没有 _tools 属性")
        print(f"_tool_manager 属性: {[x for x in dir(tool_manager) if not x.startswith('__')]}")
else:
    print("无法找到工具管理器")

