<template>
  <div class="layout">
    <LayoutHeader />

    <main class="self-stretch">
      <slot />
    </main>

    <LayoutBottomControls />
  </div>
</template>

<style scoped>
.layout {
  width: 100%;
  height: 100dvh;
  max-width: 1200px;
  padding: 0 1em;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>