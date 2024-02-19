<script setup>
import Navigation from '@/components/navigation.vue';
import { gyroDetection, gyroPermission } from "@/composables/getGyro";

const clickWallIsDisplayed = ref(false)
const responseGyro = ref()
const gyroDetected = ref(gyroDetection())

if( gyroDetected.value ){
    clickWallIsDisplayed.value = true
}

function handleClickWallClick(){
    
    window.DeviceMotionEvent.requestPermission()
            .then( response => {
                // (optional) Do something after API prompt dismissed.
                if ( response === "granted" ) {
                    responseGyro.value = response
                } else {
                    responseGyro.value = response
                }
            })
            .catch(error => {
                responseGyro.value = error
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
            gyro detected : {{ gyroDetected }}<br>
            azy click : {{ responseGyro }}
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
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: pink;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
}

</style>