# The Core Principle of AI-Assisted Development: Verification Cost Determines Applicability

In exploring AI-assisted development, I've gradually discovered a critical limitation: **Natural language itself is full of ambiguity, and without repeated confirmation and interaction, the output will increasingly deviate from expectations.**

## The Mathematical Model of Cumulative Deviation

There's an interesting calculation: if the first description is only 90% accurate, and each subsequent description is also "by feel" at 90%, then after 10 iterations:

**0.9^10 ≈ 0.3487 ≈ 34.87%**

This means that without clear feedback loops, errors will amplify exponentially. This isn't a theoretical concern—it's a problem frequently encountered in actual development.

## Core Principle: Verification Cost Determines Applicability

![Verification Cost and AI Applicability](/images/ai-generated/ai-verification-cost-principle.png)

Based on practical development experience, I've summarized a core principle:

> **When using AI for any task, you can only build solidly within the scope where you can verify AI output correctness with minimal time cost.**

The key to this principle is: **If the verification cost exceeds the cost of manual completion, then using AI isn't worthwhile.** Verification cost determines the applicability of AI.

## Low Verification Cost Scenarios

### 1. Code Generation
- **Syntax Checking**: Compiler/TypeScript immediately reports errors
- **Simple Logic**: Can tell right from wrong at a glance
- **Refactoring Tasks**: Test suites automatically verify

### 2. Content Generation
- **Format Checking**: Markdown/HTML rendering immediately shows results
- **Fact Verification**: Can quickly Google verify
- **Structured Data**: JSON Schema validation

### 3. Documentation Generation
- **Format Correctness**: Visible to the eye
- **Link Validity**: Click to test
- **Grammar Checking**: Spell-checking tools

## High Verification Cost Scenarios (Use with Caution)

1. **Complex Business Logic**: Requires deep domain knowledge
2. **Security-Related Code**: Requires security review
3. **Performance Optimization**: Requires benchmarking
4. **Architecture Design**: Requires long-term verification

## Practice in the VibeBlog Project

Let me use the VibeBlog project as an example to analyze which parts best fit the "low verification cost" principle:

### 1. TypeScript Type System

```typescript
export interface PostMeta {
  slug: string;
  title: string;
  titleEn?: string;
  date: string;
  tags: string[];
  tagsEn?: string[];
  summary?: string;
  summaryEn?: string;
  heroImage?: string;
  description?: string;
  descriptionEn?: string;
}
```

- **Verification Cost**: Almost zero (compiler automatically checks)
- **Errors immediately exposed**, no manual testing needed

### 2. JSON Metadata Structure

Each article's metadata is structured JSON:
- **Verification Cost**: Very low (JSON format checking + visual scanning)
- **Structured data**, easy to spot missing fields or format errors

### 3. Visual Output (Svelte Components)

All UI components can be viewed directly in the browser:
- **Verification Cost**: Low (just open the browser to see)
- **Follows practical verification principle**: Use chrome-devtools to open the browser and actually test

### 4. Tag Index Generation Script

```typescript
// Write tags.json (Chinese)
const indexPathZh = path.join(INDEXES_DIR, 'tags.json');
fs.writeFileSync(indexPathZh, JSON.stringify(tagsIndexZh, null, 2), 'utf-8');

console.log(`✅ Successfully generated tag index`);
console.log(`   - Chinese tags: ${tagCountZh}`);
console.log(`   - English tags: ${tagCountEn}`);
console.log(`   - Total posts: ${totalPosts}`);
```

- **Verification Cost**: Low (check output JSON + console statistics)
- **Output is structured data**, easy to verify

### 5. HTML Content Generation

Markdown to HTML conversion process:
- **Verification Cost**: Low (open HTML file or view in browser)
- **Format conversion results** can be immediately checked

## Parts Requiring Higher Verification Cost

Of course, there are also parts in the project that require higher verification costs:

1. **Content Logic Correctness**: Whether article content is accurate (requires domain knowledge)
2. **Routing Logic**: Whether URL parameter handling is correct (requires testing multiple scenarios)
3. **Language Switching Logic**: Whether Chinese/English switching is complete (requires testing all pages)

## Strategy Recommendations

Based on this principle, I recommend:

1. **Establish Automated Verification**: Tests, lint, type checking
2. **Visualize Output**: Use browser to actually test and confirm
3. **Small Step Iterations**: Only make small changes that can be immediately verified
4. **Clear Verification Standards**: Define objective standards for "correctness"

## Conclusion

**The value of AI lies in amplifying your judgment, not replacing it.** AI can only become a reliable tool within the scope where you can quickly verify.

This principle applies not only to code development but also to any work assisted by AI. Remember: **Verification cost determines the applicability of AI.** Only within the scope of low verification costs can you complete work solidly and avoid problems caused by cumulative deviation.

---

*This article is a summary based on practical development experience, hoping to help developers exploring AI-assisted development.*

