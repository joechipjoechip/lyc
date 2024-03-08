<script setup>
import { useElementVisibility } from '@vueuse/core';
import { useMainStore } from '#imports';
const store = useMainStore()

const props = defineProps({
    videoUrl: {
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
    }
})

const playerHaveBeenPaused = ref(false)
const player = ref(null)
const isVisible = useElementVisibility(player)
const curtainIsActive = ref(false)

watch(isVisible, (value) => {
    if (value) {

        if( props.videoName === "master" ){
            if( !playerHaveBeenPaused.value ){
                actPlay()
            }
        } else {
            actPlay()
        }

    } else {
        player.value.pause()
    }
})

function handlePlay(){
    console.log("play triggered")
    curtainIsActive.value = false
}

function actPlay(){
    player.value.play()
    .then(() => {
        // curtainIsActive.value = false
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
    <section 
        class="video-wrapper"
        :class="`${props.videoName}`"
    >
        <div 
            class="curtain"
            :class="{ 'curtain-active': curtainIsActive }"
            @click="handleCurtainClick"
        >
            <IconsPlay class="icon" />
        </div>
        <video 
            ref="player"
            class="player"
            :src="videoUrl"
            playsinline
            @play="handlePlay"
            @pause="handePause"
            :autoplay="!controls"
            :controls="controls"
            :muted="!controls"
            :loop="!controls"
        />
    </section>
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
    &.curtain-active {
        pointer-events: all;
        opacity: 1;
    }

}

</style>
