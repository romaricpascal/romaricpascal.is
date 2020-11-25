import { dirname, join } from 'path'
import { detectLanguage } from './lib/content/detectLanguage'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'romaricpascal.is',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/style.css', '~/assets/nord.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['~/plugins/formatDate.js'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    process.env.NODE_ENV === 'production' ? '@nuxtjs/eslint-module' : null,
    // https://go.nuxtjs.dev/stylelint
    process.env.NODE_ENV === 'production' ? '@nuxtjs/stylelint-module' : null,
  ].filter(Boolean),

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'nuxt-i18n',
  ],

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: { liveEdit: false },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extractCSS: true,
  },

  hooks: {
    'content:file:beforeInsert'(document) {
      const languageInfo = detectLanguage(document.path, {
        languages: ['en', 'fr'],
      })
      Object.assign(document, languageInfo)

      document.route = join(dirname(document.path), document.slug)
        .replace(/^\//, '')
        .replace(/index$/, '')
    },
  },

  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en',
        name: 'English',
      },
      { code: 'fr', iso: 'fr', name: 'Français' },
    ],
    defaultLocale: 'en',
    vueI18nLoader: true,
    vueI18n: {
      fallbackLocale: 'en',
      dateTimeFormats: {
        'en-gb': {
          // Require 'en-gb' here so that date is in the right order
          short: {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          },
        },
        fr: {
          short: {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          },
        },
      },
    },
    seo: true,
    vuex: {
      syncLocale: true,
      setRouteParams: true,
    },
  },
}
