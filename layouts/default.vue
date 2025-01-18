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
  max-width: 1200px;
  padding: 0 1em;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
</style>