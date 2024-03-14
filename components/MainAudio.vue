<script setup>
import { useMainStore } from '#imports';

const store = useMainStore()
const { $on, $off } = useNuxtApp()
const audioPlayer = ref(null)
const isMuted = ref(true)

$on("main-touch-and-click", handleGlobalClick)

$on("video-played", () => {
    isMuted.value = true
})

$on("video-paused", () => {
    if( store.userWantsAudio ){
        isMuted.value = false
    }
})

function handleGlobalClick(){
    isMuted.value = false
    store.setUserWantsAudio(true)
    audioPlayer.value.play()
    $off("main-touch-and-click", handleGlobalClick)
}

function handleAudioClick(){
    isMuted.value = !isMuted.value
    store.setUserWantsAudio(!isMuted.value)
}

watch(isMuted, newVal => {
    console.log("audio: isMuted changed to : ", newVal)
    if( newVal ){
        audioPlayer.value.pause()
    } else {
        audioPlayer.value.play()
    }
})

</script>

<template>
    <div class="audio-wrapper">
        <div class="audio-inner" @click="handleAudioClick">
            <IconsSound class="icon" :class="{ isMuted }" width="3rem" height="3rem"/>
            <audio 
                ref="audioPlayer"
                class="player"
                controls
                src="/audios/main.mp3"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.audio {
    &-wrapper {
        position: relative;
        z-index: 500;
    }

    &-inner {
        padding: 1rem;
        border-radius: 50% 0 0 50%;
        background-color: var(--color-main-10);
        cursor: pointer;

        audio {
            display: none;
        }

        .icon {
            opacity: 1;

            transition: opacity var(--transitionDurationMediumPlus);

            &.isMuted {
                opacity: 0.25;
            }
        }
    }

}

</style>
