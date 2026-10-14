import type { Language } from '../i18n/messages'

const LOCALES: Record<Language, string> = { ro: 'ro-RO', en: 'en-GB' }

// Times follow the app's language switch, not the browser's locale.
export function formatTime(iso: string, lang: Language, timeZone?: string): string {
  return new Date(iso).toLocaleTimeString(LOCALES[lang], { timeZone })
}
