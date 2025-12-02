#!/bin/bash
# FastMCP Server 启动脚本
# 用于在 Cursor 中运行 deapi-txt2img MCP server

# 获取脚本所在目录的父目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 切换到项目根目录
cd "$PROJECT_ROOT"

# 激活虚拟环境
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
else
    echo "错误: 找不到虚拟环境 venv/bin/activate" >&2
    exit 1
fi

# 运行 MCP server
python "$SCRIPT_DIR/deapi_txt2img.py"

