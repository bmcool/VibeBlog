# Content 目錄結構

VibeBlog 使用預計算標籤（Precomputed Tags）架構，所有內容以檔案形式管理。

## 目錄結構

```
content/
  raw/              # 原始文章（Markdown / 純文字）
  processed/        # AI 處理後的 HTML 內容
  meta/            # 文章 metadata（JSON）
  indexes/         # 預計算的索引檔案
    tags.json      # 標籤索引（tag -> slugs 映射）
```

## 文章格式

### Meta JSON (`content/meta/{slug}.json`)

每篇文章需要一個對應的 meta JSON 檔案：

```json
{
  "slug": "article-slug",
  "title": "文章標題",
  "date": "2025-12-02",
  "tags": ["標籤1", "標籤2"],
  "summary": "文章摘要",
  "heroImage": "/images/hero.png",
  "description": "文章描述（可選）"
}
```

### Processed HTML (`content/processed/{slug}.html`)

AI 處理後的 HTML 內容，直接由前端讀取顯示。

## 工作流程

1. **新增文章**：
   - 在 `content/raw/` 放置原始內容
   - 在 `content/meta/` 建立對應的 JSON 檔案
   - 在 `content/processed/` 放置處理後的 HTML

2. **更新標籤索引**：
   ```bash
   npm run generate:tags
   ```
   此命令會掃描所有 meta JSON 檔案，自動生成 `content/indexes/tags.json`

3. **AI Pipeline 整合**：
   - AI 可以自動生成 meta JSON（包含 tags）
   - AI 可以自動生成 processed HTML
   - 執行 `npm run generate:tags` 更新索引

## 圖片管理

所有圖片統一存放在 `static/images/` 目錄下：

```
static/
  ├── images/                    # 主要圖片目錄
  │   ├── mcp-servers.png       # 一般圖片（手動上傳）
  │   └── ai-generated/         # AI 生成的圖片專用目錄
  │       ├── article-1.png
  │       └── article-2-hero.png
  └── robots.txt
```

### 圖片路徑規範

- **一般圖片**：放在 `static/images/`，引用路徑為 `/images/filename.png`
- **AI 生成的圖片**：放在 `static/images/ai-generated/`，引用路徑為 `/images/ai-generated/filename.png`

### 在文章中使用圖片

在 HTML 內容中：
```html
<img src="/images/mcp-servers.png" alt="描述">
<!-- 或 AI 生成的圖片 -->
<img src="/images/ai-generated/article-hero.png" alt="描述">
```

在 meta JSON 中：
```json
{
  "heroImage": "/images/hero.png",
  "heroImage": "/images/ai-generated/article-hero.png"
}
```

## 優點

- ✅ **靜態、預計算**：所有分類在 build 時完成
- ✅ **零運行時計算**：前端只讀取 JSON，無需動態掃描
- ✅ **版本控制友好**：所有內容都是檔案
- ✅ **適合 AI 自動化**：AI 可以直接產出分類資料結構
- ✅ **高效能**：SSG + CDN 完美搭配
- ✅ **圖片管理清晰**：區分一般圖片和 AI 生成圖片，便於維護


