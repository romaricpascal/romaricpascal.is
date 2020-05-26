// Code goes here
const metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const pathInfo = require('./plugins/pathInfo');
const detectLanguage = require('./plugins/detectLanguage');
const { computeOutputPath, move } = require('./plugins/rewrite');
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
    },
    get: require('lodash/get')
  })
  .use(pathInfo())
  .use(detectLanguage())
  .use(group())
  .use(computeOutputPath())
  .use(inPlace())
  .use(
    layouts({
      pattern: ['*', '**/*', '!*.css'],
      default: 'site.pug'
    })
  )
  .use(move())
  .build(function(err) {
    if (err) throw err;
  });
