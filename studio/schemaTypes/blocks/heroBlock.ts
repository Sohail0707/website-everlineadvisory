import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  icon: HomeIcon,
  description: 'The large photo and headline at the top of the page. Use it once, as the first block.',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'The small capitalised line above the headline, e.g. "FRACTIONAL CFO FOR STARTUPS".',
      validation: (rule) => rule.required().max(48),
    }),
    defineField({
      name: 'heading',
      title: 'Headline',
      type: 'string',
      description: 'The main message of the page. One sentence.',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'body',
      title: 'Intro text',
      type: 'text',
      rows: 3,
      description: 'One or two sentences under the headline.',
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: 'cta',
      title: 'Button',
      type: 'anchorLink',
      description: 'The main button, usually pointing to the booking section ("book").',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Note under the button',
      type: 'string',
      description: 'A small reassuring line under the button. Optional.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'imageWithAlt',
      description:
        'Large portrait shown on the left (on top on phones). Use a high-resolution photo, at least 2000 px wide. Set the hotspot on the face.',
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'eyebrow', media: 'image'},
    prepare: ({title, subtitle, media}) => ({title: title || 'Hero', subtitle: `Hero · ${subtitle || ''}`, media}),
  },
})
