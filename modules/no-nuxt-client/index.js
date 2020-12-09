import rehype from 'rehype'
import removeNuxt from '../../rehype/remove-nuxt'
import unwrap, { DEFAULT_SELECTOR } from '../../rehype/hast-util-unwrap'
import stripComments from '../../rehype/strip-comments'

export default function () {
  const { nuxt } = this

  const options = nuxt.options.noNuxtClient || {}

  nuxt.hook('render:route', async function (url, result) {
    result.html = await remove(result.html)
  })
  nuxt.hook('generate:page', async function (page) {
    page.html = await remove(page.html)
  })

  async function remove(html) {
    if (!html) return html

    const res = await rehype()
      .use(removeNuxt, options.removeNuxt)
      .use(unwrap, {
        selector: `${DEFAULT_SELECTOR},.nuxt-content, #__nuxt, #__layout`,
      })
      .use(stripComments)
      .process(html)
    return res.contents
  }
}
