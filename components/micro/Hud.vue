<script setup>
import gsap from "gsap";
import { getCurrentInstance } from "vue";
import { useGetEventPosition } from '#imports';
import { useNormalizePosition } from '#imports';

import { useLocalStorageStore } from '@/stores/localStorageStore';
const localStore = useLocalStorageStore()

const props = defineProps({
    text: {
        type: String,
        required: true
    },
    isHovered: {
        type: Boolean,
        default: false
    }
})

const translateX = ref(0)
const translateY = ref(0)
const rotateX = ref(0)
const rotateY = ref(0)
const transitionString = ref("transform var(--transitionDurationShort)")
const timeoutID = ref(null)

const { $on } = useNuxtApp()

const parent = getCurrentInstance().parent.vnode

onMounted(() => {
    if( localStore.gyroIsAllowed ){
        $on("main-device-motion", handleGyro)
    }
})

watch(() => localStore.gyroIsAllowed, newVal => {
    if( newVal ){
        $on("main-device-motion", handleGyro)
    }
})

$on("main-touch-move", handleTouchMove)

function handleTouchMove(event){
    if( localStore.gyroIsAllowed ){ return }
    if( !props.isHovered ){ return }
    const { x, y } = useGetEventPosition(event)
    const { normalizedX, normalizedY } = useNormalizePosition(x, y, parent.el)
    translateX.value = normalizedX * 10 + "rem"
    translateY.value = -normalizedY * 5 + "rem"

    rotateX.value = -normalizedY * -0.02
    rotateY.value = -normalizedX * -0.04
}

function handleGyro(event){
    
    const { x, y } = event.accelerationIncludingGravity
    const animatedObject = { 
        tx: translateX.value, 
        ty: translateY.value,
        rx: rotateX.value,
        ry: rotateY.value,
    }

    console.log("animatedObject: ", animatedObject.tx)

    gsap.to(animatedObject, {
        tx: x * 10,
        ty: y * 10,
        rx: x * 10,
        ry: y * 10,
        duration: 0.2,
        ease: "linear",
        onUpdate: () => {
            translateX.value = animatedObject.tx
            translateY.value = animatedObject.ty
            rotateX.value = animatedObject.rx
            rotateY.value = animatedObject.ry
            
        }
    })
}

watch(() => props.isHovered, newVal => {
    if( !newVal ){
        translateX.value = 0
        translateY.value = 0
        rotateX.value = 0
        rotateY.value = 0
        
        transitionString.value = "transform var(--transitionDurationLong)"
    } else {
        transitionString.value = "transform 0.1s"
        if( timeoutID.value ){
            clearTimeout(timeoutID.value)
        }
        timeoutID.value = setTimeout(() => {
            transitionString.value = "unset"
            timeoutID.value = null
        }, 100)
    }
})
</script>

<template>
    <div class="hud-wrapper"
        ref="divRef"
        :style="{ transition: transitionString }"
    >
        <h4 class="text">
            {{ text }}
        </h4>
        <img src="/images/core/hud.png" alt="hud picture">
    </div>
</template>

<style lang="scss" scoped>
.hud-wrapper {
    // cursor: pointer;
    position: relative;

    width: $hudWidth;
    height: calc($hudWidth / $hudRatio);

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
        13deg
    );

    .text {
        color: var(--color-main-100);
        text-transform: uppercase;
        font-weight: 900;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;

        font-size: var(--font-size-bigest);

        @media #{$mobile} {
            font-size: var(--font-size-bigest-plus);
        }
    }

    img {
        width: 100%;
        object-fit: contain;
    }
}

</style>
