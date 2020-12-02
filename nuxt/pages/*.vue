<template>
  <Fragment>
    <Fragment v-if="doc">
      <h1 v-if="doc.title">{{ doc.title }}</h1>
      <time
        v-if="doc.type === 'post'"
        class="d--block"
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

    const results = await $content({ deep: true })
      .where({
        route: params.pathMatch || '',
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
          pathMatch: translatedDocument.route,
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
