/**
 * Shape of a versioned commission schedule, as stored in data/schedule-*.json.
 *
 * Extracted from the Ordinex codebase so this repository is self-contained: the
 * diff in `commission-diff.ts` is the exact code that produced the published CSV,
 * and it needs these types to compile.
 */

export type CommissionTier = 'standard' | 'mall'

export interface CommissionEntry {
  group: string
  l1: string
  l2: string | null
  l3: string | null
  standardPct: number
  mallPct: number
}

/** Effective-dated default rate for categories absent from `entries`. */
export interface CommissionDefault {
  tier: CommissionTier
  pct: number
  effectiveFrom: string
}

export interface CommissionMatrix {
  platform: 'tiktok' | 'shopee' | 'lazada'
  version: string
  source: string
  /** = min(standardEffectiveFrom, mallEffectiveFrom). Kept for back-compat. */
  effectiveFrom: string
  standardEffectiveFrom: string
  mallEffectiveFrom: string
  /** Fallback rates when a category path matches no entry, effective-dated per tier. */
  defaults: CommissionDefault[]
  entries: CommissionEntry[]
}
