// Code goes here
const metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');

metalsmith(process.cwd())
  .source('./content')
  .destination('./site')
  .use(inPlace())
  .build(function(err) {
    if (err) throw err;
  });
