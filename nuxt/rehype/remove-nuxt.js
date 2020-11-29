import remove from 'unist-util-remove'
import visit from 'unist-util-visit'
const { matches } = require('hast-util-select')

const NUXT_DATA_ATTRS = [
  'dataNHead',
  'dataNHeadSsr',
  'dataHid',
  'dataServerRendered',
]

export default function () {
  return function (tree) {
    remove(
      tree,
      (node, index, parent) =>
        matches('script, link', node) &&
        (isNuxtScript(node) || isNuxtData(node))
    )

    visit(
      tree,
      (node) =>
        node.properties &&
        NUXT_DATA_ATTRS.some((attr) => node.properties[attr]),
      (node) => {
        NUXT_DATA_ATTRS.forEach((attr) => delete node.properties[attr])
      }
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
