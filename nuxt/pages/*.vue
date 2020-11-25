<template>
  <div>
    <h1 v-if="doc.title">{{ doc.title }}</h1>
    <time v-if="doc.type === 'post'" :datetime="doc.date.toISOString()">{{
      $dt(doc.date)
    }}</time>
    <nuxt-content :document="doc" />
  </div>
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
}
</script>
