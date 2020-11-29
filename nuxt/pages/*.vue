<template>
  <Fragment>
    <h1 v-if="doc.title">{{ doc.title }}</h1>
    <time
      v-if="doc.type === 'post'"
      class="d--block"
      :datetime="doc.date.toISOString()"
      >{{ $dt(doc.date) }}</time
    >
    <nuxt-content :document="doc" />
  </Fragment>
</template>

<script>
export default {
  async asyncData({ $content, store, route, params }) {
    const locale = store.state.i18n.locale

    const results = await $content({ deep: true })
      .where({
        route: params.pathMatch || '',
        language: locale,
      })
      .fetch()

    const doc = results[0]
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

    return { doc }
  },
  head() {
    return {
      title: [this.doc.title, 'Romaric Pascal'].filter(Boolean).join(' | '),
    }
  },
}
</script>
