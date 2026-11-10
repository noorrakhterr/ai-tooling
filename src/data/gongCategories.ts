/**
 * Standardized Gong call categories, replacing free-text labels. Chosen from
 * the real label-frequency distribution across production gong_recordings
 * (59 rows) — these are the top ~10 real categories by usage, not a guess.
 * "Other" is a catch-all for anything that doesn't fit.
 */
export const GONG_CATEGORIES = [
  'FastPass',
  'SBR',
  'Workflows',
  'Okta Identity Engine',
  'Lifecycle Management',
  'Device Assurance',
  'OCI',
  'Identity Maturity Model',
  'Customer Success Hub',
  'SLED',
  'Other',
] as const

export type GongCategory = (typeof GONG_CATEGORIES)[number]

/**
 * Gold/Silver tier is a separate dimension from category — stored as a
 * reserved label value (not a new DB column) so it works immediately with
 * the 17 "Gold" and 28 "Silver" calls already tagged in production.
 */
export const GONG_TIERS = ['Gold', 'Silver'] as const

export type GongTier = (typeof GONG_TIERS)[number]
