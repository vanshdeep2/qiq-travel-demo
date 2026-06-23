/**
 * Generates Altair Travel contact dataset (2,200 records, 8 weeks).
 * Run: node scripts/generate-altair-dataset.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public', 'data', 'contact_search_data.json')
const STATS_OUT = join(ROOT, 'scripts', 'dataset-stats.json')

const TOTAL = 2200
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

const QUEUES = ['Holiday Amendments & Cancellations', 'New Booking Enquiries', 'Post-Travel & Complaints']
const QUEUE_WEIGHTS = [0.4, 0.35, 0.25]
const CHANNELS = ['voice', 'email', 'chat']
const CHANNEL_WEIGHTS = [0.65, 0.22, 0.13]

const FEATURED_AGENTS = [
  'Michael Naidoo',
  'Nomsa Dlamini',
  'Lerato Nkosi',
  'Pieter Botha',
  'Busisiwe Maseko',
  'Ayanda Mbeki',
  'Zanele Ndlovu',
  'Thabo van der Merwe',
  'Janine Jacobs',
  'Sipho Khumalo',
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

const CF_TYPES = [
  { id: 'policy_misquote', label: 'Policy misquote: 28-day cancellation window stated (policy is 60 days)', pillar: 'Business Policy' },
  { id: 'no_resolution_confirmation', label: 'No Save & Rebook: call closed without alternative dates or rebooking confirmation', pillar: 'Save & Rebook' },
  { id: 'no_case_notes', label: 'No case notes: repeat contact where prior interaction had no documentation', pillar: 'Documentation Accuracy' },
  { id: 'escalation_avoidance', label: 'Escalation avoidance: criteria met but not escalated, third contact from same customer', pillar: 'Escalation' },
  { id: 'verification_failure', label: 'Verification failure: booking amendment processed without identity verification', pillar: 'Verification' },
]

const AMENDMENTS_SUBCATEGORIES = [
  'Tour Date Change Request', 'Cruise Cabin Upgrade', 'Cancellation - Full', 'Cancellation - Partial Party',
  'Name Change on Booking', 'Dietary / Accessibility Amendment', 'Travel Insurance Query', 'Penalty Waiver Request',
  'Departure Airport Change',
]

const BOOKING_SUBCATEGORIES = [
  'Escorted Tour Enquiry', 'Cruise Availability', 'Group Booking', 'Solo Traveller Package',
  'Tour Plus Extension', 'Deposit & Payment Terms', 'Visa & Documentation', 'Early Bird Offer',
]

const POST_TRAVEL_SUBCATEGORIES = [
  'Tour Manager Complaint', 'Accommodation Issue', 'Missed Excursion', 'Flight Disruption',
  'Lost Luggage', 'Refund Post-Travel', 'Positive Feedback', 'ABTA/ATOL Query',
]

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Blake', 'Drew', 'Skyler', 'Cameron', 'Reese', 'Parker']
const LAST_NAMES = ['Miller', 'Davis', 'Wilson', 'Brown', 'Garcia', 'Martinez', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Robinson', 'Clark']

// Repeat-contact clusters for returns/refund search density
const REPEAT_CLUSTERS = Array.from({ length: 45 }, (_, i) => ({
  order: `AT-BK-${10000 + i}`,
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

function weekParams(weekIdx, queue, agentName) {
  const phase = weekIdx < 4 ? 'decline' : weekIdx === 4 ? 'intervention' : 'recovery'
  const isAmendments = queue === 'Holiday Amendments & Cancellations'
  const isCoached = COACHED_AGENTS.includes(agentName)

  let fcrBase = isAmendments ? 0.48 : queue === 'New Booking Enquiries' ? 0.68 : 0.75
  let ahtBase = isAmendments ? 380 : queue === 'New Booking Enquiries' ? 310 : 260
  let csatBase = isAmendments ? 3.2 : 3.8
  let escProb = isAmendments ? 0.12 : 0.06
  let trProb = isAmendments ? 0.18 : 0.10
  let repeatProb = isAmendments ? 0.28 : 0.12
  let cfProb = isAmendments ? 0.04 : 0.01

  if (phase === 'decline' && isAmendments) {
    fcrBase -= 0.02 * weekIdx
    ahtBase += 15 * weekIdx
    csatBase -= 0.08 * weekIdx
    repeatProb += 0.03 * weekIdx
    cfProb += 0.008 * weekIdx
  } else if (phase === 'intervention' && isAmendments) {
    fcrBase -= 0.05
    ahtBase += 55
    csatBase -= 0.15
    repeatProb += 0.05
    cfProb += 0.01
  } else if (phase === 'recovery' && isAmendments) {
    const recoveryWeek = weekIdx - 5
    fcrBase += 0.06 + recoveryWeek * 0.04
    ahtBase -= 20 + recoveryWeek * 12
    csatBase += 0.1 + recoveryWeek * 0.08
    repeatProb -= 0.04 + recoveryWeek * 0.03
    cfProb -= 0.015
  }

  if (isCoached && isAmendments) {
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

  // High performers on returns
  if (agentName === 'Michael Naidoo' && isAmendments) {
    fcrBase = Math.max(fcrBase, 0.82)
    csatBase = Math.max(csatBase, 4.1)
    cfProb *= 0.2
  }
  if (agentName === 'Zanele Ndlovu' && isAmendments && phase !== 'recovery') {
    fcrBase = Math.min(fcrBase, 0.35)
    csatBase = Math.min(csatBase, 2.5)
    cfProb += 0.03
  }

  return { fcrBase, ahtBase, csatBase, escProb, trProb, repeatProb, cfProb, phase }
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

function sectionScores(queue, qaScore, cfType) {
  const isAmendments = queue === 'Holiday Amendments & Cancellations'
  const doc = isAmendments ? Math.min(qaScore - 15, 55) : qaScore - 5
  const saveRebook = isAmendments ? Math.min(qaScore - 10, 60) : qaScore
  const policy = cfType === 'policy_misquote' ? 20 : qaScore
  const experience = qaScore + 5
  return [
    { section: 'Customer Experience', score_pct: Math.min(100, experience), earned_weight: 26, applicable_weight: 34 },
    { section: 'Policy and Compliance', score_pct: Math.min(100, policy), earned_weight: 12, applicable_weight: 12 },
    { section: 'Documentation Accuracy', score_pct: Math.max(20, doc), earned_weight: 25, applicable_weight: 34 },
    { section: 'Save & Rebook', score_pct: Math.max(15, saveRebook), earned_weight: 20, applicable_weight: 20 },
  ]
}

function agentLine(agent, text) {
  return `Agent (${agent}): ${text}`
}

function customerLine(text) {
  return `Customer: ${text}`
}

const SUBCATEGORY_ISSUES = {
  'Tour Date Change Request': {
    customerOpen: 'I need to move our Japan escorted tour on booking {order} to a later departure date.',
    customerFollow: 'My husband has a medical appointment that week and we cannot travel as planned.',
    agentFinding: 'I can see your Japan Highlights tour departing 14 September. Let me check alternative dates.',
    agentResolve: 'I have moved you to the 5 October departure at no change fee. Your new confirmation reference is on its way by email and the £3,800 balance schedule is unchanged.',
  },
  'Cruise Cabin Upgrade': {
    customerOpen: 'We booked a balcony cabin on the Norwegian Fjords cruise under {order} but wondered about upgrading to a suite.',
    customerFollow: 'We are celebrating our anniversary and happy to pay the difference.',
    agentFinding: 'Suite availability is limited on that sailing but I can see one Junior Suite on deck 9.',
    agentResolve: 'I have upgraded you to Junior Suite 912 for an additional £640. Updated ATOL certificate and cabin plan are being emailed now.',
  },
  'Cancellation - Full': {
    customerOpen: 'I need to cancel our Amalfi Coast group tour on booking {order} in full.',
    customerFollow: 'A family bereavement means we cannot travel this year.',
    agentFinding: 'I am sorry to hear that. Let me review your booking and our cancellation terms.',
    agentResolve: 'Before we process cancellation, I can offer the 12 May 2027 departure with your deposit transferred, saving £420 in penalties. Shall I hold that date for 48 hours while you decide?',
  },
  'Cancellation - Partial Party': {
    customerOpen: 'Two of our party of four need to cancel the Kenya safari on {order}.',
    customerFollow: 'The other two still want to travel on the original dates.',
    agentFinding: 'I can amend the passenger list and recalculate the per-person balance.',
    agentResolve: 'I have removed the two passengers and reissued invoices for the remaining travellers. Partial cancellation fee of £180 per person applies and I have confirmed the revised total by email.',
  },
  'Name Change on Booking': {
    customerOpen: 'I need to correct a spelling on one passenger name for booking {order}.',
    customerFollow: 'It is one letter wrong on the passport - the airline may reject it.',
    agentFinding: 'Name changes are permitted up to 60 days before departure on this tour.',
    agentResolve: 'I have updated the passenger name to match the passport and reissued your travel documents. No fee applied as we are inside the free amendment window.',
  },
  'Dietary / Accessibility Amendment': {
    customerOpen: 'We need to add a wheelchair-accessible room request to our Nile river cruise on {order}.',
    customerFollow: 'My mother will be using a folding wheelchair for excursions.',
    agentFinding: 'I can flag accessibility requirements with the ship and tour manager.',
    agentResolve: 'Accessible cabin 204 is now confirmed and dietary requirements are logged for the full itinerary. The tour manager will meet you at embarkation.',
  },
  'Travel Insurance Query': {
    customerOpen: 'Does our booking {order} include travel insurance or do we need to arrange our own?',
    customerFollow: 'We are both over 70 and want to be sure medical cover is adequate.',
    agentFinding: 'Your package is ATOL protected but does not include comprehensive medical insurance.',
    agentResolve: 'I have emailed our recommended over-70s policy options and noted that cover must be in place before final balance. ABTA bonding details are on your booking confirmation.',
  },
  'Penalty Waiver Request': {
    customerOpen: 'We were charged a cancellation penalty on {order} but the airline cancelled the flight.',
    customerFollow: 'Surely we should not pay a penalty when the disruption was not our fault.',
    agentFinding: 'I can see the airline schedule change on 22 April that triggered the penalty.',
    agentResolve: 'I have submitted a penalty waiver request to our operations team. You will receive a decision within 5 working days and I have documented the airline cancellation reference on your case.',
  },
  'Departure Airport Change': {
    customerOpen: 'Can we switch our departure airport from Manchester to London on booking {order}?',
    customerFollow: 'We have moved house and Manchester is no longer convenient.',
    agentFinding: 'Flight-inclusive packages can be repriced from an alternative UK gateway.',
    agentResolve: 'Heathrow departure is available for an additional £95 per person. I have held the seats for 24 hours and sent the revised ATOL certificate for review.',
  },
  'Escorted Tour Enquiry': {
    customerOpen: 'I am interested in your Canadian Rockies by rail tour for next summer.',
    customerFollow: 'We are looking at a twin room for two travellers in June.',
    agentFinding: 'June departures have good availability on the GoldLeaf service.',
    agentResolve: 'I have emailed the full itinerary, deposit terms of £500 per person, and solo supplement options. Early bird saving of £150 applies if booked before 30 June.',
  },
  'Cruise Availability': {
    customerOpen: 'Is there availability on the Mediterranean cruise departing 3 October?',
    customerFollow: 'We need a balcony cabin for two adults.',
    agentFinding: 'October sailing shows balcony cabins on decks 8 and 9.',
    agentResolve: 'Balcony cabin B847 is available at £2,149 per person including gratuities. I can place a 24-hour complimentary hold while you confirm.',
  },
  'Group Booking': {
    customerOpen: 'We are a group of 12 looking at the Amalfi Coast tour for booking reference enquiry.',
    customerFollow: 'We would need adjoining rooms where possible.',
    agentFinding: 'Group bookings of 10+ qualify for a free place policy on this tour.',
    agentResolve: 'I have sent the group contract, rooming list template, and deposit schedule. One free place applies and I have noted adjoining room requests for the hotels.',
  },
  'Solo Traveller Package': {
    customerOpen: 'Do you offer no single supplement on the Japan tour for solo travellers?',
    customerFollow: 'I am travelling alone and want to avoid a large single supplement.',
    agentFinding: 'Selected departures have no single supplement places allocated.',
    agentResolve: 'The 18 September departure has two no-supplement singles remaining at £4,200. I have reserved one for 48 hours with no obligation.',
  },
  'Tour Plus Extension': {
    customerOpen: 'Can we add a Tokyo city break before our Japan escorted tour on {order}?',
    customerFollow: 'We would like three nights before the group meets.',
    agentFinding: 'Tour Plus extensions can be added to confirmed bookings before final balance.',
    agentResolve: 'Three nights at the Shinjuku Grand with airport transfers is £485 per person. I have added it to your itinerary and updated the ATOL certificate.',
  },
  'Deposit & Payment Terms': {
    customerOpen: 'What is the deposit and final balance schedule for booking {order}?',
    customerFollow: 'We want to pay by instalments if possible.',
    agentFinding: 'Your booking shows £500 deposit paid with balance due 12 weeks before departure.',
    agentResolve: 'Final balance of £2,800 is due 18 July. Our FlexPay instalment plan is available at no extra cost and I have emailed the enrolment link.',
  },
  'Visa & Documentation': {
    customerOpen: 'What visas do we need for our India tour on {order}?',
    customerFollow: 'We hold UK passports and have not travelled to India before.',
    agentFinding: 'India requires an e-visa for UK passport holders on this itinerary.',
    agentResolve: 'I have emailed the step-by-step e-visa guide and our documentation checklist. Applications should be submitted at least 8 weeks before departure.',
  },
  'Early Bird Offer': {
    customerOpen: 'Does the early bird discount still apply if I book the Kenya safari today?',
    customerFollow: 'The website showed 10% off departures before March.',
    agentFinding: 'Early bird is valid on selected 2027 departures booked before 30 June.',
    agentResolve: 'Today\'s booking qualifies for 10% off - a saving of £380. I have applied the discount and sent the revised confirmation showing the reduced total of £3,420.',
  },
  'Tour Manager Complaint': {
    customerOpen: 'I want to complain about our tour manager on the Amalfi trip linked to {order}.',
    customerFollow: 'Several excursions ran late and information was unclear.',
    agentFinding: 'I am sorry your experience did not meet our standards. I am reviewing the post-travel feedback.',
    agentResolve: 'I have logged a formal complaint with our operations director. You will receive a written response within 10 working days and a goodwill gesture is being considered.',
  },
  'Accommodation Issue': {
    customerOpen: 'The hotel on night three of our tour was not the standard advertised on {order}.',
    customerFollow: 'The room was on a main road and very noisy.',
    agentFinding: 'I can see your post-travel survey flagged the Rome hotel.',
    agentResolve: 'I have escalated to our product team and arranged a £75 compensation voucher. Your feedback will inform our 2027 hotel selections.',
  },
  'Missed Excursion': {
    customerOpen: 'We missed the included excursion on day four due to a coach breakdown on {order}.',
    customerFollow: 'We were not offered an alternative that day.',
    agentFinding: 'The DMC reported a vehicle fault that affected the Pompeii visit.',
    agentResolve: 'I have credited £45 per person for the missed excursion and arranged a private revisit option on your next Altair booking at 50% discount.',
  },
  'Flight Disruption': {
    customerOpen: 'Our outbound flight on {order} was delayed six hours and we missed the group transfer.',
    customerFollow: 'We had to pay for a taxi to reach the ship.',
    agentFinding: 'I can see the airline delay code on your booking.',
    agentResolve: 'I have submitted a taxi reimbursement claim for £68 and confirmed your cabin was held. ATOL protection covers consequential losses and I have started the claim form.',
  },
  'Lost Luggage': {
    customerOpen: 'My luggage was lost on the flight for our cruise booking {order}.',
    customerFollow: 'I only have carry-on and the formal cruise dinner is tonight.',
    agentFinding: 'The airline file reference is on your case from the port agent.',
    agentResolve: 'I have emailed an emergency clothing allowance form and our port concierge will press the airline for delivery to the next port of call.',
  },
  'Refund Post-Travel': {
    customerOpen: 'We are still waiting for the refund promised after our cancelled excursion on {order}.',
    customerFollow: 'It has been three weeks since the tour ended.',
    agentFinding: 'I can see the refund was approved but not yet released by finance.',
    agentResolve: 'I have chased finance and your £90 refund will post within 5 working days. I have sent written confirmation with the payment reference.',
  },
  'Positive Feedback': {
    customerOpen: 'I wanted to call and praise our tour manager on the Japan trip - booking {order}.',
    customerFollow: 'She made the whole group feel cared for throughout.',
    agentFinding: 'Thank you - positive feedback is wonderful to receive.',
    agentResolve: 'I have logged your comments for her manager and added a thank-you note to your customer profile. We hope to welcome you on another Altair journey soon.',
  },
  'ABTA/ATOL Query': {
    customerOpen: 'Can you confirm our booking {order} is financially protected?',
    customerFollow: 'We want to see the ATOL certificate before paying the final balance.',
    agentFinding: 'All Altair Travel flight-inclusive packages are ATOL protected.',
    agentResolve: 'I have reissued your ATOL certificate by email. Your protection number is ATOL 2987 and ABTA membership details are on the confirmation.',
  },
}

function fillTemplate(text, order) {
  return text.replace(/\{order\}/g, order)
}

function buildTranscript({
  agent,
  order,
  subcategory,
  queue,
  cfType,
  channel,
  phase,
  isRepeat,
  fcr,
  escalated,
}) {
  const issue = SUBCATEGORY_ISSUES[subcategory] || {
    customerOpen: `I need help with ${subcategory.toLowerCase()} on order {order}.`,
    customerFollow: 'I have the order details ready if you need them.',
    agentFinding: `Let me pull up order {order} in the system.`,
    agentResolve: `I have taken care of your ${subcategory.toLowerCase()} request and documented everything on the case.`,
  }

  const isBenchmark = agent === 'Michael Naidoo'
  const isCoached = COACHED_AGENTS.includes(agent)
  const coachedBadPhase = isCoached && (phase === 'decline' || phase === 'intervention')
  const zaneleEscalationMiss = agent === 'Zanele Ndlovu' && phase !== 'recovery' && (isRepeat || cfType === 'escalation_avoidance')

  const lines = []

  if (channel === 'email') {
    lines.push('Email thread - Altair Travel Customer Care')
    lines.push(customerLine(`Re: booking ${order} - ${subcategory.toLowerCase()}.`))
    lines.push(agentLine(agent, 'Thank you for contacting Altair Travel.'))
  } else if (channel === 'chat') {
    lines.push('Chat - Altair Travel Support')
    lines.push(agentLine(agent, 'Hi, thanks for chatting with Altair Travel. How can I help you today?'))
  } else {
    lines.push(agentLine(agent, `Thank you for contacting Altair Travel, this is ${agent}. How can I help you today?`))
  }

  if (cfType !== 'verification_failure' && !coachedBadPhase) {
    lines.push(agentLine(agent, 'For security, can I confirm the order number and the email address on the account?'))
    lines.push(customerLine(`Order ${order}, and the email on the account should be on file from checkout.`))
  } else if (cfType === 'verification_failure') {
    lines.push(agentLine(agent, 'I can look into that return for you right away.'))
    lines.push(customerLine(fillTemplate(issue.customerOpen, order)))
  } else {
    lines.push(agentLine(agent, 'Can I get your order number to get started?'))
    lines.push(customerLine(`It is ${order}.`))
  }

  if (isRepeat && !cfType) {
    lines.push(customerLine(`This is my third time contacting Altair Travel about ${subcategory.toLowerCase()} on booking ${order}.`))
  } else {
    lines.push(customerLine(fillTemplate(issue.customerOpen, order)))
  }

  lines.push(agentLine(agent, fillTemplate(issue.agentFinding, order)))

  lines.push(customerLine(fillTemplate(issue.customerFollow, order)))

  if (cfType === 'policy_misquote') {
    lines.push(agentLine(agent, 'Our cancellation penalty window is 28 days before departure, so this booking would not qualify for a full refund under policy.'))
    lines.push(customerLine('I thought Altair Travel allowed 60 days - that is what your brochure says.'))
    lines.push(agentLine(agent, 'The system shows 28 days for this tour category. I can note your concern but I cannot override that today.'))
  } else if (cfType === 'escalation_avoidance' || zaneleEscalationMiss) {
    lines.push(agentLine(agent, 'I understand this is frustrating. Let me try one more time to process the cancellation from my side.'))
    lines.push(customerLine('I have already spoken to two other agents. I need a supervisor or escalation.'))
    lines.push(agentLine(agent, 'I am sure we can sort this without escalating. I will refresh the booking status now.'))
    lines.push(customerLine('That is what I was told last time. I am not confident this is resolved.'))
    lines.push(agentLine(agent, 'I have updated the notes. Please allow 24 hours and call back if you still do not see the amendment.'))
  } else if (cfType === 'verification_failure') {
    lines.push(agentLine(agent, 'I will go ahead and process the amendment on this booking now without holding the line.'))
    lines.push(customerLine('Do you need me to confirm anything else for security?'))
    lines.push(agentLine(agent, 'No, we are fine. The amendment is submitted.'))
  } else if (cfType === 'no_resolution_confirmation' || (coachedBadPhase && queue === 'Holiday Amendments & Cancellations' && !isBenchmark)) {
    lines.push(agentLine(agent, 'I have started the cancellation in the system.'))
    lines.push(customerLine('Are there any alternative dates or options before we cancel completely?'))
    lines.push(agentLine(agent, 'It should process soon. Is there anything else I can help with today?'))
    lines.push(customerLine('So you cannot offer rebooking or confirm what happens next?'))
    lines.push(agentLine(agent, 'The system will update automatically once processing completes. Thank you for calling Altair Travel.'))
  } else if (escalated) {
    lines.push(agentLine(agent, 'This needs our specialist amendments team. I am escalating now with full notes on booking ' + order + '.'))
    lines.push(customerLine('How long until someone contacts me?'))
    lines.push(agentLine(agent, 'A specialist will reach out within 24 hours. Your escalation reference is on the case.'))
  } else {
    const policyLine = queue === 'Holiday Amendments & Cancellations'
      ? 'Altair Travel offers a 60-day penalty-free cancellation window on this package where applicable.'
      : ''
    if (policyLine && subcategory !== 'Cancellation - Full') {
      lines.push(agentLine(agent, policyLine))
    }
    lines.push(agentLine(agent, fillTemplate(issue.agentResolve, order)))
    if (isBenchmark && queue === 'Holiday Amendments & Cancellations') {
      lines.push(agentLine(agent, 'To recap: your rebooking to the October departure is confirmed at no change fee. I have added full notes to booking ' + order + ' and confirmation is on its way by email.'))
    }
  }

  const skipCaseNotes = cfType === 'no_case_notes' || (coachedBadPhase && !isBenchmark && rand() < 0.6)
  if (!skipCaseNotes && fcr && cfType !== 'no_resolution_confirmation' && cfType !== 'escalation_avoidance' && !zaneleEscalationMiss) {
    lines.push(agentLine(agent, 'I have documented today\'s resolution and next steps on your case for any future contacts.'))
  }

  if (fcr && cfType !== 'no_resolution_confirmation' && !zaneleEscalationMiss && cfType !== 'escalation_avoidance') {
    lines.push(agentLine(agent, 'Is there anything else I can help you with today?'))
    lines.push(customerLine('No, that covers it. Thank you.'))
    lines.push(agentLine(agent, 'Thank you for contacting Altair Travel. Have a wonderful trip planning with us.'))
  } else if (!fcr) {
    lines.push(customerLine('I may need to call back if this is not resolved.'))
    lines.push(agentLine(agent, 'Please use the same case reference if you contact us again so we can pick up where we left off.'))
  }

  return lines.join('\n')
}

function buildRecord(id, weekIdx, opts = {}) {
  const queue = opts.queue || pickWeighted(QUEUES, QUEUE_WEIGHTS)
  const channel = opts.channel || pickWeighted(CHANNELS, CHANNEL_WEIGHTS)
  const agent = opts.agent || pick(ALL_AGENTS)
  const subcats = queue === 'Holiday Amendments & Cancellations' ? AMENDMENTS_SUBCATEGORIES
    : queue === 'New Booking Enquiries' ? BOOKING_SUBCATEGORIES : POST_TRAVEL_SUBCATEGORIES
  const subcategory = opts.subcategory || pick(subcats)

  const cluster = opts.cluster || (rand() < 0.35 && queue === 'Holiday Amendments & Cancellations' ? pick(REPEAT_CLUSTERS) : null)
  const customer = cluster ? cluster.customer : `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`
  const order = cluster ? cluster.order : `AT-BK-${20000 + Math.floor(rand() * 8000)}`

  const params = weekParams(weekIdx, queue, agent)
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
  const prefix = critical ? 'AT-RX-CF' : 'AT-RX-'
  const callId = opts.callId || `${prefix}${String(id).padStart(6, '0')}`

  const transcript = buildTranscript({
    agent,
    order,
    subcategory,
    queue,
    cfType: critical ? cfType : null,
    channel,
    phase: params.phase,
    isRepeat,
    fcr,
    escalated,
  })
  const summary = `Contact regarding booking ${order} (${subcategory}) via ${channel}. `
    + (critical ? `Critical failure flagged: ${cfLabel}. ` : '')
    + (isRepeat ? 'This is a repeat contact on the same issue. ' : '')
    + (fcr ? 'Issue resolved on first contact.' : 'Issue not fully resolved; follow-up may be required.')

  return {
    call_id: callId,
    full_uuid: randomUUID(),
    agent_name: agent,
    call_date: date,
    call_time: time,
    call_category: queue,
    call_subcategory: subcategory,
    merchant_name: customer,
    merchant_contact: order,
    channel,
    order_number: order,
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
    key_strengths: fcr ? ['Clear communication on Altair Travel policy and Save & Rebook options.'] : [],
    key_gaps: critical ? [cfLabel] : !fcr ? ['Save & Rebook not completed at close.'] : [],
    questions_met: Math.floor(qaScore / 10),
    questions_not_met: 14 - Math.floor(qaScore / 10),
    section_scores: sectionScores(queue, qaScore, cfType),
    question_evaluations: makeQuestionEvals(qaScore, cfType),
  }
}

// --- Generate ---
const records = []
let id = 1
let cfCounter = 1

for (let w = 0; w < WEEKS; w++) {
  const weekCount = w === WEEKS - 1 ? TOTAL - records.length : PER_WEEK
  const cfTarget = w < 4 ? 12 + w * 2 : w < 6 ? 6 - (w - 4) * 2 : 2

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
      queue: isCf ? 'Holiday Amendments & Cancellations' : undefined,
    })
    records.push(record)
  }
}

// Add dense repeat clusters for returns search
for (const cluster of REPEAT_CLUSTERS.slice(0, 30)) {
  for (let c = 0; c < cluster.contacts; c++) {
    if (records.length >= TOTAL + 50) break
    const w = c === 0 ? Math.floor(rand() * 4) : Math.min(7, Math.floor(rand() * 4) + c)
    records.push(buildRecord(id++, w, {
      cluster,
      queue: 'Holiday Amendments & Cancellations',
      subcategory: pick(['Tour Date Change Request', 'Cancellation - Full', 'Penalty Waiver Request']),
      isRepeat: c > 0,
      agent: pick(COACHED_AGENTS),
      fcr: c === cluster.contacts - 1 ? false : false,
      forceCritical: c === cluster.contacts - 1 && rand() < 0.4,
      cfType: c === cluster.contacts - 1 ? 'no_case_notes' : null,
    }))
  }
}

// Trim or pad to exactly TOTAL (replace tail if over)
while (records.length > TOTAL) records.pop()
while (records.length < TOTAL) {
  records.push(buildRecord(id++, 7, { queue: 'Post-Travel & Complaints' }))
}

// Force ~18% CSAT < 3 (calibrate)
const lowCsatTarget = Math.round(TOTAL * 0.18)
let lowIndices = records
  .map((r, i) => ({ i, csat: r.predicted_csat_score }))
  .filter((x) => x.csat < 3)
  .map((x) => x.i)

// Raise excess low-CSAT records above 3
if (lowIndices.length > lowCsatTarget) {
  const toRaise = lowIndices
    .filter((i) => records[i].call_category !== 'Holiday Amendments & Cancellations' || rand() > 0.5)
    .slice(0, lowIndices.length - lowCsatTarget)
  for (const i of toRaise) {
    records[i].predicted_csat_score = Math.round((3.1 + rand() * 0.8) * 10) / 10
    records[i].predicted_csat_label = 'Neutral'
  }
}

lowIndices = records.map((r, i) => (r.predicted_csat_score < 3 ? i : -1)).filter((i) => i >= 0)
for (const i of records.map((_, idx) => idx)) {
  if (lowIndices.length >= lowCsatTarget) break
  if (records[i].predicted_csat_score >= 3 && records[i].call_category === 'Holiday Amendments & Cancellations') {
    records[i].predicted_csat_score = Math.round((2 + rand() * 0.9) * 10) / 10
    records[i].predicted_csat_label = records[i].predicted_csat_score < 2.5 ? 'Very Dissatisfied' : 'Dissatisfied'
    lowIndices.push(i)
  }
}

// Calibrate AHT toward 348s period average
const currentAht = records.reduce((s, r) => s + r.call_handling_time, 0) / records.length
const ahtScale = 348 / currentAht
for (const r of records) {
  r.call_handling_time = Math.round(r.call_handling_time * ahtScale)
  if (r.call_category === 'Holiday Amendments & Cancellations') {
    r.call_handling_time = Math.round(r.call_handling_time * 1.08)
  }
}

// Calibrate repeat rate toward 23%
const repeatTarget = Math.round(TOTAL * 0.23)
let repeatCount = records.filter((r) => r.is_repeat_contact).length
if (repeatCount < repeatTarget) {
  const candidates = records
    .filter((r) => !r.is_repeat_contact && r.call_category === 'Holiday Amendments & Cancellations')
    .sort(() => rand() - 0.5)
  for (const r of candidates.slice(0, repeatTarget - repeatCount)) {
    r.is_repeat_contact = true
  }
}

// Boost coached agents W7-W8 returns FCR
for (const r of records) {
  if (COACHED_AGENTS.includes(r.agent_name) && r.call_category === 'Holiday Amendments & Cancellations' && r.call_date >= '2026-05-18') {
    if (rand() < 0.75) {
      r.fcr_resolved = true
      r.predicted_csat_score = Math.round(Math.max(r.predicted_csat_score, 3.5) * 10) / 10
    }
  }
}

// Nudge period FCR to ~61%
const fcrCount = records.filter((r) => r.fcr_resolved).length
const targetFcr = Math.round(TOTAL * 0.61)
if (fcrCount > targetFcr) {
  const toFlip = records.filter((r) => r.fcr_resolved && r.call_category === 'Post-Travel & Complaints').slice(0, fcrCount - targetFcr)
  for (const r of toFlip) r.fcr_resolved = false
} else if (fcrCount < targetFcr) {
  const toFlip = records.filter((r) => !r.fcr_resolved && r.call_category === 'Post-Travel & Complaints').slice(0, targetFcr - fcrCount)
  for (const r of toFlip) r.fcr_resolved = true
}

// --- Stats ---
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

  const byQueue = {}
  for (const q of QUEUES) {
    const subset = data.filter((r) => r.call_category === q)
    byQueue[q] = {
      count: subset.length,
      aht: avg(subset.map((r) => r.call_handling_time)),
      fcr: (subset.filter((r) => r.fcr_resolved).length / subset.length) * 100,
      csat: avg(subset.map((r) => r.predicted_csat_score)),
      rcr: (subset.filter((r) => r.is_repeat_contact).length / subset.length) * 100,
    }
  }

  const byWeek = WEEK_BOUNDARIES.map((w, wi) => {
    const subset = data.filter((r) => r.call_date >= w.start && r.call_date <= w.end)
    const amendments = subset.filter((r) => r.call_category === 'Holiday Amendments & Cancellations')
    return {
      week: w.label,
      aht: avg(subset.map((r) => r.call_handling_time)),
      fcr: (subset.filter((r) => r.fcr_resolved).length / subset.length) * 100,
      csat: avg(subset.map((r) => r.predicted_csat_score)),
      cf: subset.filter((r) => r.critical_failure).length,
      amendmentsAht: amendments.length ? avg(amendments.map((r) => r.call_handling_time)) : 0,
      amendmentsFcr: amendments.length ? (amendments.filter((r) => r.fcr_resolved).length / amendments.length) * 100 : 0,
    }
  })

  const byChannel = {}
  for (const ch of CHANNELS) {
    byChannel[ch] = data.filter((r) => r.channel === ch).length / n
  }

  const coachedAmendmentsFcr = {}
  for (const agent of COACHED_AGENTS) {
    const early = data.filter((r) => r.agent_name === agent && r.call_category === 'Holiday Amendments & Cancellations' && r.call_date <= '2026-05-03')
    const late = data.filter((r) => r.agent_name === agent && r.call_category === 'Holiday Amendments & Cancellations' && r.call_date >= '2026-05-18')
    coachedAmendmentsFcr[agent] = {
      w1w4: early.length ? (early.filter((r) => r.fcr_resolved).length / early.length) * 100 : 0,
      w7w8: late.length ? (late.filter((r) => r.fcr_resolved).length / late.length) * 100 : 0,
    }
  }

  return { n, aht, fcr, csat, rcr, er, tr, csatLow, byQueue, byWeek, byChannel, coachedAmendmentsFcr }
}

const stats = aggregate(records)

// Validation
const errors = []
if (records.length !== TOTAL) errors.push(`Count ${records.length} !== ${TOTAL}`)
if (Math.abs(stats.csatLow - 18) > 3) errors.push(`CSAT<3 ${stats.csatLow.toFixed(1)}% not ~18%`)
if (stats.byQueue['Holiday Amendments & Cancellations'].fcr >= stats.byQueue['New Booking Enquiries'].fcr) {
  errors.push('Amendments FCR should be worst')
}
for (const agent of COACHED_AGENTS) {
  const c = stats.coachedAmendmentsFcr[agent]
  if (c.w7w8 <= c.w1w4) errors.push(`${agent} FCR not improved W7-W8 vs W1-W4`)
}

console.log('Dataset stats:', JSON.stringify(stats, null, 2))
if (errors.length) {
  console.warn('Validation warnings:', errors)
} else {
  console.log('Validation passed.')
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(records, null, 2))
writeFileSync(STATS_OUT, JSON.stringify(stats, null, 2))
console.log(`Wrote ${records.length} records to ${OUT}`)
