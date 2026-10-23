import {defineField, defineType} from 'sanity'

/** Search engine and social sharing settings for a page. */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description:
        'Shown in the browser tab and as the headline in Google. Around 50–60 characters. Leave empty to use the default from Site settings.',
      validation: (rule) => rule.max(70).warning('Google usually cuts titles after about 60 characters.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description:
        'The short summary under the title in Google results. Around 150 characters. Leave empty to use the default.',
      validation: (rule) => rule.max(170).warning('Google usually cuts descriptions after about 160 characters.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social sharing image',
      type: 'image',
      description: 'Shown when the page is shared on LinkedIn, Slack, etc. Best size: 1200 × 630 pixels.',
    }),
  ],
})
