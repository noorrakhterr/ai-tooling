import type { ReferenceResource } from '../types'

/**
 * General reference material — not tied to a single lifecycle phase, unlike
 * the phase-tagged entries in the Tool catalog.
 */
export const RESOURCES: ReferenceResource[] = [
  {
    id: 'agent-gem-library',
    title: 'Okta Agent & Gem Library',
    description: 'Full list of available agents and Gems in Gemini Enterprise.',
    link: 'https://vertexaisearch.cloud.google.com/home/cid/cd50f96b-072d-4a0a-9ac3-8699ac11797f/r/agents',
  },
  {
    id: 'gong-enablement',
    title: 'Gong Enablement',
    description: 'Training, FAQs, and shadowing resources for getting started with Gong.',
    links: [
      {
        label: 'Gong Highspot training',
        url: 'https://okta.highspot.com/spots/5eac9ceba2e3a930dd17d267?list=5ed15e3c66bbaa35cf3dc67b&overview=true',
      },
      {
        label: 'Gong FAQs',
        url: 'https://okta.highspot.com/items/69f273e8bc2ef5ace359a0f2?lfrm=srp.1#1',
      },
      {
        label: 'Gong enablement (ScaleU). Passcode: SA^gaX63',
        url: 'https://okta.zoom.us/rec/component-page?accessLevel=meeting&action=viewdetailpage&sharelevel=meeting&useWhichPasswd=meeting&requestFrom=pwdCheck&clusterId=aw1&componentName=need-password&meetingId=Re8u3a8VBlM1-W7n8hn0mVTdIULUT9rZU4TYtGGlEMoQathaTOXDooUuragSfPPE.wPCTh7lk6IsyoKKV&originRequestUrl=https%3A%2F%2Fokta.zoom.us%2Frec%2Fshare%2F7KyBJDBC0jshQsw7OpALDx56NROgvEphixkI9LDPCdEQQCfYgU1xZ9mCwe0wH85i.V8a3nqZiYUI9DZ7G',
      },
      {
        label: 'Gong team shadowing calendar',
        url: 'https://us-5814.app.gong.io/activity?workspace-id=5383262448296349696&manager-id=1769827346853520674&date=2026-10-13&view-type=day',
      },
    ],
  },
  {
    id: 'claude-skills',
    title: 'Get Started with Claude Skills',
    description: 'How to build a Claude Skill, plus a running list of ideas for the CSM workflow.',
    links: [
      {
        label: 'How to build a Claude Skill',
        url: 'https://docs.google.com/document/d/1ibLLyV_qCNutBXjHYDwsUEtjrhokh1gq3uJyWehz2LE/edit?usp=sharing',
      },
      {
        label: 'More ideas for Claude Skills',
        url: 'https://docs.google.com/document/d/1osJ9Aj5bTjlPS0jLUmABGEwR0jKeSymLDrzf-pBVkOU/edit?tab=t.0#heading=h.uvgcocc8yanc',
      },
    ],
  },
]
