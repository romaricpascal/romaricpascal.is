module.exports = function detectLanguage({ languageInfo = pathPrefix } = {}) {
  return function(files, metalsmith) {
    const { i18n } = metalsmith.metadata();

    Object.values(files).forEach(file => {
      file.i18n = languageInfo(file, i18n);
    });
  };
};

function pathPrefix(
  file,
  { defaultLanguage = 'en', languages = [defaultLanguage] } = {}
) {
  const prefix = new RegExp(`^(${languages.join('|')})/(.*)`);
  const result = prefix.exec(file.pathInfo.stem);
  if (result) {
    return {
      language: result[1],
      key: result[2]
    };
  } else {
    return {
      language: defaultLanguage,
      key: file.pathInfo.stem
    };
  }
}
