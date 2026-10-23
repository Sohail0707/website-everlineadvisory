import {siteSettings} from './documents/siteSettings'
import {page} from './documents/page'
import {anchorLink} from './objects/link'
import {seo} from './objects/seo'
import {imageWithAlt} from './objects/imageWithAlt'
import {heroBlock} from './blocks/heroBlock'
import {aboutBlock} from './blocks/aboutBlock'
import {serviceBlock} from './blocks/serviceBlock'
import {galleryBlock} from './blocks/galleryBlock'
import {bookingBlock} from './blocks/bookingBlock'
import {faqBlock} from './blocks/faqBlock'
import {contactBlock} from './blocks/contactBlock'

export const schemaTypes = [
  // documents
  siteSettings,
  page,
  // shared objects
  anchorLink,
  seo,
  imageWithAlt,
  // page builder blocks
  heroBlock,
  aboutBlock,
  serviceBlock,
  galleryBlock,
  bookingBlock,
  faqBlock,
  contactBlock,
]
