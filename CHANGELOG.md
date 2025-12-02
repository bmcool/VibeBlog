# Changelog

所有重要的變更都會記錄在這個文件中。

格式基於 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/)，
版本號遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

## [Unreleased]

### 計劃中
- 搜尋功能
- RSS Feed

## [0.1.1] - 2025-12-02

### Changed
- **優化 MCP 文章內容**：
  - 添加詳細的 MCP 協議介紹和背景說明
  - 為每個 MCP server 添加功能說明和使用場景
  - 添加實際應用案例章節
  - 在文章開頭添加醒目的快速連結區域
  - 所有連結顯示完整 URL，方便複製和分享
  - 優化連結樣式，使用藍色加粗顯示
  - 添加中英文完整版本

### Added
- MCP 文章的英文版本 (`installing-mcp-servers.en.html`)
- 快速連結區域，包含所有相關資源的連結
- 每個 MCP server 的詳細功能說明和相關連結

## [0.1.0] - 2025-12-02

### Added
- **Precomputed Tags 架構**：實現預計算標籤索引系統
  - 使用 `content/indexes/tags.json` 和 `tags.en.json` 預計算標籤索引
  - 零運行時計算，O(1) 查詢效能
  - 自動生成標籤索引腳本 (`npm run generate:tags`)
- **多語言支持（中英文）**：
  - 完整的雙語內容管理系統
  - URL 參數語言切換 (`?lang=en` / `?lang=zh`)
  - 語言切換器組件
  - 所有頁面支持中英文切換
- **標籤系統**：
  - 標籤列表頁面 (`/tags`)
  - 標籤詳情頁面 (`/tags/[tag]`)
  - 文章標籤顯示和導航
- **內容管理架構**：
  - `content/` 目錄結構（raw, processed, meta, indexes）
  - 文章 metadata JSON 格式（支持多語言字段）
  - 處理後的 HTML 內容存儲
- **新文章**：
  - "Precomputed Tags：用預計算索引取代動態搜尋的標籤系統"
  - 中英文完整版本

### Changed
- 重構內容讀取系統，使用文件系統而非內存數組
- 更新所有路由以支持多語言
- 優化導航鏈接，保持語言參數

### Technical Details
- 新增 `tsx` 作為腳本執行工具
- 新增 `src/lib/content.ts` 內容管理模組
- 新增 `src/lib/utils/language.ts` 語言工具
- 新增 `src/lib/components/LanguageSwitcher.svelte` 語言切換組件
- 更新類型定義，支持 `PostMeta` 和 `Language` 類型

## [0.0.1] - 2025-12-02

### Added
- 初始化 SvelteKit 專案（TypeScript + Vite）
- 建立部落格系統架構
  - 部落格列表頁面 (`/blog`)
  - 單篇文章頁面 (`/blog/[slug]`)
  - 支援 Markdown 內容渲染
- 添加導航欄（首頁、文章）
- 響應式設計
- 第一篇部落格文章：「安裝 MCP Servers - 我的開發環境設置」
  - 記錄了 5 個 MCP servers 的安裝和配置
  - 包含設置截圖
- 首頁顯示最新文章預覽

### Changed
- 更新 README.md 為 VibeBlog 專案說明

### Technical Details
- 使用 SvelteKit 2.48.5
- 使用 Svelte 5.43.8
- 使用 TypeScript 5.9.3
- 使用 Vite 7.2.2 作為建置工具
- 使用 marked 17.0.1 進行 Markdown 渲染
- 使用 adapter-auto 7.0.0 支援多種部署環境

[Unreleased]: https://github.com/bmcool/VibeBlog/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/bmcool/VibeBlog/releases/tag/v0.0.1

