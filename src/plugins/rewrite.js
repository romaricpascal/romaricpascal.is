const { extname } = require('path');

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
  if (extension) {
    return `${file.i18n.language}/${file.i18n.key}${extension}`;
  }
  return `${file.i18n.language}/${file.i18n.key}.html`;
}
