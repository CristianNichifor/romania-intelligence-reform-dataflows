import type { Flow, FlowDraft, Localized, Source } from './types'

/** The date every link below was last checked. */
export const DATASET_AS_OF = '2026-10-14'

const checked = (title: string, url: string): Source => ({ title, url, accessed: DATASET_AS_OF })

// Romanian acts link to the Ministry of Justice portal (legislatie.just.ro).
const LAW_14_1992 = checked(
  'Legea nr. 14/1992 privind organizarea și funcționarea Serviciului Român de Informații',
  'https://legislatie.just.ro/Public/DetaliiDocumentAfis/2144',
)
const LAW_51_1991 = checked(
  'Legea nr. 51/1991 privind securitatea națională a României',
  'https://legislatie.just.ro/Public/DetaliiDocument/1517',
)
const LAW_1_1998 = checked(
  'Legea nr. 1/1998 privind organizarea și funcționarea Serviciului de Informații Externe',
  'https://legislatie.just.ro/Public/DetaliiDocument/13909',
)
const CRIMINAL_PROCEDURE = checked(
  'Codul de procedură penală (Legea nr. 135/2010)',
  'https://legislatie.just.ro/Public/DetaliiDocument/120611',
)
const CCR_51_2016 = checked(
  'Curtea Constituțională, Decizia nr. 51/2016 (art. 142 alin. (1) Cod procedură penală)',
  'https://legislatie.just.ro/Public/DetaliiDocumentAfis/176576',
)
const LAW_415_2002 = checked(
  'Legea nr. 415/2002 privind organizarea și funcționarea Consiliului Suprem de Apărare a Țării',
  'https://legislatie.just.ro/Public/DetaliiDocument/37198',
)
const LAW_92_1996 = checked(
  'Legea nr. 92/1996 privind organizarea și funcționarea Serviciului de Telecomunicații Speciale',
  'https://legislatie.just.ro/Public/DetaliiDocumentAfis/8502',
)
const LAW_191_1998 = checked(
  'Legea nr. 191/1998 privind organizarea și funcționarea Serviciului de Protecție și Pază',
  'https://legislatie.just.ro/Public/DetaliiDocumentAfis/15960',
)
const LAW_190_2018 = checked(
  'Legea nr. 190/2018 privind măsuri de punere în aplicare a Regulamentului (UE) 2016/679',
  'https://legislatie.just.ro/Public/DetaliiDocument/203151',
)
const OUG_104_2021 = checked(
  'OUG nr. 104/2021 privind înființarea Directoratului Național de Securitate Cibernetică',
  'https://legislatie.just.ro/Public/DetaliiDocumentAfis/246652',
)
const LAW_35_1997 = checked(
  'Legea nr. 35/1997 privind organizarea și funcționarea instituției Avocatul Poporului',
  'https://legislatie.just.ro/Public/DetaliiDocument/11200',
)
const GDPR = checked(
  'Regulation (EU) 2016/679 (General Data Protection Regulation)',
  'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
)
const DCAF_TOOLKIT = checked(
  'DCAF, Overseeing Intelligence Services: A Toolkit (Born & Wills, eds., 2012)',
  'https://www.dcaf.ch/sites/default/files/publications/documents/Born_Wills_Intelligence_oversight_TK_EN.pdf',
)
const DCAF_INTERNAL_CONTROL = checked(
  'DCAF Thematic Brief, Internal Control in Intelligence Services',
  'https://www.dcaf.ch/sites/default/files/publications/documents/InternalControl_in_IntelligenceServices_EN.pdf',
)
// Target-state flows are this project's proposal; the specification is their primary source.
const TARGET_SPEC = checked(
  'This project, docs/03-target-state-flows.md (proposed target state)',
  'https://github.com/CristianNichifor/romania-intelligence-reform-dataflows/blob/main/docs/03-target-state-flows.md',
)

const SOURCES: Record<string, Source[]> = {
  C1: [LAW_14_1992, LAW_51_1991],
  C2: [LAW_1_1998, LAW_51_1991],
  C3: [LAW_415_2002, LAW_51_1991],
  C3b: [LAW_415_2002, LAW_51_1991],
  C4: [CRIMINAL_PROCEDURE, CCR_51_2016],
  C5: [LAW_415_2002, LAW_51_1991],
  C6: [LAW_14_1992],
  C7: [LAW_92_1996, CCR_51_2016],
  C8: [GDPR, LAW_190_2018],
  C9: [LAW_1_1998],
  C11: [LAW_191_1998],
  C12: [LAW_191_1998],
  C13: [LAW_191_1998],
  T1: [TARGET_SPEC, LAW_14_1992],
  T2: [TARGET_SPEC, LAW_1_1998],
  T3: [TARGET_SPEC],
  T4: [TARGET_SPEC],
  T5: [TARGET_SPEC],
  T6: [TARGET_SPEC],
  T7: [TARGET_SPEC, OUG_104_2021],
  T7b: [TARGET_SPEC, OUG_104_2021],
  T8: [TARGET_SPEC, OUG_104_2021],
  T8b: [TARGET_SPEC, OUG_104_2021],
  T9: [TARGET_SPEC, CRIMINAL_PROCEDURE],
  T9b: [TARGET_SPEC, CRIMINAL_PROCEDURE],
  T10: [TARGET_SPEC, CRIMINAL_PROCEDURE],
  T11: [TARGET_SPEC, DCAF_INTERNAL_CONTROL],
  T11b: [TARGET_SPEC, DCAF_INTERNAL_CONTROL],
  T11c: [TARGET_SPEC, DCAF_INTERNAL_CONTROL],
  T12: [TARGET_SPEC, DCAF_INTERNAL_CONTROL],
  T13: [TARGET_SPEC],
  T14: [TARGET_SPEC, GDPR, LAW_190_2018],
  T14b: [TARGET_SPEC, GDPR, LAW_190_2018],
  T15: [TARGET_SPEC, LAW_415_2002],
  T15b: [TARGET_SPEC, LAW_415_2002],
  T16: [TARGET_SPEC, LAW_415_2002],
  T17: [TARGET_SPEC, LAW_35_1997],
  T18: [TARGET_SPEC, DCAF_TOOLKIT],
  T18b: [TARGET_SPEC, DCAF_TOOLKIT],
  T18c: [TARGET_SPEC, DCAF_TOOLKIT],
  W1: [TARGET_SPEC, DCAF_TOOLKIT],
  W2: [TARGET_SPEC, DCAF_TOOLKIT],
  W3: [TARGET_SPEC, DCAF_TOOLKIT],
  T19: [TARGET_SPEC, LAW_191_1998],
  T20: [TARGET_SPEC, DCAF_INTERNAL_CONTROL],
  T21: [TARGET_SPEC, GDPR, LAW_190_2018],
}

// Flows the author could not tie to a public, verifiable source. Listed in ERRATA.md.
const SOURCE_NEEDED: Record<string, Localized> = {
  C10: {
    en: 'An assessment of public communication practice; no public document establishes it.',
    ro: 'O evaluare a practicii de comunicare publică; niciun document public nu o stabilește.',
  },
}

export function withSources(flow: FlowDraft): Flow {
  const sources = SOURCES[flow.id] ?? []
  return sources.length ? { ...flow, sources } : { ...flow, sources, sourceNeeded: SOURCE_NEEDED[flow.id] }
}
