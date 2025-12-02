import type { BlogPost } from '$lib/types/blog';

export const posts: BlogPost[] = [
	{
		slug: 'installing-mcp-servers',
		title: '安裝 MCP Servers - 我的開發環境設置',
		date: '2025-12-02',
		description: '記錄我為 VibeBlog 專案設置開發環境時安裝的 MCP (Model Context Protocol) servers。',
		content: `
# 安裝 MCP Servers

在開始建立 VibeBlog 之前，我先設置了開發環境，安裝了幾個有用的 MCP (Model Context Protocol) servers 來提升開發效率。

## 已安裝的 MCP Servers

### 1. sequential-thinking
- **工具數量**: 1 個工具已啟用
- **狀態**: ✅ 啟用中
- **用途**: 提供順序思考功能，幫助進行複雜的問題分析和解決

### 2. chrome-devtools
- **工具數量**: 26 個工具已啟用
- **狀態**: ✅ 啟用中
- **用途**: 強大的 Chrome 開發工具整合，可以進行瀏覽器調試、網路監控等功能

### 3. context7
- **工具數量**: 2 個工具已啟用
- **狀態**: ✅ 啟用中
- **用途**: 提供最新的程式庫文檔和代碼範例，非常適合快速查找 API 文檔

### 4. gitmcp
- **工具數量**: 4 個工具已啟用
- **狀態**: ✅ 啟用中
- **用途**: Git 和 GitHub 整合，可以搜尋代碼、獲取文檔等

### 5. awslabs.openapi-mcp-server
- **狀態**: ❌ 錯誤
- **備註**: 此 server 目前有錯誤，需要進一步檢查配置

## 設置截圖

![已安裝的 MCP Servers](/images/mcp-servers.png)

## 下一步

有了這些 MCP servers，我可以更高效地：
- 快速查找和學習新的程式庫
- 進行複雜的問題分析
- 調試和測試應用程式
- 管理 Git 倉庫和代碼

接下來，我將使用這些工具來建立 VibeBlog 的基礎架構。
		`,
		image: '/images/mcp-servers.png'
	}
];

export function getPost(slug: string): BlogPost | undefined {
	return posts.find((post) => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

