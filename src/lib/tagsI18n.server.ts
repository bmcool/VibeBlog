import fs from 'fs'
import path from 'path'
import type { Language } from '$lib/types/blog'

type TagMaps = {
  zhToEn: Map<string, string>
  enToZh: Map<string, string>
}

let cached: TagMaps | null = null

function getMetaDir() {
  // Prefer project root (works in dev + prerender)
  return path.join(process.cwd(), 'content', 'meta')
}

function buildMaps(): TagMaps {
  const metaDir = getMetaDir()
  const zhToEn = new Map<string, string>()
  const enToZh = new Map<string, string>()

  if (!fs.existsSync(metaDir)) {
    return { zhToEn, enToZh }
  }

  const files = fs.readdirSync(metaDir).filter((f: string) => f.endsWith('.json'))
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(metaDir, file), 'utf-8')
      const meta = JSON.parse(raw) as { tags?: string[]; tagsEn?: string[] }
      const tagsZh = Array.isArray(meta.tags) ? meta.tags : []
      const tagsEn = Array.isArray(meta.tagsEn) ? meta.tagsEn : []
      const n = Math.min(tagsZh.length, tagsEn.length)
      for (let i = 0; i < n; i++) {
        const zh = tagsZh[i]
        const en = tagsEn[i]
        if (!zh || !en) continue
        if (!zhToEn.has(zh)) zhToEn.set(zh, en)
        if (!enToZh.has(en)) enToZh.set(en, zh)
      }
    } catch {
      // ignore broken meta files
    }
  }

  return { zhToEn, enToZh }
}

function getMaps(): TagMaps {
  if (!cached) cached = buildMaps()
  return cached
}

/**
 * Translate a tag between zh/en if we can infer a mapping from meta.json files.
 *
 * Mapping rule (project convention):
 * - meta.tags[i] is the zh tag
 * - meta.tagsEn[i] is the corresponding en translation at the same index
 */
export function translateTag(tag: string, from: Language, to: Language): string | null {
  if (from === to) return tag
  const maps = getMaps()
  if (from === 'zh' && to === 'en') return maps.zhToEn.get(tag) ?? null
  if (from === 'en' && to === 'zh') return maps.enToZh.get(tag) ?? null
  return null
}

