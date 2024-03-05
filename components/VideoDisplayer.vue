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
    }
})

const player = ref(null)
const isVisible = useElementVisibility(player)

watch(isVisible, (value) => {
    if (value) {

        if( props.videoName === "master" ){
            if( !store.videoMasterHaveBeenPaused ){
                player.value.play()
            }
        } else {
            player.value.play()
        }

    } else {
        player.value.pause()
    }
})

function handlePlay(){
    if( props.videoName === "master" ){
        store.setVideoMasterHaveBeenPaused(false)
    }
}

function handePause(){
    console.log("-- - - -  paused")
    if( props.videoName === "master" ){
        store.setVideoMasterHaveBeenPaused(true)
    }
}

</script>

<template>
    <section class="video-wrapper">
        <video 
            ref="player"
            :src="videoUrl"
            playsinline
            controls
            @pause="handePause"
        ></video>
    </section>
</template>

<style lang="scss" scoped>
.video {
    &-wrapper {
        position: relative;
        width: 100%;
        height: 100vh;
        margin-top: $dividerVertical;

        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;

        video {
            display: block;
            width: 100%;
            max-width: calc($layoutMaxWidthDesktop * 0.75);
            margin: 0 auto;
        }
    }
}
</style>
