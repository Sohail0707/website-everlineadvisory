import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

/** Every block an editor can add to a page. Each one has a matching component in src/components/blocks/. */
const BLOCK_TYPES = [
  'heroBlock',
  'aboutBlock',
  'serviceBlock',
  'galleryBlock',
  'bookingBlock',
  'faqBlock',
  'contactBlock',
]

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      // Set by the translation plugin. Editors never type this.
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'title',
      title: 'Page name',
      type: 'string',
      group: 'content',
      description: 'For finding the page in the Studio. Not shown on the website.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      group: 'content',
      description:
        'The web address of the page. Use "home" for the start page (it lives at / and /de/). Translations keep the same URL.',
      options: {source: 'title', maxLength: 64},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Sections',
      type: 'array',
      group: 'content',
      description: 'The page from top to bottom. Click "Add item" to add a section, drag to reorder.',
      of: BLOCK_TYPES.map((type) => defineArrayMember({type})),
      options: {
        insertMenu: {
          filter: false,
          groups: [
            {name: 'intro', title: 'Intro', of: ['heroBlock', 'aboutBlock']},
            {name: 'content', title: 'Content', of: ['serviceBlock', 'galleryBlock', 'faqBlock']},
            {name: 'conversion', title: 'Booking & contact', of: ['bookingBlock', 'contactBlock']},
          ],
          views: [{name: 'list'}],
        },
      },
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', language: 'language'},
    prepare: ({title, slug, language}) => ({
      title: title || 'Untitled page',
      subtitle: `${(language || '').toUpperCase()} · /${slug === 'home' ? '' : slug || ''}`,
    }),
  },
})
