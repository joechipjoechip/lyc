<script setup>
import Navigation from '@/components/navigation.vue';

useHead({
  htmlAttrs: {
    class: 'dark'
  },
})
</script>

<template>
    <div class="layout-default">
        <Navigation />
        <main>
            <NuxtPage />
        </main>
    </div>
</template>

<style lang="scss" scoped>
.layout-default {
    position: relative;

    main {
        border: solid 1px blue;
        margin-top: $layoutNavHeightDesktop;
    }
}

</style>