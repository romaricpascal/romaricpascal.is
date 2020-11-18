<template>
  <nuxt-content :document="doc" />
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
