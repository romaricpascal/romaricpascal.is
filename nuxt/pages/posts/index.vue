<i18n>
{
  "en": {
    "heading": "All posts"
  },
  "fr": {
    "heading": "Tous les posts"
  }
}
</i18n>

<template>
  <div>
    <h1>{{ $t('heading') }}</h1>
    <ul class="post-list">
      <li v-for="post in posts" class="post-list-item">
        <h2>
          <nuxt-link :to="localePath(`/${post.route}`)">
            {{ post.title }}
          </nuxt-link>
        </h2>
        <time :datetime="post.date.toISOString()">{{ $dt(post.date) }}</time>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, store }) {
    const locale = store.state.i18n.locale

    const posts = await $content('posts')
      .where({
        language: locale,
      })
      .sortBy('date', 'desc')
      .fetch()

    posts.forEach((post) => (post.date = new Date(post.date)))
    return { posts }
  },
  head() {
    return {
      title: this.$t('heading'),
    }
  },
}
</script>
