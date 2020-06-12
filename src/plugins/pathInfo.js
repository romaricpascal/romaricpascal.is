const { dirname, basename, join } = require('path');

/**
 * A metalsmith plugin to provide path breakdown
 */
module.exports = function pathInfo() {
  return function(files) {
    Object.keys(files).forEach(filePath => {
      files[filePath].pathInfo = getPathInfo(filePath);
    });
  };
};

function getPathInfo(filePath) {
  const dirName = dirname(filePath);
  const fileName = basename(filePath);
  const [baseName, ...extensionsList] = fileName.split('.');
  return {
    path: filePath,
    stem: join(dirName, baseName),
    extension: extensionsList[extensionsList.length - 1] || '',
    extensions: extensionsList.join('.'),
    extensionList: extensionsList,
    dirName,
    fileName,
    baseName
  };
}
