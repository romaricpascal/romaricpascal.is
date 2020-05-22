// Code goes here
const metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const pathInfo = require('./plugins/pathInfo');
const detectLanguage = require('./plugins/detectLanguage');

metalsmith(process.cwd())
  .source('./content')
  .destination('./site')
  .metadata({
    i18n: {
      defaultLanguage: 'en',
      languages: ['en', 'fr']
    }
  })
  .use(pathInfo())
  .use(detectLanguage())
  .use(inPlace())
  .use(
    layouts({
      pattern: ['*', '**/*', '!*.css'],
      default: 'site.pug'
    })
  )
  .use(permalinks())
  .build(function(err) {
    if (err) throw err;
  });
