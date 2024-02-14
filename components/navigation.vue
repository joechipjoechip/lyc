<script setup>
</script>

<template>
    <nav class="nav-wrapper">
        <div class="nav-logo">
            <img src="/images/core/logo-chrome.png" alt="">
            <img src="/images/core/logo-typo-chrome.png" alt="">
        </div>
        <div class="nav-inner">
            <NuxtLink to="/contact">Marketplace</NuxtLink>
            <NuxtLink to="/">Whitepaper</NuxtLink>
            <NuxtLink to="/">About us</NuxtLink>
            <NuxtLink to="/">Sign in</NuxtLink>
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
            
            background-color: var(--color-contrast-30);
            backdrop-filter: blur(8px);
        }

        &-logo {
            position: absolute;
            top: 1rem;
            left: 2rem;

            img {
                height: calc($layoutNavHeightDesktop - 2rem);
                margin-right: 1rem;
                
                &:last-of-type {
                    margin-right: 0;
                }
            }
        }

        &-inner {
            // border: solid 1px red;
            margin-right: 2rem;

            * {
                font-size: var(--font-size-big-plus);
                text-transform: uppercase;
                color: var(--color-main-100);

                text-decoration: none;
                margin: 0 3rem;
    
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
