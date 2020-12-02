export function detectLanguage(path, options) {
  return (
    filenameSuffix(path, options) ||
    pathPrefix(path, options) ||
    defaultLanguageInfo(path, options)
  )
}

function defaultLanguageInfo(path, { defaultLanguage = 'en' } = {}) {
  return {
    key: path,
    language: defaultLanguage,
  }
}

function pathPrefix(
  path,
  { defaultLanguage = 'en', languages = [defaultLanguage] } = {}
) {
  const prefix = new RegExp(`^(${languages.join('|')})/(.*)`)
  const result = prefix.exec(path)
  if (result) {
    return {
      language: result[1],
      key: result[2],
    }
  }
}

function filenameSuffix(
  path,
  {
    separator = '--',
    defaultLanguage = 'en',
    languages = [defaultLanguage],
  } = {}
) {
  const suffix = new RegExp(`(.*)${separator}(${languages.join('|')})`)
  const result = suffix.exec(path)
  if (result) {
    return {
      language: result[2],
      key: result[1],
    }
  }
}
