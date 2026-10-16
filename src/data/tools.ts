import type { Tool } from '../types'

/**
 * Sample catalog — placeholder data pending the real inventory being built by
 * Amelia (Gong resources) and Julia (AI resources) per the Gong and AI Tools
 * Rollout Plan. Replace with the validated Tool catalog sheet once published.
 */
export const SAMPLE_TOOLS: Tool[] = [
  {
    id: 'account-research-gem',
    name: 'Account Research Gem',
    type: 'Gem',
    description: 'Pulls account history, open tickets, and usage trends into a single research brief.',
    phaseIds: ['customer-research'],
    link: '#',
    owner: 'Julia',
  },
  {
    id: 'ae-handoff-notebook',
    name: 'AE Handoff Notebook',
    type: 'Notebook',
    description: 'Summarizes AE context and deal history to align before CSM outreach.',
    phaseIds: ['ae-outreach'],
    link: '#',
    owner: 'Julia',
  },
  {
    id: 'customer-outreach-prompt',
    name: 'Customer Outreach Prompt',
    type: 'Prompt',
    description: 'Drafts a personalized first-touch email referencing recent account activity.',
    phaseIds: ['customer-outreach'],
    link: '#',
    owner: 'Julia',
  },
  {
    id: 'meeting-grader-agent',
    name: 'Meeting Grader / Coaching Agent',
    type: 'Gem',
    description: 'Identifies strengths and prepares better discovery questions ahead of a call.',
    phaseIds: ['meeting-prep'],
    link: '#',
    owner: 'Julia',
  },
  {
    id: 'gong-call-review-guidance',
    name: 'Gong Call Review Guidance',
    type: 'Gong resource',
    description: 'Reviews discovery, customer goals, risks, and next steps from the call recording.',
    phaseIds: ['meeting', 'post-meeting'],
    link: '#',
    owner: 'Amelia',
  },
  {
    id: 'followup-recap-skill',
    name: 'Follow-up Recap Skill',
    type: 'Skill',
    description: 'Drafts a recap and customer commitments from meeting notes or a transcript.',
    phaseIds: ['post-meeting', 'closing-out'],
    link: '#',
    owner: 'Julia',
  },
  {
    id: 'closing-checklist-prompt',
    name: 'Engagement Closeout Checklist',
    type: 'Prompt',
    description: 'Confirms open commitments and generates a closing summary for the customer.',
    phaseIds: ['closing-out'],
    link: '#',
    owner: 'Julia',
  },
  {
    id: 'sbr-notebook',
    name: 'SBR Gem / Notebook',
    type: 'Notebook',
    description: 'Prepares a strategic business review from verified customer information.',
    phaseIds: ['sbr'],
    link: '#',
    owner: 'Julia',
  },
  {
    id: 'stakeholder-map-gem',
    name: 'Stakeholder Mapping Gem',
    type: 'Gem',
    description: 'Builds an org chart and stakeholder map from available account data.',
    phaseIds: ['customer-org'],
    link: '#',
    owner: 'Julia',
  },
  {
    id: 'resource-finder-skill',
    name: 'Resource Finder Skill',
    type: 'Skill',
    description: 'Surfaces relevant decks, docs, and playbooks for the engagement.',
    phaseIds: ['resource-gathering'],
    link: '#',
    owner: 'Amelia',
  },
]
