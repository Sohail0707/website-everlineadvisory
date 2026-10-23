import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons/Images'
import {ANCHOR_PATTERN, GALLERY_LAYOUTS} from '../../constants'

export const galleryBlock = defineType({
  name: 'galleryBlock',
  title: 'Gallery',
  type: 'object',
  icon: ImagesIcon,
  description: 'One to four photos. The layout adapts to how many photos you add and their shape.',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'E.g. "Inside the work". Optional.',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'images',
      title: 'Photos',
      type: 'array',
      description:
        'Add 1 to 4 photos. Portrait photos get a taller tile instead of being cropped. Drag to reorder: the first photo is the large one in "Featured".',
      of: [defineArrayMember({type: 'imageWithAlt'})],
      options: {layout: 'grid'},
      validation: (rule) => rule.required().min(1).max(4).error('A gallery needs between 1 and 4 photos.'),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      description:
        'Auto picks the best arrangement: 1 photo = full width, 2 = side by side, 3 = one large + two stacked, 4 = 2 × 2 grid.',
      options: {list: GALLERY_LAYOUTS, layout: 'radio'},
      initialValue: 'auto',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'anchor',
      title: 'Section id (optional)',
      type: 'string',
      description: 'Only needed if a menu link should jump to this gallery, e.g. "work".',
      validation: (rule) => rule.regex(ANCHOR_PATTERN).error('Use lowercase letters, numbers and dashes only.'),
    }),
  ],
  preview: {
    select: {title: 'heading', images: 'images', layout: 'layout', media: 'images.0'},
    prepare: ({title, images, layout, media}) => {
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: title || 'Gallery',
        subtitle: `Gallery · ${count} photo${count === 1 ? '' : 's'} · ${layout || 'auto'}`,
        media,
      }
    },
  },
})
