const { format } = require('date-fns');

module.exports = function formatDate(date, formatOrOptions, options = {}) {
  if (typeof formatOrOptions === 'string') {
    return formatDate(date, {
      format: formatOrOptions,
      ...options
    });
  }
  // A little mapping between date-fns locales and our languages
  let { format: formatStr, locale = 'en' } = formatOrOptions;
  if (locale === 'en') {
    locale = 'enGB';
  }
  const localeConfiguration = require('date-fns/locale')[locale];
  if (!formatStr) {
    formatStr = localeConfiguration.formatLong
      .dateTime()
      .replace('{{date}}', localeConfiguration.formatLong.date())
      .replace('{{time}}', localeConfiguration.formatLong.time());
  }
  return format(date, formatStr, {
    locale: localeConfiguration
  });
};
