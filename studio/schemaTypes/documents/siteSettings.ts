import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  description: 'Name, menu, contact details and default SEO. There is one per language.',
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'navigation', title: 'Menu'},
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
      name: 'name',
      title: 'Business name',
      type: 'string',
      group: 'general',
      description: 'Shown top-left in the menu and in the footer.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'general',
      description: 'One line under the name in the footer.',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'email',
      group: 'general',
      description: 'Shown in the contact section and the footer.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright line',
      type: 'string',
      group: 'general',
      description: 'Small print in the footer, e.g. "© 2026 Everline Advisory. All rights reserved."',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'nav',
      title: 'Menu items',
      type: 'array',
      group: 'navigation',
      description: 'Links in the top menu and the footer. Each one scrolls to a section. Up to 5.',
      of: [defineArrayMember({type: 'anchorLink'})],
      validation: (rule) => rule.required().max(5),
    }),
    defineField({
      name: 'bookCta',
      title: 'Menu button',
      type: 'anchorLink',
      group: 'navigation',
      description: 'The outlined button at the right of the menu, e.g. "Book a call" → book.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Default SEO title',
      type: 'string',
      group: 'seo',
      description: 'Used when a page has no SEO title of its own. Around 50–60 characters.',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Default SEO description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Used when a page has no SEO description of its own. Around 150 characters.',
      validation: (rule) => rule.required().max(170),
    }),
  ],
  preview: {
    select: {title: 'name', language: 'language'},
    prepare: ({title, language}) => ({title: title || 'Site settings', subtitle: `Site settings · ${(language || '').toUpperCase()}`}),
  },
})
