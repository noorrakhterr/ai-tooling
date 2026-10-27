/**
 * Derives a readable display name from an email's local-part.
 * "noor.akhter@okta.com" -> "Noor Akhter". Falls back to the raw email if
 * it doesn't look like a normal local-part.
 */
export function displayName(email: string): string {
  const localPart = email.split('@')[0] ?? email
  const words = localPart.split(/[._-]+/).filter(Boolean)
  if (words.length === 0) return email
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}
