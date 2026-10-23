import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {LANGUAGES} from './constants'

/**
 * The left-hand menu in the Studio.
 * Pages and settings are split by language so editors never mix up English and German.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages by language')
            .items(
              LANGUAGES.map((lang) =>
                S.listItem()
                  .id(`pages-${lang.id}`)
                  .title(lang.title)
                  .schemaType('page')
                  .child(
                    S.documentTypeList('page')
                      .title(`Pages (${lang.title})`)
                      .filter('_type == "page" && language == $lang')
                      .params({lang: lang.id})
                      // "page-en" / "page-de" are templates created by the translation plugin.
                      .initialValueTemplates([S.initialValueTemplateItem(`page-${lang.id}`)]),
                  ),
              ),
            ),
        ),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site settings')
            .items(
              // One fixed document per language (created by the seed script).
              LANGUAGES.map((lang) =>
                S.listItem()
                  .id(`siteSettings-${lang.id}`)
                  .title(lang.title)
                  .icon(CogIcon)
                  .child(S.document().schemaType('siteSettings').documentId(`siteSettings-${lang.id}`)),
              ),
            ),
        ),
    ])
