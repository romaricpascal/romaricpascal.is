// Code goes here
const metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');

metalsmith(process.cwd())
  .source('./content')
  .destination('./site')
  .use(inPlace())
  .use(
    layouts({
      pattern: ['*', '**/*', '!*.css'],
      default: 'site.pug'
    })
  )
  .build(function(err) {
    if (err) throw err;
  });
