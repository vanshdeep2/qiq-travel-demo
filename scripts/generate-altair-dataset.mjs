/**
 * Generates Altair Travel contact dataset (10,000 records, 8 weeks).
 * Run: node scripts/generate-altair-dataset.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'
import {
  DRIVER_TAXONOMY,
  L1_CATEGORIES,
  L1_WEIGHTS,
  L2_WEIGHTS,
  isHighRiskDriver,
  pickWeightedDriver,
} from '../src/data/contactDriverTaxonomy.js'
import { DRIVER_ISSUE_TEMPLATES } from './travel-driver-templates.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public', 'data', 'contact_search_data.json')
const STATS_OUT = join(ROOT, 'scripts', 'dataset-stats.json')

const TOTAL = 10000
const WEEKS = 8
const PER_WEEK = TOTAL / WEEKS

const WEEK_BOUNDARIES = [
  { start: '2026-04-06', end: '2026-04-12', label: 'W1' },
  { start: '2026-04-13', end: '2026-04-19', label: 'W2' },
  { start: '2026-04-20', end: '2026-04-26', label: 'W3' },
  { start: '2026-04-27', end: '2026-05-03', label: 'W4' },
  { start: '2026-05-04', end: '2026-05-10', label: 'W5' },
  { start: '2026-05-11', end: '2026-05-17', label: 'W6' },
  { start: '2026-05-18', end: '2026-05-24', label: 'W7' },
  { start: '2026-05-25', end: '2026-05-31', label: 'W8' },
]

const CHANNELS = ['voice', 'email', 'chat']
const CHANNEL_WEIGHTS = [0.65, 0.22, 0.13]

const FEATURED_AGENTS = [
  'Michael Naidoo', 'Nomsa Dlamini', 'Lerato Nkosi', 'Pieter Botha', 'Busisiwe Maseko',
  'Ayanda Mbeki', 'Zanele Ndlovu', 'Thabo van der Merwe', 'Janine Jacobs', 'Sipho Khumalo',
]

const COACHED_AGENTS = ['Lerato Nkosi', 'Pieter Botha', 'Busisiwe Maseko', 'Ayanda Mbeki']

const EXTRA_AGENTS = [
  'Andile Zulu', 'Bongani Ngcobo', 'Candice Pretorius', 'Dumisani Mthembu', 'Elize Steyn',
  'Fikile Xaba', 'Gugu Mhlongo', 'Hendrik Kruger', 'Ingrid Bothma', 'Jabulani Sithole',
  'Karabo Molefe', 'Lungile Cele', 'Mandla Dube', 'Naledi Mokoena', 'Oscar Viljoen',
  'Palesa Radebe', 'Quinton Fourie', 'Refilwe Modise', 'Sibusiso Gumede', 'Themba Nkuna',
  'Unathi Qwabe', 'Vuyisile Mabaso', 'Willem de Klerk', 'Xolani Mbatha', 'Yolanda Swart',
  'Zinhle Buthelezi', 'Amahle Nkomo', 'Bheki Zondi', 'Chantelle van Wyk', 'Dineo Kgosana',
  'Ebrahim Patel', 'Fatima Osman', 'Gert van Heerden', 'Hlengiwe Shange', 'Isaac Mnguni',
  'Johan Erasmus', 'Kgomotso Seboko', 'Lerato Mabena', 'Mpho Tshabalala', 'Nhlanhla Mkhize',
  'Olwethu Dlamini', 'Phumzile Nxumalo', 'Riaan Louw', 'Sello Mahlangu', 'Thandiwe Maseko',
  'Ulrich van Niekerk', 'Vusi Ndaba', 'Wandile Khoza', 'Xoliswa Mthethwa', 'Yusuf Adams',
  'Zodwa Maphumulo', 'Anathi Bhengu', 'Brenton Jacobs', 'Cebile Mkhwanazi', 'Daniel Mokoena',
  'Elsabe Venter', 'Fanie Coetzee', 'Gcinile Mabaso', 'Hermanus du Plessis', 'Itumeleng Moloi',
  'Jaco van Zyl', 'Keabetswe Modise', 'Lindiwe Nkabinde', 'Marius Steenkamp', 'Nokuthula Zungu',
  'Oupa Moleko', 'Petra van der Berg', 'Qinisile Mthembu', 'Rethabile Mokoena', 'Stefan Nel',
  'Tshepo Molefe', 'Unathi Mabena', 'Vernon Pieterse', 'Winnie Mabaso', 'Xander van Rooyen',
]

const ALL_AGENTS = [...FEATURED_AGENTS, ...EXTRA_AGENTS].slice(0, 85)

const CF_WEEKLY_TARGET = [77, 82, 105, 123, 59, 45, 32, 41]

const FEATURED_CF_CALLS = [
  { callId: 'AT-RX-CF0001', agent: 'Pieter Botha', date: '2026-04-14', cfType: 'policy_misquote' },
  { callId: 'AT-RX-CF0002', agent: 'Lerato Nkosi', date: '2026-04-22', cfType: 'no_resolution_confirmation' },
  { callId: 'AT-RX-CF0003', agent: 'Ayanda Mbeki', date: '2026-05-01', cfType: 'verification_failure' },
  { callId: 'AT-RX-CF0004', agent: 'Zanele Ndlovu', date: '2026-05-08', cfType: 'escalation_avoidance' },
  { callId: 'AT-RX-CF0005', agent: 'Busisiwe Maseko', date: '2026-04-18', cfType: 'no_case_notes' },
]

const CF_TYPES = [
  { id: 'policy_misquote', label: 'Policy misquote: 28-day cancellation window stated (policy is 60 days)', pillar: 'Business Policy' },
  { id: 'no_resolution_confirmation', label: 'No Save & Rebook: call closed without alternative dates or rebooking confirmation', pillar: 'Save & Rebook' },
  { id: 'no_case_notes', label: 'No case notes: repeat contact where prior interaction had no documentation', pillar: 'Documentation Accuracy' },
  { id: 'escalation_avoidance', label: 'Escalation avoidance: criteria met but not escalated, third contact from same customer', pillar: 'Escalation' },
  { id: 'verification_failure', label: 'Verification failure: booking amendment processed without identity verification', pillar: 'Verification' },
]

const HIGH_RISK_L2_PICK = ["Tour Date Change Request","Cancellation - Full","Penalty Waiver Request","Cancellation - Partial Party","Cancellation Refund Status","Penalty Fee Dispute"]

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Blake', 'Drew', 'Skyler', 'Cameron', 'Reese', 'Parker']
const LAST_NAMES = ['Miller', 'Davis', 'Wilson', 'Brown', 'Garcia', 'Martinez', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Robinson', 'Clark']

const REPEAT_CLUSTERS = Array.from({ length: 205 }, (_, i) => ({
  booking: `AT-BK-${10000 + i}`,
  customer: `${FIRST_NAMES[i % 15]} ${LAST_NAMES[i % 15]}`,
  contacts: 2 + (i % 3),
}))

let seed = 42
function rand() {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

function pickWeighted(items, weights) {
  const r = rand()
  let acc = 0
  for (let i = 0; i < items.length; i++) {
    acc += weights[i]
    if (r < acc) return items[i]
  }
  return items[items.length - 1]
}

function pick(arr) {
  return arr[Math.floor(rand() * arr.length)]
}

function pickDriver(opts = {}) {
  if (opts.l1 && opts.l2) return { l1: opts.l1, l2: opts.l2 }
  if (opts.l1) {
    const l2Items = DRIVER_TAXONOMY[opts.l1]
    const weights = L2_WEIGHTS[opts.l1]
    const l2Weights = l2Items.map((l2) => weights[l2] ?? 1 / l2Items.length)
    return { l1: opts.l1, l2: pickWeighted(l2Items, l2Weights) }
  }
  if (opts.forceHighRisk) {
    const l1 = pick(["Amendments & Cancellations","Payments & Refunds"])
    const l2Items = DRIVER_TAXONOMY[l1].filter((l2) => HIGH_RISK_L2_PICK.includes(l2))
    return { l1, l2: pick(l2Items.length ? l2Items : DRIVER_TAXONOMY[l1]) }
  }
  return pickWeightedDriver(rand)
}

function dateInWeek(weekIdx) {
  const w = WEEK_BOUNDARIES[weekIdx]
  const start = new Date(w.start)
  const end = new Date(w.end)
  const days = Math.floor((end - start) / 86400000)
  const d = new Date(start)
  d.setDate(d.getDate() + Math.floor(rand() * (days + 1)))
  const h = 8 + Math.floor(rand() * 10)
  const m = Math.floor(rand() * 60)
  const s = Math.floor(rand() * 60)
  return {
    date: d.toISOString().slice(0, 10),
    time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
  }
}

function weekParams(weekIdx, l1, l2, agentName) {
  const phase = weekIdx < 4 ? 'decline' : weekIdx === 4 ? 'intervention' : 'recovery'
  const isHighRisk = isHighRiskDriver(l1, l2)
  const isCoached = COACHED_AGENTS.includes(agentName)

  let fcrBase = isHighRisk ? 0.48 : l1 === 'Bookings & Reservations' ? 0.68 : 0.75
  let ahtBase = isHighRisk ? 380 : l1 === 'Bookings & Reservations' ? 310 : 260
  let csatBase = isHighRisk ? 3.2 : 3.8
  let escProb = isHighRisk ? 0.12 : 0.06
  let trProb = isHighRisk ? 0.18 : 0.10
  let repeatProb = isHighRisk ? 0.28 : 0.12
  let cfProb = isHighRisk ? 0.04 : 0.01

  if (phase === 'decline' && isHighRisk) {
    fcrBase -= 0.02 * weekIdx
    ahtBase += 15 * weekIdx
    csatBase -= 0.08 * weekIdx
    repeatProb += 0.03 * weekIdx
    cfProb += 0.008 * weekIdx
  } else if (phase === 'intervention' && isHighRisk) {
    fcrBase -= 0.05
    ahtBase += 55
    csatBase -= 0.15
    repeatProb += 0.05
    cfProb += 0.01
  } else if (phase === 'recovery' && isHighRisk) {
    const recoveryWeek = weekIdx - 5
    fcrBase += 0.06 + recoveryWeek * 0.04
    ahtBase -= 20 + recoveryWeek * 12
    csatBase += 0.1 + recoveryWeek * 0.08
    repeatProb -= 0.04 + recoveryWeek * 0.03
    cfProb -= 0.015
  }

  if (isCoached && isHighRisk) {
    if (phase === 'decline' || phase === 'intervention') {
      fcrBase -= 0.12
      ahtBase += 40
      csatBase -= 0.25
      repeatProb += 0.08
      cfProb += 0.02
    } else {
      fcrBase += 0.15 + (weekIdx - 5) * 0.05
      ahtBase -= 30
      csatBase += 0.2
      repeatProb -= 0.1
      cfProb -= 0.02
    }
  }

  if (agentName === 'Michael Naidoo' && isHighRisk) {
    fcrBase = Math.max(fcrBase, 0.82)
    csatBase = Math.max(csatBase, 4.1)
    cfProb *= 0.2
  }
  if (agentName === 'Zanele Ndlovu' && isHighRisk && phase !== 'recovery') {
    fcrBase = Math.min(fcrBase, 0.35)
    csatBase = Math.min(csatBase, 2.5)
    cfProb += 0.03
  }

  return { fcrBase, ahtBase, csatBase, escProb, trProb, repeatProb, cfProb, phase, isHighRisk }
}

function makeQuestionEvals(qaScore, cfType) {
  const metCount = Math.round((qaScore / 100) * 10)
  const evals = []
  for (let i = 1; i <= 14; i++) {
    const qid = `q${i}`
    const applicable = i !== 3 && i !== 10
    let awarded = applicable && i <= metCount ? 1 : applicable ? 0 : null
    if (cfType === 'policy_misquote' && qid === 'q13') awarded = 0
    if (cfType === 'no_resolution_confirmation' && qid === 'q9') awarded = 0
    if (cfType === 'no_case_notes' && qid === 'q11') awarded = 0
    if (cfType === 'verification_failure' && qid === 'q4') awarded = 0
    evals.push({
      na_reason: applicable ? null : 'Not applicable for this contact type.',
      reasoning: applicable ? 'Evaluated from transcript.' : 'N/A',
      applicable,
      question_id: qid,
      requires_crm: qid === 'q3',
      llm_score_awarded: awarded,
      structured_evidence: [],
      policy_score_awarded: awarded ?? 1,
      effective_earned_weight: applicable ? (awarded ? 8 : 0) : 0,
    })
  }
  return evals
}

function sectionScores(isHighRisk, qaScore, cfType) {
  const doc = isHighRisk ? Math.min(qaScore - 15, 55) : qaScore - 5
  const resolution = isHighRisk ? Math.min(qaScore - 10, 60) : qaScore
  const policy = cfType === 'policy_misquote' ? 20 : qaScore
  const experience = qaScore + 5
  return [
    { section: 'Customer Experience', score_pct: Math.min(100, experience), earned_weight: 26, applicable_weight: 34 },
    { section: 'Policy and Compliance', score_pct: Math.min(100, policy), earned_weight: 12, applicable_weight: 12 },
    { section: 'Documentation Accuracy', score_pct: Math.max(20, doc), earned_weight: 25, applicable_weight: 34 },
    { section: 'Save & Rebook', score_pct: Math.max(15, resolution), earned_weight: 20, applicable_weight: 20 },
  ]
}

function agentLine(agent, text) {
  return `Agent (${agent}): ${text}`
}

function customerLine(text) {
  return `Customer: ${text}`
}

function fillTemplate(text, ref) {
  return text.replace(/\{booking\}/g, ref)
}

function countTranscriptTurns(lines) {
  let agent = 0
  let customer = 0
  for (const line of lines) {
    if (line.startsWith('Agent (')) agent++
    else if (line.startsWith('Customer:')) customer++
  }
  return { total: lines.length, agent, customer }
}

function padTranscript(lines, agent, ref, subcategory) {
  const fillers = [
    agentLine(agent, 'One moment while I review the booking details in our system.'),
    customerLine('Sure, take your time.'),
    agentLine(agent, 'Thank you for waiting. I can see the full history on booking ' + ref + '.'),
    customerLine('Does that change anything about my request?'),
    agentLine(agent, `To make sure I have this right - you contacted us about ${subcategory.toLowerCase()} on this booking.`),
    customerLine('Yes, that is correct.'),
    agentLine(agent, 'I appreciate your patience while we work through this together.'),
    customerLine('I just want to make sure it is actually resolved this time.'),
    agentLine(agent, 'I have noted everything we discussed today on your case for future reference.'),
    customerLine('Thank you for explaining that clearly.'),
    agentLine(agent, 'Is there anything else about booking ' + ref + ' I can help with before we close?'),
    customerLine('No, I think we have covered everything for now.'),
    agentLine(agent, 'Thank you for contacting Altair Travel. We appreciate your business.'),
  ]
    let fi = 0
  while (fi < fillers.length) {
    const { total, agent: a, customer: c } = countTranscriptTurns(lines)
    if (total >= 8 && a >= 3 && c >= 3) break
    lines.splice(lines.length - 1, 0, fillers[fi])
    fi++
  }
  return lines
}

function buildTranscript({
  agent,
  ref,
  subcategory,
  l1,
  isHighRisk,
  cfType,
  channel,
  phase,
  isRepeat,
  fcr,
  escalated,
}) {
  const issue = DRIVER_ISSUE_TEMPLATES[subcategory] || {
    customerOpen: `I need help with ${subcategory.toLowerCase()} on booking {booking}.`,
    customerFollow: 'I have the booking details ready if you need them.',
    agentFinding: `Let me pull up booking {booking} in the system.`,
    agentResolve: `I have taken care of your ${subcategory.toLowerCase()} request and documented everything on the case.`,
  }

  const isBenchmark = agent === 'Michael Naidoo'
  const isCoached = COACHED_AGENTS.includes(agent)
  const coachedBadPhase = isCoached && (phase === 'decline' || phase === 'intervention')
  const zaneleEscalationMiss = agent === 'Zanele Ndlovu' && cfType === 'escalation_avoidance'

  const lines = []

  if (channel === 'email') {
    lines.push('Email thread - Altair Travel Customer Care')
    lines.push(customerLine(`Re: booking ${ref} - ${subcategory.toLowerCase()}.`))
    lines.push(agentLine(agent, 'Thank you for contacting Altair Travel Customer Care.'))
  } else if (channel === 'chat') {
    lines.push('Chat - Altair Travel Support')
    lines.push(agentLine(agent, 'Hi, thanks for chatting with Altair Travel. How can I help you today?'))
  } else {
    lines.push(agentLine(agent, `Thank you for contacting Altair Travel, this is ${agent}. How can I help you today?`))
  }

  if (cfType !== 'verification_failure' && !coachedBadPhase) {
    lines.push(agentLine(agent, 'For security, can I confirm the booking reference and the email address on the account?'))
    lines.push(customerLine(`Booking ${ref}, and the email on the account should be on file from when we booked.`))
  } else if (cfType === 'verification_failure') {
    lines.push(agentLine(agent, 'I can look into that amendment for you right away.'))
    lines.push(customerLine(fillTemplate(issue.customerOpen, ref)))
  } else {
    lines.push(agentLine(agent, 'Can I get your booking reference to get started?'))
    lines.push(customerLine(`It is ${ref}.`))
  }

  if (isRepeat && !cfType) {
    lines.push(customerLine(`This is my third time contacting Altair Travel about ${subcategory.toLowerCase()} on booking ${ref}.`))
  } else {
    lines.push(customerLine(fillTemplate(issue.customerOpen, ref)))
  }

  lines.push(agentLine(agent, fillTemplate(issue.agentFinding, ref)))
  lines.push(customerLine(fillTemplate(issue.customerFollow, ref)))

  if (cfType === 'policy_misquote') {
    lines.push(agentLine(agent, 'Our cancellation window is 28 days before departure, so this booking would incur a penalty under policy.'))
    lines.push(customerLine('I thought Altair Travel allowed 60 days penalty-free — that is what your brochure says.'))
    lines.push(agentLine(agent, 'The system shows 28 days for this package type. I can note your concern but I cannot override that today.'))
  } else if (cfType === 'escalation_avoidance' || zaneleEscalationMiss) {
    lines.push(agentLine(agent, 'I understand this is frustrating. Let me try one more time to resolve the amendment from my side.'))
    lines.push(customerLine('I have already spoken to two other agents. I need a supervisor or escalation.'))
    lines.push(agentLine(agent, 'I am sure we can sort this without escalating. I will refresh the booking status now.'))
    lines.push(customerLine('That is what I was told last time. I am not confident this is resolved.'))
    lines.push(agentLine(agent, 'I have updated the notes. Please allow 24 hours and call back if you still do not have rebooking confirmation.'))
  } else if (cfType === 'verification_failure') {
    lines.push(agentLine(agent, 'I will go ahead and process the amendment now without completing identity verification.'))
    lines.push(customerLine('Do you need me to confirm anything else for security?'))
    lines.push(agentLine(agent, 'No, we are fine. The amendment is submitted.'))
  } else if (cfType === 'no_resolution_confirmation' || (coachedBadPhase && isHighRisk && !isBenchmark)) {
    lines.push(agentLine(agent, 'I have noted the cancellation request in the system.'))
    lines.push(customerLine('When will I receive confirmation of the alternative dates?'))
    lines.push(agentLine(agent, 'It should be confirmed soon. Is there anything else I can help with today?'))
    lines.push(customerLine('So you cannot confirm the departure dates or rebooking reference?'))
    lines.push(agentLine(agent, 'The system will update automatically once processing completes. Thank you for calling Altair Travel.'))
  } else if (escalated) {
    lines.push(agentLine(agent, 'This needs our specialist amendments team. I am escalating now with full notes on booking ' + ref + '.'))
    lines.push(customerLine('How long until someone contacts me?'))
    lines.push(agentLine(agent, 'A specialist will reach out within 24 hours. Your escalation reference is on the case.'))
  } else {
    const policyLine = isHighRisk ? 'Altair Travel offers a 60-day penalty-free cancellation window where applicable.' : ''
    if (policyLine && subcategory !== 'Policy Clarification') {
      lines.push(agentLine(agent, policyLine))
    }
    lines.push(agentLine(agent, fillTemplate(issue.agentResolve, ref)))
    if (isBenchmark && isHighRisk) {
      lines.push(agentLine(agent, 'To recap: your move to the alternative departure is confirmed on ' + ref + '. I have added full notes to the booking and confirmation is on its way by email.'))
    }
  }

  const skipCaseNotes = cfType === 'no_case_notes' || (coachedBadPhase && !isBenchmark && rand() < 0.6)
  if (!skipCaseNotes && fcr && cfType !== 'no_resolution_confirmation' && cfType !== 'escalation_avoidance' && !zaneleEscalationMiss) {
    lines.push(agentLine(agent, 'I have documented today\'s resolution and next steps on your case for any future contacts.'))
  }

  if (fcr && cfType !== 'no_resolution_confirmation' && !zaneleEscalationMiss && cfType !== 'escalation_avoidance') {
    lines.push(agentLine(agent, 'Is there anything else I can help you with today?'))
    lines.push(customerLine('No, that covers it. Thank you.'))
    lines.push(agentLine(agent, 'Thank you for contacting Altair Travel. Have a great day.'))
  } else if (!fcr) {
    lines.push(customerLine('I may need to call back if this is not resolved.'))
    lines.push(agentLine(agent, 'Please use the same case reference if you contact us again so we can pick up where we left off.'))
  }

  padTranscript(lines, agent, ref,
    subcategory)
  return lines.join('\n')
}

function buildRecord(id, weekIdx, opts = {}) {
  const { l1, l2 } = pickDriver(opts)
  const channel = opts.channel || pickWeighted(CHANNELS, CHANNEL_WEIGHTS)
  const agent = opts.agent || pick(ALL_AGENTS)

  const cluster = opts.cluster || (rand() < 0.35 && isHighRiskDriver(l1, l2) ? pick(REPEAT_CLUSTERS) : null)
  const customer = cluster ? cluster.customer : `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`
  const ref = cluster ? cluster.booking : `AT-BK-${20000 + Math.floor(rand() * 8000)}`

  const params = weekParams(weekIdx, l1, l2, agent)
  const { date, time } = dateInWeek(weekIdx)

  const fcr = opts.fcr ?? (rand() < params.fcrBase)
  const escalated = opts.escalated ?? (rand() < params.escProb)
  const transferred = opts.transferred ?? (!escalated && rand() < params.trProb)
  const isRepeat = opts.isRepeat ?? (rand() < params.repeatProb)

  let cfType = opts.cfType ?? null
  let critical = false
  if (!cfType && rand() < params.cfProb) {
    cfType = pick(CF_TYPES).id
    critical = true
  }
  if (opts.forceCritical) {
    critical = true
    cfType = opts.cfType || pick(CF_TYPES).id
  }

  let csat = params.csatBase + (rand() - 0.5) * 0.8
  if (!fcr) csat -= 0.6
  if (critical) csat -= 1.2
  if (fcr && !critical) csat += 0.3
  csat = Math.max(1, Math.min(5, Math.round(csat * 10) / 10))

  const aht = Math.round(params.ahtBase + (rand() - 0.5) * 60 + (channel === 'email' ? -40 : channel === 'chat' ? -20 : 0))

  let qaScore = 70 + (csat - 3) * 12 + (fcr ? 8 : -10) - (critical ? 40 : 0)
  qaScore = Math.max(0, Math.min(100, Math.round(qaScore * 10) / 10))
  const qaPass = !critical && qaScore >= 70

  const cfLabel = critical ? CF_TYPES.find((c) => c.id === cfType)?.label : null
  const prefix = critical ? 'AT-RX-CF' : 'AT-VR-'
  const callId = opts.callId || `${prefix}${String(id).padStart(6, '0')}`

  const transcript = buildTranscript({
    agent,
    ref,
    subcategory: l2,
    l1,
    isHighRisk: params.isHighRisk,
    cfType: critical ? cfType : null,
    channel,
    phase: params.phase,
    isRepeat,
    fcr,
    escalated,
  })

  const summary = `Contact regarding booking ${ref} (${l2}) via ${channel}. `
    + (critical ? `Critical failure flagged: ${cfLabel}. ` : '')
    + (isRepeat ? 'This is a repeat contact on the same issue. ' : '')
    + (fcr ? 'Issue resolved on first contact.' : 'Issue not fully resolved; follow-up may be required.')

  let micro_coaching_action = null
  let formal_coaching_flag = false
  if (critical && cfType) {
    const shortLabel = CF_TYPES.find((c) => c.id === cfType)?.label?.split(':')[0] || cfType
    micro_coaching_action = `QiQ micro coaching: ${shortLabel} flagged on this contact — review protocol before your next amendments shift.`
  } else if (!fcr && params.isHighRisk) {
    micro_coaching_action = `QiQ micro coaching: Confirm Save & Rebook and departure dates before closing amendment contacts.`
  } else if (COACHED_AGENTS.includes(agent) && params.isHighRisk && (params.phase === 'decline' || params.phase === 'intervention')) {
    micro_coaching_action = `QiQ micro coaching: ${agent.split(' ')[0]}, you missed resolution confirmation on a booking contact today.`
  }
  if (COACHED_AGENTS.includes(agent) && params.phase === 'recovery' && params.isHighRisk) {
    formal_coaching_flag = true
  }

  return {
    call_id: callId,
    full_uuid: randomUUID(),
    agent_name: agent,
    call_date: date,
    call_time: time,
    driver_category: l1,
    driver_subcategory: l2,
    call_category: l1,
    call_subcategory: l2,
    booking_name: customer,
    booking_contact: ref,
    channel,
    booking_number: ref,
    call_handling_time: aht,
    transcript,
    narrative_summary: summary,
    fcr_resolved: fcr,
    predicted_csat_score: csat,
    predicted_csat_label: csat >= 4.5 ? 'Very Satisfied' : csat >= 4 ? 'Satisfied' : csat >= 3 ? 'Neutral' : csat >= 2 ? 'Dissatisfied' : 'Very Dissatisfied',
    predicted_nps_score: Math.round(csat * 2 - 1),
    critical_failure: critical,
    critical_failure_category: cfType,
    escalated,
    transferred,
    is_repeat_contact: isRepeat,
    qa_score: critical ? 0 : qaScore,
    qa_pass: qaPass,
    auto_fail_reasons: critical ? [cfLabel] : [],
    key_strengths: fcr ? ['Clear communication on Altair Travel policy.'] : [],
    key_gaps: critical ? [cfLabel] : !fcr ? ['Resolution not confirmed at close.'] : [],
    questions_met: Math.floor(qaScore / 10),
    questions_not_met: 14 - Math.floor(qaScore / 10),
    section_scores: sectionScores(params.isHighRisk, qaScore, cfType),
    question_evaluations: makeQuestionEvals(qaScore, cfType),
    micro_coaching_action,
    formal_coaching_flag,
  }
}

function isHighRiskRecord(r) {
  return isHighRiskDriver(r.driver_category || r.call_category, r.driver_subcategory || r.call_subcategory)
}

// --- Generate ---
const records = []
let id = 1
let cfCounter = 1

for (let w = 0; w < WEEKS; w++) {
  const weekCount = w === WEEKS - 1 ? TOTAL - records.length : PER_WEEK
  const cfTarget = CF_WEEKLY_TARGET[w]

  const cfSlots = new Set()
  while (cfSlots.size < cfTarget && cfSlots.size < weekCount) {
    cfSlots.add(Math.floor(rand() * weekCount))
  }

  for (let i = 0; i < weekCount; i++) {
    const isCf = cfSlots.has(i)
    const cfType = isCf ? CF_TYPES[cfCounter % CF_TYPES.length].id : null
    const record = buildRecord(id++, w, {
      forceCritical: isCf,
      cfType,
      callId: isCf ? `AT-RX-CF${String(cfCounter++).padStart(4, '0')}` : undefined,
      agent: isCf && w < 5 ? pick([...COACHED_AGENTS, 'Zanele Ndlovu']) : undefined,
      forceHighRisk: isCf || undefined,
    })
    records.push(record)
  }
}

for (const cluster of REPEAT_CLUSTERS.slice(0, 140)) {
  for (let c = 0; c < cluster.contacts; c++) {
    if (records.length >= TOTAL + 200) break
    const w = c === 0 ? Math.floor(rand() * 4) : Math.min(7, Math.floor(rand() * 4) + c)
    records.push(buildRecord(id++, w, {
      cluster,
      l1: 'Amendments & Cancellations',
      l2: pick(["Cancellation - Full","Penalty Waiver Request","Cancellation Refund Status"]),
      isRepeat: c > 0,
      agent: pick(COACHED_AGENTS),
      fcr: false,
      forceCritical: c === cluster.contacts - 1 && rand() < 0.4,
      cfType: c === cluster.contacts - 1 ? 'no_case_notes' : null,
    }))
  }
}

while (records.length > TOTAL) records.pop()
while (records.length < TOTAL) {
  records.push(buildRecord(id++, 7, { l1: 'General Support' }))
}

for (const featured of FEATURED_CF_CALLS) {
  const idx = records.findIndex((r) => r.call_id === featured.callId)
  if (idx < 0) continue
  const w = WEEK_BOUNDARIES.findIndex((wb) => featured.date >= wb.start && featured.date <= wb.end)
  const rebuilt = buildRecord(idx + 1, Math.max(0, w), {
    callId: featured.callId,
    agent: featured.agent,
    cfType: featured.cfType,
    forceCritical: true,
    l1: 'Amendments & Cancellations',
    l2: 'Tour Date Change Request',
    fcr: false,
    isRepeat: featured.cfType === 'no_case_notes' || featured.cfType === 'escalation_avoidance',
  })
  rebuilt.call_date = featured.date
  records[idx] = rebuilt
}

// Calibrate CSAT < 3 ~18%
const lowCsatTarget = Math.round(TOTAL * 0.18)
let lowIndices = records.map((r, i) => ({ i, csat: r.predicted_csat_score })).filter((x) => x.csat < 3).map((x) => x.i)

if (lowIndices.length > lowCsatTarget) {
  const toRaise = lowIndices
    .filter((i) => !isHighRiskRecord(records[i]) || rand() > 0.5)
    .slice(0, lowIndices.length - lowCsatTarget)
  for (const i of toRaise) {
    records[i].predicted_csat_score = Math.round((3.1 + rand() * 0.8) * 10) / 10
    records[i].predicted_csat_label = 'Neutral'
  }
}

lowIndices = records.map((r, i) => (r.predicted_csat_score < 3 ? i : -1)).filter((i) => i >= 0)
for (const i of records.map((_, idx) => idx)) {
  if (lowIndices.length >= lowCsatTarget) break
  if (records[i].predicted_csat_score >= 3 && isHighRiskRecord(records[i])) {
    records[i].predicted_csat_score = Math.round((2 + rand() * 0.9) * 10) / 10
    records[i].predicted_csat_label = records[i].predicted_csat_score < 2.5 ? 'Very Dissatisfied' : 'Dissatisfied'
    lowIndices.push(i)
  }
}

const currentAht = records.reduce((s, r) => s + r.call_handling_time, 0) / records.length
const ahtScale = 348 / currentAht
for (const r of records) {
  r.call_handling_time = Math.round(r.call_handling_time * ahtScale)
  if (isHighRiskRecord(r)) {
    r.call_handling_time = Math.round(r.call_handling_time * 1.08)
  }
}

const repeatTarget = Math.round(TOTAL * 0.23)
let repeatCount = records.filter((r) => r.is_repeat_contact).length
if (repeatCount < repeatTarget) {
  const candidates = records.filter((r) => !r.is_repeat_contact && isHighRiskRecord(r)).sort(() => rand() - 0.5)
  for (const r of candidates.slice(0, repeatTarget - repeatCount)) {
    r.is_repeat_contact = true
  }
}

for (const r of records) {
  if (COACHED_AGENTS.includes(r.agent_name) && isHighRiskRecord(r) && r.call_date >= '2026-05-18') {
    if (rand() < 0.75) {
      r.fcr_resolved = true
      r.predicted_csat_score = Math.round(Math.max(r.predicted_csat_score, 3.5) * 10) / 10
    }
  }
}

const fcrCount = records.filter((r) => r.fcr_resolved).length
const targetFcr = Math.round(TOTAL * 0.61)
if (fcrCount > targetFcr) {
  const toFlip = records.filter((r) => r.fcr_resolved && r.driver_category === 'General Support').slice(0, fcrCount - targetFcr)
  for (const r of toFlip) r.fcr_resolved = false
} else if (fcrCount < targetFcr) {
  const toFlip = records.filter((r) => !r.fcr_resolved && r.driver_category === 'General Support').slice(0, targetFcr - fcrCount)
  for (const r of toFlip) r.fcr_resolved = true
}

const escTarget = Math.round(TOTAL * 0.092)
let escCount = records.filter((r) => r.escalated).length
if (escCount > escTarget) {
  for (const r of records.filter((r) => r.escalated && r.driver_category === 'General Support').slice(0, escCount - escTarget)) {
    r.escalated = false
  }
} else if (escCount < escTarget) {
  for (const r of records.filter((r) => !r.escalated && isHighRiskRecord(r)).slice(0, escTarget - escCount)) {
    r.escalated = true
  }
}

const trTarget = Math.round(TOTAL * 0.141)
let trCount = records.filter((r) => r.transferred).length
if (trCount > trTarget) {
  for (const r of records.filter((r) => r.transferred && !r.escalated && r.driver_category === 'General Support').slice(0, trCount - trTarget)) {
    r.transferred = false
  }
} else if (trCount < trTarget) {
  for (const r of records.filter((r) => !r.transferred && !r.escalated && isHighRiskRecord(r)).slice(0, trTarget - trCount)) {
    r.transferred = true
  }
}

const csatAvg = records.reduce((s, r) => s + r.predicted_csat_score, 0) / records.length
const csatShift = 3.6 - csatAvg
for (const r of records) {
  r.predicted_csat_score = Math.max(1, Math.min(5, Math.round((r.predicted_csat_score + csatShift) * 10) / 10))
}

const FEATURED_CF_IDS = new Set(FEATURED_CF_CALLS.map((f) => f.callId))

function clearCriticalFlag(record) {
  record.critical_failure = false
  record.critical_failure_category = null
  record.qa_score = Math.max(72, record.qa_score || 75)
  record.qa_pass = record.qa_score >= 70
  record.auto_fail_reasons = []
  record.key_gaps = record.fcr_resolved ? [] : ['Resolution not confirmed at close.']
}

function applyCriticalFlag(record, cfTypeId) {
  const cfMeta = CF_TYPES.find((c) => c.id === cfTypeId) || CF_TYPES[0]
  record.critical_failure = true
  record.critical_failure_category = cfMeta.id
  record.qa_score = 0
  record.qa_pass = false
  record.fcr_resolved = false
  record.auto_fail_reasons = [cfMeta.label]
  record.key_gaps = [cfMeta.label]
  if (!record.micro_coaching_action) {
    const shortLabel = cfMeta.label.split(':')[0]
    record.micro_coaching_action = `QiQ micro coaching: ${shortLabel} flagged on this contact — review protocol before your next amendments shift.`
  }
}

for (let w = 0; w < WEEKS; w++) {
  const wb = WEEK_BOUNDARIES[w]
  const target = CF_WEEKLY_TARGET[w]
  const inWeek = records.filter((r) => r.call_date >= wb.start && r.call_date <= wb.end)

  const refreshCfList = () => inWeek.filter((r) => r.critical_failure)
  let cfList = refreshCfList()

  while (cfList.length > target) {
    const removable = cfList.filter((r) => !FEATURED_CF_IDS.has(r.call_id))
    if (!removable.length) break
    clearCriticalFlag(removable[removable.length - 1])
    cfList = refreshCfList()
  }

  let typeIdx = 0
  while (cfList.length < target) {
    const pool = inWeek.filter((r) => !r.critical_failure && !FEATURED_CF_IDS.has(r.call_id))
    const candidate = pool.find(isHighRiskRecord) || pool[0]
    if (!candidate) break
    applyCriticalFlag(candidate, CF_TYPES[typeIdx % CF_TYPES.length].id)
    typeIdx += 1
    cfList = refreshCfList()
  }
}

function aggregateDrivers(data) {
  const n = data.length
  const byL1 = {}
  const byL2 = {}

  for (const l1 of L1_CATEGORIES) {
    const subset = data.filter((r) => r.driver_category === l1)
    if (!subset.length) continue
    const esc = subset.filter((r) => r.escalated).length
    byL1[l1] = {
      volume: subset.length,
      share: Math.round((subset.length / n) * 1000) / 10,
      fcr: Math.round((subset.filter((r) => r.fcr_resolved).length / subset.length) * 1000) / 10,
      aht: Math.round(subset.reduce((s, r) => s + r.call_handling_time, 0) / subset.length),
      esc: Math.round((esc / subset.length) * 1000) / 10,
      drivers: {},
    }
    for (const l2 of DRIVER_TAXONOMY[l1]) {
      const sub = subset.filter((r) => r.driver_subcategory === l2)
      if (!sub.length) continue
      const subEsc = sub.filter((r) => r.escalated).length
      const row = {
        name: l2,
        volume: sub.length,
        share: Math.round((sub.length / subset.length) * 1000) / 10,
        fcr: Math.round((sub.filter((r) => r.fcr_resolved).length / sub.length) * 1000) / 10,
        aht: Math.round(sub.reduce((s, r) => s + r.call_handling_time, 0) / sub.length),
        esc: Math.round((subEsc / sub.length) * 1000) / 10,
      }
      byL1[l1].drivers[l2] = row
      byL2[`${l1}::${l2}`] = row
    }
  }
  return { byL1, byL2 }
}

function aggregate(data) {
  const n = data.length
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
  const aht = avg(data.map((r) => r.call_handling_time))
  const fcr = (data.filter((r) => r.fcr_resolved).length / n) * 100
  const csat = avg(data.map((r) => r.predicted_csat_score))
  const rcr = (data.filter((r) => r.is_repeat_contact).length / n) * 100
  const er = (data.filter((r) => r.escalated).length / n) * 100
  const tr = (data.filter((r) => r.transferred).length / n) * 100
  const csatLow = (data.filter((r) => r.predicted_csat_score < 3).length / n) * 100

  const byL1 = {}
  for (const l1 of L1_CATEGORIES) {
    const subset = data.filter((r) => r.driver_category === l1)
    if (!subset.length) continue
    byL1[l1] = {
      count: subset.length,
      aht: avg(subset.map((r) => r.call_handling_time)),
      fcr: (subset.filter((r) => r.fcr_resolved).length / subset.length) * 100,
      csat: avg(subset.map((r) => r.predicted_csat_score)),
      rcr: (subset.filter((r) => r.is_repeat_contact).length / subset.length) * 100,
    }
  }

  const highRisk = data.filter(isHighRiskRecord)
  const lowRisk = data.filter((r) => !isHighRiskRecord(r))

  const byWeek = WEEK_BOUNDARIES.map((w) => {
    const subset = data.filter((r) => r.call_date >= w.start && r.call_date <= w.end)
    const hr = subset.filter(isHighRiskRecord)
    return {
      week: w.label,
      aht: avg(subset.map((r) => r.call_handling_time)),
      fcr: (subset.filter((r) => r.fcr_resolved).length / subset.length) * 100,
      csat: avg(subset.map((r) => r.predicted_csat_score)),
      cf: subset.filter((r) => r.critical_failure).length,
      returnsAht: hr.length ? avg(hr.map((r) => r.call_handling_time)) : 0,
      returnsFcr: hr.length ? (hr.filter((r) => r.fcr_resolved).length / hr.length) * 100 : 0,
    }
  })

  const byChannel = {}
  for (const ch of CHANNELS) {
    byChannel[ch] = data.filter((r) => r.channel === ch).length / n
  }

  const coachedReturnsFcr = {}
  for (const agent of COACHED_AGENTS) {
    const early = data.filter((r) => r.agent_name === agent && isHighRiskRecord(r) && r.call_date <= '2026-05-03')
    const late = data.filter((r) => r.agent_name === agent && isHighRiskRecord(r) && r.call_date >= '2026-05-18')
    coachedReturnsFcr[agent] = {
      w1w4: early.length ? (early.filter((r) => r.fcr_resolved).length / early.length) * 100 : 0,
      w7w8: late.length ? (late.filter((r) => r.fcr_resolved).length / late.length) * 100 : 0,
    }
  }

  const driverStats = aggregateDrivers(data)

  return {
    n, aht, fcr, csat, rcr, er, tr, csatLow,
    byL1, byQueue: byL1,
    highRisk: {
      count: highRisk.length,
      aht: highRisk.length ? avg(highRisk.map((r) => r.call_handling_time)) : 0,
      fcr: highRisk.length ? (highRisk.filter((r) => r.fcr_resolved).length / highRisk.length) * 100 : 0,
    },
    lowRisk: {
      count: lowRisk.length,
      fcr: lowRisk.length ? (lowRisk.filter((r) => r.fcr_resolved).length / lowRisk.length) * 100 : 0,
    },
    byWeek, byChannel, coachedReturnsFcr, driverStats,
  }
}

const stats = aggregate(records)

const errors = []
if (records.length !== TOTAL) errors.push(`Count ${records.length} !== ${TOTAL}`)
if (Math.abs(stats.csatLow - 18) > 3) errors.push(`CSAT<3 ${stats.csatLow.toFixed(1)}% not ~18%`)
if (stats.highRisk.fcr >= stats.lowRisk.fcr) errors.push('High-risk FCR should be worst')
for (const agent of COACHED_AGENTS) {
  const c = stats.coachedReturnsFcr[agent]
  if (c.w7w8 <= c.w1w4) errors.push(`${agent} FCR not improved W7-W8 vs W1-W4`)
}

let shortTranscripts = 0
for (const r of records) {
  const lines = r.transcript.split('\n').filter(Boolean)
  const { total, agent: a, customer: c } = countTranscriptTurns(lines)
  if (total < 8 || a < 3 || c < 3) shortTranscripts++
}
if (shortTranscripts > 0) errors.push(`${shortTranscripts} transcripts below minimum length`)

console.log('Dataset stats:', JSON.stringify({ n: stats.n, byL1: stats.byL1, driverStatsL1: Object.fromEntries(Object.entries(stats.driverStats.byL1).map(([k, v]) => [k, { volume: v.volume, share: v.share }])) }, null, 2))
if (errors.length) {
  console.warn('Validation warnings:', errors)
} else {
  console.log('Validation passed.')
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(records, null, 2))
writeFileSync(STATS_OUT, JSON.stringify(stats, null, 2))
console.log(`Wrote ${records.length} records to ${OUT}`)
