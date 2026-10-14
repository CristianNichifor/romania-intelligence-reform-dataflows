import type { Actor, ActorCategory } from './types'

export const currentActors: Actor[] = [
  {
    id: 'PRES',
    name: { en: 'Presidency', ro: 'Președinție' },
    role: { en: 'Presidential Administration', ro: 'Administrația Prezidențială' },
    category: 'executive',
  },
  {
    id: 'CSAT',
    name: { en: 'CSAT', ro: 'CSAT' },
    role: {
      en: 'Supreme Council of National Defence',
      ro: 'Consiliul Suprem de Apărare a Țării',
    },
    category: 'executive',
    note: {
      en: 'Coordination node with limited transparency',
      ro: 'Nod de coordonare cu transparență limitată',
    },
  },
  {
    id: 'SRI',
    name: { en: 'SRI', ro: 'SRI' },
    role: { en: 'Domestic intelligence (military)', ro: 'Informații interne (militar)' },
    category: 'agency',
    note: {
      en: 'Receives, stores and correlates data without a unified warrant ledger',
      ro: 'Primește, stochează și corelează date fără un registru unic de mandate',
    },
  },
  {
    id: 'SIE',
    name: { en: 'SIE', ro: 'SIE' },
    role: { en: 'Foreign intelligence (military)', ro: 'Informații externe (militar)' },
    category: 'agency',
    note: {
      en: 'Foreign ops with no domestic oversight',
      ro: 'Operațiuni externe fără supraveghere internă',
    },
  },
  {
    id: 'STS',
    name: { en: 'STS', ro: 'STS' },
    role: { en: 'Telecom / IT technical intercepts', ro: 'Interceptări tehnice telecom / IT' },
    category: 'agency',
    note: {
      en: 'Shared infrastructure, unclear separation from SRI',
      ro: 'Infrastructură comună, separare neclară față de SRI',
    },
  },
  {
    id: 'SPP',
    name: { en: 'SPP', ro: 'SPP' },
    role: {
      en: 'Protection & Guard Service',
      ro: 'Serviciul de Protecție și Pază',
    },
    category: 'agency',
    note: {
      en: 'Under presidential authority; checked only by the weak parliamentary defence committees',
      ro: 'Sub autoritate prezidențială; controlat doar de comisiile parlamentare de apărare, slabe',
    },
  },
  {
    id: 'DIICOT',
    name: { en: 'DIICOT / PICCJ', ro: 'DIICOT / PICCJ' },
    role: { en: 'Prosecutors', ro: 'Procurori' },
    category: 'justice',
    note: {
      en: 'Receives referrals, not traceable evidence chains',
      ro: 'Primește sesizări, nu lanțuri de probe trasabile',
    },
  },
  {
    id: 'ICCJ',
    name: { en: 'ICCJ', ro: 'ICCJ' },
    role: {
      en: 'High Court of Cassation',
      ro: 'Înalta Curte de Casație și Justiție',
    },
    category: 'judicial',
  },
  {
    id: 'JPC',
    name: { en: 'Joint Parliamentary Committee', ro: 'Comisia parlamentară comună' },
    role: { en: 'SRI/SIE oversight', ro: 'Supravegherea SRI/SIE' },
    category: 'oversight',
    note: {
      en: 'Receives filtered briefings, not verifiable data; no subpoena power',
      ro: 'Primește informări filtrate, nu date verificabile; fără putere de subpoena',
    },
  },
  {
    id: 'ANSPDCP',
    name: { en: 'ANSPDCP', ro: 'ANSPDCP' },
    role: { en: 'Data Protection Authority', ro: 'Autoritatea pentru Protecția Datelor' },
    category: 'oversight',
  },
  {
    id: 'OMB',
    name: { en: 'Ombudsman', ro: 'Avocatul Poporului' },
    role: { en: 'Civil rights oversight', ro: 'Supravegherea drepturilor civile' },
    category: 'oversight',
  },
  {
    id: 'DNSC',
    name: { en: 'DNSC', ro: 'DNSC' },
    role: { en: 'Civilian cyber defense', ro: 'Apărare cibernetică civilă' },
    category: 'civilian',
  },
  {
    id: 'PUB',
    name: { en: 'Public / Media', ro: 'Public / Presă' },
    role: { en: 'Recipients of narratives', ro: 'Destinatarii narativelor' },
    category: 'public',
    note: {
      en: 'Target of unattributed disinformation ops',
      ro: 'Ținta operațiunilor de dezinformare neatribuite',
    },
  },
]

export const targetActors: Actor[] = [
  {
    id: 'PRES',
    name: { en: 'Presidency', ro: 'Președinție' },
    role: { en: 'Receives strategic summaries', ro: 'Primește rezumate strategice' },
    category: 'executive',
  },
  {
    id: 'CSAT',
    name: { en: 'CSAT', ro: 'CSAT' },
    role: { en: 'Strategic coordination', ro: 'Coordonare strategică' },
    category: 'executive',
    note: {
      en: 'Receives threat assessments; no direct operational data',
      ro: 'Primește evaluări de amenințare; fără date operaționale directe',
    },
  },
  {
    id: 'SRI',
    name: { en: 'SRI (civilianized)', ro: 'SRI (civilianizat)' },
    role: {
      en: 'Domestic intelligence · case vault',
      ro: 'Informații interne · vault de caz',
    },
    category: 'agency',
    note: {
      en: 'Holds its own encrypted, purpose-bound case files',
      ro: 'Deține propriile dosare de caz criptate, legate de scop',
    },
  },
  {
    id: 'SIE',
    name: { en: 'SIE (civilianized)', ro: 'SIE (civilianizat)' },
    role: {
      en: 'Foreign intelligence · case vault',
      ro: 'Informații externe · vault de caz',
    },
    category: 'agency',
    note: {
      en: 'Holds its own encrypted, purpose-bound case files',
      ro: 'Deține propriile dosare de caz criptate, legate de scop',
    },
  },
  {
    id: 'SSC',
    name: { en: 'SSC', ro: 'SSC' },
    role: {
      en: 'Specialized Surveillance Court · warrant token registry',
      ro: 'Curtea de Supraveghere Specializată · registrul tokenurilor de mandat',
    },
    category: 'judicial',
    note: {
      en: 'Issues/denies warrant tokens; holds warrant registry',
      ro: 'Emite/respinge tokenuri de mandat; deține registrul mandatelor',
    },
  },
  {
    id: 'SPP',
    name: { en: 'SPP (reformed)', ro: 'SPP (reformat)' },
    role: {
      en: 'Protection & Guard · case vault',
      ro: 'Protecție și pază · vault de caz',
    },
    category: 'agency',
    note: {
      en: 'Protection intelligence under SSC warrants; IG audit access closes the oversight gap',
      ro: 'Informațiile de protecție sub mandate SSC; accesul IG la audit închide golul de supraveghere',
    },
  },
  {
    id: 'IADE',
    name: { en: 'IADE', ro: 'IADE' },
    role: {
      en: 'Inter-Agency Data Exchange · stateless broker + audit ledger',
      ro: 'Schimb de date interinstituțional · broker fără stare + registru de audit',
    },
    category: 'broker',
    note: {
      en: 'Does not store content; routes requests/responses; logs every transaction',
      ro: 'Nu stochează conținut; rutează cereri/răspunsuri; înregistrează fiecare tranzacție',
    },
  },
  {
    id: 'IG',
    name: { en: 'Inspector General', ro: 'Inspector General' },
    role: { en: 'Independent statutory oversight', ro: 'Supraveghere statutară independentă' },
    category: 'oversight',
    note: {
      en: 'Full audit-log access; no raw content unless warranted',
      ro: 'Acces complet la jurnalele de audit; fără conținut brut decât cu mandat',
    },
  },
  {
    id: 'JPC',
    name: { en: 'Joint Parliamentary Committee', ro: 'Comisia parlamentară comună' },
    role: { en: 'Legislative oversight', ro: 'Supraveghere legislativă' },
    category: 'oversight',
    note: {
      en: 'Aggregated metrics + subpoena power for specific files',
      ro: 'Metrici agregate + putere de subpoena pentru fișiere specifice',
    },
  },
  {
    id: 'ITAP',
    name: { en: 'ITAP', ro: 'ITAP' },
    role: {
      en: 'Independent Technical Advisory Panel',
      ro: 'Panel Tehnic Consultativ Independent',
    },
    category: 'oversight',
    note: {
      en: 'Validates technical claims; audits systems',
      ro: 'Validează afirmațiile tehnice; auditează sistemele',
    },
  },
  {
    id: 'ANSPDCP',
    name: { en: 'ANSPDCP', ro: 'ANSPDCP' },
    role: { en: 'Data Protection Authority', ro: 'Autoritatea pentru Protecția Datelor' },
    category: 'oversight',
    note: {
      en: 'Receives notification of high-risk processing',
      ro: 'Primește notificări privind procesarea cu risc ridicat',
    },
  },
  {
    id: 'OMB',
    name: { en: 'Ombudsman', ro: 'Avocatul Poporului' },
    role: { en: 'Civil rights oversight', ro: 'Supravegherea drepturilor civile' },
    category: 'oversight',
    note: {
      en: 'Receives complaints; can trigger IG review',
      ro: 'Primește plângeri; poate declanșa verificări IG',
    },
  },
  {
    id: 'DNSC',
    name: { en: 'DNSC', ro: 'DNSC' },
    role: { en: 'Civilian cyber defense', ro: 'Apărare cibernetică civilă' },
    category: 'civilian',
    note: {
      en: 'National cyber incident response; receives threat indicators',
      ro: 'Răspuns național la incidente cibernetice; primește indicatori de amenințare',
    },
  },
  {
    id: 'DIICOT',
    name: { en: 'DIICOT / PICCJ', ro: 'DIICOT / PICCJ' },
    role: { en: 'Prosecutors', ro: 'Procurori' },
    category: 'justice',
    note: {
      en: 'Receives warranted evidence packages with chain-of-custody',
      ro: 'Primește pachete de probe cu mandat și lanț de custodie',
    },
  },
  {
    id: 'ICCJ',
    name: { en: 'ICCJ', ro: 'ICCJ' },
    role: {
      en: 'High Court of Cassation',
      ro: 'Înalta Curte de Casație și Justiție',
    },
    category: 'judicial',
  },
]

export const categoryColors: Record<ActorCategory, string> = {
  executive: '#94a3b8',
  agency: '#f87171',
  judicial: '#4ade80',
  oversight: '#f472b6',
  civilian: '#2dd4bf',
  broker: '#60a5fa',
  justice: '#c084fc',
  public: '#94a3b8',
}

export const currentStateOverrides: Partial<Record<ActorCategory, string>> = {
  agency: '#ef4444',
  judicial: '#c084fc',
}

export function resolveActorColor(actor: Actor, mode: 'current' | 'target'): string {
  if (mode === 'current' && actor.category in currentStateOverrides) {
    return currentStateOverrides[actor.category] as string
  }
  return categoryColors[actor.category]
}
