<template>
  <Fragment>
    <Fragment v-if="doc">
      <h1 v-if="doc.title">{{ doc.title }}</h1>
      <time
        v-if="doc.type === 'post'"
        class="d--block margin-top--0"
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

export default {
  components: {
    Page404,
  },
  async asyncData({ $content, store, route, params, redirect }) {
    const locale = store.state.i18n.locale

    const routes = [
      params.pathMatch, // Either match the exact path
      `${params.pathMatch}/__INDEX__`, // Or an index page for that path
      `__INDEX__`, // Or the route path
    ]
    const results = await $content({ deep: true })
      .where({
        route: { $in: routes },
        language: locale,
      })
      .fetch()

    const doc = results[0]
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
  head() {
    return {
      title: this.doc ? this.doc.title : 'Not found',
    }
  },
}
</script>
