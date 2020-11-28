import remove from 'unist-util-remove'
const { matches } = require('hast-util-select')

export default function () {
  return function (tree) {
    remove(
      tree,
      (node, index, parent) =>
        matches('script, link', node) &&
        (isNuxtScript(node) || isNuxtData(node))
    )
  }
}

function isNuxtScript(node) {
  return (
    /nuxt/.test(node.properties.src) ||
    (/nuxt/.test(node.properties.href) && /.js$/.test(node.properties.href))
  )
}

function isNuxtData(node) {
  return (
    node.children &&
    node.children[0] &&
    node.children[0].type === 'text' &&
    node.children[0].value.includes('window.__NUXT__')
  )
}
