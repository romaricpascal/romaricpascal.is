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

const PER_PAGE = 5

function paginate(data, { page = 1, perPage = paginate.PER_PAGE } = {}) {
  const lastPage = Math.ceil(data.length / perPage)

  const isInRange = page >= 0 && page <= lastPage
  if (!isInRange) return null

  const startIndex = (page - 1) * perPage
  const endIndex = Math.min(startIndex + perPage, data.length)

  const previousPage = page > 1 ? page - 1 : null
  // Quick cast of page as an integer
  const nextPage = page < lastPage ? page * 1 + 1 : null

  return {
    firstPage: 1,
    startIndex,
    endIndex,
    lastPage,
    previousPage,
    nextPage,
  }
}

paginate.PER_PAGE = PER_PAGE
</script>
