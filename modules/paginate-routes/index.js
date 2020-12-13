const DEFAULT_OPTIONS = {
  paths: [],
  slug: 'page',
}

export default function (userOptions) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
    ...this.options.paginateRoutes,
  }
  const { paths, slug } = options

  const { trailingSlash } = this.options.router

  this.extendRoutes(function (routes) {
    paths.forEach((path) => {
      const index = routes.findIndex((r) => r.path === path)
      if (index !== -1) {
        const route = routes[index]
        routes.splice(index, 0, {
          ...route,
          path: [
            route.path,
            trailingSlash ? '' : '/', // Slash is already part of the initial path if trailingSlash is on
            `${slug}/:page`,
            trailingSlash ? '/' : '', // Need to add a trailing slash if trailing slash is on
          ].join(''),
          name: `paginated_${route.name}`,
        })
      }
    })
  })
}
