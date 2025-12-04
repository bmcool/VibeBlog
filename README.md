# VibeBlog

VibeBlog 專案 - 基於 SvelteKit 建立的部落格應用程式

Powered by [`sv`](https://github.com/sveltejs/cli) and [SvelteKit](https://kit.svelte.dev).

## 開發

安裝依賴：

```sh
npm install
```

啟動開發伺服器：

```sh
npm run dev

# 或自動開啟瀏覽器
npm run dev -- --open
```

## 構建

生成生產版本：

```sh
npm run build
```

預覽生產版本：

```sh
npm run preview
```

## 部署到 GitHub Pages

### 自動部署（推薦）

專案已配置 GitHub Actions，會自動構建和部署：

1. **啟用 GitHub Pages**：
   - 前往 GitHub 倉庫的 Settings → Pages
   - Source 選擇 "GitHub Actions"

2. **配置自定義域名**：
   - 在 Settings → Pages → Custom domain 中輸入 `vibeblog.app`
   - 勾選 "Enforce HTTPS"
   - GitHub 會自動創建 CNAME 文件（專案中已包含）

3. **配置 DNS**：
   在域名服務商（如 Cloudflare、Namecheap 等）添加以下 DNS 記錄：
   - **類型 A**：`@` → `185.199.108.153`
   - **類型 A**：`@` → `185.199.109.153`
   - **類型 A**：`@` → `185.199.110.153`
   - **類型 A**：`@` → `185.199.111.153`
   - **類型 CNAME**：`www` → `你的用戶名.github.io`

4. **推送代碼**：
   ```sh
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

5. **等待部署完成**：
   - 在 Actions 標籤頁查看部署進度
   - 部署完成後，網站會自動發布到 `https://vibeblog.app`

### 手動部署

如果需要手動部署：

```sh
# 生成 HTML 文件
npm run generate:html

# 生成標籤索引
npm run generate:tags

# 構建（輸出到 build/ 目錄）
npm run build

# 將 build/ 目錄的內容上傳到靜態託管服務
```

## 內容管理

### 生成文章 HTML

```sh
npm run generate:html
```

### 生成標籤索引

```sh
npm run generate:tags
```
