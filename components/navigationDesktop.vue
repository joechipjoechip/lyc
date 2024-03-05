<script setup>
import { handleAnchorNav } from "@/composables/anchorNav"

function handleCLickLogo( event ){
    console.log("logo click, event", event)
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
            justify-content: space-between;
            align-items: center;
            
            background-color: var(--color-contrast-80);
            backdrop-filter: blur(20px);
        }

        &-logo {
            cursor: pointer;
            position: relative;
            left: 2rem;
            height: 100%;

            img {
                pointer-events: none;
                position: relative;
                top: 15%;
                height: 70%;
                margin-right: 1rem;
                
                &:last-of-type {
                    margin-right: 0;
                }
            }
        }
    }
    
</style>
