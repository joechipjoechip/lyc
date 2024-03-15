<script setup>
import { useElementVisibility } from '@vueuse/core';
import { useMainStore } from '#imports';
const store = useMainStore()
const { $emit } = useNuxtApp()

const props = defineProps({
    videoFileName: {
        type: String,
        required: true
    },
    videoName: {
        type: String,
        required: true
    },
    controls: {
        type: Boolean,
        default: true
    },
    checkVisibility: {
        type: Boolean,
        default: false
    }
})

const playerHaveBeenPaused = ref(false)
const wrapper = ref(null)
const player = ref(null)
const isVisible = useElementVisibility(wrapper)
const curtainIsActive = ref(false)
const muted = ref(!props.controls)
const device = ref(store.isMobile ? "mobile" : "desktop")

if( props.checkVisibility ){
    watch(isVisible, (newVal) => {
        if (newVal) {
            actPlay()
        } else {
            player.value.pause()
        }
    })
}

function handlePlay(){
    // console.log("play triggered")
    curtainIsActive.value = false
}

function handlePause(){
    // console.log("pause triggered")
    playerHaveBeenPaused.value = true

    $emit("video-paused", {})
}

function actPlay(){
    player.value.play()
    .then(() => {
        // curtainIsActive.value = false
        if( !muted ){
            // add condition : && if user want audio
            // play the audio
            
        }
        $emit("video-played", {})
        // console.log("video : emit envoyé played")
    })
    .catch(() => {
        console.log("display curtain video")
        curtainIsActive.value = true
    })
}

function handleCurtainClick(){
    curtainIsActive.value = false
    actPlay()
}

</script>

<template>
    <div 
        ref="wrapper"
        class="video-wrapper"
        :class="`${props.videoName}`"
    >
        <div 
            class="curtain"
            :class="{ curtainIsActive }"
            @click="handleCurtainClick"
        >
            <IconsPlay class="icon" />
        </div>
        <video 
            ref="player"
            class="player"
            :src="`/videos/${device}/${videoFileName}`"
            playsinline
            @play="handlePlay"
            @pause="handlePause"
            :controls="controls"
            :autoplay="muted"
            :muted="muted"
            :loop="!controls"
        />
    </div>
</template>

<style lang="scss" scoped>
.video {
    &-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        margin-top: $dividerVertical;

        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;

        &.master {
            .player {
                max-width: calc($layoutMaxWidthDesktop * 0.75);
            }
        }
    }
}

.player {
    z-index: 40;
    position: relative;
    display: block;
    width: 100%;
    margin: 0 auto;
}

.curtain {
    z-index: 50;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-contrast-75);
    pointer-events: none;
    
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    
    opacity: 0;

    transition: opacity var(--transitionDurationMediumPlus);
    &.curtainIsActive {
        pointer-events: all;
        opacity: 1;
    }

}

</style>
