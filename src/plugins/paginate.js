const chunk = require('lodash/chunk');
const { compareDesc } = require('date-fns');
const { join } = require('path');

module.exports = function() {
  return function(files, metalsmith) {
    const { groups } = metalsmith.metadata();
    Object.values(files).forEach(file => {
      if (file.i18n.key === 'posts/index') {
        const pagedCollection = createPagedCollection(
          file.i18n.language,
          groups
        );
        let pages = [];
        pagedCollection.forEach(function(page, pageIndex) {
          const newPage = {
            ...file,
            pathInfo: {
              ...file.pathInfo,
              dirName: join(file.pathInfo.dirName, `page/${pageIndex + 1}`),
              path: join(
                file.pathInfo.dirName,
                `page/${pageIndex + 1}`,
                file.pathInfo.fileName
              ),
              stem: join(
                file.pathInfo.dirName,
                `page/${pageIndex + 1}`,
                file.pathInfo.baseName
              )
            },
            i18n: {
              ...file.i18n,
              key: join(
                file.pathInfo.dirName,
                `page/${pageIndex + 1}`,
                file.pathInfo.baseName
              )
            },
            pageSource: file,
            page,
            pages,
            pagedCollection,
            pageIndex
          };
          files[newPage.pathInfo.path] = newPage;
        });
      }
    });
  };
};

function createPagedCollection(language, groups) {
  return chunk(
    groups.byLanguageByType[language]['post'].sort(function(a, b) {
      return compareDesc(a.date, b.date);
    }),
    10
  );
}
