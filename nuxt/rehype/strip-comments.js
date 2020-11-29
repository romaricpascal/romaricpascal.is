import remove from 'unist-util-remove'

export default function () {
  return function (tree) {
    remove(tree, (node) => node.type === 'comment')
  }
}
