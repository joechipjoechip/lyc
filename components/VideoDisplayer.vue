<script setup>
import { useElementVisibility } from '@vueuse/core';

const props = defineProps({
    videoUrl: {
        type: String,
        required: true
    }
})

const player = ref(null)
const isVisible = useElementVisibility(player)

watch(isVisible, (value) => {
    if (value) {
        player.value.play()
    } else {
        player.value.pause()
    }
})

</script>

<template>
    <div class="video-wrapper">
        <video 
            ref="player"
            :src="videoUrl"
            playsinline
            controls
        ></video>
    </div>
</template>

<style lang="scss" scoped>
.video {
    &-wrapper {
        position: relative;
        width: 100%;
        height: 100vh;
        margin-top: calc($dividerVertical * 2);

        video {
            display: block;
            width: 100%;
            max-width: calc($layoutMaxWidthDesktop * 0.75);
            margin: 0 auto;
        }
    }
}
</style>
