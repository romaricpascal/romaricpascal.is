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
    siteUrl: 'http://romaricpascal.is',
    siteTitle: 'Romaric Pascal',
    defaultLanguage: 'en',
    languages: ['en', 'fr'],
    dateFormats: {
      en: date => FORMATTERS.en.format(date),
      fr: date => FORMATTERS.fr.format(date)
    },
    forHire: false,
    noForHireCTA: false,
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
      },
      forHireHeading: {
        en: 'Available for your projects',
        fr: 'Disponible pour vos projets'
      },
      forHireContent: {
        en: `
          I'm currently <a href="/me#available-for-your-projects">available for new projects or a new role</a>. 
          I'd be happy to chat about how I could help, so don't hesitate to
          <a href="mailto:hello@romaricpascal.is">get in touch</a>.
        `,
        fr: `
          Je suis actuellement <a href="/fr/a-propos#disponible-pour-vos-projets">disponible pour de nouveaux projets ou un nouveau poste</a>.
          Je serais heureux de discutter de l'aide que je pourrais vous apporter, n'hésitez donc pas à <a href="mailto:hello@romaricpascal.is">me contacter</a>.
        `
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
        plugins: [
          require('remark-hreflang'),
          require('remark-slug'),
          require('remark-autolink-headings'),
          function() {
            return require('remark-rehype')({
              allowDangerousHtml: true
            });
          },
          require('rehype-raw'),
          require('rehype-hreflang'),
          require('./rehype/well-known-urls'),
          require('./rehype/code-blocks'),
          require('./rehype/normalize-whitespace'),
          function() {
            return require('rehype-highlight')({ ignoreMissing: true });
          },
          require('rehype-stringify')
        ]
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
