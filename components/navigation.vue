<script setup>
</script>

<template>
    <nav class="nav-wrapper">
        <div class="nav-inner">
            <NuxtLink to="/">home</NuxtLink>
            <NuxtLink to="/contact">contact</NuxtLink>
        </div>
    </nav>
</template>

<style lang="scss" scoped>
    .nav {

        &-wrapper {
            position: fixed;
            top: 0;
            width: 100%;
            height: $layoutNavHeightDesktop;
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-end;
            align-items: center;
            
            background-color: var(--color-main-30);
            backdrop-filter: blur(8px);
        }

        &-inner {
            border: solid 1px red;
            margin-right: 2rem;

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

    }
</style>
