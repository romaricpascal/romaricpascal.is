const { dirname, basename } = require('path');

/**
 * A metalsmith plugin to provide path breakdown
 */
module.exports = function pathInfo() {
  return function(files) {
    Object.keys(files).forEach(filePath => {
      // First split the extension
      files[filePath].pathInfo = getPathInfo(filePath);
    });
  };
};

function getPathInfo(filePath) {
  const [stem, ...extensionsList] = filePath.split('.');
  return {
    path: filePath,
    stem,
    extension: extensionsList[extensionsList.length - 1] || '',
    extensions: extensionsList.join('.'),
    extensionList: extensionsList,
    dirName: dirname(stem),
    baseName: basename(stem),
    fileName: basename(filePath)
  };
}
