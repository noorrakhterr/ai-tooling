import type { Recording } from '../types'

/**
 * Gong call recordings, sourced from the team's Gong catalog sheet. Labels
 * are the use-case tags from that sheet (not lifecycle phases) — Gong
 * platform tools went into the Tool Catalog, and training/FAQ resources
 * went into Home's "How-to guides for self-enablement" section.
 */
export const RECORDINGS: Recording[] = [
  {
    id: 'ps-deployment-tam-support',
    title: 'Professional Services Deployment & TAM support',
    owner: 'Iyana Johnson',
    callDate: '2026-09-16',
    labels: ['TAM Support'],
    link: 'https://us-5814.app.gong.io/call?id=5982886860163394973',
  },
  {
    id: 'imm-cs',
    title: 'IMM/CS',
    owner: 'Noor Akhter',
    callDate: '2026-08-20',
    labels: ['IMM/CS'],
    link: 'https://us-5814.app.gong.io/call?id=1278793262274114096',
  },
  {
    id: 'gold-scale-sled-call',
    title: 'Gold Scale SLED Call',
    owner: 'Soon Hwang',
    callDate: '2026-08-21',
    labels: ['Gold Scale', 'SLED'],
    link: 'https://us-5814.app.gong.io/call?id=5860037599081297282&entry=calls_widget',
  },
  {
    id: 'fastpass-sync',
    title: 'FastPass Sync',
    owner: 'Noor Akhter',
    callDate: '2026-07-26',
    labels: ['FastPass'],
    link: 'https://us-5814.app.gong.io/call?id=593102769271220887',
  },
  {
    id: 'ae-engagement',
    title: 'AE Engagement',
    owner: 'Noor Akhter',
    callDate: '2026-05-15',
    labels: ['AE Engagement'],
    link: 'https://us-5814.app.gong.io/call?id=59408253280444890',
  },
  {
    id: 'workflows-fastpass-checkin',
    title: 'Workflows and Fastpass Check in',
    owner: 'Sophia Stone',
    callDate: '2026-08-13',
    labels: ['Workflows', 'FastPass'],
    link: 'https://us-5814.app.gong.io/call?id=4342904771528264211',
  },
  {
    id: 'oie-upgrade',
    title: 'OIE upgrade',
    owner: 'Lauren Cheung',
    callDate: '2026-07-16',
    labels: ['OIE'],
    link: 'https://us-5814.app.gong.io/call?id=756107672496610184',
  },
  {
    id: 'fastpass-technical-question-handling',
    title: 'Fastpass + Very technical, good question handling',
    owner: 'Dominic Bravo',
    callDate: '2026-06-30',
    labels: ['FastPass', 'Technical Q&A'],
    link: 'https://us-5814.app.gong.io/call?id=4272575744472884645',
  },
  {
    id: 'chegg-sbr',
    title: 'Chegg SBR',
    customer: 'Chegg',
    owner: 'Carolyn Chorich',
    callDate: '2026-10-02',
    labels: ['SBR'],
    link: 'https://us-5814.app.gong.io/welcome/sign-in?targeturl=%2Fcall%3Fid%3D7962750503935429428%26entry%3Dcalls_widget',
  },
  {
    id: 'jd-power-sbr',
    title: 'J.D. Power SBR',
    customer: 'J.D. Power',
    owner: 'Ruthie Jehu',
    callDate: '2026-10-02',
    labels: ['SBR'],
    link: 'https://us-5814.app.gong.io/call?id=5356077940782607868',
  },
  {
    id: 'gong-enablement-for-csms',
    title: 'Gong Enablement for CSMs',
    owner: 'Sophia Kaleem',
    callDate: '2026-03-31',
    labels: ['Gong Enablement'],
    link: 'https://us-5814.app.gong.io/call?id=7893345233917463612',
  },
  {
    id: 'chugach-sbr',
    title: 'Chugach SBR',
    customer: 'Chugach',
    owner: 'Julia Weiss',
    callDate: '2026-10-20',
    labels: ['SBR'],
    link: 'https://us-5814.app.gong.io/call?id=4721771672532586449&entry=calls_widget',
  },
  {
    id: 'kinaxis-sbr',
    title: 'Kinaxis SBR',
    customer: 'Kinaxis',
    owner: 'Julia Weiss',
    callDate: '2026-10-15',
    labels: ['SBR'],
    link: 'https://us-5814.app.gong.io/call?id=4721771672532586449&entry=calls_widget',
  },
]
