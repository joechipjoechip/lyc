<script setup>
import { handleAnchorNav } from "@/composables/anchorNav"

function handleCLickLogo( event ){
    handleAnchorNav(event)
}

</script>

<template>
    <nav class="nav-wrapper">

        <div class="nav-logo" @click="handleCLickLogo" data-anchor="#portal">
            <img src="/images/core/logo-chrome.png" alt="">
            <img src="/images/core/logo-typo-chrome.png" alt="">
        </div>

        <MicroNavCore type="top" />
        
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
            cursor: pointer;
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
    }
    
</style>
