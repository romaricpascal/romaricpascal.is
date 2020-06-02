// Code goes here
const metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const pathInfo = require('./plugins/pathInfo');
const defaultDate = require('./plugins/defaultDate');
const detectLanguage = require('./plugins/detectLanguage');
const { computeOutputPath, move } = require('./plugins/rewrite');
const group = require('./plugins/group');

metalsmith(process.cwd())
  .source('./content')
  .destination('./site')
  .metadata({
    siteUrl: 'http://localhost:3000',
    siteTitle: 'Romaric Pascal',
    defaultLanguage: 'en',
    languages: ['en', 'fr'],
    messages: {
      languageSwitcher: {
        en: 'English',
        fr: 'Francais'
      },
      mastodonHandle: {
        en: 'website',
        fr: 'siteweb'
      }
    },
    get: require('lodash/get'),
    formatDate: require('./helpers/formatDate')
  })
  .use(pathInfo())
  .use(detectLanguage())
  .use(group())
  .use(defaultDate())
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
