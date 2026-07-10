/** Altair Travel — UK tour & cruise contact driver taxonomy */

export const DRIVER_TAXONOMY = {
  'Amendments & Cancellations': [
    'Tour Date Change Request',
    'Cruise Cabin Upgrade',
    'Cancellation - Full',
    'Cancellation - Partial Party',
    'Name Change on Booking',
    'Penalty Waiver Request',
    'Departure Airport Change',
    'Dietary / Accessibility Amendment',
  ],
  'Bookings & Reservations': [
    'Escorted Tour Enquiry',
    'Cruise Availability',
    'Group Booking',
    'Solo Traveller Package',
    'Deposit & Payment Terms',
    'Early Bird Offer',
  ],
  'Payments & Refunds': [
    'Cancellation Refund Status',
    'Balance Payment Failure',
    'Travel Insurance Query',
    'Penalty Fee Dispute',
  ],
  'Pre-Travel Support': [
    'Travel Documentation',
    'Itinerary Query',
    'Visa & Documentation',
    'Transfer Arrangements',
  ],
  'Post-Travel & Complaints': [
    'Tour Manager Complaint',
    'Accommodation Issue',
    'Missed Excursion',
    'Flight Disruption',
    'Lost Luggage',
    'Refund Post-Travel',
    'ABTA/ATOL Query',
  ],
  'Account & General': [
    'Account & Login Issues',
    'Policy Clarification',
    'Follow-up Calls',
    'Feedback',
  ],
}

export const L1_CATEGORIES = Object.keys(DRIVER_TAXONOMY)

export const L1_WEIGHTS = {
  'Amendments & Cancellations': 0.32,
  'Payments & Refunds': 0.23,
  'Bookings & Reservations': 0.18,
  'Post-Travel & Complaints': 0.12,
  'Pre-Travel Support': 0.09,
  'Account & General': 0.06,
}

export const L2_WEIGHTS = {
  'Amendments & Cancellations': {
    'Tour Date Change Request': 0.28,
    'Cancellation - Full': 0.22,
    'Penalty Waiver Request': 0.14,
    'Cancellation - Partial Party': 0.12,
    'Cruise Cabin Upgrade': 0.08,
    'Name Change on Booking': 0.06,
    'Departure Airport Change': 0.05,
    'Dietary / Accessibility Amendment': 0.05,
  },
  'Payments & Refunds': {
    'Cancellation Refund Status': 0.35,
    'Penalty Fee Dispute': 0.25,
    'Balance Payment Failure': 0.20,
    'Travel Insurance Query': 0.20,
  },
  'Bookings & Reservations': {
    'Escorted Tour Enquiry': 0.28,
    'Cruise Availability': 0.22,
    'Group Booking': 0.18,
    'Deposit & Payment Terms': 0.14,
    'Solo Traveller Package': 0.10,
    'Early Bird Offer': 0.08,
  },
  'Pre-Travel Support': {
    'Travel Documentation': 0.30,
    'Itinerary Query': 0.28,
    'Visa & Documentation': 0.22,
    'Transfer Arrangements': 0.20,
  },
  'Post-Travel & Complaints': {
    'Tour Manager Complaint': 0.22,
    'Accommodation Issue': 0.20,
    'Flight Disruption': 0.18,
    'Lost Luggage': 0.15,
    'Missed Excursion': 0.12,
    'Refund Post-Travel': 0.08,
    'ABTA/ATOL Query': 0.05,
  },
  'Account & General': {
    'Account & Login Issues': 0.35,
    'Policy Clarification': 0.25,
    'Follow-up Calls': 0.22,
    'Feedback': 0.18,
  },
}

export const HIGH_RISK_L2 = new Set([
  'Tour Date Change Request',
  'Cancellation - Full',
  'Cancellation - Partial Party',
  'Penalty Waiver Request',
  'Cancellation Refund Status',
  'Penalty Fee Dispute',
])

export const HIGH_RISK_L1 = new Set(['Amendments & Cancellations', 'Payments & Refunds'])

export const ALL_L2_DRIVERS = L1_CATEGORIES.flatMap((l1) =>
  DRIVER_TAXONOMY[l1].map((l2) => ({ l1, l2 })),
)

export function isHighRiskDriver(l1, l2) {
  return HIGH_RISK_L1.has(l1) && HIGH_RISK_L2.has(l2)
}

export function pickWeightedDriver(randFn) {
  const l1Items = L1_CATEGORIES
  const l1Weights = l1Items.map((l1) => L1_WEIGHTS[l1])
  const l1 = pickWeightedItem(l1Items, l1Weights, randFn)
  const l2Items = DRIVER_TAXONOMY[l1]
  const weights = L2_WEIGHTS[l1]
  const l2Weights = l2Items.map((l2) => weights[l2] ?? 1 / l2Items.length)
  const l2 = pickWeightedItem(l2Items, l2Weights, randFn)
  return { l1, l2 }
}

function pickWeightedItem(items, weights, randFn) {
  const r = randFn()
  let acc = 0
  for (let i = 0; i < items.length; i++) {
    acc += weights[i]
    if (r < acc) return items[i]
  }
  return items[items.length - 1]
}
