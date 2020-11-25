/**
 * Creates a default configuration for the date translation
 * that:
 *  - sets a default format name
 *  - accounts for language being defined as `en` but Intl requiring `en-gb`
 */
export default (context, inject) => {
  inject('dt', function (date, format = 'short', locale = this.$i18n.locale) {
    console.log(locale)
    return this.$d(date, 'short', locale === 'en' ? 'en-gb' : locale)
  })
}
