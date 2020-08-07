const set = require('lodash/set');
const get = require('lodash/fp/get');

module.exports = function() {
  return function(files, metalsmith) {
    const groups = {
      byKeyByLanguage: {},
      byLanguageByType: {}
    };
    Object.values(files).forEach(file => {
      const language = get('i18n.language')(file);
      const key = get('i18n.key')(file);
      const type = get('type')(file);
      set(groups.byKeyByLanguage, [key, language], file);
      push(groups.byLanguageByType, [language, type], file);
    });

    metalsmith.metadata().groups = groups;
  };
};

/**
 * Pushes the given value in the array set at key on obj
 * @param {Object} object
 * @param {Array} key
 * @param {*} value
 */
function push(object, key, value) {
  const array = getOrCreate(object, key, Array);
  array.push(value);
}

function getOrCreate(object, key, factory) {
  let value = get(key, object);
  if (!value) {
    value = factory();
    set(object, key, value);
  }

  return value;
}
