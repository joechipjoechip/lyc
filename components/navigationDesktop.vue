<script setup>
import navData from "@/assets/data/navData.js"
import { handleAnchorNav } from "@/composables/anchorNav"

function handleAnchorNavClick(e){
    handleAnchorNav(e)
}

</script>

<template>
    <nav class="nav-wrapper">

        <div class="nav-logo">
            <img src="/images/core/logo-chrome.png" alt="">
            <img src="/images/core/logo-typo-chrome.png" alt="">
        </div>

        <div class="nav-inner">
            <p 
                v-for="navItem in navData.filter(item => item.anchor)" :key="navItem.id"
                :data-anchor="navItem.anchor"
                class="nav-item"
                @click="handleAnchorNavClick"
            >
                {{ navItem.name }}
            </p>
            <NuxtLink 
                v-for="navItem in navData.filter(item => item.route)" :key="navItem.id"
                :to="navItem.route"
                class="nav-item"
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

            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-end;
            align-items: center
        }

        &-item {
            font-size: var(--font-size-medium);
            text-transform: uppercase;
            color: var(--color-main-100);
            cursor: pointer;

            text-decoration: none;
            margin: 0 1.75rem;

            &:first-child {
                margin-left: 0;
            }

            &:last-child {
                margin-right: 0;
            }
        }

    }
</style>
