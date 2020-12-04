<template>
  <Fragment>
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header container">
      <Navigation />
      <LanguageSwitcher />
    </header>
    <main
      id="main"
      class="prose contained-children contained-children--with-automatic-widening"
    >
      <Nuxt />
    </main>
    <footer class="site-footer" role="contentinfo">
      © 2020 Romaric Pascal -
      <a href="https://github.com/rhumaric" rel="me">Github</a>
      <a href="https://twitter.com/romaricpascal" rel="me">Twitter</a> -
      <a href="/feed.xml" rel="alternate">RSS</a>
    </footer>
  </Fragment>
</template>
