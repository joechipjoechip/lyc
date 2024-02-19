<script setup>
import Navigation from '@/components/navigation.vue';
import { gyroDetection, gyroPermission, addGyroListeners } from "@/composables/gyroHelpers";
import { useMainStore } from "@/stores/main"

const store = useMainStore()

const clickWallIsDisplayed = ref(false)
const gyroDetected = ref(gyroDetection())
const gyroIsAllowed = ref(false)

onMounted(() => {
    if( gyroDetected.value ){
        clickWallIsDisplayed.value = true
    }
})


function handleClickWallClick(){
    gyroPermission().then(response => {
        gyroIsAllowed.value = response
        clickWallIsDisplayed.value = false
        store.setGyroIsAllowed(gyroIsAllowed.value)

        if( gyroIsAllowed.value ){
            addGyroListeners()
        }
    })
}

</script>

<template>
    <div class="layout-default">
        <div 
            v-if="clickWallIsDisplayed"
            @click="handleClickWallClick"
            class="clickWall" 
        >
            welcome and click here to activate your device motions
        </div>

        <Navigation class="nav" />
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