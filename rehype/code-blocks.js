const visit = require('unist-util-visit')
const { matches } = require('hast-util-select')
const h = require('hastscript')

/**
 * Turns `<script>` and `<style>` tags into visible
 * code blocks
 */
module.exports = function () {
  return function (tree) {
    const processed = new WeakSet()

    visit(
      tree,
      function (node) {
        return matches('style, script', node) && !matches('.d--none', node)
      },
      function (element, index, parent) {
        if (processed.has(element)) return

        const clonedChildren = JSON.parse(JSON.stringify(element.children))

        const codeBlock = h('pre', [
          h('code', { class: getLanguageClass(element) }, clonedChildren),
        ])

        processed.add(element)

        parent.children.splice(index, 0, codeBlock)
      }
    )
  }
}

function getLanguageClass(element) {
  if (element.tagName === 'script') {
    return 'language-js'
  }
  if (element.tagName === 'style') {
    return 'language-css'
  }
  return 'plaintext'
}
