<template>
  <nav aria-labelledby="site-navigation-label">
    <h2 id="site-navigation-label" hidden>Site</h2>
    <nuxt-link
      class="link-reversed brand no-active"
      :to="localePath('/')"
      :active-class="null"
    >
      Romaric Pascal
    </nuxt-link>
    <nuxt-link :to="localePath('/posts')">All posts</nuxt-link>
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
