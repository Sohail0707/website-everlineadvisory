/**
 * Languages, URLs and the few interface strings that are part of the code rather than content
 * (screen-reader labels, calendar legend). Everything an editor might want to change lives in Sanity.
 */

export type Lang = 'en' | 'de';

/** The first language is the default and has no URL prefix. */
export const LANGUAGES: { id: Lang; label: string; name: string; locale: string }[] = [
  { id: 'en', label: 'EN', name: 'English', locale: 'en-US' },
  { id: 'de', label: 'DE', name: 'Deutsch', locale: 'de-DE' },
];

export const DEFAULT_LANG: Lang = 'en';

/** One entry of the language switcher and of the hreflang links. */
export interface LanguageLink {
  lang: Lang;
  label: string;
  name: string;
  href: string;
  current: boolean;
}

/** Turns any string (possibly with stega) into a known language, falling back to English. */
export function toLang(value: string | null | undefined): Lang {
  return LANGUAGES.some((l) => l.id === value) ? (value as Lang) : DEFAULT_LANG;
}

export function localeFor(lang: Lang) {
  return LANGUAGES.find((l) => l.id === lang)!.locale;
}

/**
 * The URL of a page. Keep in sync with studio/presentation.ts.
 * home + en -> "/", home + de -> "/de/", about + de -> "/de/about/"
 */
export function pagePath(slug: string | null | undefined, lang: Lang) {
  const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`;
  if (!slug || slug === 'home') return `${prefix}/`;
  return `${prefix}/${slug}/`;
}

/** Interface strings that are not editable content. */
export const ui = {
  en: {
    skipLink: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    primaryNav: 'Primary',
    footerNav: 'Footer',
    languageNav: 'Language',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    chooseDate: 'Choose a date',
    chooseTime: 'Choose a time',
    selected: 'Selected',
    available: 'Available',
    at: 'at', // "Wed, Sep 16 at 10:20"
    honeypot: 'Leave this empty',
  },
  de: {
    skipLink: 'Zum Inhalt springen',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    primaryNav: 'Hauptmenü',
    footerNav: 'Fußzeile',
    languageNav: 'Sprache',
    previousMonth: 'Vorheriger Monat',
    nextMonth: 'Nächster Monat',
    chooseDate: 'Datum wählen',
    chooseTime: 'Uhrzeit wählen',
    selected: 'Ausgewählt',
    available: 'Verfügbar',
    at: 'um',
    honeypot: 'Bitte leer lassen',
  },
} satisfies Record<Lang, Record<string, string>>;
