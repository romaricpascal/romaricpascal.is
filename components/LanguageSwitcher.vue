<template>
  <nav
    class="language-switcher show-current-link"
    aria-labelledby="languageSwitcherHeading"
  >
    <h2 id="languageSwitcherHeading" hidden>Language</h2>
    <nuxt-link
      v-for="(locale, index) in $i18n.locales"
      :key="index"
      :exact="true"
      :to="switchLocalePath(locale.code)"
      >{{ locale.name }}</nuxt-link
    >
  </nav>
</template>
