<script setup>
import navData from "@/assets/data/navData.js"
// console.log("navData", navData)

// @TODO

</script>

<template>
    <nav class="nav-wrapper">

        <div class="nav-inner">
            <NuxtLink 
                v-for="navItem in navData" :key="navItem.id"
                :to="navItem.route"
            >
                {{ navItem.name }}
            </NuxtLink>
        </div>
        
    </nav>
</template>

<style lang="scss" scoped>
    // .nav {

    //     &-wrapper {
    //         position: fixed;
    //         top: 0;
    //         width: 100%;
    //         height: $layoutNavHeightDesktop;
    //         display: flex;
    //         flex-flow: row nowrap;
    //         justify-content: flex-end;
    //         align-items: center;
            
    //         background-color: var(--color-contrast-30);
    //         backdrop-filter: blur(8px);
    //     }

    //     &-logo {
    //         position: absolute;
    //         top: 1rem;
    //         left: 2rem;

    //         img {
    //             height: calc($layoutNavHeightDesktop - 2rem);
    //             margin-right: 1rem;
                
    //             &:last-of-type {
    //                 margin-right: 0;
    //             }
    //         }
    //     }

    //     &-inner {
    //         // border: solid 1px red;
    //         margin-right: 2rem;

    //         * {
    //             font-size: var(--font-size-big-plus);
    //             text-transform: uppercase;
    //             color: var(--color-main-100);

    //             text-decoration: none;
    //             margin: 0 3rem;
    
    //             &:first-of-type {
    //                 margin-left: 0;
    //             }
    
    //             &:last-of-type {
    //                 margin-right: 0;
    //             }
    //         }

    //     }

    // }
</style>
