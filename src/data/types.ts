import type { Localized } from '../i18n/messages'

export type { Localized }

export type ActorCategory =
  | 'executive'
  | 'agency'
  | 'judicial'
  | 'oversight'
  | 'civilian'
  | 'broker'
  | 'justice'
  | 'public'

export interface Actor {
  id: string
  name: Localized
  role: Localized
  category: ActorCategory
  note?: Localized
}

export interface Source {
  title: string
  url: string
  /** ISO date the link was last checked. */
  accessed: string
}

export interface Flow {
  id: string
  source: string
  target: string
  label: Localized
  dataType: Localized
  legal: Localized
  audit?: Localized
  oversight?: Localized
  risk?: Localized
  category: 'current' | 'target'
  description?: Localized
  sources: Source[]
  /** Why a flow has no verified source yet; set only when sources is empty. */
  sourceNeeded?: Localized
}

export type FlowDraft = Omit<Flow, 'sources' | 'sourceNeeded'>

export interface ActorNodeData extends Record<string, unknown> {
  label: string
  role: string
  category: ActorCategory
  color: string
  note?: string
}
