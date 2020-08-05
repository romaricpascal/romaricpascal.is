// Code goes here
const metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const pathInfo = require('./plugins/pathInfo');
const defaultDate = require('./plugins/defaultDate');
const detectLanguage = require('./plugins/detectLanguage');
const { computeOutputPath, moveToOutputPath } = require('./plugins/outputPath');
const group = require('./plugins/group');

const FORMATTERS = {
  en: new Intl.DateTimeFormat('en-gb', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }),
  fr: new Intl.DateTimeFormat('fr', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
};

metalsmith(process.cwd())
  .source('./content')
  .destination('./site')
  .metadata({
    siteUrl: 'http://localhost:3000',
    siteTitle: 'Romaric Pascal',
    defaultLanguage: 'en',
    languages: ['en', 'fr'],
    dateFormats: {
      en: date => FORMATTERS.en.format(date),
      fr: date => FORMATTERS.fr.format(date)
    },
    messages: {
      languageSwitcher: {
        en: 'English',
        fr: 'Français'
      },
      languageSwitcherLabel: {
        en: 'Languages',
        fr: 'Langues'
      },
      skipLinkLabel: {
        en: 'Skip to content',
        fr: 'Aller au contenu'
      },
      mastodonHandle: {
        en: 'website',
        fr: 'siteweb'
      }
    },
    get: require('lodash/get')
  })
  .use(pathInfo())
  .use(detectLanguage())
  .use(defaultDate())
  .use(computeOutputPath())
  .use(function(files) {
    Object.entries(files).forEach(function([key, file]) {
      if (new Date() - file.date < 0) {
        delete files[key];
      }
    });
  })
  .use(group())
  .use(
    inPlace({
      engineOptions: {
        plugins: [require('remark-slug'), require('remark-autolink-headings')]
      }
    })
  )
  .use(
    layouts({
      pattern: ['*.html', '**/*.html'],
      default: 'site.pug'
    })
  )
  .use(moveToOutputPath())
  .build(function(err) {
    if (err) throw err;
  });
