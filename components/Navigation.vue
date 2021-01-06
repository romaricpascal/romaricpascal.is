<i18n>
{
  "en": {
    "posts": "All posts"
  },
  "fr": {
    "posts": "Tous les posts"
  }
}
</i18n>

<template>
  <nav
    aria-labelledby="site-navigation-label"
    class="show-current-link show-active-link"
  >
    <h2 id="site-navigation-label" hidden>Site</h2>
    <nuxt-link
      class="link-reversed brand no-active"
      :to="localePath('/')"
      :active-class="null"
    >
      Romaric Pascal
    </nuxt-link>
    <nuxt-link :to="localePath('/posts')">{{ $t('posts') }}</nuxt-link>
    <nuxt-link :to="localePath(`/${me.route}`)">{{ me.title }}</nuxt-link>
    <a href="mailto:hello@romaricpascal.is">Contact</a>
  </nav>
</template>

<script>
export default {
  async fetch() {
    const me = await this.$content({ deep: true })
      .where({
        key: '/me',
        language: this.$i18n.locale,
      })
      .fetch()
    this.me = me[0]
  },
  data() {
    return { me: {} }
  },
  watch: {
    '$i18n.locale'() {
      this.$fetch()
    },
  },
}
</script>
