<template>
  <div>
    <h1>{{ doc.title }}</h1>
    <time>{{ formatDate(doc.date) }}</time>
    <nuxt-content :document="doc" />
  </div>
</template>

<script>
const dateFormatter = new Intl.DateTimeFormat('en-gb', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
})

export default {
  async asyncData({ $content, params }) {
    const doc = await $content(`posts/${params.slug}`).fetch()
    doc.date = new Date(doc.date)

    return {
      doc,
    }
  },
  methods: {
    formatDate(date) {
      return dateFormatter.format(date)
    },
  },
}
</script>
