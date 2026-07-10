import { formatAht } from '../utils/format'

export const WK_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
export const COACHING_WEEK_INDEX = 4
export const AHT_ACTUAL = 348
export const AHT_TARGET = 270
export const TREND = {
  aht: [362, 375, 384, 387, 386, 337, 333, 336],
  nps: [-12, -8, -15, -18, -22, -5, 2, 4],
  fcr: [48.7, 58.9, 58.2, 57.8, 58.5, 71.6, 68.4, 65.8],
  csat: [3.59, 3.49, 3.44, 3.44, 3.33, 3.61, 3.59, 3.59],
  er: [7.2, 8.1, 9.0, 9.8, 10.2, 9.0, 8.5, 8.2],
}
export const AMENDMENTS_AHT = [441, 456, 470, 492, 495, 408, 393, 380]
export const AMENDMENTS_FCR = [58.5, 44.8, 42.5, 38.7, 37.0, 61.2, 62.7, 58.9]
export const T1_RESOLUTION = AMENDMENTS_FCR
export const COACHING_DEPLOYMENT = [0, 0, 0, 0, 100, 80, 60, 40]
export const FORMAL_COACHING_AGENTS = [0, 0, 0, 0, 4, 4, 3, 2]
export const MICRO_COACHING_TRIGGERS = [28, 31, 34, 36, 24, 14, 9, 6]
export const CF_WEEKLY = [77, 82, 105, 123, 59, 45, 32, 41]
export const CF_BAR_COLORS = ['#c0392b', '#c0392b', '#c0392b', '#c0392b', '#d97706', '#1a7a4a', '#1a7a4a', '#1a7a4a']

export const COACHING_HEALTH_STATS = [
  { label: 'Deployed', value: '52', valueClass: '', sub: 'Formal + micro sessions generated' },
  { label: 'Taken up', value: '38', valueClass: 'val-green', sub: '73% of deployed' },
  { label: 'In progress', value: '8', valueClass: 'val-amber', sub: '15% of deployed' },
  { label: 'Not touched', value: '2', valueClass: 'val-red', sub: '4% of deployed' },
]

export const HERO_CHIPS = [
  { text: 'Holiday Amendments & Cancellations · worst across all KPIs', className: 'chip-red', dotColor: '#fca5a5' },
  { text: 'W5 formal coaching · 4 agents flagged', className: 'chip-amber', dotColor: '#fbbf24' },
  { text: 'Amendments FCR +22pts · W5 to W8', className: 'chip-green', dotColor: '#4ade80' },
]

export const HERO_STATS = [
  { value: '37%', label: 'Amendments repeat contact rate' },
  { value: '4', label: 'Agents on formal coaching' },
  { value: '22pts', label: 'Amendments FCR lift post-W5' },
  { value: 'Daily', label: 'Micro coaching cadence' },
  { value: '3 of 4', label: 'Coached agents improving' },
]

export const QUALITY_SUMMARY = [
  { value: 'Lerato Nkosi: 38% to 82% Amendments FCR', label: 'Biggest coached-agent FCR improvement' },
  { value: 'Ayanda Mbeki: 31% to 78% Amendments FCR', label: 'Strongest post-formal recovery arc' },
  { value: 'Michael Naidoo: 84% Amendments FCR all period', label: 'Amendments benchmark performer' },
  { value: 'Zanele Ndlovu: 34% Amendments FCR · 3 critical failures', label: 'Highest-risk agent on queue' },
]

export const AHT_WASTE = {
  items: [
    { label: 'Week 1 weekly waste', value: '£184/week', valueClass: 'val-red' },
    { label: 'Week 8 weekly waste', value: '£98/week', valueClass: 'val-red' },
    { label: '8-week total', value: '£1,120', valueClass: 'val-red' },
    { label: 'Annualised projection', value: '£7,280', valueClass: 'val-red' },
  ],
  delta: 'Down £86/week from week 1 - coaching-driven efficiency on amendment contacts',
}

export const COACHING_LEDGER_ROWS = [
  { agent: 'Lerato Nkosi', issue: 'W1-W4 · No Save & Rebook on 78% of amendment calls', topic: 'Save & Rebook Protocol', deployed: 'Week 5 · Formal TL session', outcome: 'Amendments FCR 25% → 82% by W8; micro coaching triggers down 70%', badges: [{ text: 'Improving', className: 'badge badge-green' }] },
  { agent: 'Pieter Botha', issue: 'W1-W4 · Policy misquote on cancellation window (28 vs 60 days)', topic: 'Cancellation Policy Accuracy', deployed: 'Week 5 · Formal TL session', outcome: 'Zero policy misquotes W6-W8; FCR up 42pts on amendments', badges: [{ text: 'Improving', className: 'badge badge-green' }] },
  { agent: 'Busisiwe Maseko', issue: 'W1-W4 · 7+ days micro coaching on cancel without rebooking offer', topic: 'Save & Rebook', deployed: 'Week 5 · Formal TL session', outcome: 'FCR improving; still monitoring documentation accuracy', badges: [{ text: 'In Progress', className: 'badge badge-amber' }, { text: 'TL action required', className: 'badge badge-tl' }], statusCell: true },
  { agent: 'Ayanda Mbeki', issue: 'W1-W4 · Verification skipped on booking amendments', topic: 'Identity Verification on Amendments', deployed: 'Week 5 · Formal TL session', outcome: 'Verification pass rate up; amendments FCR 31% → 78%', badges: [{ text: 'Improving', className: 'badge badge-green' }] },
  { agent: 'Zanele Ndlovu', issue: 'W1-W4 · 3 critical failures · escalation avoidance', topic: 'Escalation Criteria', deployed: 'Week 6 · Escalation protocol', outcome: 'Still below target - formal follow-up scheduled', badges: [{ text: 'Action Needed', className: 'badge badge-red' }, { text: 'TL action required', className: 'badge badge-tl' }], statusCell: true },
  { agent: 'Michael Naidoo', issue: 'No coaching needed', topic: 'Benchmark', deployed: '-', outcome: '84% Amendments FCR consistently - peer coaching source', badges: [{ text: 'Benchmark', className: 'badge badge-trophy' }] },
  { agent: 'Nomsa Dlamini', issue: 'W2-W3 · Case notes gaps on repeat contacts', topic: 'Documentation Accuracy', deployed: 'Week 4 · Micro coaching reinforced', outcome: 'Repeat contacts down; documentation scores improving', badges: [{ text: 'Improving', className: 'badge badge-green' }] },
  { agent: 'Thabo van der Merwe', issue: 'W3 · High AHT on tour date changes', topic: 'Handle Efficiency', deployed: 'Week 5 · Structured workflow', outcome: 'AHT reducing on date-change contacts', badges: [{ text: 'Improving', className: 'badge badge-green' }] },
  { agent: 'Janine Jacobs', issue: 'W4 · Penalty waiver disputes mishandled', topic: 'Penalty Waiver Workflow', deployed: 'Week 6 · Process coaching', outcome: 'Monitoring - early improvement visible', badges: [{ text: 'Monitor', className: 'badge badge-amber' }] },
  { agent: 'Sipho Khumalo', issue: 'W1 · New to amendments queue', topic: 'Amendments Onboarding', deployed: 'Week 3 · Micro coaching daily', outcome: 'Steady improvement; below benchmark but trending up', badges: [{ text: 'On Track', className: 'badge badge-green' }] },
]

export const COACHING_LEDGER_SUMMARY = [
  { text: '10 agents tracked', className: 'summary-chip' },
  { text: '5 improving', className: 'summary-chip summary-chip-green' },
  { text: '2 in progress', className: 'summary-chip summary-chip-amber' },
  { text: '1 action needed', className: 'summary-chip summary-chip-amber' },
  { text: '1 benchmark', className: 'summary-chip summary-chip-trophy' },
]

export const PATTERN_CARDS = [
  { variant: 'red', title: 'Amendments Queue Performance Gap', level: 'Queue level', body: 'Holiday Amendments & Cancellations is the worst-performing queue on every KPI: 50% FCR vs 72% on New Booking Enquiries, 444s AHT vs 323s, 37% repeat contact rate, and lowest CSAT at 3.1. Documentation Accuracy and Save & Rebook are the weakest quality pillars.', tags: [{ text: 'FCR -22%', className: 'tag tag-red' }, { text: 'AHT +120s', className: 'tag tag-red' }, { text: 'RCR +24pts', className: 'tag tag-red' }, { text: 'CSAT -0.8', className: 'tag tag-red' }] },
  { variant: 'amber', title: 'Micro Coaching Without Save & Rebook', level: 'Agent level', body: 'Daily QiQ micro coaching fired on amendments agents throughout W1-W4 but behaviour did not improve - agents continued processing cancellations without offering alternative dates. This pattern triggered formal coaching for 4 agents at W5.', tags: [{ text: 'Micro daily W1-W4', className: 'tag tag-amber' }, { text: 'No behaviour change', className: 'tag tag-amber' }, { text: '4 formal flags W5', className: 'tag tag-amber' }] },
  { variant: 'green', title: 'Formal Coaching Drives Amendments Recovery', level: 'Team level', body: 'After W5 formal TL-led sessions on the four flagged agents, Amendments queue FCR rose from 37% to 59% by W8. CSAT partially recovered and repeat contact rate dropped. Micro coaching frequency on coached agents fell as behaviours stabilised.', tags: [{ text: 'FCR +22pts', className: 'tag tag-green' }, { text: 'CSAT +0.3', className: 'tag tag-green' }, { text: 'RCR -8pts', className: 'tag tag-green' }] },
  { variant: 'red', title: 'Critical Failure Cluster on Amendments', level: 'Quality level', body: 'Five critical failure types cluster on amendment contacts: policy misquote, no Save & Rebook, no case notes, escalation avoidance, and verification failure. 387 critical failures in W1–W4 vs 118 in W6–W8.', tags: [{ text: 'CF 387 → 118', className: 'tag tag-green' }, { text: '5 failure types', className: 'tag tag-red' }, { text: 'Amendments queue', className: 'tag tag-red' }] },
]

export const QUEUE_COMPARISON = [
  { queue: 'Holiday Amendments & Cancellations', fcr: '50%', aht: '7m 24s', rcr: '37%', csat: '3.1', highlight: true },
  { queue: 'New Booking Enquiries', fcr: '72%', aht: '5m 23s', rcr: '14%', csat: '3.9', highlight: false },
  { queue: 'Post-Travel & Complaints', fcr: '68%', aht: '5m 41s', rcr: '16%', csat: '3.8', highlight: false },
]

export const BEST_PRACTICE_CARDS = [
  { title: 'Offer alternative dates before processing cancellation', evidence: 'Evidence: FCR +34pts on coached agents · RCR -12pts · CSAT +0.4 on amendment contacts', agents: 'Agents: Lerato Nkosi, Ayanda Mbeki (W6-W8)', rec: 'Recommendation: Mandate Save & Rebook script on all amendment contacts. Reinforce via micro coaching until behaviour is consistent.' },
  { title: 'Accurate cancellation policy communication (60-day window)', evidence: 'Evidence: Zero policy misquote CFs post-coaching · FCR +42pts on Pieter Botha', agents: 'Agents: Michael Naidoo (benchmark), Pieter Botha (post-coaching)', rec: 'Recommendation: Make the 60-day cancellation policy card standard on all amendment contacts. Use Michael Naidoo calls as coaching reference material.' },
]

export function getMetricsDrawerSections() {
  return [
    { id: 'kpi-aht-drawer', label: 'Average Handle Time', value: formatAht(AHT_ACTUAL), valueClass: 'val-amber', sub: `Target: ${formatAht(AHT_TARGET)}`, change: '+28.9% vs target', changeClass: 'chg-amber', dataKey: 'aht', color: '#d97706', note: 'AHT elevated on Amendments queue - improving post-W5 coaching on handle efficiency' },
    { id: 'kpi-nps', label: 'Net Promoter Score', value: '4', valueClass: 'val-amber', sub: 'Target: 40', change: '-90% vs target', changeClass: 'chg-amber', dataKey: 'nps', color: '#1a7a4a', note: 'NPS recovering in W6-W8 as amendments CSAT partially rebounds after formal coaching' },
    { id: 'kpi-fcr-drawer', label: 'First Contact Resolution', value: '61.0%', valueClass: 'val-red', sub: 'Target: 78%', change: '-21.8% vs target', changeClass: 'chg-red', dataKey: 'fcr', color: '#1a7a4a', note: 'FCR trough at W5; recovery visible W6-W8 driven by amendments coaching intervention' },
    { id: 'kpi-csat', label: 'Customer Satisfaction Score', value: '3.60', valueClass: 'val-amber', sub: 'Target: 4.2', change: '-14.3% vs target', changeClass: 'chg-amber', dataKey: 'csat', color: '#d97706', note: 'CSAT declined W1-W5 on amendment contacts; partial recovery W6-W8' },
  ]
}
