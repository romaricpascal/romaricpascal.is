const { selectAll } = require('hast-util-select')
const toString = require('hast-util-to-string')

module.exports = function ({
  schemes = {
    tw: 'https://twitter.com',
    gh: 'https://github.com',
    npm: 'https://npmjs.com',
  },
} = {}) {
  // Build a regexp for detecting the links based on
  // the list of available schemes
  const r = new RegExp(`^(?:(${Object.keys(schemes).join('|')}):)(.*)`, 'i')

  return function (tree) {
    const links = selectAll('a', tree)

    for (const link of links) {
      const match = r.exec(link.properties.href)
      if (match) {
        const [, schemeName, path] = match
        let content
        if (!path) {
          content = toString(link)
        }
        link.properties.href = `${schemes[schemeName]}/${path || content}`
      }
    }
  }
}
