<script setup>
</script>

<template>
    <nav>
        <NuxtLink to="/">home</NuxtLink>
        <NuxtLink to="/contact">contact</NuxtLink>
    </nav>
</template>

<style lang="scss" scoped>
    nav {
        // border: solid 2px red;
        height: $layoutNavHeightDesktop;
        position: fixed;
        top: 0;
        width: 100%;
        text-align: right;

        background-color: var(--color-main-30);
        backdrop-filter: blur(8px);

        * {
            color: var(--color-main-90);
            margin: 0 2rem;

            &:first-of-type {
                margin-left: 0;
            }

            &:last-of-type {
                margin-right: 0;
            }
        }
    }
</style>
