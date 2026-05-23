import type { Container, ContainerStatus } from '@/domain/entities/container'

const TYPES      = ['Tank', 'Drum', 'IBC', 'Cylinder', 'Flexibag', 'Tote', 'ISO Tank']
const STATUSES: ContainerStatus[] = ['Active', 'Expired', 'PendingReview']
const TEAMS      = ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon']
const OWNERS     = ['Acme Corp', 'BetaCo', 'GammaTech', 'DeltaInc', 'EpsilonLtd', 'ZetaCorp', 'EtaGroup', 'ThetaWorks', 'IotaLtd', 'KappaFarm']
const NOTES_POOL = [
  'Primary storage unit, quarterly maintenance required',
  'Chemical storage, corrosion-resistant lining confirmed',
  'Inspection access requires scheduled shutdown window',
  'All certifications current, cleared for active use',
  'Pending final disposal certificate from regulatory body',
  'Fire suppression system verified last quarter',
  'Portable unit for remote site operations',
  'Seasonal usage only, stored during off-season',
  'Double-walled, sealed for hazardous materials',
  '',
]

function pad(n: number, len = 5): string {
  return String(n).padStart(len, '0')
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

function rng(seed: number, min: number, max: number): number {
  const x = Math.sin(seed + 1) * 10000
  return min + Math.floor((x - Math.floor(x)) * (max - min + 1))
}

export function generateContainers(count: number): Container[] {
  const items: Container[] = []
  for (let i = 1; i <= count; i++) {
    const year  = 2024 + rng(i * 7, 0, 2)
    const month = pad(rng(i * 13, 1, 12), 2)
    const day   = pad(rng(i * 17, 1, 28), 2)
    items.push({
      id:             `GEN-${pad(i)}`,
      location:       `Loc ${pad(i, 3)}`,
      type:           pick(TYPES, i * 3),
      capacity:       rng(i * 11, 50, 8000),
      lastInspection: `${year}-${month}-${day}`,
      notes:          pick(NOTES_POOL, i * 5),
      assignedTeam:   pick(TEAMS, i * 7),
      temperature:    i % 7 === 0 ? null : rng(i * 9, 10, 35) + 0.5,
      humidity:       i % 11 === 0 ? null : rng(i * 13, 30, 90),
      pressure:       rng(i * 17, 980, 1040),
      contract:       `CTR-${pad(i, 4)}`,
      owner:          pick(OWNERS, i * 19),
      status:         pick(STATUSES, i * 23),
    })
  }
  return items
}

export const CONTAINERS_MOCK: Container[] = [
  { id: 'C001', location: 'Loc 251', type: 'Tank', capacity: 1100, lastInspection: '2026-12-01', notes: 'Primary storage unit for sector A, requires quarterly maintenance checks', assignedTeam: 'Team Alpha', temperature: 22.5, humidity: 45, pressure: 1013, contract: 'CTR-251', owner: 'Acme Corp', status: 'Expired' },
  { id: 'C002', location: 'Loc 102', type: 'Drum', capacity: 200, lastInspection: '2026-08-15', notes: 'Chemical storage drum, corrosion-resistant lining confirmed', assignedTeam: 'Team Beta', temperature: 18.0, humidity: 60, pressure: 1010, contract: 'CTR-102', owner: 'BetaCo', status: 'Active' },
  { id: 'C003', location: 'Loc 305', type: 'IBC', capacity: 1000, lastInspection: '2026-03-22', notes: 'Intermediate bulk container used for solvent transfer operations', assignedTeam: 'Team Alpha', temperature: 20.0, humidity: 55, pressure: 1012, contract: 'CTR-305', owner: 'GammaTech', status: 'PendingReview' },
  { id: 'C004', location: 'Loc 417', type: 'Tank', capacity: 5000, lastInspection: '2025-11-30', notes: 'Large capacity tank, last inspection found minor seal wear — flagged for repair', assignedTeam: 'Team Gamma', temperature: 25.0, humidity: 40, pressure: 1015, contract: 'CTR-417', owner: 'DeltaInc', status: 'Expired' },
  { id: 'C005', location: 'Loc 088', type: 'Cylinder', capacity: 50, lastInspection: '2026-10-05', notes: 'High-pressure gas cylinder, hydrostatic test up to date', assignedTeam: 'Team Beta', temperature: null, humidity: null, pressure: 200, contract: 'CTR-088', owner: 'EpsilonLtd', status: 'Active' },
  { id: 'C006', location: 'Loc 199', type: 'Drum', capacity: 205, lastInspection: '2026-01-18', notes: 'Waste collection drum, approved for hazardous materials category 3', assignedTeam: 'Team Delta', temperature: 19.5, humidity: 65, pressure: 1011, contract: 'CTR-199', owner: 'ZetaCorp', status: 'Active' },
  { id: 'C007', location: 'Loc 322', type: 'Tank', capacity: 2500, lastInspection: '2025-06-14', notes: '', assignedTeam: 'Team Alpha', temperature: 21.0, humidity: 50, pressure: 1014, contract: 'CTR-322', owner: 'Acme Corp', status: 'Expired' },
  { id: 'C008', location: 'Loc 445', type: 'IBC', capacity: 1250, lastInspection: '2026-09-27', notes: 'Repainted and resealed after 2025 audit. Cleared for active use.', assignedTeam: 'Team Gamma', temperature: 23.0, humidity: 48, pressure: 1013, contract: 'CTR-445', owner: 'EtaGroup', status: 'Active' },
  { id: 'C009', location: 'Loc 067', type: 'Drum', capacity: 180, lastInspection: '2026-07-09', notes: 'Dedicated to lubricant storage, no contamination risk', assignedTeam: 'Team Beta', temperature: 17.5, humidity: 70, pressure: 1009, contract: 'CTR-067', owner: 'ThetaWorks', status: 'PendingReview' },
  { id: 'C010', location: 'Loc 531', type: 'Cylinder', capacity: 80, lastInspection: '2026-11-12', notes: 'Nitrogen cylinder for lab use', assignedTeam: 'Team Delta', temperature: null, humidity: null, pressure: 150, contract: 'CTR-531', owner: 'BetaCo', status: 'Active' },
  { id: 'C011', location: 'Loc 273', type: 'Tank', capacity: 3000, lastInspection: '2025-04-03', notes: 'Underground tank — inspection access requires scheduled shutdown window', assignedTeam: 'Team Alpha', temperature: 16.0, humidity: 80, pressure: 1010, contract: 'CTR-273', owner: 'IotaLtd', status: 'Expired' },
  { id: 'C012', location: 'Loc 388', type: 'IBC', capacity: 950, lastInspection: '2026-05-21', notes: 'Liquid fertilizer storage, seasonal usage', assignedTeam: 'Team Gamma', temperature: 22.0, humidity: 52, pressure: 1012, contract: 'CTR-388', owner: 'KappaFarm', status: 'Active' },
  { id: 'C013', location: 'Loc 156', type: 'Drum', capacity: 220, lastInspection: '2026-02-14', notes: 'Contains archived waste awaiting disposal approval from regulatory body', assignedTeam: 'Team Beta', temperature: 20.5, humidity: 58, pressure: 1011, contract: 'CTR-156', owner: 'LambdaEnv', status: 'PendingReview' },
  { id: 'C014', location: 'Loc 492', type: 'Tank', capacity: 4500, lastInspection: '2026-06-30', notes: 'Fuel storage tank, fire suppression system verified Q2 2026', assignedTeam: 'Team Delta', temperature: 24.0, humidity: 43, pressure: 1016, contract: 'CTR-492', owner: 'MuEnergy', status: 'Active' },
  { id: 'C015', location: 'Loc 014', type: 'Cylinder', capacity: 100, lastInspection: '2025-12-22', notes: 'Oxygen cylinder bank — pair with C016 for redundancy', assignedTeam: 'Team Alpha', temperature: null, humidity: null, pressure: 180, contract: 'CTR-014', owner: 'NuMed', status: 'Expired' },
  { id: 'C016', location: 'Loc 015', type: 'Cylinder', capacity: 100, lastInspection: '2026-12-22', notes: 'Oxygen cylinder bank — pair with C015 for redundancy', assignedTeam: 'Team Alpha', temperature: null, humidity: null, pressure: 185, contract: 'CTR-014', owner: 'NuMed', status: 'Active' },
  { id: 'C017', location: 'Loc 611', type: 'IBC', capacity: 1100, lastInspection: '2026-04-17', notes: 'Coolant fluid storage for HVAC maintenance crew', assignedTeam: 'Team Gamma', temperature: 15.5, humidity: 75, pressure: 1008, contract: 'CTR-611', owner: 'XiCool', status: 'PendingReview' },
  { id: 'C018', location: 'Loc 744', type: 'Tank', capacity: 800, lastInspection: '2026-08-01', notes: 'Portable water tank for remote site operations', assignedTeam: 'Team Beta', temperature: 18.5, humidity: 62, pressure: 1010, contract: 'CTR-744', owner: 'OmicronWater', status: 'Active' },
  { id: 'C019', location: 'Loc 822', type: 'Drum', capacity: 230, lastInspection: '2025-09-08', notes: 'Acid waste drum — double-walled, sealed. Pending final disposal certificate.', assignedTeam: 'Team Delta', temperature: 21.5, humidity: 55, pressure: 1013, contract: 'CTR-822', owner: 'PiChem', status: 'Expired' },
  { id: 'C020', location: 'Loc 903', type: 'Tank', capacity: 6000, lastInspection: '2026-10-19', notes: 'Main process tank for plant B, all certifications current', assignedTeam: 'Team Alpha', temperature: 26.0, humidity: 38, pressure: 1017, contract: 'CTR-903', owner: 'RhoProcess', status: 'Active' },
]
