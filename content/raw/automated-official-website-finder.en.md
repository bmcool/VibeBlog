# Automating Official Website Discovery for 1000+ Software Products: Design Logic of an Intelligent Search Script

## Background: The Challenge of Moving from Manual to Automated Maintenance

![Automation Workflow](/images/ai-generated/automated-official-website-finder.png)

A software distributor was originally maintaining all products on their website manually. Facing over 1000 software products, each with different website structures, if crawlers had been written from the start, it would have been straightforward. But starting from scratch with no crawlers, achieving this overnight is not a simple task.

Initially, using agents like Cursor with Playwright MCP, we found that while it was possible, the efficiency was extremely poor, costs were high, and accuracy couldn't be trusted for large-scale runs. After trying several approaches, with various edge cases across 1000+ software products (disconnected official websites, products becoming sub-products, changed URLs, etc.), we realized we needed to proceed step by step.

**The first step was to recover the official websites for these software products.** This is the mission of the `openai_web_search.py` script.

## Overall Script Architecture

The core goal of this script is: **automatically find the corresponding official website domain from a product name**. The entire system is divided into three main layers:

1. **WebSearchTool**: Low-level web search tool responsible for actual searching and web page crawling
2. **OpenAISearchAssistant**: Mid-level AI assistant responsible for optimizing search strategies and judging results
3. **Main Function Flow**: Top-level batch processing logic responsible for reading products from the database and processing them in batches

## Core Component One: WebSearchTool Class

### Search Infrastructure

`WebSearchTool` uses `crawl4ai` as the underlying crawler engine, configured as follows:

```python
self.browser_config = BrowserConfig(
    headless=True,
    verbose=False
)
self.run_config = CrawlerRunConfig(
    cache_mode=CacheMode.BYPASS,
    delay_before_return_html=2.0,  # Wait 2 seconds for page to load
    wait_for_images=False,
    screenshot=False
)
```

We chose `crawl4ai` over traditional `requests` because:
- Can handle JavaScript-rendered pages
- Better anti-crawler resistance
- Supports asynchronous operations for improved efficiency

### Search Execution Logic

The core flow of the `_search_with_language` method:

1. **Build Search URL**: Use DuckDuckGo's HTML search interface
   ```python
   search_url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
   ```

2. **Retry Mechanism**: Retry up to 3 times, with increasing wait times between retries (10s, 20s, 30s)
   - Special handling for 403 errors (rate limiting)
   - Other errors are also retried but logged and continued

3. **Parse Search Results**: Extract title, URL, and snippet from HTML
   - Handle DuckDuckGo redirect URLs (`/l/?uddg=...` format)
   - Extract real target URLs

### Simple Official Domain Finding

The `find_official_domain` method uses a score-based matching algorithm:

```python
# Calculate matching score
score = 0

# Domain contains product name (case-insensitive) - highest priority
if product_name_clean in domain_lower:
    score += 10  # Domain matching is the most important indicator

# Title contains product name
if product_name.lower() in title:
    score += 5

# Title contains "official"
if 'official' in title:
    score += 3

# Snippet contains product name
if product_name.lower() in snippet:
    score += 2

# Common official domain patterns (.com prioritized)
if '.com' in domain:
    score += 2
```

This method is simple and direct, but has limited accuracy because:
- Cannot distinguish between official and third-party websites
- Cannot handle ambiguous product names
- Cannot understand product descriptions to assist judgment

## Core Component Two: Optimized Official Domain Finding

### Why Optimization is Needed?

Simple score-based matching encounters many problems in practical applications:
- Product names may have multiple expressions (e.g., "Adobe Photoshop" vs "Photoshop")
- Third-party websites may contain product names but are not official websites
- Products may have been renamed or merged into other product lines

Therefore, we need to introduce **LLM for intelligent judgment**.

### Three Stages of the Optimization Process

#### Stage One: Extract Search Keywords

The `extract_product_search_keywords` method uses LLM to convert product names into 1-3 most effective search keywords:

```python
extraction_prompt = f"""Please extract 1-3 English search keywords for the following product name. These keywords should be the ones most likely to find the official website.

Requirements:
1. If it's a Chinese product name, first translate to the official English name
2. Extract 1-3 keyword combinations, prioritized from high to low:
   - Company name + Product name (e.g., "adobe photoshop")
   - Company name (e.g., "adobe")
   - Product name (e.g., "photoshop")
3. Only use official English names, avoid common words
```

The key to this stage is: **finding keyword combinations that are most likely to find the official website**, not the most complete product name.

#### Stage Two: Sequential Search and Batch Judgment

The core logic of the `find_official_domain_optimized` method:

1. **Sequential Keyword Search**: Search each keyword in priority order
   ```python
   for keyword_idx, keyword in enumerate(search_keywords, 1):
       results = await self.search(keyword, num_results=num_results_per_keyword)
   ```

2. **Extract Candidate Domains**: Extract all possible domains from search results
   - Handle DuckDuckGo redirect URLs
   - Deduplicate across keywords (keep each domain only once)

3. **Batch LLM Judgment**: Submit all candidate domains to LLM for judgment at once
   ```python
   async def judge_candidates(candidates: List[Dict[str, str]]) -> List[Dict[str, Any]]:
       judgment_prompt = f"""Please judge whether the following websites are the official website of product "{product_name}".
       
       Please carefully analyze each website to determine if it's the official website of this product. Consider:
       1. Whether the domain is related to the product name
       2. Whether the title and snippet match the product name and description
       3. Whether it looks like an official website (not third-party, news, dictionary sites, etc.)
       
       Please return a JSON array, each element corresponding to a website's judgment result:
       [
           {{
               "domain": "domain1",
               "is_official": true/false,
               "confidence": 0.0-1.0,
               "reason": "judgment reason"
           }},
           ...
       ]
       """
   ```

4. **Early Termination Strategy**: If an official domain with confidence > 0.9 is found, return immediately, skipping remaining keywords
   ```python
   if best_domain and best_confidence > 0.9:
       print(f"✅ Found high-confidence official domain: {best_domain}")
       return best_domain
   ```

### Advantages of Batch Judgment

Why batch judgment instead of one-by-one?

1. **Cost Efficiency**: One API call can judge multiple candidate domains, saving costs compared to individual calls
2. **Context Consistency**: LLM can compare multiple candidate domains simultaneously for more accurate judgment
3. **Speed Improvement**: Reducing API calls improves overall processing speed

### Error Handling and Rate Limiting

The script implements comprehensive error handling:

```python
# If encountering 403 error, wait longer (30-60 seconds)
if "403" in error_msg or "Forbidden" in error_msg:
    delay = 30 + random.uniform(0, 30)  # 30-60 second random delay
    await asyncio.sleep(delay)
elif keyword != search_keywords[-1]:
    # Other errors also add delay (15-20 seconds)
    delay = 15 + random.uniform(0, 5)
    await asyncio.sleep(delay)
```

Key design points:
- **Random Delays**: Avoid being identified as bot behavior
- **Tiered Delays**: 403 errors wait longer
- **Continue Execution**: Even if one keyword fails, continue processing the next

## Core Component Three: Main Function Batch Processing Flow

### Product Filtering Strategy

The `main_async` function implements intelligent product filtering logic:

```python
# Default behavior: Skip products with existing URLs, and products processed within 1 day
# But prioritize: products without URLs but with timestamps (representing failed fetches)
failed_products = []  # Products without URLs but with timestamps (prioritize)
new_products = []     # Products with no records at all

for product_id in all_product_ids[:args.limit * 3]:
    url_info = get_product_url_with_timestamp(conn, product_id)
    
    # If URL exists, skip
    if url_info and url_info.get('url'):
        skip_count += 1
        continue
    
    # If processed within 1 day, skip (unless failed)
    if url_info and url_info.get('last_fetched_at'):
        last_fetched = datetime.fromisoformat(...)
        if last_fetched.isoformat() > one_day_ago:
            if not url_info.get('url'):
                failed_products.append(product_id)  # Prioritize failed ones
            else:
                skip_count += 1
            continue
    
    # Categorize
    if url_info and url_info.get('last_fetched_at') and not url_info.get('url'):
        failed_products.append(product_id)
    elif not url_info:
        new_products.append(product_id)

# Prioritize failed products, then process new products
product_ids_to_process = (failed_products + new_products)[:args.limit]
```

Advantages of this strategy:
1. **Avoid Duplicate Processing**: Products with existing URLs are skipped directly
2. **Prioritize Retrying Failures**: Previously failed products are prioritized
3. **Time Window Control**: Products processed within 1 day are skipped (unless failed)

### Processing Flow

The processing flow for each product:

```python
# 1. Get product information
product_data = get_latest_version(conn, product_id)
product_name = product_data.get('name', '')
product_desc1 = product_data.get('desc1', '') or ''

# 2. Find official domain
official_domain = await find_official_domain_optimized(
    product_name=product_name,
    product_desc1=product_desc1,
    api_key=args.api_key
)

# 3. Save results
if official_domain:
    official_url = f"https://{official_domain}"
    set_product_url(conn, product_id, official_url)
    success_count += 1
else:
    # Official domain not found, clear existing URL but update fetch time
    delete_product_url(conn, product_id)
    update_product_url_fetched_time(conn, product_id)
    cleared_count += 1
```

Key design points:
- **Update timestamp even on failure**: Avoid infinite retries of the same product
- **Clear invalid URLs**: If official domain not found, clear existing incorrect URLs
- **Statistics**: Record counts of success, failure, and skipped

## Technical Details: URL Processing and Domain Extraction

### DuckDuckGo Redirect Handling

DuckDuckGo uses redirect URLs to protect user privacy, in the format `/l/?uddg=...`. The script needs to extract the real target URL:

```python
# Handle DuckDuckGo redirect URLs
if url.startswith('//duckduckgo.com/l/') or url.startswith('/l/?'):
    try:
        parsed = urllib.parse.urlparse(url if url.startswith('//') else f"https:{url}")
        params = urllib.parse.parse_qs(parsed.query)
        if 'uddg' in params:
            real_url = urllib.parse.unquote(params['uddg'][0])
    except Exception as e:
        print(f"⚠️  URL parsing failed: {url}, error: {e}")
        continue
```

### Domain Extraction Logic

The `_extract_domain_from_url` method handles various URL formats:

```python
def _extract_domain_from_url(self, url: str) -> Optional[str]:
    # 1. Handle DuckDuckGo redirects
    if url.startswith('//duckduckgo.com/l/') or url.startswith('/l/?'):
        # Extract real URL from uddg parameter
        ...
    
    # 2. Skip DuckDuckGo domains
    if 'duckduckgo.com' in url.lower():
        return None
    
    # 3. If URL has no protocol, add https://
    if not url.startswith(('http://', 'https://')):
        url = f"https://{url}"
    
    # 4. Parse domain
    parsed = urlparse(url)
    domain = parsed.netloc
    
    # 5. Remove www. prefix and port number
    if domain.startswith('www.'):
        domain = domain[4:]
    if ':' in domain:
        domain = domain.split(':')[0]
    
    # 6. Validate domain format
    if '.' not in domain or len(domain.split('.')) < 2:
        return None
    
    return domain
```

## Practical Application Results

How does this script perform in practical applications?

### Advantages

1. **High Automation**: Can batch process large numbers of products without manual intervention
2. **Improved Accuracy**: Using LLM judgment is more accurate than simple keyword matching
3. **Controllable Costs**: Batch judgment and early termination strategies reduce API call costs
4. **Error Recovery**: Comprehensive retry mechanisms and error handling

### Challenges

1. **Rate Limiting**: DuckDuckGo and target websites may limit crawler access
2. **Edge Cases**: Product renaming, mergers, disconnected official websites require manual handling
3. **Costs**: Although optimized, LLM API calls still have costs

### Improvement Directions

1. **Caching Mechanism**: Cache processed products to avoid duplicate processing
2. **Concurrency Control**: Improve concurrent processing while respecting rate limits
3. **Result Validation**: Periodically verify if saved URLs are still valid

## Conclusion

The `openai_web_search.py` script demonstrates a practical automation solution that:

1. **Layered Design**: Separates search, judgment, and batch processing, each with clear responsibilities
2. **Intelligent Judgment**: Uses LLM for semantic understanding, not simple keyword matching
3. **Cost Optimization**: Batch processing and early termination strategies reduce API costs
4. **Error Handling**: Comprehensive retry mechanisms and error recovery strategies
5. **Practical Usability**: Designed for real-world scenarios with 1000+ software products, handling various edge cases

This script not only solves the specific problem of "recovering official websites" but more importantly demonstrates how to balance automation level, accuracy, and cost in complex real-world scenarios.

---

*This article details the design logic of a script for automating the recovery of software official websites, hoping to help developers building similar automation systems.*

