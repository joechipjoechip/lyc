<script setup>
import navData from "@/assets/data/navData.js"

console.log("navData", navData)
</script>

<template>
    <nav class="nav-wrapper">

        <div class="nav-logo">
            <img src="/images/core/logo-chrome.png" alt="">
            <img src="/images/core/logo-typo-chrome.png" alt="">
        </div>

        <div class="nav-inner">
            <NuxtLink 
                v-for="navItem in navData.filter(item => item.displayInTopNav)" :key="navItem.id"
                :to="navItem.route"
            >
                {{ navItem.name }}
            </NuxtLink>
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
            
            background-color: var(--color-contrast-80);
            backdrop-filter: blur(20px);
        }

        &-logo {
            position: absolute;
            // top: 1rem;
            left: 2rem;

            img {
                height: calc($layoutNavHeightDesktop - 1rem);
                margin-right: 1rem;
                
                &:last-of-type {
                    margin-right: 0;
                }
            }
        }

        &-inner {
            // border: solid 1px red;
            margin-right: 2rem;
            font-family: "Lexend Zetta";
            font-weight: 700;
            
            * {
                font-size: var(--font-size-medium);
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
