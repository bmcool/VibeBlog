# Python 虚拟环境说明

本项目包含一个 Python 虚拟环境，用于运行 FastMCP 相关工具。

## 环境信息

- **Python 版本**: 3.12.9
- **虚拟环境路径**: `venv/`
- **主要工具**: FastMCP 2.13.2

## 激活虚拟环境

```bash
source venv/bin/activate
```

## 已安装的包

- **FastMCP 2.13.2**: 用于构建 MCP servers 和 clients 的 Python 框架

完整依赖列表请查看 `requirements.txt`

## 使用 FastMCP

激活虚拟环境后，可以使用以下命令：

```bash
# 查看版本信息
fastmcp version

# 查看帮助
fastmcp --help

# 运行 MCP server（开发模式）
fastmcp dev

# 运行 MCP server
fastmcp run

# 检查 MCP server
fastmcp inspect
```

## 安装新包

```bash
source venv/bin/activate
pip install <package-name>
pip freeze > requirements.txt  # 更新依赖列表
```

## 退出虚拟环境

```bash
deactivate
```

