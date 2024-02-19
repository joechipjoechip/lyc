<script setup>
import { gyroDetection, gyroPermission, addGyroListeners } from "@/composables/gyroHelpers";
import { useMainStore } from "@/stores/main"

const store = useMainStore()

const clickWallIsDisplayed = ref(false)
const gyroDetected = ref(false)

onMounted(() => {
    gyroDetected.value = gyroDetection()

    if( gyroDetected.value ){
        clickWallIsDisplayed.value = true
    }
})


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
            v-if="clickWallIsDisplayed && store.isMobile"
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


    .nav {
        z-index: 100;
    }
    
    main {
        z-index: 90;
        // border: solid 1px blue;
        padding-top: calc($layoutNavHeightDesktop + 3rem);
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