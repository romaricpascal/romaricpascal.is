const { extname, basename, dirname } = require('path');

module.exports = function rewrite() {
  return function(files, metalsmith) {
    Object.entries(files).forEach(([outputPath, file]) => {
      const { i18n } = metalsmith.metadata();
      if (file.i18n.language !== i18n.defaultLanguage) {
        // Start with deletion in case the new output path
        // is the same as the current one
        delete files[outputPath];
        files[newOutputPath(file, extname(outputPath) || 'html')] = file;
      }
    });
  };
};

function newOutputPath(file, extension) {
  const slug = file.slug || basename(file.i18n.key);

  if (extension) {
    return `${file.i18n.language}/${dirname(
      file.i18n.key
    )}/${slug}${extension}`;
  }
  return `${file.i18n.language}/${file.i18n.key}.html`;
}
