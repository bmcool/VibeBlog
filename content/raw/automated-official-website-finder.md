# 自動化找回 1000+ 軟體官方網站：一個智能搜索腳本的設計邏輯

## 背景：從人工維護到自動化的挑戰

![自動化工作流程](/images/ai-generated/automated-official-website-finder.png)

有一間軟體經銷商，原本是靠人工在維護網站上所有的產品。面對 1000 多個軟體，每個軟體的網站結構都不一樣，如果一路以來都寫好爬蟲，這水到渠成，但一個爬蟲都沒有的情況下，要一蹴可及，也並非簡單的事情。

從一開始例如 Cursor 這類的 agent，配合 Playwright MCP 來做，發現雖然做得到，但效率極差，且成本高昂，甚至準確度也無法放心的大量跑。中間也換過好幾次做法，在 1000 多檔軟體的各種例外狀況下（官網早失聯、產品變成子產品、換了網址...etc），其實還是應該要按部就班的來做。

**第一件事情就是先找回這些軟體的官方網站。** 這就是 `openai_web_search.py` 腳本的使命。

## 腳本整體架構

這個腳本的核心目標是：**自動化地從產品名稱找到對應的官方網站域名**。整個系統分為三個主要層次：

1. **WebSearchTool**：底層的網絡搜索工具，負責實際的搜索和網頁抓取
2. **OpenAISearchAssistant**：中層的 AI 助手，負責優化搜索策略和判斷結果
3. **主函數流程**：頂層的批量處理邏輯，負責從數據庫讀取產品並批量處理

## 核心組件一：WebSearchTool 類

### 搜索基礎設施

`WebSearchTool` 使用 `crawl4ai` 作為底層爬蟲引擎，配置如下：

```python
self.browser_config = BrowserConfig(
    headless=True,
    verbose=False
)
self.run_config = CrawlerRunConfig(
    cache_mode=CacheMode.BYPASS,
    delay_before_return_html=2.0,  # 等待 2 秒讓頁面載入
    wait_for_images=False,
    screenshot=False
)
```

選擇 `crawl4ai` 而非傳統的 `requests` 是因為：
- 可以處理 JavaScript 渲染的頁面
- 更好的反爬蟲對抗能力
- 支持異步操作，提高效率

### 搜索執行邏輯

`_search_with_language` 方法的核心流程：

1. **構建搜索 URL**：使用 DuckDuckGo 的 HTML 搜索接口
   ```python
   search_url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
   ```

2. **重試機制**：最多重試 3 次，每次重試前等待時間遞增（10秒、20秒、30秒）
   - 特別處理 403 錯誤（速率限制）
   - 其他錯誤也會重試，但會記錄並繼續

3. **解析搜索結果**：從 HTML 中提取標題、URL 和摘要
   - 處理 DuckDuckGo 的重定向 URL（`/l/?uddg=...` 格式）
   - 提取真實的目標 URL

### 簡單的官方域名查找

`find_official_domain` 方法使用基於分數的匹配算法：

```python
# 計算匹配分數
score = 0

# 域名中包含產品名稱（不區分大小寫）- 最高優先級
if product_name_clean in domain_lower:
    score += 10  # 域名匹配是最重要的指標

# 標題中包含產品名稱
if product_name.lower() in title:
    score += 5

# 標題中包含 "official"
if 'official' in title:
    score += 3

# 摘要中包含產品名稱
if product_name.lower() in snippet:
    score += 2

# 常見的官方域名模式（.com 優先）
if '.com' in domain:
    score += 2
```

這個方法簡單直接，但準確度有限，因為：
- 無法區分官方網站和第三方網站
- 無法處理產品名稱模糊的情況
- 無法理解產品描述來輔助判斷

## 核心組件二：優化的官方域名查找

### 為什麼需要優化？

簡單的基於分數的匹配在實際應用中遇到很多問題：
- 產品名稱可能有多種表達方式（如 "Adobe Photoshop" vs "Photoshop"）
- 第三方網站可能包含產品名稱但並非官方網站
- 產品可能已經改名或合併到其他產品線

因此，我們需要引入 **LLM 來進行智能判斷**。

### 優化流程的三個階段

#### 階段一：提取搜索關鍵詞

`extract_product_search_keywords` 方法使用 LLM 將產品名稱轉換為 1-3 個最有效的搜索關鍵詞：

```python
extraction_prompt = f"""請為以下產品名稱提取1-3個英文搜索關鍵詞，這些關鍵詞應該是最容易搜尋到官方網站的名稱。

要求：
1. 如果是中文產品名，先翻譯成官方英文名稱
2. 提取1-3個關鍵詞組合，優先級從高到低：
   - 公司名 + 產品名（如 "adobe photoshop"）
   - 公司名（如 "adobe"）
   - 產品名（如 "photoshop"）
3. 只使用官方英文名稱，不要使用常見單字
```

這個階段的關鍵是：**找到最容易搜到官網的關鍵詞組合**，而不是最完整的產品名稱。

#### 階段二：順序搜索並批量判斷

`find_official_domain_optimized` 方法的核心邏輯：

1. **順序搜索關鍵詞**：按優先級順序搜索每個關鍵詞
   ```python
   for keyword_idx, keyword in enumerate(search_keywords, 1):
       results = await self.search(keyword, num_results=num_results_per_keyword)
   ```

2. **提取候選域名**：從搜索結果中提取所有可能的域名
   - 處理 DuckDuckGo 重定向 URL
   - 跨關鍵詞去重（同一個域名只保留一次）

3. **批量 LLM 判斷**：一次性將所有候選域名提交給 LLM 判斷
   ```python
   async def judge_candidates(candidates: List[Dict[str, str]]) -> List[Dict[str, Any]]:
       judgment_prompt = f"""請判斷以下多個網站是否為產品 "{product_name}" 的官方網站。
       
       請仔細分析每個網站，判斷是否為該產品的官方網站。請考慮：
       1. 域名是否與產品名稱相關
       2. 標題和摘要是否與產品名稱和描述匹配
       3. 是否看起來像官方網站（而非第三方網站、新聞網站、字典網站等）
       
       請以 JSON 格式返回一個數組，每個元素對應一個網站的判斷結果：
       [
           {{
               "domain": "域名1",
               "is_official": true/false,
               "confidence": 0.0-1.0,
               "reason": "判斷理由"
           }},
           ...
       ]
       """
   ```

4. **早期終止策略**：如果找到信心度 > 0.9 的官方域名，立即返回，跳過剩餘關鍵詞
   ```python
   if best_domain and best_confidence > 0.9:
       print(f"✅ 找到高信心度官方域名: {best_domain}")
       return best_domain
   ```

### 批量判斷的優勢

為什麼要批量判斷而不是逐個判斷？

1. **成本效率**：一次 API 調用可以判斷多個候選域名，比逐個調用更節省成本
2. **上下文一致性**：LLM 可以同時比較多個候選域名，做出更準確的判斷
3. **速度提升**：減少 API 調用次數，提高整體處理速度

### 錯誤處理和速率限制

腳本實現了完善的錯誤處理機制：

```python
# 如果遇到 403 錯誤，等待更長時間（30-60秒）
if "403" in error_msg or "Forbidden" in error_msg:
    delay = 30 + random.uniform(0, 30)  # 30-60 秒隨機延遲
    await asyncio.sleep(delay)
elif keyword != search_keywords[-1]:
    # 其他錯誤也添加延遲（15-20秒）
    delay = 15 + random.uniform(0, 5)
    await asyncio.sleep(delay)
```

關鍵設計點：
- **隨機延遲**：避免被識別為機器人行為
- **分級延遲**：403 錯誤等待更長時間
- **繼續執行**：即使某個關鍵詞失敗，也會繼續處理下一個

## 核心組件三：主函數批量處理流程

### 產品過濾策略

`main_async` 函數實現了智能的產品過濾邏輯：

```python
# 默認行為：跳過已有 URL 的產品，以及1天內已處理過的產品
# 但優先處理：沒有網址但有時間戳的（代表抓取失敗的）
failed_products = []  # 沒有網址但有時間戳的產品（優先處理）
new_products = []     # 完全沒有記錄的產品

for product_id in all_product_ids[:args.limit * 3]:
    url_info = get_product_url_with_timestamp(conn, product_id)
    
    # 如果有 URL，跳過
    if url_info and url_info.get('url'):
        skip_count += 1
        continue
    
    # 如果1天內已處理過，跳過（除非是失敗的）
    if url_info and url_info.get('last_fetched_at'):
        last_fetched = datetime.fromisoformat(...)
        if last_fetched.isoformat() > one_day_ago:
            if not url_info.get('url'):
                failed_products.append(product_id)  # 優先處理失敗的
            else:
                skip_count += 1
            continue
    
    # 分類處理
    if url_info and url_info.get('last_fetched_at') and not url_info.get('url'):
        failed_products.append(product_id)
    elif not url_info:
        new_products.append(product_id)

# 優先處理失敗的產品，然後處理新產品
product_ids_to_process = (failed_products + new_products)[:args.limit]
```

這個策略的優勢：
1. **避免重複處理**：已有 URL 的產品直接跳過
2. **優先重試失敗**：之前失敗的產品優先處理
3. **時間窗口控制**：1 天內已處理過的產品跳過（除非失敗）

### 處理流程

對每個產品的處理流程：

```python
# 1. 獲取產品信息
product_data = get_latest_version(conn, product_id)
product_name = product_data.get('name', '')
product_desc1 = product_data.get('desc1', '') or ''

# 2. 查找官方域名
official_domain = await find_official_domain_optimized(
    product_name=product_name,
    product_desc1=product_desc1,
    api_key=args.api_key
)

# 3. 保存結果
if official_domain:
    official_url = f"https://{official_domain}"
    set_product_url(conn, product_id, official_url)
    success_count += 1
else:
    # 未找到官方域名，清空現有網址但更新撷取時間
    delete_product_url(conn, product_id)
    update_product_url_fetched_time(conn, product_id)
    cleared_count += 1
```

關鍵設計點：
- **即使失敗也更新時間戳**：避免無限重試同一個產品
- **清空無效 URL**：如果找不到官方域名，清空現有的錯誤 URL
- **統計信息**：記錄成功、失敗、跳過的數量

## 技術細節：URL 處理和域名提取

### DuckDuckGo 重定向處理

DuckDuckGo 使用重定向 URL 來保護用戶隱私，格式為 `/l/?uddg=...`。腳本需要提取真實的目標 URL：

```python
# 處理 DuckDuckGo 的重定向 URL
if url.startswith('//duckduckgo.com/l/') or url.startswith('/l/?'):
    try:
        parsed = urllib.parse.urlparse(url if url.startswith('//') else f"https:{url}")
        params = urllib.parse.parse_qs(parsed.query)
        if 'uddg' in params:
            real_url = urllib.parse.unquote(params['uddg'][0])
    except Exception as e:
        print(f"⚠️  解析 URL 失敗: {url}, 錯誤: {e}")
        continue
```

### 域名提取邏輯

`_extract_domain_from_url` 方法處理各種 URL 格式：

```python
def _extract_domain_from_url(self, url: str) -> Optional[str]:
    # 1. 處理 DuckDuckGo 重定向
    if url.startswith('//duckduckgo.com/l/') or url.startswith('/l/?'):
        # 提取 uddg 參數中的真實 URL
        ...
    
    # 2. 跳過 DuckDuckGo 的域名
    if 'duckduckgo.com' in url.lower():
        return None
    
    # 3. 如果 URL 沒有協議，添加 https://
    if not url.startswith(('http://', 'https://')):
        url = f"https://{url}"
    
    # 4. 解析域名
    parsed = urlparse(url)
    domain = parsed.netloc
    
    # 5. 移除 www. 前綴和端口號
    if domain.startswith('www.'):
        domain = domain[4:]
    if ':' in domain:
        domain = domain.split(':')[0]
    
    # 6. 驗證域名格式
    if '.' not in domain or len(domain.split('.')) < 2:
        return None
    
    return domain
```

## 實際應用效果

這個腳本在實際應用中表現如何？

### 優勢

1. **自動化程度高**：可以批量處理大量產品，無需人工介入
2. **準確度提升**：使用 LLM 判斷，比簡單的關鍵詞匹配更準確
3. **成本可控**：批量判斷和早期終止策略降低了 API 調用成本
4. **錯誤恢復**：完善的重試機制和錯誤處理

### 挑戰

1. **速率限制**：DuckDuckGo 和目標網站可能限制爬蟲訪問
2. **特殊情況**：產品改名、合併、官網失聯等情況需要人工處理
3. **成本**：雖然有優化，但 LLM API 調用仍有成本

### 改進方向

1. **緩存機制**：對已處理的產品進行緩存，避免重複處理
2. **並發控制**：在遵守速率限制的前提下，提高並發處理能力
3. **結果驗證**：定期驗證已保存的 URL 是否仍然有效

## 總結

`openai_web_search.py` 腳本展示了一個實用的自動化解決方案，它：

1. **分層設計**：將搜索、判斷、批量處理分離，各司其職
2. **智能判斷**：使用 LLM 進行語義理解，而非簡單的關鍵詞匹配
3. **成本優化**：批量處理和早期終止策略降低 API 成本
4. **錯誤處理**：完善的重試機制和錯誤恢復策略
5. **實際可用**：針對 1000+ 軟體的實際場景設計，處理各種邊緣情況

這個腳本不僅解決了「找回官方網站」這個具體問題，更重要的是展示了如何在複雜的實際場景中，平衡自動化程度、準確度和成本。

---

*這篇文章詳細講述了自動化找回軟體官方網站的腳本設計邏輯，希望對正在構建類似自動化系統的開發者有所幫助。*

