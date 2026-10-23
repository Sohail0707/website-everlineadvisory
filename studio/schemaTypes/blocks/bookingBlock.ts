import {defineArrayMember, defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export const bookingBlock = defineType({
  name: 'bookingBlock',
  title: 'Booking',
  type: 'object',
  icon: CalendarIcon,
  description: 'The dark section with the three steps and the booking calendar. Its section id is "book".',
  groups: [
    {name: 'content', title: 'Text', default: true},
    {name: 'calendar', title: 'Calendar'},
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
      description: 'E.g. "Book a free 20-minute intro call."',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'stepsHeading',
      title: 'Steps heading',
      type: 'string',
      group: 'content',
      description: 'Small capitalised line above the steps, e.g. "WHAT HAPPENS NEXT".',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      group: 'content',
      description: 'What happens after someone gets in touch. They are numbered automatically. Up to 4.',
      of: [
        defineArrayMember({
          name: 'step',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: 'body',
              title: 'Text',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required().max(140),
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'body'}},
        }),
      ],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: 'panel',
      title: 'Booking calendar',
      type: 'object',
      group: 'calendar',
      description: 'The calendar card on the right. Picking a slot fills in the contact form; nothing is booked automatically.',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'E.g. "20-Minute Intro Call".',
          validation: (rule) => rule.required().max(40),
        }),
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
          description: 'Small text on the right of the title, e.g. "Book a time".',
          validation: (rule) => rule.required().max(24),
        }),
        defineField({
          name: 'meta',
          title: 'Call details',
          type: 'string',
          description: 'Length, tool and time zone, e.g. "20 min · Zoom · CT".',
          validation: (rule) => rule.required().max(40),
        }),
        defineField({
          name: 'timeSlots',
          title: 'Time slots',
          type: 'array',
          description: 'Times offered every open day, in 24-hour format like "09:00". Up to 8.',
          of: [
            defineArrayMember({
              type: 'string',
              validation: (rule) => rule.regex(TIME_PATTERN).error('Use 24-hour time like "09:40".'),
            }),
          ],
          validation: (rule) => rule.required().min(1).max(8).unique(),
        }),
        defineField({
          name: 'defaultSlot',
          title: 'Pre-selected time',
          type: 'string',
          description: 'The time that is selected when the page loads. Must be one of the time slots above.',
          validation: (rule) =>
            rule.required().custom((value, context) => {
              const parent = context.parent as {timeSlots?: string[]} | undefined
              if (!value || !parent?.timeSlots) return true
              return parent.timeSlots.includes(value) || 'Pick one of the time slots above.'
            }),
        }),
        defineField({
          name: 'openWeekdays',
          title: 'Open days',
          type: 'array',
          description: 'Days people can pick in the calendar.',
          of: [defineArrayMember({type: 'number'})],
          options: {
            // Numbers match JavaScript's Date: 0 = Sunday … 6 = Saturday.
            list: [
              {title: 'Mon', value: 1},
              {title: 'Tue', value: 2},
              {title: 'Wed', value: 3},
              {title: 'Thu', value: 4},
              {title: 'Fri', value: 5},
              {title: 'Sat', value: 6},
              {title: 'Sun', value: 0},
            ],
            layout: 'grid',
          },
          validation: (rule) => rule.required().min(1),
        }),
        defineField({
          name: 'confirmLabel',
          title: 'Confirm button',
          type: 'string',
          description: 'The chosen date and time are added after it automatically, e.g. "Confirm — Wed, Sep 16 at 10:20".',
          validation: (rule) => rule.required().max(20),
        }),
        defineField({
          name: 'messageTemplate',
          title: 'Message added to the contact form',
          type: 'string',
          description:
            'Written into the contact form when someone confirms. Keep {date} and {time}: they are replaced with the choice.',
          validation: (rule) =>
            rule.required().custom((value) =>
              !value || (value.includes('{date}') && value.includes('{time}')) || 'Include both {date} and {time}.',
            ),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'panel.title'},
    prepare: ({title, subtitle}) => ({title: title || 'Booking', subtitle: `Booking · ${subtitle || ''}`}),
  },
})
