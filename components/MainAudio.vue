<script setup>
import { useMainStore } from '#imports';

const store = useMainStore()
const { $on, $off } = useNuxtApp()
const audioPlayer = ref(null)
const isMuted = ref(false)

$on("main-touch-and-click", handleGlobalClick)

function handleGlobalClick(){
    console.log("global click")
    audioPlayer.value.play()
    $off("main-touch-and-click", handleGlobalClick)
}

function handleAudioClick(){
    if( !isMuted.value ){
        store.setUserWantAudio(true)
    } else {
        store.setUserWantAudio(false)
    }
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
        <div class="audio-inner">
            <audio 
                ref="audioPlayer"
                class="player"
                controls
                src="/audios/main.mp3"
                @click="handleAudioClick"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.audio-wrapper {
    position: relative;
    z-index: 500;
}
</style>
