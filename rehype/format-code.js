const { selectAll } = require('hast-util-select')
const dedent = require('dedent')

/**
 * Ensures text don't have unnecessary line breaks or indentation.
 * It only matters for `<pre><code>` content
 */
module.exports = function () {
  return function (tree) {
    selectAll('pre code', tree).forEach((node) => {
      const textNode = node.children[0]
      if (textNode.type !== 'text') return
      // Remove multiple line-breaks
      textNode.value = textNode.value.replace(/^\n+|\n+$/g, '')
      // Only dedent if there is some whitespace at the start
      // to avoid breaking indentation when there is none
      if (/^\s/.test(textNode.value)) {
        textNode.value = dedent(textNode.value)
      }
    })
  }
}
