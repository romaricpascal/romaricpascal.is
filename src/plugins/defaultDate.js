/**
 * Metalsmith plugin to set a default `date`
 * property using the file's birthtime
 */
module.exports = function defaultDate() {
  return function(files) {
    Object.values(files).forEach(file => {
      file.date = file.date || file.stats.birthtime;
    });
  };
};
