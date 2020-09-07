const { selectAll, matches } = require('hast-util-select');
const h = require('hastscript');

module.exports = function({
  selector = '[hreflang]',
  ignoreSelector = '.no-hreflang',
  className = 'hreflang'
} = {}) {
  return function(tree) {
    const linksWithHreflang = selectAll(selector, tree);
    for (const link of linksWithHreflang) {
      if (!ignoreSelector || !matches(ignoreSelector, link)) {
        const span = h('span', { class: className }, link.properties.hrefLang);

        // Add a little space
        link.children.push({ type: 'text', value: ' ' });
        // Add the generated span with the language
        link.children.push(span);
      }
    }
  };
};
