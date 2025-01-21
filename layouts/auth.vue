<template>
    <div class="layout">
        <main >
            <slot />
        </main>
    </div>
</template>

<script setup>
definePageMeta({
  layoutTransition: {
    name: 'layout',
  }
})
</script>


<style lang="scss" scoped>
</style>