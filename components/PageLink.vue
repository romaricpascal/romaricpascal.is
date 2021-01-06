<template>
  <Fragment>
    <nuxt-link
      v-if="page"
      :to="{ name: routeName, params: { page } }"
      v-bind="$attrs"
      ><slot
    /></nuxt-link>
    <a v-if="!page"><slot /></a>
  </Fragment>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    page: {
      type: [String, Number],
      default: null,
    },
  },
  computed: {
    routeName() {
      if (this.page === 1) {
        return this.unpaginatedRouteName
      }
      return this.paginatedRouteName
    },
    paginatedRouteName() {
      if (this.$route.name.startsWith('paginated')) {
        return this.$route.name
      } else {
        return `paginated_${this.$route.name}`
      }
    },
    unpaginatedRouteName() {
      if (this.$route.name.startsWith('paginated')) {
        return this.$route.name.replace(/^paginated_/, '')
      } else {
        return this.$route.name
      }
    },
  },
}
</script>
