<template>
  <div class="layout">
    <LayoutHeader />
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  width: 100%;
  height: 100svh;
  max-width: 1200px;
  padding: 0 1em;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
}
</style>