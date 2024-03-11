<script setup>
import { useMainStore } from '#imports';

const store = useMainStore()
const { $on, $off } = useNuxtApp()
const audioPlayer = ref(null)
const isMuted = ref(false)

$on("main-touch-and-click", handleGlobalClick)


function handleGlobalClick(){
    // console.log("global click")
    audioPlayer.value.play()
    $off("main-touch-and-click", handleGlobalClick)
}

function handleAudioClick(){
    isMuted.value = !isMuted.value
    store.setUserWantsAudio(!isMuted.value)
    console.log("audio clicked, isMuted: ", isMuted.value)
}

watch(isMuted, newVal => {
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
        padding: 2rem;
        border: solid 2px red;
    }

}

</style>
