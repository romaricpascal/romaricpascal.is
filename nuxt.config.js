import { dirname, join } from 'path'
import querystring from 'querystring'
import rehype from 'rehype'
import { detectLanguage } from './lib/content/detectLanguage'
import removeNuxt from './rehype/remove-nuxt'
import unwrap, { DEFAULT_SELECTOR } from './rehype/hast-util-unwrap'
import stripComments from './rehype/strip-comments'

const LOCALES = {
  locales: [
    {
      code: 'en',
      iso: 'en',
      name: 'English',
    },
    { code: 'fr', iso: 'fr', name: 'Français' },
  ],
  defaultLocale: 'en',
}

const EXTRA_JS = false // { main: ['./assets/main.js'] };

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: (titleChunk) => {
      if (titleChunk) {
        return `${titleChunk} | Romaric Pascal`
      }
      return 'Romaric Pascal'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/style.scss'],

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
    '@nuxtjs/feed',
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
      highlighter(rawCode, lang, _, { h, node, u }) {
        // Simply returning `rawCode` would get any HTML in there parsed
        // Instead, we need to create the HAST structure
        // and pass the code as a text node
        return h(node, 'pre', [
          h(node, 'code', { className: [`language-${lang}`] }, [
            u('text', rawCode),
          ]),
        ])
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extractCSS: true,
    extend(config, { isClient, isDev }) {
      if (isClient && EXTRA_JS) {
        config.entry = Object.assign({}, config.entry || {}, EXTRA_JS)

        if (isDev) {
          // Thanks Nuxt default config
          // https://github.com/nuxt/nuxt.js/blob/dev/packages/webpack/src/config/client.js
          const {
            options: { router },
          } = this.buildContext

          const hotMiddlewareClientOptions = {
            reload: true,
            timeout: 30000,
            path: `${router.base}/__webpack_hmr/${config.name}`.replace(
              /\/\//g,
              '/'
            ),
            name: this.name,
          }

          const hotMiddlewareClientOptionsStr = querystring.stringify(
            hotMiddlewareClientOptions
          )

          config.entry.main.unshift(
            'eventsource-polyfill',
            `webpack-hot-middleware/client?${hotMiddlewareClientOptionsStr}`
          )
        }
      }
    },
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
          .use(removeNuxt, {
            ignore: (node) =>
              EXTRA_JS && /(runtime|main).js/.test(node.properties.src || ''),
          })
          .use(unwrap, {
            selector: `${DEFAULT_SELECTOR},.nuxt-content, #__nuxt, #__layout`,
          })
          .use(stripComments)
          .processSync(result.html)
        result.html = res.contents
      }
      // }
    },
  },

  i18n: {
    ...LOCALES,
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

  feed() {
    const baseUrl = 'https://romaricpascal.is'
    const feedFormats = {
      rss: { type: 'rss2', file: 'feed.xml' },
      json: { type: 'json1', file: 'feed.json' },
    }
    const feedDescriptions = {
      en: 'Thoughts about front-end development (mostly)',
      fr: "Pensées sur l'intégration web (en gros)",
    }
    const { $content } = require('@nuxt/content')

    const feeds = LOCALES.locales.map(createFeeds).flat()
    return feeds

    function createFeeds(locale) {
      return Object.values(feedFormats).map(({ file, type }) => ({
        path: i18nRoute(file, { locale: locale.code }),
        type,
        create: createFeedArticles(locale.code),
      }))
    }

    function createFeedArticles(localeCode) {
      return async function create(feed) {
        feed.options = {
          title: 'Romaric Pascal',
          author: 'Romaric Pascal <hello@romaricpascal.is>',
          description: feedDescriptions[localeCode],
          link: baseUrl,
          language: localeCode,
        }
        const articles = await $content('posts')
          .where({
            language: localeCode,
          })
          .sortBy('date', 'desc')
          .limit(20)
          .fetch()

        articles.forEach((article) => {
          const url = `${baseUrl}/${i18nRoute(article.route, {
            locale: localeCode,
          })}`

          feed.addItem({
            title: article.title,
            id: url,
            link: url,
            date: new Date(article.date),
          })
        })
      }
    }
  },
}

function i18nRoute(path, { locale }) {
  if (locale !== LOCALES.defaultLocale) {
    return `${locale}/${path}`
  }

  return path
}
