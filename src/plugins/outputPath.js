const { basename, dirname, join, normalize } = require('path');

exports.computeOutputPath = function rewrite() {
  return function(files, metalsmith) {
    Object.values(files).forEach(file => {
      const { defaultLanguage } = metalsmith.metadata();
      let outputPath = newOutputPath(file);
      if (file.i18n.language !== defaultLanguage) {
        outputPath = normalize(join(file.i18n.language, outputPath));
      }
      // Store the output path and url on the file
      file.outputPath = outputPath;
      file.outputUrl = '/' + normalize(outputPath).replace('index.html', '');
    });
  };
};

exports.moveToOutputPath = function moveToOutputPath() {
  return function(files) {
    Object.entries(files).forEach(([currentPath, file]) => {
      if (file.outputPath) {
        delete files[currentPath];
        if (files[file.outputPath]) {
          throw new DuplicateOutput(
            file.outputPath,
            file,
            files[file.outputPath]
          );
        }
        files[file.outputPath] = file;
      }
    });
  };
};

class DuplicateOutput extends Error {
  constructor(outputPath, fileA, fileB) {
    super(`
      Duplicate output at ${outputPath}.

      - ${fileA.pathInfo.path}
      - ${fileB.pathInfo.path}
    `);
  }
}

function newOutputPath(file) {
  const slug = file.slug || basename(file.i18n.key);
  const path = dirname(file.i18n.key);

  const extension = file.pathInfo.extensionList[0];

  // Only process extensions that'll output HTML
  if (extension == 'md' || extension == 'html' || extension == 'pug') {
    // Only handle the `index` case when outputing HTML
    if (slug === 'index') {
      return join(path, 'index.html');
    } else {
      return join(path, slug, 'index.html');
    }
  }

  // Keep the extensions if there are any
  if (extension) {
    return join(path, `${slug}.${extension}`);
  }
  return join(path, slug);
}
