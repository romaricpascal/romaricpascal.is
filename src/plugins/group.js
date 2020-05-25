const set = require('lodash/set');
const get = require('lodash/fp/get');

module.exports = function() {
  return function(files, metalsmith) {
    const groups = {
      byKeyByLanguage: {}
    };
    Object.values(files).forEach(file => {
      const language = get('i18n.language')(file);
      const key = get('i18n.key')(file);
      set(groups.byKeyByLanguage, [key, language], file);
    });

    metalsmith.metadata().groups = groups;
  };
};
