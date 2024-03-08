<script setup>
import { gsap } from 'gsap';
import { useGetEventPosition } from '@/composables/getEventPosition'
import { useNormalizePosition } from '@/composables/getNormalizedPosition'

import { useLocalStorageStore } from '@/stores/localStorageStore';
const store = useLocalStorageStore()

const props = defineProps({
    wording: {
        type: Object,
        required: true
    }
})

const { $on } = useNuxtApp()
const isHovered = ref(false)

$on("main-touch-move", handleTouchMove)
const normalizedPosition = reactive({ x: 0, y: 0 })

function handleTouchMove(event){
    if( store.gyroIsAllowed ){ return }
    if( !store.gyroIsAllowed && !isHovered.value ){ return }

    const { x, y } = useGetEventPosition(event)
    const { normalizedX, normalizedY } = useNormalizePosition(x, y)
    normalizedPosition.x = normalizedX
    normalizedPosition.y = normalizedY
}

// - - - - 
$on("main-device-motion", handleGyro)

function handleGyro(event){
    const { x, y, z } = event.accelerationIncludingGravity
    const animatedObject = { x: normalizedPosition.x, y: normalizedPosition.y }

    gsap.to(animatedObject, {
        x: x/4,
        y: y/6,
        duration: 0.2,
        ease: "linear",
        onUpdate: () => {
            normalizedPosition.x = animatedObject.x
            normalizedPosition.y = animatedObject.y
        }
    })
}

</script>

<template>
    <section 
        id="key"
        class="key-wrapper"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >

        <div class="key-inner">
            <MicroHud 
                :text="wording.cta" 
                class="hud" 
                :isHovered="isHovered"
            />
    
            <h6 class="title" v-html="wording.title"></h6>
    
            <div class="paragraph" v-for="paragraph in wording.paragraphs" :key="paragraph.id">
                <p v-for="line in paragraph" :key="line.id">
                    {{ line }}
                </p>
            </div>
    
            <img src="/images/core/logo-chrome-typo-and-visu.png" alt="logo lyc">
        </div>

        <VideoDisplayer 
            videoUrl="/videos/key.mp4" 
            videoName="key"
            :controls="false"
            class="video"
        />

    </section>

</template>

<style lang="scss" scoped>
    .key {
        &-wrapper {
            position: relative;
            width: 100%;
            max-width: $layoutMaxWidthDesktop;
            margin: 0 auto;

            @media #{ $mobile } {
                min-height: 50vh;
            }
        }

        &-inner {
            z-index: 50;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            font-size: var(--font-size-big);
            color: var(--color-main-80);

            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
        }
    }

    .title,
    .paragraph,
    img {
        z-index: 50;
        text-transform: uppercase;
        font-family: 'Mada Bold';
        color: var(--color-main-100);
    }

    .title {
        margin-top: 5rem;
        font-size: var(--font-size-bigest-plus);
    }
    
    .paragraph {
        text-align: center;
        margin-top: 2rem;
        font-size: var(--font-size-big);

        p {
            line-height: var(--font-size-bigest);
        }
    }

    img {
        // border: solid 1px red;
        width: 35rem;
        position: absolute;
        bottom: $gutter;
        left: $gutter;

        @media #{ $mobile } {
            width: 15rem;
        }
    }

</style>