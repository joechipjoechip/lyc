<script setup> 
import { useGetEventPosition } from '@/composables/getEventPosition'
import { useNormalizePosition } from '@/composables/getNormalizedPosition'

const { $on } = useNuxtApp()

const wrapper = ref(null)
const translateX = ref(0)
const translateY = ref(0)
const rotateX = ref(0)
const rotateY = ref(0)
const translateXalter = ref(0)
const translateYalter = ref(0)
const rotateXalter = ref(0)
const rotateYalter = ref(0)

$on("main-touch-move", handleMove)

function handleMove(event){
    const { x, y } = useGetEventPosition(event)
    const { normalizedX, normalizedY } = useNormalizePosition(x, y)
    translateX.value = normalizedX * 1.2 + "rem"
    translateY.value = -normalizedY * 1.3 + "rem"

    rotateX.value = -normalizedY * 1.2
    rotateY.value = -normalizedX * -0.2

    translateXalter.value = normalizedX * 1.7 + "rem"
    translateYalter.value = -normalizedY * 1.5 + "rem"

    rotateXalter.value = -normalizedY * 2.4
    rotateYalter.value = -normalizedX * 9.8
}

</script>

<template>
    <section ref="wrapper" class="roadmap-wrapper">
        <h4 class="title">
            Roadmap<br>2024
        </h4>
        <VideoDisplayer 
            class="videoPlayer"
            videoName="roadmap" 
            videoUrl="/videos/roadmap.mp4" 
            :controls="false"
        />
        <div class="roadmap-inner">
            <img v-for="index in 4" :key="index"
                :src="`/images/visuals/roadmap/q${index}.png`" 
                :alt="`roadmap quarter ${index}`"
                :class="`roadmap-item q${index}`"
                :style="{ '--i': index }"
            />
        </div>
    </section>    
</template>

<style lang="scss" scoped>
.title {
    z-index: 50;
    font-size: var(--font-size-bigest-plus);
    font-family: 'Lexend Zetta';
    font-weight: 900;
    position: absolute;
    top: 0;
    left: 2rem; 
    text-transform: uppercase;
    
    @media #{$mobile} {
        position: relative;
        font-size: calc(var(--font-size-bigest-plus) * 2);
        text-align: center;
        left: unset;
    }
}
.videoPlayer {
    z-index: 40;
    max-width: calc(100vmin - $layoutNavHeightDesktop);
    margin: 0 auto;
    // border: solid 1px blue;
    
    @media #{$mobile} {
        position: absolute;
        max-width: unset;
        
        :deep(video){
            height: 80%;
            object-fit: cover;
        }
    }
}

.roadmap {
    &-wrapper {
        position: relative;
        max-width: $layoutMaxWidthDesktop;
        margin: 0 auto;
        // border: solid 1px lime;

        @media #{$mobile} {
            height: 100%;
        }
    }

    &-inner {
        z-index: 60;
        perspective: 1000px;
        position: absolute;
        top: 0;
        left: 5%;
        width: 90%;
        height: 100%;

        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;

        // border: solid 1px orange;

        @media #{$mobile} {
            position: relative;
            margin-top: 8rem;
            flex-flow: column nowrap;
            height: unset;
        }
    }

    &-item {
        width: 23%;
        position: relative;
        // border: solid 1px green;
        will-change: top, left, transform;

        // animation: animQ calc(8s * var(--i)) infinite;

        @media #{$mobile} {
            width: 70%;
        }

        @media #{$desktop} {
            &.q1,
            &.q3 {
                transition: all calc( 0.07s * var(--i));
                transform: 
                    translate3d(
                        v-bind(translateX), 
                        v-bind(translateY), 
                        0
                    )
                    rotate3d(
                        v-bind(rotateX), 
                        v-bind(rotateY), 
                        0,
                        3deg
                    );
            }
            
            &.q2,
            &.q4 {
                transition: all calc( 0.15s * var(--i));
                transform: 
                    translate3d(
                        v-bind(translateXalter), 
                        v-bind(translateYalter), 
                        0
                    )
                    rotate3d(
                        v-bind(rotateXalter), 
                        v-bind(rotateYalter), 
                        0,
                        3deg
                    );
            }
        }

        

        &.q2,
        &.q3 {
            top: -10rem;
            @media #{$mobile} {
                top: unset;
            }
        }
    }
}


</style>
