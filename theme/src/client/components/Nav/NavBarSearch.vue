<template>
  <div class="navbar-search">
    <DocSearch />
  </div>
</template>

<style>
.navbar-search {
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .navbar-search {
    flex-grow: 1;
    padding-left: 24px;
  }
}

@media (min-width: 960px) {
  .navbar-search {
    padding-left: 32px;
  }
}

/* plugin-docsearch */
.DocSearch {
  --docsearch-primary-color: var(--vp-c-brand-1);
  --docsearch-highlight-color: var(--docsearch-primary-color);
  --docsearch-text-color: var(--vp-c-text-1);
  --docsearch-muted-color: var(--vp-c-text-2);
  --docsearch-searchbox-shadow: none;
  --docsearch-searchbox-background: var(--vp-c-default-soft);
  --docsearch-searchbox-focus-background: var(--vp-c-default-3);
  --docsearch-key-gradient: transparent;
  --docsearch-key-shadow: none;
  --docsearch-modal-background: var(--vp-c-bg-soft);
  --docsearch-footer-background: var(--vp-c-bg);
}

.dark .DocSearch {
  --docsearch-modal-shadow: none;
  --docsearch-footer-shadow: none;
  --docsearch-logo-color: var(--vp-c-text-2);
  --docsearch-hit-background: var(--vp-c-default-soft);
  --docsearch-hit-color: var(--vp-c-text-2);
  --docsearch-hit-shadow: none;
}

.navbar-search .DocSearch-Button {
  display: flex;
  justify-content: center !important;
  align-items: center;
  margin: 0;
  padding: 0;
  width: 32px;
  height: 32px;
  background: var(--docsearch-searchbox-background);
  transition: border-color 0.25s;
}

.navbar-search .DocSearch-Button:hover {
  background: var(--docsearch-searchbox-focus-background);
}

.navbar-search .DocSearch-Button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color;
}

.navbar-search .DocSearch-Button:focus:not(:focus-visible) {
  outline: none !important;
}

.navbar-search #docsearch-container {
    min-width: 32px;
  }

@media (min-width: 768px) {
  .navbar-search .DocSearch-Button {
    justify-content: flex-start;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 0 10px 0 12px;
    width: 100%;
    height: 40px;
    background-color: var(--vp-c-bg-alt);
  }

  .navbar-search .DocSearch-Button:hover {
    border-color: var(--vp-c-brand-1);
    background: var(--docsearch-searchbox-focus-background);
  }
}

.DocSearch-Button .DocSearch-Button-Container {
  display: flex;
  align-items: center;
}

.DocSearch-Button .DocSearch-Search-Icon {
  position: relative;
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-1);
  fill: currentColor;
  transition: color 0.5s;
}

.DocSearch-Button:hover .DocSearch-Search-Icon {
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .DocSearch-Button .DocSearch-Search-Icon {
    top: 1px;
    margin-right: 8px;
    width: 14px;
    height: 14px;
    color: var(--vp-c-text-2);
  }
}

.DocSearch-Button .DocSearch-Button-Placeholder {
  display: none;
  margin-top: 2px;
  padding: 0 16px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
}

.DocSearch-Button:hover .DocSearch-Button-Placeholder {
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .DocSearch-Button .DocSearch-Button-Placeholder {
    display: inline-block;
  }
}

.DocSearch-Button .DocSearch-Button-Keys {
  /*rtl:ignore*/
  direction: ltr;
  display: none;
  min-width: auto;
}

@media (min-width: 768px) {
  .DocSearch-Button .DocSearch-Button-Keys {
    display: flex;
    align-items: center;
  }
}

.DocSearch-Button .DocSearch-Button-Key {
  display: block;
  margin: 2px 0 0 0;
  border: 1px solid var(--vp-c-divider);
  /*rtl:begin:ignore*/
  border-right: none;
  border-radius: 4px 0 0 4px;
  padding-left: 6px;
  /*rtl:end:ignore*/
  min-width: 0;
  width: auto;
  height: 22px;
  line-height: 22px;
  font-family: var(--vp-font-family-base);
  font-size: 12px;
  font-weight: 500;
  transition: color 0.5s, border-color 0.5s;
}

.DocSearch-Button .DocSearch-Button-Key + .DocSearch-Button-Key {
  /*rtl:begin:ignore*/
  border-right: 1px solid var(--vp-c-divider);
  border-left: none;
  border-radius: 0 4px 4px 0;
  padding-left: 2px;
  padding-right: 6px;
  /*rtl:end:ignore*/
}

.DocSearch-Button .DocSearch-Button-Key:first-child {
  font-size: 1px;
  letter-spacing: -12px;
  color: transparent;
}

.DocSearch-Button .DocSearch-Button-Key:first-child:after {
  font-size: 12px;
  letter-spacing: normal;
  color: var(--docsearch-muted-color);
}

.DocSearch-Button .DocSearch-Button-Key:first-child > * {
  display: none;
}

.dark .DocSearch-Footer {
  border-top: 1px solid var(--vp-c-divider);
}

.DocSearch-Form {
  border: 1px solid var(--vp-c-brand-1);
  background-color: var(--vp-c-white);
}

.dark .DocSearch-Form {
  background-color: var(--vp-c-bg-soft);
}

/* plugin-docsearch */

/* plugin-search */
.navbar-search .search-box input {
  padding: 0 0.3rem 0 1.575rem;
  background-position: 0.5rem 0.4rem;
}
/* plugin-search */
</style>
