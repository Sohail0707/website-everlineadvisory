import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'
import {ICONS} from '../../constants'

export const aboutBlock = defineType({
  name: 'aboutBlock',
  title: 'About',
  type: 'object',
  icon: UserIcon,
  description: 'Who is behind the business: credentials, a quote, a short bio and key numbers.',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'E.g. "About Renata".',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'array',
      description: 'Short facts shown as a list with icons, e.g. "CPA". Up to 6.',
      of: [
        defineArrayMember({
          name: 'credential',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Pick the icon that fits best.',
              options: {list: ICONS, layout: 'radio', direction: 'horizontal'},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Text',
              type: 'string',
              description: 'Written in capitals, e.g. "12 YEARS IN STARTUP FINANCE".',
              validation: (rule) => rule.required().max(48),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'icon'}},
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      description: 'A personal quote, including the quotation marks “ ”.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 6,
      description: 'A short biography in the third person. One paragraph.',
      validation: (rule) => rule.required().max(700),
    }),
    defineField({
      name: 'stats',
      title: 'Key numbers',
      type: 'array',
      description: 'Up to three numbers shown large at the bottom, e.g. "14" founding teams.',
      of: [
        defineArrayMember({
          name: 'stat',
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Number',
              type: 'string',
              description: 'The big figure, e.g. "$40M+" or "30 days".',
              validation: (rule) => rule.required().max(12),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'What the number means, in capitals.',
              validation: (rule) => rule.required().max(48),
            }),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
      // The layout has three columns on desktop.
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'quote'},
    prepare: ({title, subtitle}) => ({title: title || 'About', subtitle: `About · ${subtitle || ''}`}),
  },
})
