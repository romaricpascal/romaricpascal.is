export default {
  head() {
    const { title, description } = this.headData

    const head = {}
    if (title) {
      Object.assign(head, {
        title,
        meta: [
          {
            hid: 'ogTitle',
            name: 'og:title',
            value: title,
          },
        ],
      })
    }

    if (description) {
      head.meta = [
        {
          hid: 'description',
          name: 'description',
          value: description,
        },
        {
          hid: 'ogDescription',
          name: 'og:description',
          value: description,
        },
      ]
    } else {
      head.meta = [
        {
          hid: 'description',
          name: 'description',
          value: this.$t('siteDescription'),
        },
        {
          hid: 'ogDescription',
          name: 'og:description',
          value: this.$t('siteDescription'),
        },
      ]
    }

    return head
  },
}
