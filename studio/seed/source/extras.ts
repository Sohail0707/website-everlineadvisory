/**
 * English copy that used to be hard-coded in components (form labels, booking confirm text).
 * It now lives in Sanity like everything else; this file only feeds the seed script.
 */
export const contactForm = {
  nameLabel: 'Name',
  namePlaceholder: 'Jane Smith',
  emailLabel: 'Email',
  emailPlaceholder: 'example@xyz.abc',
  companyLabel: 'Company',
  companyPlaceholder: 'What is your company name?',
  stageLabel: 'Stage',
  needLabel: 'What do you need help with?',
  selectPlaceholder: 'Select…',
  messageLabel: 'Message',
  // Kept word for word from the original site, so the first Sanity render matches it exactly.
  messagePlaceholder: 'Anything else should I know before we talk?',
  submitLabel: 'Send',
}

export const bookingPanelExtras = {
  confirmLabel: 'Confirm',
  messageTemplate: "I'd like to book the intro call on {date} at {time} CT.",
}

export const pageTitle = 'Home'
