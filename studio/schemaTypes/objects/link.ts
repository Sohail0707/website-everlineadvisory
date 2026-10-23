import {defineField, defineType} from 'sanity'
import {ANCHOR_PATTERN} from '../../constants'

/**
 * A link to a section on the same page (this is a one-page site).
 * Stored without the "#": the website adds it.
 */
export const anchorLink = defineType({
  name: 'anchorLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'The text people see, e.g. "Book a call". Keep it short.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'anchor',
      title: 'Jumps to section',
      type: 'string',
      description:
        'The section id to scroll to, without "#". Built-in ids: home, about, services, book, contact.',
      validation: (rule) =>
        rule.required().regex(ANCHOR_PATTERN, {name: 'section id'}).error('Use lowercase letters, numbers and dashes only, e.g. "book".'),
    }),
  ],
  preview: {
    select: {title: 'label', anchor: 'anchor'},
    prepare: ({title, anchor}) => ({title, subtitle: anchor ? `#${anchor}` : ''}),
  },
})
