import rehype from 'rehype'
import removeNuxt from '../../rehype/remove-nuxt'
import unwrap, { DEFAULT_SELECTOR } from '../../rehype/hast-util-unwrap'
import stripComments from '../../rehype/strip-comments'

export default function () {
  const { nuxt } = this

  const options = nuxt.options.noNuxtClient || {}

  nuxt.hook('render:route', remove)

  async function remove(url, result, context) {
    if (result.html) {
      const res = await rehype()
        .use(removeNuxt, options.removeNuxt)
        .use(unwrap, {
          selector: `${DEFAULT_SELECTOR},.nuxt-content, #__nuxt, #__layout`,
        })
        .use(stripComments)
        .process(result.html)
      result.html = res.contents
    }
  }
}
