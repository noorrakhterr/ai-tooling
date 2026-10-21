import type { ReferenceResource } from '../types'

/**
 * General reference material — not tied to a single lifecycle phase, unlike
 * the phase-tagged entries in the Tool catalog.
 */
export const RESOURCES: ReferenceResource[] = [
  {
    id: 'agent-gem-library',
    title: 'Agent / Gem library',
    description: 'Full list of available agents and Gems in Gemini Enterprise.',
    link: 'https://vertexaisearch.cloud.google.com/home/cid/cd50f96b-072d-4a0a-9ac3-8699ac11797f/r/agents',
  },
  {
    id: 'how-to-build-claude-skill',
    title: 'How to build a Claude Skill',
    description: 'Step-by-step guide for building a custom Claude Skill.',
    link: 'https://docs.google.com/document/d/1ibLLyV_qCNutBXjHYDwsUEtjrhokh1gq3uJyWehz2LE/edit?usp=sharing',
  },
  {
    id: 'more-claude-skill-ideas',
    title: 'More ideas for Claude Skills',
    description: 'A running list of candidate Claude Skills for the CSM workflow.',
    link: 'https://docs.google.com/document/d/1osJ9Aj5bTjlPS0jLUmABGEwR0jKeSymLDrzf-pBVkOU/edit?tab=t.0#heading=h.uvgcocc8yanc',
  },
]
