# Changelog

所有重要的變更都會記錄在這個文件中。

格式基於 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/)，
版本號遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

## [Unreleased]

### 計劃中
- 更多部落格功能
- 文章分類和標籤
- 搜尋功能
- RSS Feed

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

