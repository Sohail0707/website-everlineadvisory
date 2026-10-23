import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // `npm run deploy` publishes the Studio to https://<studioHost>.sanity.studio.
  // studioHost is marked deprecated in favour of deployment.appId, but the appId only exists after
  // the first deploy: once `sanity deploy` prints it, add it under `deployment` below.
  studioHost: process.env.SANITY_STUDIO_HOSTNAME || 'everline-advisory',
  deployment: {autoUpdates: true},
  typegen: {
    // Read the queries from the website and write the types next to them.
    path: '../src/**/*.{ts,astro}',
    schema: '../src/lib/sanity/schema.json',
    generates: '../src/lib/sanity/sanity.types.ts',
  },
})
