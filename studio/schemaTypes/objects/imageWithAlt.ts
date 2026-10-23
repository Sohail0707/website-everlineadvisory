import {defineField, defineType} from 'sanity'

/**
 * An image with required alt text and an optional caption.
 * Used by the hero and the gallery.
 */
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  // Hotspot lets editors choose which part of the photo stays visible when it is cropped.
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'Describe the image for people who cannot see it, and for Google. E.g. "Renata reviewing a cash-flow model with a founder".',
      validation: (rule) => rule.required().max(150),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
      description: 'A short line shown under the image. Only used in galleries.',
      validation: (rule) => rule.max(120),
    }),
  ],
  validation: (rule) => rule.required().assetRequired(),
})
