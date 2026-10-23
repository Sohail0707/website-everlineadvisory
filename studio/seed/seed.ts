/**
 * Seed script: imports the original site copy into Sanity as English documents,
 * then creates the German translations and links them as translation siblings.
 *
 * Run from studio/:   npm run seed
 * (= `sanity exec seed/seed.ts --with-user-token`, so it uses your `sanity login`; no token in .env)
 *
 * Idempotent: every document has a fixed _id and every array item a fixed _key,
 * so running it again updates the same documents instead of creating duplicates.
 * Careful: it OVERWRITES edits made in the Studio to these documents.
 * Pass `-- --keep-existing` to only create documents that don't exist yet.
 */
import {readFileSync, readdirSync, existsSync, createReadStream} from 'node:fs'
import {basename, extname, join, resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'
import * as en from './source/site'
import * as enExtras from './source/extras'
import * as de from './source/de'

const client = getCliClient({apiVersion: '2025-02-19'})
const keepExisting = process.argv.includes('--keep-existing')

// Paths are relative to studio/, where `sanity exec` runs.
const ROOT = resolve(process.cwd(), '..')
const FAQ_DIR = resolve(process.cwd(), 'seed/source/faq')
const HERO_IMAGE = join(ROOT, 'src/assets/hero-renata.jpg')
const GALLERY_DIR = join(ROOT, 'seed-images')

// ---------- helpers ----------

/** "#book" -> "book" (Sanity stores anchors without the #). */
const anchor = (href: string) => href.replace(/^#/, '')

/** Array items need a stable _key so re-runs don't create "changes" in the Studio. */
const withKeys = <T extends object>(prefix: string, items: T[]) =>
  items.map((item, i) => ({_key: `${prefix}-${i}`, ...item}))

/** One plain paragraph of text as Portable Text. */
function paragraph(text: string, key: string) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: `${key}-s`, text, marks: []}],
  }
}

/** Reads the old FAQ markdown files (frontmatter: question, order; body: answer), sorted by order. */
function readFaqMarkdown() {
  return readdirSync(FAQ_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = readFileSync(join(FAQ_DIR, file), 'utf8')
      const [, frontmatter, body] = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/) ?? []
      const question = frontmatter.match(/question:\s*"(.*)"/)?.[1] ?? ''
      const order = Number(frontmatter.match(/order:\s*(\d+)/)?.[1] ?? 0)
      return {question, order, answer: body.trim()}
    })
    .sort((a, b) => a.order - b.order)
}

/** Uploads an image file. Sanity de-duplicates by content, so re-running returns the same asset. */
async function uploadImage(path: string) {
  const asset = await client.assets.upload('image', createReadStream(path), {filename: basename(path)})
  return {_type: 'reference' as const, _ref: asset._id}
}

/** Gallery photos from seed-images/ (falls back to the hero photo when the folder is empty). */
function galleryFiles() {
  const files = existsSync(GALLERY_DIR)
    ? readdirSync(GALLERY_DIR)
        .filter((f) => ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase()))
        .sort()
        .map((f) => join(GALLERY_DIR, f))
    : []
  if (files.length === 0) {
    console.warn('! seed-images/ is empty: the gallery uses the hero photo instead.')
    return [HERO_IMAGE]
  }
  return files.slice(0, 4)
}

// ---------- document builders (same shape for both languages) ----------

type Copy = typeof de

function buildSettings(lang: string, copy: Copy) {
  return {
    _id: `siteSettings-${lang}`,
    _type: 'siteSettings',
    language: lang,
    name: copy.site.name,
    tagline: copy.site.tagline,
    email: copy.site.email,
    copyright: copy.site.copyright,
    nav: withKeys('nav', copy.nav.map((item) => ({_type: 'anchorLink', label: item.label, anchor: anchor(item.href)}))),
    bookCta: {_type: 'anchorLink', label: copy.bookCta.label, anchor: anchor(copy.bookCta.href)},
    seoTitle: copy.site.title,
    seoDescription: copy.site.description,
  }
}

function buildPage(
  lang: string,
  copy: Copy,
  faqItems: {question: string; answer: string}[],
  heroImage: {_type: 'reference'; _ref: string},
  gallery: {images: {_type: 'reference'; _ref: string}[]; heading: string; alts: string[]},
) {
  const services = copy.services.map((s, i) => ({
    _key: `service-${i}`,
    _type: 'serviceBlock',
    heading: s.heading,
    eyebrow: s.eyebrow,
    body: s.body,
    illustration: s.illustration,
    side: s.side,
    ...(s.id ? {anchor: s.id} : {}),
  }))

  return {
    _id: `page-home-${lang}`,
    _type: 'page',
    language: lang,
    title: copy.pageTitle,
    slug: {_type: 'slug', current: 'home'},
    seo: {_type: 'seo', title: copy.site.title, description: copy.site.description},
    pageBuilder: [
      {
        _key: 'hero',
        _type: 'heroBlock',
        eyebrow: copy.hero.eyebrow,
        heading: copy.hero.heading,
        body: copy.hero.body,
        cta: {_type: 'anchorLink', label: copy.hero.cta.label, anchor: anchor(copy.hero.cta.href)},
        note: copy.hero.note,
        image: {_type: 'imageWithAlt', asset: heroImage, alt: copy.hero.imageAlt},
      },
      {
        _key: 'about',
        _type: 'aboutBlock',
        heading: copy.about.heading,
        credentials: withKeys('cred', copy.about.credentials.map((c) => ({icon: c.icon, label: c.label}))),
        quote: copy.about.quote,
        bio: copy.about.bio,
        stats: withKeys('stat', copy.about.stats.map((s) => ({value: s.value, label: s.label}))),
      },
      ...services,
      {
        _key: 'gallery',
        _type: 'galleryBlock',
        heading: gallery.heading,
        layout: 'auto',
        images: gallery.images.map((asset, i) => ({
          _key: `img-${i}`,
          _type: 'imageWithAlt',
          asset,
          alt: gallery.alts[i] ?? gallery.alts[0],
        })),
      },
      {
        _key: 'booking',
        _type: 'bookingBlock',
        heading: copy.booking.heading,
        stepsHeading: copy.booking.stepsHeading,
        steps: withKeys('step', copy.booking.steps.map((s) => ({title: s.title, body: s.body}))),
        panel: {...copy.booking.panel, ...copy.bookingPanelExtras},
      },
      {
        _key: 'faq',
        _type: 'faqBlock',
        heading: copy.faq.heading,
        items: faqItems.map((item, i) => ({
          _key: `faq-${i}`,
          _type: 'faqItem',
          question: item.question,
          answer: [paragraph(item.answer, `faq-${i}-p`)],
        })),
      },
      {
        _key: 'contact',
        _type: 'contactBlock',
        heading: copy.contact.heading,
        body: copy.contact.body,
        directLabel: copy.contact.directLabel,
        stages: copy.contact.stages,
        needs: copy.contact.needs,
        form: copy.contactForm,
      },
    ],
  }
}

/** Links the EN and DE versions so the translation plugin shows them as siblings. */
function buildTranslationMetadata(baseId: string, schemaType: string) {
  return {
    _id: `translation.metadata.${baseId}`,
    _type: 'translation.metadata',
    schemaTypes: [schemaType],
    translations: ['en', 'de'].map((lang) => ({
      _key: lang,
      _type: 'internationalizedArrayReferenceValue',
      language: lang,
      value: {_type: 'reference', _ref: `${baseId}-${lang}`},
    })),
  }
}

// ---------- run ----------

async function main() {
  const {projectId, dataset} = client.config()
  console.log(`Seeding ${projectId}/${dataset}${keepExisting ? ' (keeping existing documents)' : ''}…`)

  const heroImage = await uploadImage(HERO_IMAGE)
  const files = galleryFiles()
  const galleryImages = []
  for (const file of files) galleryImages.push(await uploadImage(file))
  // Placeholder alt text: replace it in the Studio once real photos are in seed-images/.
  const usingHeroFallback = files[0] === HERO_IMAGE

  // site.ts is typed loosely (`as const`, union types), so give it the German file's shape.
  const enCopy = {...en, ...enExtras, faqItems: []} as unknown as Copy
  const enFaq = readFaqMarkdown()

  // Typed as plain Sanity documents: the six documents have different shapes.
  const docs: {_id: string; _type: string}[] = [
    buildSettings('en', enCopy),
    buildSettings('de', de),
    buildPage('en', enCopy, enFaq, heroImage, {
      images: galleryImages,
      heading: 'Inside the work',
      alts: [usingHeroFallback ? en.hero.imageAlt : 'Renata Cole at work with a founding team'],
    }),
    buildPage('de', de, de.faqItems, heroImage, {
      images: galleryImages,
      heading: 'Einblicke in die Arbeit',
      alts: [usingHeroFallback ? de.hero.imageAlt : 'Renata Cole bei der Arbeit mit einem Gründerteam'],
    }),
    buildTranslationMetadata('siteSettings', 'siteSettings'),
    buildTranslationMetadata('page-home', 'page'),
  ]

  const tx = client.transaction()
  for (const doc of docs) {
    if (keepExisting) tx.createIfNotExists(doc)
    else tx.createOrReplace(doc)
  }
  await tx.commit()
  for (const doc of docs) console.log(`  ✓ ${doc._id}`)
  console.log('Done.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
