import type { Tool } from '../types'

/**
 * Tool catalog. Real, submitted Gems/Agents only (plus the one announced
 * but not-yet-available tool, flagged with comingSoon). Pending additions
 * from the full "Gong and AI Tools Rollout Plan" inventory will be added
 * here as they're validated.
 */
export const TOOLS: Tool[] = [
  {
    id: 'gold-scale-coaching-agent',
    name: 'Gold Scale Strategic Coaching Agent',
    type: 'Agent',
    description: 'Strategic coaching support for Gold Scale meeting prep. Not yet available.',
    phaseIds: ['meeting-prep'],
    link: '#',
    comingSoon: true,
  },
  {
    id: 'transcript-to-meeting-summary',
    name: 'Transcript to Meeting Summary Gem',
    type: 'Gem',
    description:
      'Extracts key insights from client transcripts to create structured CRM notes. Focuses on CTA outcomes, Gold Status resource adoption, and Identity Maturity updates.',
    phaseIds: ['post-meeting'],
    link: 'https://gemini.google.com/gem/1QpWK_no5rBle0LhM0gfLlq9Ok-k-AJaI?usp=sharing',
  },
  {
    id: 'transcript-to-cta-update',
    name: 'Transcript to CTA Update Gem',
    type: 'Gem',
    description: 'Converts a meeting transcript into a structured CTA update.',
    phaseIds: ['post-meeting'],
    link: 'https://gemini.google.com/gem/1jnIKpHNPx5ymYJJVcmxD9dMDXVRYOK1O?usp=sharing',
  },
  {
    id: 'transcript-to-security-essential',
    name: 'Transcript to Security Essential',
    type: 'Gem',
    description:
      'Acts as a specialized CSM/technical analyst, converting meeting transcripts into updates keyed off specific product keywords (e.g. FastPass, Workflows, LCM). Useful for follow-up emails and as a personal notetaker so a CSM doesn’t have to rewatch their own call.',
    phaseIds: ['post-meeting'],
    link: 'https://gemini.google.com/gem/443cff2a10c1?usp=sharing',
  },
  {
    id: 'transcript-to-followup-email',
    name: 'Transcript to Followup Email Gem',
    type: 'Gem',
    description:
      'Generates a customer-specific follow-up email from a meeting transcript and the main priority item discussed on the call.',
    phaseIds: ['post-meeting'],
    link: 'https://gemini.google.com/gem/1ZCTmoW_hTA3uggWSl5Gsc_vVLRAR0jxT?usp=sharing',
  },
  {
    id: 'path-2-green-gem',
    name: 'Path 2 Green Gem',
    type: 'Gem',
    description:
      'Creates a weekly action plan for high-risk and critical Gold accounts: a problem statement plus verified risk/root cause, actions completed, next action/owner/exact date, intended path to green outcome, and blocker or leadership task. Date and Guardian score are filled in by the CSM.',
    phaseIds: ['post-meeting'],
    link: 'https://gemini.google.com/gem/ad55e01d49aa',
  },
  {
    id: 'sipp-tam-handoff-gem',
    name: 'SIPP Info to TAM Handoff Gem',
    type: 'Gem',
    description:
      'Builds a brief for a TAM to reference when engaging with an account. Upload a customer check-in or business review deck, call transcripts, Account Overview, and other resources (see the Gem’s instructions for the full list) to hand off context that helps the TAM support the CTA.',
    phaseIds: ['closing-out'],
    link: 'https://gemini.google.com/gem/1LfgD_tSxzFcCN_SXxd7gMPBkzctxsQku?usp=sharing',
  },
  {
    id: 'sbr-assist-agent',
    name: 'SBR Assist Gem',
    type: 'Agent',
    description:
      'Helps build executive-grade Strategic Business Review decks using the Command of the Message methodology, via three stages: Intake, Apex Framing, and Slide Enhancement (slides 1–5). Access through Gemini Enterprise → Agents → "CSM SBR AI Assist"; say "Hi" to begin.',
    phaseIds: ['sbr'],
    link: 'https://vertexaisearch.cloud.google.com/home/cid/cd50f96b-072d-4a0a-9ac3-8699ac11797f/r/agent/7944332289853326822/session/-',
  },
  {
    id: 'sbr-quality-checker-gem',
    name: 'SBR Quality Checker Gem',
    type: 'Agent',
    description:
      'Evaluates an SBR deck against a built-in rubric, producing a per-slide verdict, specific recommendations, and a review checklist before the customer presentation. Say "Hi" to start.',
    phaseIds: ['sbr'],
    link: 'https://vertexaisearch.cloud.google.com/home/cid/cd50f96b-072d-4a0a-9ac3-8699ac11797f/r/agent/9576353426048634315/session/-',
  },
]
