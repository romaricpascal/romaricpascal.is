const PER_PAGE = 8

export function paginate(data, { page = 1, perPage = paginate.PER_PAGE } = {}) {
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
