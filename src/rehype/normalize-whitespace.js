const visit = require('unist-util-visit');
const dedent = require('dedent');

/**
 * Ensures text don't have unnecessary line breaks or indentation.
 * It only matters for `<pre>` content, but doesn't hurt the rest
 */
module.exports = function() {
  return function(tree) {
    visit(
      tree,
      n => n.type === 'text',
      node => {
        node.value = dedent(node.value.replace(/^\n+|\n+$/g, ''));
      }
    );
  };
};
