'use client'

// Sanity Studio, served by Next.js at /studio
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  basePath: '/studio',
  title: 'Typo Klasse',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Posters')
              .schemaType('poster')
              .child(S.documentTypeList('poster').title('Posters').defaultOrdering([
                { field: 'year', direction: 'desc' },
                { field: '_createdAt', direction: 'asc' },
              ])),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
