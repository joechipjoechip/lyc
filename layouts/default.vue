<script setup>
import Navigation from '@/components/navigation.vue';
</script>

<template>
    <div class="layout-default">
        <Navigation class="nav" />
        <main>
            <NuxtPage />
        </main>
    </div>
</template>

<style lang="scss" scoped>
.layout-default {
    position: relative;
    background-color: var(--color-contrast-100);

    .nav {
        z-index: 100;
    }
    
    main {
        z-index: 90;
        // border: solid 1px blue;
        margin-top: $layoutNavHeightDesktop;
    }
}

</style>