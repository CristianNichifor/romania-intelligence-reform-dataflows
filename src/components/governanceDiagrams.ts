import type { Localized, MessageKey } from '../i18n/messages'

import enAppointment from '../../diagrams/leadership-appointment.mmd?raw'
import enLayering from '../../diagrams/oversight-layering.mmd?raw'
import enCoolingOff from '../../diagrams/cooling-off-enforcement.mmd?raw'
import enConflict from '../../diagrams/conflict-of-interest-cycle.mmd?raw'
import roAppointment from '../../diagrams/ro/leadership-appointment.mmd?raw'
import roLayering from '../../diagrams/ro/oversight-layering.mmd?raw'
import roCoolingOff from '../../diagrams/ro/cooling-off-enforcement.mmd?raw'
import roConflict from '../../diagrams/ro/conflict-of-interest-cycle.mmd?raw'

export interface GovernanceDiagram {
  id: string
  titleKey: MessageKey
  source: Localized
}

// The Romanian files mirror the English node ids and edges; only the labels differ
// (governanceDiagrams.test.ts checks the skeletons match).
export const GOVERNANCE_DIAGRAMS: GovernanceDiagram[] = [
  { id: 'gov-mm-appointment', titleKey: 'gov.diagram.appointment', source: { en: enAppointment, ro: roAppointment } },
  { id: 'gov-mm-layering', titleKey: 'gov.diagram.layering', source: { en: enLayering, ro: roLayering } },
  { id: 'gov-mm-coolingoff', titleKey: 'gov.diagram.coolingoff', source: { en: enCoolingOff, ro: roCoolingOff } },
  { id: 'gov-mm-conflict', titleKey: 'gov.diagram.conflict', source: { en: enConflict, ro: roConflict } },
]
