import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'

export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  description: 'Questions and answers. On phones each answer opens on tap.',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'E.g. "Questions founders ask".',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      description: 'Drag to reorder.',
      of: [
        defineArrayMember({
          name: 'faqItem',
          title: 'Question',
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required().max(100),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'array',
              description: 'Keep it to a short paragraph or two. Bold, italic and links are allowed.',
              // Deliberately small toolbar: no headings or lists, so answers always fit the layout.
              of: [
                defineArrayMember({
                  type: 'block',
                  styles: [{title: 'Normal', value: 'normal'}],
                  lists: [],
                  marks: {
                    decorators: [
                      {title: 'Bold', value: 'strong'},
                      {title: 'Italic', value: 'em'},
                    ],
                  },
                }),
              ],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'question'}},
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'heading', items: 'items'},
    prepare: ({title, items}) => {
      const count = Array.isArray(items) ? items.length : 0
      return {title: title || 'FAQ', subtitle: `FAQ · ${count} question${count === 1 ? '' : 's'}`}
    },
  },
})
