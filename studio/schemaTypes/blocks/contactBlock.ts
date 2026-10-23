import {defineArrayMember, defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons/Envelope'

/** Small helper for the many short form-label fields below. */
function formText(name: string, title: string, description: string, max = 48) {
  return defineField({
    name,
    title,
    type: 'string',
    description,
    validation: (rule) => rule.required().max(max),
  })
}

export const contactBlock = defineType({
  name: 'contactBlock',
  title: 'Contact',
  type: 'object',
  icon: EnvelopeIcon,
  description: 'The contact form. Submissions arrive in Netlify Forms. Its section id is "contact".',
  groups: [
    {name: 'content', title: 'Text', default: true},
    {name: 'form', title: 'Form'},
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'string',
      group: 'content',
      description: 'One line under the heading, e.g. how fast you reply.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'directLabel',
      title: 'Email label',
      type: 'string',
      group: 'content',
      description: 'Small capitalised line above the email address, e.g. "OR WRITE DIRECTLY". The address itself comes from Site settings.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'stages',
      title: 'Company stage options',
      type: 'array',
      group: 'form',
      description: 'Choices in the "Stage" dropdown.',
      of: [defineArrayMember({type: 'string', validation: (rule) => rule.max(40)})],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'needs',
      title: 'Help options',
      type: 'array',
      group: 'form',
      description: 'Choices in the "What do you need help with?" dropdown.',
      of: [defineArrayMember({type: 'string', validation: (rule) => rule.max(40)})],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'form',
      title: 'Form labels',
      type: 'object',
      group: 'form',
      description: 'Labels and grey example text inside the empty fields.',
      options: {collapsible: true, collapsed: true},
      fields: [
        formText('nameLabel', 'Name label', 'E.g. "Name".'),
        formText('namePlaceholder', 'Name example', 'E.g. "Jane Smith".'),
        formText('emailLabel', 'Email label', 'E.g. "Email".'),
        formText('emailPlaceholder', 'Email example', 'E.g. "example@xyz.abc".'),
        formText('companyLabel', 'Company label', 'E.g. "Company".'),
        formText('companyPlaceholder', 'Company example', 'E.g. "What is your company name?".', 60),
        formText('stageLabel', 'Stage label', 'E.g. "Stage".'),
        formText('needLabel', 'Help label', 'E.g. "What do you need help with?".', 60),
        formText('selectPlaceholder', 'Dropdown hint', 'Shown before a choice is made, e.g. "Select…".', 24),
        formText('messageLabel', 'Message label', 'E.g. "Message".'),
        formText('messagePlaceholder', 'Message example', 'E.g. "Anything else I should know before we talk?".', 80),
        formText('submitLabel', 'Send button', 'E.g. "Send".', 24),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Contact', subtitle: 'Contact form'}),
  },
})
