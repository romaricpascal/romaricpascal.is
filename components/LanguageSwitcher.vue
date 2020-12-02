<template>
  <nav class="language-switcher" aria-labelledby="languageSwitcherHeading">
    <h2 id="languageSwitcherHeading" hidden>Language</h2>
    <nuxt-link :to="switchLocalePath('en')">English</nuxt-link>
    <nuxt-link :to="switchLocalePath('fr')">Français</nuxt-link>
  </nav>
</template>
