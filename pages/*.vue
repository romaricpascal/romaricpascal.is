<template>
  <Fragment>
    <Fragment v-if="doc">
      <h1 v-if="doc.title">{{ doc.title }}</h1>
      <time
        v-if="doc.type === 'post'"
        class="d--block no-margin-top"
        :datetime="doc.date.toISOString()"
        >{{ $dt(doc.date) }}</time
      >
      <nuxt-content :document="doc" />
    </Fragment>
    <Page404 v-if="!doc" />
  </Fragment>
</template>

<script>
import Page404 from './404'
import head from '~/mixins/head'

export default {
  components: {
    Page404,
  },
  mixins: [head],
  async asyncData({ $content, store, route, params, redirect }) {
    const locale = store.state.i18n.locale

    const routes = [
      params.pathMatch, // Either match the exact path
      `${params.pathMatch}/__INDEX__`, // Or an index page for that path
      `__INDEX__`, // Or the root path
    ]
    let doc
    for (const r of routes) {
      const results = await $content({ deep: true })
        .where({
          route: r,
          language: locale,
        })
        .fetch()

      doc = results[0]
      if (doc) break
    }

    if (doc) {
      if (doc.date) {
        doc.date = new Date(doc.date)
      }
      const translations = await $content({ deep: true })
        .where({ key: doc.key })
        .fetch()

      const pathTranslations = {}
      translations.forEach((translatedDocument) => {
        pathTranslations[translatedDocument.language] = {
          pathMatch: translatedDocument.route.replace('__INDEX__', ''),
        }
      })

      await store.dispatch('i18n/setRouteParams', pathTranslations)
    }

    return { doc }
  },
  computed: {
    headData() {
      return {
        title: this.doc ? this.doc.title : 'Not found',
        description: this.doc?.ogDescription,
      }
    },
  },
}
</script>
