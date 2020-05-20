// Code goes here
const metalsmith = require('metalsmith');

metalsmith(process.cwd())
  .source('./content')
  .destination('./site')
  .build(function(err) {
    if (err) throw err;
  });
