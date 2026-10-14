import type { Localized, MessageKey } from '../i18n/messages'

import en14 from '../../docs/14-leadership-appointment.md?raw'
import en15 from '../../docs/15-conflict-of-interest.md?raw'
import en16 from '../../docs/16-cooling-off-regime.md?raw'
import en17 from '../../docs/17-civil-society-oversight.md?raw'
import en18 from '../../docs/18-internal-control.md?raw'
import en19 from '../../docs/19-dcaf-references.md?raw'
import ro14 from '../../docs/ro/14-leadership-appointment.md?raw'
import ro15 from '../../docs/ro/15-conflict-of-interest.md?raw'
import ro16 from '../../docs/ro/16-cooling-off-regime.md?raw'
import ro17 from '../../docs/ro/17-civil-society-oversight.md?raw'
import ro18 from '../../docs/ro/18-internal-control.md?raw'
import ro19 from '../../docs/ro/19-dcaf-references.md?raw'

export interface GovernanceDoc {
  id: string
  titleKey: MessageKey
  source: Localized
}

export const GOVERNANCE_DOCS: GovernanceDoc[] = [
  { id: '14', titleKey: 'gov.doc.14', source: { en: en14, ro: ro14 } },
  { id: '15', titleKey: 'gov.doc.15', source: { en: en15, ro: ro15 } },
  { id: '16', titleKey: 'gov.doc.16', source: { en: en16, ro: ro16 } },
  { id: '17', titleKey: 'gov.doc.17', source: { en: en17, ro: ro17 } },
  { id: '18', titleKey: 'gov.doc.18', source: { en: en18, ro: ro18 } },
  { id: '19', titleKey: 'gov.doc.19', source: { en: en19, ro: ro19 } },
]
