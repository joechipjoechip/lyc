<script setup>
import { gyroDetection, gyroPermission, addGyroListeners } from "@/composables/gyroHelpers";
import { useMainStore } from "@/stores/main"
import { useGlobalEvents } from "@/composables/globalEvents"

const store = useMainStore()

useGlobalEvents()

const gyroDetected = ref(gyroDetection())
const clickWallIsDisplayed = ref(gyroDetected.value)

function handleClickWallClick(){

    if( store.isIOS ){
        gyroPermission().then(response => {
            if( response ){
                addGyroListeners()
                store.setGyroIsAllowed(true)
            }
        })
    } else {
        addGyroListeners()
        store.setGyroIsAllowed(true)
    }

    clickWallIsDisplayed.value = false
    
}

</script>

<template>
    <div class="layout-default">
        <div 
            v-if="clickWallIsDisplayed"
            @click="handleClickWallClick"
            class="clickWall"
        >
            welcome, click here to activate your device motions
        </div>

        <NavigationMobile v-if="store.isMobile" />
        <NavigationDesktop v-else class="nav"/>
        <main>
            <NuxtPage />
        </main>
    </div>
</template>

<style lang="scss" scoped>
.layout-default {
    position: relative;
    background-color: var(--color-contrast-100);
    min-height: 100vh;


    .nav {
        z-index: 100;
    }
    
    main {
        z-index: 90;
        // border: solid 1px blue;
        padding-top: calc($layoutNavHeightDesktop);
    }
}

.clickWall {
    z-index: 150;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: var(--color-contrast-100);
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
}

</style>