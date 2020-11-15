<template>
  <div>
    <h1>{{ doc.title }}</h1>
    <nuxt-content :document="doc" />
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const doc = await $content(`posts/${params.slug}`).fetch()
    return { doc }
  },
}
</script>
