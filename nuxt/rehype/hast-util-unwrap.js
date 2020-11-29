import { matches } from 'hast-util-select'
import visit from 'unist-util-visit'

export const DEFAULT_SELECTOR = '.rehype-unwrap'

export default function ({ selector = DEFAULT_SELECTOR } = {}) {
  return function (tree) {
    visit(
      tree,
      (node) => matches(selector, node),
      (node, index, parent) => {
        parent.children.splice(index, 1, ...node.children)
      }
    )
  }
}
