const { selectAll } = require('hast-util-select');
const dedent = require('dedent');

/**
 * Ensures text don't have unnecessary line breaks or indentation.
 * It only matters for `<pre><code>` content
 */
module.exports = function() {
  return function(tree) {
    selectAll('pre code', tree).forEach(node => {
      const textNode = node.children[0];
      textNode.value = dedent(textNode.value.replace(/^\n+|\n+$/g, ''));
    });
  };
};
