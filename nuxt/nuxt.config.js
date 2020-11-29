import { dirname, join } from 'path'
import rehype from 'rehype'
import { detectLanguage } from './lib/content/detectLanguage'
import removeNuxt from './rehype/remove-nuxt'
import unwrap, { DEFAULT_SELECTOR } from './rehype/hast-util-unwrap'

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
  css: ['~/assets/nord.css', '~/assets/style.css'],

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
  content: {
    liveEdit: false,
    markdown: {
      remarkPlugins(plugins) {
        return ['remark-hreflang', ...plugins]
      },
      rehypePlugins(plugins) {
        return [
          ...plugins,
          './rehype/well-known-urls',
          './rehype/code-blocks',
          './rehype/format-code',
          'rehype-hreflang',
          ['rehype-highlight', { ignoreMissing: true }],
        ]
      },
      highlighter(rawCode, lang) {
        return rawCode
      },
    },
  },

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
    'render:route'(url, result, context) {
      // if (process.env.NODE_ENV === 'production') {
      if (result.html) {
        const res = rehype()
          .use(removeNuxt)
          .use(unwrap, {
            selector: `${DEFAULT_SELECTOR},.nuxt-content, #__nuxt, #__layout`,
          })
          .processSync(result.html)
        result.html = res.contents
      }
      // }
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
