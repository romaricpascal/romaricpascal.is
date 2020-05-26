// Code goes here
const metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const pathInfo = require('./plugins/pathInfo');
const detectLanguage = require('./plugins/detectLanguage');
const rewrite = require('./plugins/rewrite');
const group = require('./plugins/group');

metalsmith(process.cwd())
  .source('./content')
  .destination('./site')
  .metadata({
    defaultLanguage: 'en',
    languages: ['en', 'fr'],
    messages: {
      languageSwitcher: {
        en: 'English',
        fr: 'Francais'
      }
    }
  })
  .use(pathInfo())
  .use(detectLanguage())
  .use(group())
  .use(inPlace())
  .use(
    layouts({
      pattern: ['*', '**/*', '!*.css'],
      default: 'site.pug'
    })
  )
  .use(rewrite())
  .use(
    permalinks({
      // Prevent copying the images linked in the content
      // to place them next to the `index.html` file
      relative: false
    })
  )
  .build(function(err) {
    if (err) throw err;
  });
