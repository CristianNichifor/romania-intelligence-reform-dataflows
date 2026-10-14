import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { translate, type Language, type MessageKey } from './messages'
import { I18nContext } from './useI18n'

const STORAGE_KEY = 'ro-intel-lang'

function initialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'ro') return stored
  } catch {
    /* localStorage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('ro') ? 'ro' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(initialLanguage)

  const setLang = useCallback((next: Language) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = translate('app.title', lang)
  }, [lang])

  const t = useCallback(
    (key: MessageKey, params?: Record<string, string | number>) => translate(key, lang, params),
    [lang],
  )

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}
