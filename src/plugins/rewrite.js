const { basename, dirname } = require('path');

exports.computeOutputPath = function rewrite() {
  return function(files, metalsmith) {
    Object.values(files).forEach(file => {
      const { defaultLanguage } = metalsmith.metadata();
      let outputPath = newOutputPath(file);
      if (file.i18n.language !== defaultLanguage) {
        outputPath = `${file.i18n.language}/${outputPath}`;
      }
      // Store the output path and url on the file
      file.outputPath = outputPath;
      file.outputUrl = outputPath.replace('index.html', '');
    });
  };
};

exports.move = function move() {
  return function(files) {
    Object.entries(files).forEach(([currentPath, file]) => {
      if (file.outputPath) {
        delete files[currentPath];
        files[file.outputPath] = file;
      }
    });
  };
};

function newOutputPath(file) {
  const slug = file.slug || basename(file.i18n.key);
  const path = dirname(file.i18n.key);
  const extension = file.pathInfo.extensionList[0];

  if (extension == 'md' || extension == 'html') {
    if (slug === 'index') {
      return `${path}/index.html`;
    } else {
      return `${path}/${slug}/index.html`;
    }
  } else if (extension) {
    return `${path}/${slug}.${extension}`;
  }
  return `${path}/${slug}`;
}
