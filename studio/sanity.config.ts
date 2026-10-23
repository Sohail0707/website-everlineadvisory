import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {resolve} from './presentation'
import {LANGUAGES} from './constants'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// The server-rendered preview deployment of the website (see README → "Two build modes").
// Falls back to the local Astro dev server.
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:4321'

export default defineConfig({
  name: 'everline',
  title: 'Everline Advisory',
  projectId,
  dataset,

  plugins: [
    structureTool({structure}),
    presentationTool({
      resolve,
      previewUrl: {
        initial: previewUrl,
        // The website route that checks the secret from the Studio and turns on draft mode.
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
    documentInternationalization({
      supportedLanguages: LANGUAGES,
      schemaTypes: ['page', 'siteSettings'],
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Hide the generic "new page" / "new settings" templates: the language-specific ones
    // from the translation plugin make sure every new document gets a language.
    templates: (prev) => prev.filter((template) => !['page', 'siteSettings'].includes(template.id)),
  },

  document: {
    // Settings are fixed documents (one per language): don't offer "Create new" for them.
    newDocumentOptions: (prev) => prev.filter((item) => !item.templateId.startsWith('siteSettings')),
    actions: (prev, context) =>
      context.schemaType === 'siteSettings'
        ? prev.filter((action) => !['duplicate', 'delete', 'unpublish'].includes(action.action ?? ''))
        : prev,
  },
})
