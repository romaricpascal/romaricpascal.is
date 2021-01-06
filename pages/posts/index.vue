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
  <Fragment>
    <h1>{{ $t('heading') }}</h1>
    <ul class="post-list margin-top--sm">
      <li v-for="(post, index) in posts" :key="index" class="post-list-item">
        <h2>
          <nuxt-link :to="localePath(`/${post.route}`)">
            {{ post.title }}
          </nuxt-link>
        </h2>
        <time :datetime="post.date.toISOString()">{{ $dt(post.date) }}</time>
      </li>
    </ul>
    <Pagination
      class="margin-top--md"
      :show-list="true"
      v-bind="pagination"
      :page="page"
    >
      Page {{ page }} / {{ pagination.lastPage }}
    </Pagination>
  </Fragment>
</template>

<script>
import head from '~/mixins/head'
import { paginate } from '~/lib/paginate'

export default {
  mixins: [head],
  async asyncData({ $content, store, params }) {
    const locale = store.state.i18n.locale
    const posts = await $content('posts')
      .where({
        language: locale,
      })
      .sortBy('date', 'desc')
      .fetch()

    posts.forEach((post) => (post.date = new Date(post.date)))

    const page = params.page || 1
    const pagination = paginate(posts, {
      page: params.page || 1,
    })

    return {
      posts: posts.slice(pagination.startIndex, pagination.endIndex),
      page,
      pagination,
    }
  },
  data() {
    return {
      headData: {
        title: this.$t('heading'),
      },
    }
  },
  created() {
    this.$store.commit('SET', {
      prose: false,
    })
  },
  layoutOptions: {
    prose: false,
  },
}
</script>
