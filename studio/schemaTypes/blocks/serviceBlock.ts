import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'
import {ANCHOR_PATTERN, ILLUSTRATIONS} from '../../constants'

export const serviceBlock = defineType({
  name: 'serviceBlock',
  title: 'Service',
  type: 'object',
  icon: CaseIcon,
  description: 'One service: an illustration next to a headline and a short description.',
  fields: [
    defineField({
      name: 'heading',
      title: 'Headline',
      type: 'string',
      description: 'Describe the founder’s problem in one sentence, e.g. "Your board meeting is Thursday…".',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Service name',
      type: 'string',
      description: 'Shown in small capitals under the headline, e.g. "BOARD DECK PREP".',
      validation: (rule) => rule.required().max(48),
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences on what you deliver.',
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: 'illustration',
      title: 'Illustration',
      type: 'string',
      description: 'The drawing shown next to the text.',
      options: {list: ILLUSTRATIONS, layout: 'radio'},
      initialValue: 'data-room',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'side',
      title: 'Illustration side',
      type: 'string',
      description: 'Alternate left and right between services so the page has rhythm. Phones always show it on top.',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'left',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'anchor',
      title: 'Section id (optional)',
      type: 'string',
      description:
        'Lets a menu link jump here. The first service uses "services" so the "Services" menu item works. Leave empty on the others.',
      validation: (rule) => rule.regex(ANCHOR_PATTERN).error('Use lowercase letters, numbers and dashes only.'),
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'eyebrow', side: 'side'},
    prepare: ({title, subtitle, side}) => ({
      title: title || 'Service',
      subtitle: `Service · ${subtitle || ''}${side ? ` · illustration ${side}` : ''}`,
    }),
  },
})
