module.exports = function detectLanguage({
  languageInfo = getLanguageInfo
} = {}) {
  return function(files, metalsmith) {
    const config = metalsmith.metadata();

    Object.values(files).forEach(file => {
      file.i18n = languageInfo(file, config);
    });
  };
};

function getLanguageInfo(file, options) {
  return (
    filenameSuffix(file, options) ||
    pathPrefix(file, options) ||
    defaultLanguageInfo(file, options)
  );
}

function defaultLanguageInfo(file, { defaultLanguage = 'en' } = {}) {
  return {
    key: file.pathInfo.stem,
    language: defaultLanguage
  };
}

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
  }
}

function filenameSuffix(file, { separator = '--', languages } = {}) {
  const suffix = new RegExp(`(.*)${separator}(${languages.join('|')})`);
  const result = suffix.exec(file.pathInfo.stem);
  if (result) {
    return {
      language: result[2],
      key: result[1]
    };
  }
}
