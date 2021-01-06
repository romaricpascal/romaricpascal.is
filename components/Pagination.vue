<i18n>
{
  "en": {
    "first": "First",
    "previous": "Newer",
    "next": "Older",
    "last": "Last"
  },
  "fr": {
    "first": "Première",
    "previous": "Plus récents",
    "next": "Plus anciens",
    "last": "Dernière"
  }
}
</i18n>

<template>
  <nav class="pagination show-current-link" aria-labelledby="pagination">
    <h2 id="pagination" hidden>Pages</h2>
    <PageLink
      v-if="showFirstAndLast"
      :page="page == firstPage ? null : firstPage"
      >{{ $t('first') }}</PageLink
    >
    <PageLink v-if="showPreviousAndNext" :page="previousPage" rel="prev">{{
      $t('previous')
    }}</PageLink>
    <slot v-if="showList">
      <ul class="pagination__pages page-list">
        <li v-for="p in lastPage" :key="p">
          <PageLink :page="p">{{ p }}</PageLink>
        </li>
      </ul>
    </slot>
    <PageLink v-if="showPreviousAndNext" :page="nextPage" rel="next">{{
      $t('next')
    }}</PageLink>
    <PageLink
      v-if="showFirstAndLast"
      :page="page == lastPage ? null : lastPage"
      >{{ $t('last') }}</PageLink
    >
  </nav>
</template>

<script>
export default {
  props: {
    page: String,
    firstPage: Number,
    lastPage: Number,
    startIndex: Number,
    endIndex: Number,
    nextPage: Number,
    previousPage: Number,
    showFirstAndLast: {
      type: Boolean,
      default: false,
    },
    showPreviousAndNext: {
      type: Boolean,
      default: true,
    },
    showList: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
