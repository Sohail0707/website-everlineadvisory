/**
 * German demo copy. AI-translated (not reviewed by a native-speaking copywriter): see README.
 * Same shape as site.ts + extras.ts so the seed script can treat both languages the same way.
 */
export const site = {
  name: 'Everline Advisory',
  title: 'Everline Advisory — Fractional CFO für Startups',
  description:
    'Fractional-CFO-Unterstützung für Teams von Pre-Seed bis Series A — Finanzmodelle für die Finanzierungsrunde, Monatsabschluss und Board-Decks, ohne Vollzeitstelle.',
  email: 'hello@everlineadvisory.com',
  tagline: 'Finanzielle Klarheit für Gründer, die lieber aufbauen als budgetieren.',
  copyright: '© 2026 Everline Advisory. Alle Rechte vorbehalten.',
}

export const nav = [
  {label: 'Start', href: '#home'},
  {label: 'Leistungen', href: '#services'},
  {label: 'Über mich', href: '#about'},
  {label: 'Kontakt', href: '#contact'},
]

export const bookCta = {label: 'Termin buchen', href: '#book'}

export const hero = {
  eyebrow: 'FRACTIONAL CFO FÜR STARTUPS',
  heading: 'Finanzielle Klarheit für Gründer, die lieber aufbauen als budgetieren.',
  body: 'Fractional-CFO-Unterstützung für Teams von Pre-Seed bis Series A — Finanzmodelle für die Finanzierungsrunde, Monatsabschluss und Board-Decks, ohne Vollzeitstelle.',
  cta: {label: 'Kostenloses Erstgespräch buchen', href: '#book'},
  note: 'Kein Pitch-Deck nötig — erzählen Sie mir einfach, wo Sie stehen.',
  imageAlt: 'Renata Cole, Gründerin von Everline Advisory',
}

export const about = {
  heading: 'Über Renata',
  credentials: [
    {icon: 'award', label: '12 JAHRE STARTUP-FINANZEN'},
    {icon: 'briefcase', label: 'EX-MERIDIAN CAPITAL'},
    {icon: 'file-check', label: 'CPA (US-WIRTSCHAFTSPRÜFERIN)'},
    {icon: 'map-pin', label: 'AUSTIN, TX — KUNDEN IN DEN GANZEN USA'},
  ],
  quote:
    '„Ich habe Everline gegründet, weil Gründer sich nicht zwischen sauberen Büchern und dem Aufbau ihres Produkts entscheiden müssen sollten.“',
  bio: 'Renata Cole hat zwölf Jahre lang die Finanzinfrastruktur junger Startups aufgebaut, bevor sie sich als Fractional CFO selbstständig gemacht hat. Sie hat Due-Diligence-Prozesse in Finanzierungsrunden geleitet, Monatsabschlüsse verantwortet und in Board-Meetings gesessen — vom ersten Investment bis zur Series A. Mit Everline Advisory bringt sie diese Klarheit zu Gründern, die CFO-Niveau brauchen, ohne gleich einen CFO in Vollzeit einzustellen.',
  stats: [
    {value: '14', label: 'GRÜNDERTEAMS'},
    {value: '$40M+', label: 'IN KUNDENRUNDEN EINGEWORBEN'},
    {value: '30 Tage', label: 'BIS ZUM ERSTEN SAUBEREN ABSCHLUSS (Ø)'},
  ],
}

export const services = [
  {
    id: 'services',
    heading: 'Die Finanzierungsrunde ist in drei Wochen, und Ihr Modell hält nicht stand.',
    eyebrow: 'INVESTORENTAUGLICHE FINANZEN',
    body: 'Saubere, belastbare Modelle und ein Datenraum, der der Prüfung durch Investoren standhält — so aufgebaut, wie es die Due Diligence Ihrer nächsten Runde erwartet.',
    illustration: 'data-room',
    side: 'left',
  },
  {
    heading: 'Es ist der 8. und Sie kennen die Zahlen des Vormonats noch immer nicht.',
    eyebrow: 'MONATSABSCHLUSS & REPORTING',
    body: 'Saubere Bücher, jeden Monat pünktlich, mit Berichten, die man tatsächlich lesen kann — damit Sie immer wissen, wo Sie stehen.',
    illustration: 'monthly-close',
    side: 'right',
  },
  {
    heading: 'Ihr Board-Meeting ist am Donnerstag, und das Deck existiert noch nicht.',
    eyebrow: 'BOARD-DECK-VORBEREITUNG',
    body: 'Die Geschichte hinter den Zahlen, die Ihr Board wirklich sehen will — ausgerichtet auf die anstehenden Entscheidungen, nicht nur auf die Tabelle.',
    illustration: 'board-deck',
    side: 'left',
  },
]

export const booking = {
  heading: 'Buchen Sie ein kostenloses 20-minütiges Erstgespräch.',
  stepsHeading: 'SO GEHT ES WEITER',
  steps: [
    {title: 'Anfrage senden', body: 'Erzählen Sie mir, wo Sie stehen und was Sie brauchen — ohne Vorbereitung.'},
    {title: 'Individuellen Plan erhalten', body: 'Umfang, Zeitplan und eine feste Monatspauschale, innerhalb eines Werktags.'},
    {title: 'Mit sauberen Büchern starten', body: 'Onboarding in der ersten Woche, Ihr erster Abschluss innerhalb von 30 Tagen.'},
  ],
  panel: {
    title: 'Erstgespräch (20 Minuten)',
    label: 'Termin wählen',
    meta: '20 Min. · Zoom · CT',
    timeSlots: ['09:00', '09:40', '10:20', '13:00', '13:40', '14:20'],
    defaultSlot: '10:20',
    openWeekdays: [1, 2, 3, 4, 5],
  },
}

export const faq = {
  heading: 'Was Gründer häufig fragen',
}

/** Same order as the English FAQ (by `order`). */
export const faqItems = [
  {
    question: 'Ich habe bereits einen Buchhalter — brauche ich das trotzdem?',
    answer:
      'In der Regel ja. Ein Buchhalter sorgt dafür, dass die Bücher im Tagesgeschäft stimmen; ich mache daraus die finanzielle Geschichte, die Investoren und Boards tatsächlich brauchen. Die meisten Kunden behalten ihren Buchhalter und holen mich für Modellierung, Reporting und strategische Fragen auf Board-Ebene dazu.',
  },
  {
    question: 'Wie viel meiner Zeit nimmt das tatsächlich in Anspruch?',
    answer:
      'Sobald alles eingerichtet ist, etwa eine Stunde pro Monat — ein kurzer asynchroner Check-in, plus was rund um eine Finanzierungsrunde oder ein Board-Meeting anfällt. Ziel ist weniger Zeit für Finanzen, nicht mehr.',
  },
  {
    question: 'Was kostet das?',
    answer:
      'Eine feste Monatspauschale, je nach Phase und Umfang typischerweise 2.000–4.500 $ — keine Abrechnung nach Stunden. Den Betrag vereinbaren wir, bevor die Arbeit beginnt.',
  },
  {
    question: 'Kann ich kündigen?',
    answer: 'Ja. Monatlich kündbar, ohne lange Vertragslaufzeit — 30 Tage Kündigungsfrist, und wir sind quitt.',
  },
  {
    question: 'Wie schnell können wir starten?',
    answer:
      'Die meisten Mandate starten innerhalb einer Woche nach dem Erstgespräch, und Ihr erster sauberer Abschluss folgt innerhalb von 30 Tagen.',
  },
]

export const contact = {
  heading: 'Noch unsicher? Erzählen Sie mir, wo Sie stehen.',
  body: 'Ich melde mich innerhalb eines Werktags.',
  directLabel: 'ODER DIREKT SCHREIBEN',
  stages: ['Pre-Seed', 'Seed', 'Series A'],
  needs: ['Vorbereitung der Finanzierung', 'Monatsabschluss', 'Board-Reporting'],
}

export const contactForm = {
  nameLabel: 'Name',
  namePlaceholder: 'Erika Mustermann',
  emailLabel: 'E-Mail',
  emailPlaceholder: 'beispiel@xyz.abc',
  companyLabel: 'Unternehmen',
  companyPlaceholder: 'Wie heißt Ihr Unternehmen?',
  stageLabel: 'Phase',
  needLabel: 'Wobei brauchen Sie Unterstützung?',
  selectPlaceholder: 'Bitte wählen…',
  messageLabel: 'Nachricht',
  messagePlaceholder: 'Was sollte ich vor unserem Gespräch noch wissen?',
  submitLabel: 'Senden',
}

export const bookingPanelExtras = {
  confirmLabel: 'Bestätigen',
  messageTemplate: 'Ich möchte das Erstgespräch am {date} um {time} Uhr (CT) buchen.',
}

export const pageTitle = 'Startseite'
