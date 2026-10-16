import type { Phase } from '../types'

export const CORE_PHASES: Phase[] = [
  {
    id: 'customer-research',
    order: 1,
    group: 'core',
    title: 'Customer research',
    description: 'Build a picture of the account before any outreach happens.',
  },
  {
    id: 'ae-outreach',
    order: 2,
    group: 'core',
    title: 'AE outreach and connection',
    description: "Coordinate with the account team and form a baseline hypothesis.",
  },
  {
    id: 'customer-outreach',
    order: 3,
    group: 'core',
    title: 'Customer outreach',
    description: 'Reach the customer directly to confirm goals and book time.',
  },
  {
    id: 'meeting-prep',
    order: 4,
    group: 'core',
    title: 'Meeting prep',
    description: 'Prepare discovery questions and review account context before the call.',
  },
  {
    id: 'meeting',
    order: 5,
    group: 'core',
    title: 'Meeting',
    description: 'Run the meeting itself: discovery, goals, risks, and next steps.',
  },
  {
    id: 'post-meeting',
    order: 6,
    group: 'core',
    title: 'Post meeting',
    description: 'Review the call, capture notes, and draft a recap.',
  },
  {
    id: 'closing-out',
    order: 7,
    group: 'core',
    title: 'Closing out customer',
    description: 'Confirm commitments and close the loop with the customer.',
  },
]

export const BONUS_PHASES: Phase[] = [
  {
    id: 'sbr',
    order: 1,
    group: 'bonus',
    title: 'SBR',
    description: 'Prepare a strategic business review from verified customer information.',
  },
  {
    id: 'customer-org',
    order: 2,
    group: 'bonus',
    title: 'Customer organization',
    description: 'Map stakeholders and org structure for the account.',
  },
  {
    id: 'resource-gathering',
    order: 3,
    group: 'bonus',
    title: 'Resource gathering',
    description: 'Collect supporting materials and resources for the engagement.',
  },
]

export const ALL_PHASES: Phase[] = [...CORE_PHASES, ...BONUS_PHASES]

export function getPhaseById(id: string): Phase | undefined {
  return ALL_PHASES.find((phase) => phase.id === id)
}
