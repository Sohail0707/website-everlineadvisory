/**
 * Site-wide content. Edit copy here; components only handle layout.
 */

export const site = {
  name: 'Everline Advisory',
  title: 'Everline Advisory — Fractional CFO for Startups',
  description:
    'Fractional CFO support for pre-seed to Series A teams — fundraise models, monthly close, and board decks, without a full-time hire.',
  email: 'hello@everlineadvisory.com',
  tagline: 'Financial clarity for founders who’d rather build than budget.',
  copyright: '© 2026 Everline Advisory. All rights reserved.',
};

export const nav = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const bookCta = { label: 'Book a call', href: '#book' };

export const hero = {
  eyebrow: 'FRACTIONAL CFO FOR STARTUPS',
  heading: 'Financial clarity for founders who’d rather build than budget.',
  body: 'Fractional CFO support for pre-seed to Series A teams — fundraise models, monthly close, and board decks, without a full-time hire.',
  cta: { label: 'Book a 20-Minute Intro Call', href: '#book' },
  note: 'No pitch deck required — just tell me where you are.',
  imageAlt: 'Renata Cole, founder of Everline Advisory',
};

export const about = {
  heading: 'About Renata',
  credentials: [
    { icon: 'award', label: '12 YEARS IN STARTUP FINANCE' },
    { icon: 'briefcase', label: 'EX-MERIDIAN CAPITAL' },
    { icon: 'file-check', label: 'CPA' },
    { icon: 'map-pin', label: 'AUSTIN, TX — CLIENTS NATIONWIDE' },
  ],
  quote:
    '“I built Everline because founders shouldn’t have to choose between clean books and building the thing.”',
  bio: 'Renata Cole spent 12 years building financial infrastructure for early-stage startups before going fractional. She’s led fundraise diligence, closed the books, and sat in board meetings for companies from first check to Series A — and built Everline Advisory to bring that same clarity to founders who need CFO-level rigor without a CFO-level hire.',
  stats: [
    { value: '14', label: 'FOUNDING TEAMS' },
    { value: '$40M+', label: 'RAISED ACROSS CLIENT ROUNDS' },
    { value: '30 days', label: 'AVERAGE TIME TO FIRST CLEAN CLOSE' },
  ],
} as const;

export type IllustrationName = 'data-room' | 'monthly-close' | 'board-deck';

export const services: {
  id?: string;
  heading: string;
  eyebrow: string;
  body: string;
  illustration: IllustrationName;
  side: 'left' | 'right';
}[] = [
  {
    id: 'services',
    heading: 'You’re three weeks from a raise and your model doesn’t hold up.',
    eyebrow: 'FUNDRAISE-READY FINANCIALS',
    body: "Clean, defensible models and a data room that holds up under investor scrutiny — built the way your next round's diligence will expect.",
    illustration: 'data-room',
    side: 'left',
  },
  {
    heading: 'It’s the 8th and you still don’t know last month’s numbers.',
    eyebrow: 'MONTHLY CLOSE & REPORTING',
    body: 'Clean books, delivered on time, every month, with reporting you can actually read — so you always know where you stand.',
    illustration: 'monthly-close',
    side: 'right',
  },
  {
    heading: 'Your board meeting is Thursday and the deck doesn’t exist.',
    eyebrow: 'BOARD DECK PREP',
    body: 'The numbers story your board actually wants to see, framed around the decisions in front of you, not just the spreadsheet.',
    illustration: 'board-deck',
    side: 'left',
  },
];

export const booking = {
  heading: 'Book a free 20-minute intro call.',
  stepsHeading: 'WHAT HAPPENS NEXT',
  steps: [
    { title: 'Inquire', body: 'Tell me where you are and what you need — no prep required.' },
    { title: 'Get a tailored plan', body: 'Scope, timeline, and a flat monthly fee, within one business day.' },
    { title: 'Start clean books', body: 'Onboarding in week one, your first close inside 30 days.' },
  ],
  panel: {
    title: '20-Minute Intro Call',
    label: 'Book a time',
    meta: '20 min · Zoom · CT',
    timeSlots: ['09:00', '09:40', '10:20', '13:00', '13:40', '14:20'],
    defaultSlot: '10:20',
    /** Days of the week that can be booked (0 = Sunday). */
    openWeekdays: [1, 2, 3, 4, 5],
  },
};

export const faq = {
  heading: 'Questions founders ask',
};

export const contact = {
  heading: 'Not sure yet? Tell me where you are.',
  body: "I'll follow up within one business day.",
  directLabel: 'OR WRITE DIRECTLY',
  stages: ['Pre-seed', 'Seed', 'Series A'],
  needs: ['Fundraise Prep', 'Monthly Close', 'Board Reporting'],
};
