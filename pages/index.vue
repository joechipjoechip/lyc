<script setup>
const route = useRoute()
const isVisible = ref(route.fullPath === "/")
</script>

<template>
    <div class="page-index">
        <Hero :isVisible="isVisible"/>
        <!-- here, other slots/modules -->
    </div>
</template>

<style lang="scss" scoped>
//
</style>