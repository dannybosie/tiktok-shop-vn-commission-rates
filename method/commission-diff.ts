/**
 * Diff two versioned TikTok commission matrices, category by category.
 *
 * TikTok reprices the whole fee schedule periodically (2026-05-09, then
 * 2026-07-03 for standard shops with Mall stepping 2026-08-03). Press coverage
 * reports the change as a single headline range. Per category, the changes are
 * far more spread out, and some categories get cheaper.
 *
 * Pure functions over CommissionMatrix, with no I/O and no formatting.
 */

import type { CommissionEntry, CommissionMatrix, CommissionTier } from './commission-matrix'

/** Stable identity for a category across matrix versions. */
export type CategoryKey = string

/**
 * Category names are transcribed from PDFs whose casing and spacing drift
 * between editions: the 2026-05-09 schedule writes "Mẹ & bé" where 2026-07-03
 * writes "Mẹ & Bé". Matching literally silently dropped all 199 categories in
 * that group from the comparison, so the key folds case and collapses runs of
 * whitespace. Display always uses the newer matrix's spelling.
 *
 * Levels are joined with NUL, which cannot occur in a category name, so
 * ("a b", null) and ("a", "b") stay distinct keys.
 */
export function categoryKey(e: Pick<CommissionEntry, 'group' | 'l1' | 'l2' | 'l3'>): CategoryKey {
  return [e.group, e.l1, e.l2 ?? '', e.l3 ?? '']
    .map((s) => s.trim().replace(/\s+/g, ' ').toLowerCase())
    .join('\0')
}

/** How a category fared between two matrix versions, for one tier. */
export interface TierDelta {
  /** Rate in the older matrix. */
  from: number
  /** Rate in the newer matrix. */
  to: number
  /** to - from, rounded to 2dp to kill float noise (rates are 1dp in source). */
  delta: number
  direction: 'up' | 'down' | 'flat'
}

export interface CategoryDiff {
  key: CategoryKey
  group: string
  l1: string
  l2: string | null
  l3: string | null
  standard: TierDelta
  mall: TierDelta
}

/** Categories present in only one of the two versions. */
export interface DiffCoverage {
  addedCount: number
  removedCount: number
  comparedCount: number
}

export interface DiffSummary {
  up: number
  down: number
  flat: number
  /** Histogram of delta -> category count, ascending by delta. */
  distribution: { delta: number; count: number }[]
  /** Largest increase and largest decrease, or null when nothing compared. */
  maxIncrease: CategoryDiff | null
  maxDecrease: CategoryDiff | null
}

/** A category that exists only in the newer schedule, so there is no delta to compute. */
export interface AddedCategory {
  key: CategoryKey
  group: string
  l1: string
  l2: string | null
  l3: string | null
  standardPct: number
  mallPct: number
}

export interface MatrixDiff {
  fromVersion: string
  toVersion: string
  standardEffectiveFrom: string
  mallEffectiveFrom: string
  coverage: DiffCoverage
  entries: CategoryDiff[]
  /**
   * New in the newer schedule. Excluded from every summary statistic (they
   * have no old rate), but surfaced so a lookup can still answer "what is my
   * rate?" instead of returning nothing.
   */
  added: AddedCategory[]
  standard: DiffSummary
  mall: DiffSummary
}

/** Rates carry 1 decimal in the source PDFs; 2dp rounding removes float dust. */
function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function tierDelta(from: number, to: number): TierDelta {
  const delta = round2(to - from)
  return {
    from,
    to,
    delta,
    direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat',
  }
}

function pick(entry: CommissionEntry, tier: CommissionTier): number {
  return tier === 'standard' ? entry.standardPct : entry.mallPct
}

function summarise(entries: CategoryDiff[], tier: CommissionTier): DiffSummary {
  const counts = new Map<number, number>()
  let up = 0
  let down = 0
  let flat = 0
  let maxIncrease: CategoryDiff | null = null
  let maxDecrease: CategoryDiff | null = null

  for (const e of entries) {
    const d = tier === 'standard' ? e.standard : e.mall
    counts.set(d.delta, (counts.get(d.delta) ?? 0) + 1)
    if (d.direction === 'up') up++
    else if (d.direction === 'down') down++
    else flat++

    const best = maxIncrease && (tier === 'standard' ? maxIncrease.standard : maxIncrease.mall)
    if (d.delta > 0 && (!best || d.delta > best.delta)) maxIncrease = e

    const worst = maxDecrease && (tier === 'standard' ? maxDecrease.standard : maxDecrease.mall)
    if (d.delta < 0 && (!worst || d.delta < worst.delta)) maxDecrease = e
  }

  const distribution = Array.from(counts.entries())
    .map(([delta, count]) => ({ delta, count }))
    .sort((a, b) => a.delta - b.delta)

  return { up, down, flat, distribution, maxIncrease, maxDecrease }
}

/**
 * Compare two matrices. Only categories present in BOTH are diffed. A category
 * that appears or disappears between versions has no meaningful delta, so it is
 * counted in `coverage` and excluded from `entries`.
 *
 * Argument order matters: `older` then `newer`. Passing them backwards inverts
 * every sign, so callers should resolve order by `effectiveFrom`, not by hand.
 */
export function diffCommissionMatrices(
  older: CommissionMatrix,
  newer: CommissionMatrix,
): MatrixDiff {
  const oldByKey = new Map<CategoryKey, CommissionEntry>()
  for (const e of older.entries) oldByKey.set(categoryKey(e), e)

  const newKeys = new Set<CategoryKey>()
  const entries: CategoryDiff[] = []
  const added: AddedCategory[] = []

  for (const n of newer.entries) {
    const key = categoryKey(n)
    newKeys.add(key)
    const o = oldByKey.get(key)
    if (!o) {
      added.push({
        key,
        group: n.group,
        l1: n.l1,
        l2: n.l2,
        l3: n.l3,
        standardPct: n.standardPct,
        mallPct: n.mallPct,
      })
      continue
    }
    entries.push({
      key,
      group: n.group,
      l1: n.l1,
      l2: n.l2,
      l3: n.l3,
      standard: tierDelta(pick(o, 'standard'), pick(n, 'standard')),
      mall: tierDelta(pick(o, 'mall'), pick(n, 'mall')),
    })
  }

  let removedCount = 0
  for (const key of oldByKey.keys()) if (!newKeys.has(key)) removedCount++

  return {
    fromVersion: older.version,
    toVersion: newer.version,
    standardEffectiveFrom: newer.standardEffectiveFrom,
    mallEffectiveFrom: newer.mallEffectiveFrom,
    coverage: {
      addedCount: added.length,
      removedCount,
      comparedCount: entries.length,
    },
    entries,
    added,
    standard: summarise(entries, 'standard'),
    mall: summarise(entries, 'mall'),
  }
}

/**
 * Categories that moved the most, biggest magnitude first.
 * `direction: 'up'` returns increases only; `'down'` returns decreases only.
 */
export function topMovers(
  diff: MatrixDiff,
  tier: CommissionTier,
  direction: 'up' | 'down',
  limit = 20,
): CategoryDiff[] {
  return diff.entries
    .filter((e) => (tier === 'standard' ? e.standard : e.mall).direction === direction)
    .sort((a, b) => {
      const da = (tier === 'standard' ? a.standard : a.mall).delta
      const db = (tier === 'standard' ? b.standard : b.mall).delta
      return direction === 'up' ? db - da : da - db
    })
    .slice(0, limit)
}

export interface GroupRollup {
  group: string
  count: number
  up: number
  down: number
  flat: number
  /** Mean delta across the group, 2dp. */
  avgDelta: number
}

/** Roll the per-category diff up to TikTok's top-level groups. */
export function rollupByGroup(diff: MatrixDiff, tier: CommissionTier): GroupRollup[] {
  const acc = new Map<string, { count: number; up: number; down: number; flat: number; sum: number }>()
  for (const e of diff.entries) {
    const d = tier === 'standard' ? e.standard : e.mall
    let g = acc.get(e.group)
    if (!g) {
      g = { count: 0, up: 0, down: 0, flat: 0, sum: 0 }
      acc.set(e.group, g)
    }
    g.count++
    g.sum += d.delta
    if (d.direction === 'up') g.up++
    else if (d.direction === 'down') g.down++
    else g.flat++
  }
  return Array.from(acc.entries())
    .map(([group, g]) => ({
      group,
      count: g.count,
      up: g.up,
      down: g.down,
      flat: g.flat,
      avgDelta: round2(g.sum / g.count),
    }))
    .sort((a, b) => b.avgDelta - a.avgDelta)
}
