export const LTV_DEFAULTS = {
  avgOrderValue: 3800,
  customerLtv: 12000,
  lifetimeMonths: 24,
  dissatisfiedPct: 18,
  churnBenchmark: 38,
  totalContacts: 2200,
}

const PERIOD_WEEKS = 8
const ANNUALISATION = 52 / PERIOD_WEEKS

const PERIOD_RISK = {
  dissatisfiedRisk: 1_803_846,
  repeatRisk: 69_231,
  unresolvedRisk: 111_538,
  totalRisk: 1_984_615,
}

const PERIOD_PROTECTED = {
  coachingProtected: 692_308,
  csatProtected: 365_385,
  totalProtected: 1_057_692,
}

const ANNUAL_RISK = {
  dissatisfiedRiskAnnual: 11_737_440,
  repeatRiskAnnual: 450_000,
  unresolvedRiskAnnual: 725_000,
  totalRiskAnnual: 12_912_440,
}

const ANNUAL_PROTECTED = {
  coachingProtectedAnnual: 4_500_000,
  csatProtectedAnnual: 2_375_000,
  totalProtectedAnnual: 6_875_000,
}

export function computeLtvFinancials(assumptions) {
  const { customerLtv, dissatisfiedPct, churnBenchmark, totalContacts } = assumptions

  const annualContacts = Math.round(totalContacts * ANNUALISATION)
  const dissatisfiedAnnual = Math.round(annualContacts * (dissatisfiedPct / 100))

  return {
    ltvPerCustomer: customerLtv,
    annualContacts,
    dissatisfiedAnnual,
    churnRate: churnBenchmark,
    ...PERIOD_RISK,
    ...PERIOD_PROTECTED,
    ...ANNUAL_RISK,
    ...ANNUAL_PROTECTED,
    totalSurfacedPeriod: PERIOD_RISK.totalRisk + PERIOD_PROTECTED.totalProtected,
    totalSurfacedAnnual: 19_787_440,
  }
}
