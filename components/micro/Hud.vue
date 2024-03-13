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
const ratioHudTransformOnMove  = {
    tx: 10,
    ty: -5,
    rx: -0.02,
    ry: -0.04
}
const ratioHudTransformOnGyro  = {
    tx: 1,
    ty: 1,
    rx: -2,
    ry: -4
}

const { $on, $off } = useNuxtApp()

const parent = getCurrentInstance().parent.vnode

watch(() => localStore.gyroIsAllowed, newVal => {
    if( newVal ){
        initGyroEvent()
    }
})

onMounted(() => {
    if( localStore.gyroIsAllowed ){
        initGyroEvent()
    }
})

function initGyroEvent(){
    $on("main-device-motion", handleGyro)
    $off("main-touch-move", handleTouchMove)
}

$on("main-touch-move", handleTouchMove)

function handleTouchMove(event){
    if( localStore.gyroIsAllowed ){ return }
    if( !props.isHovered ){ return }
    const { x, y } = useGetEventPosition(event)
    const { normalizedX, normalizedY } = useNormalizePosition(x, y, parent.el)
    translateX.value = normalizedX * ratioHudTransformOnMove.tx + "rem"
    translateY.value = normalizedY * ratioHudTransformOnMove.ty + "rem"

    rotateX.value = -normalizedY * ratioHudTransformOnMove.rx
    rotateY.value = -normalizedX * ratioHudTransformOnMove.ry
}

function handleGyro(event){
    
    const { x, y } = event.accelerationIncludingGravity
    const animatedObject = { 
        tx: translateX.value ? parseInt(translateX.value.replace("rem", "")) : 0, 
        ty: translateY.value ? parseInt(translateY.value.replace("rem", "")) : 0,
        rx: rotateX.value,
        ry: rotateY.value,
    }

    gsap.to(animatedObject, {
        tx: x * ratioHudTransformOnGyro.tx,
        ty: y * ratioHudTransformOnGyro.ty,
        rx: x * ratioHudTransformOnGyro.rx,
        ry: y * ratioHudTransformOnGyro.ry,
        duration: 0.2,
        ease: "linear",
        onUpdate: () => {
            translateX.value = animatedObject.tx + "rem"
            translateY.value = animatedObject.ty + "rem"
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
