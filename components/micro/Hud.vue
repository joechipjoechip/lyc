<script setup>
import { getCurrentInstance } from "vue";
import { useGetEventPosition } from '#imports';
import { useNormalizePosition } from '#imports';

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

const buttonRef = ref(null)

const translateX = ref(0)
const translateY = ref(0)
const rotateX = ref(0)
const rotateY = ref(0)
const transitionString = ref("transform var(--transitionDurationShort)")

const { $on } = useNuxtApp()

const parent = getCurrentInstance().parent.vnode

$on("main-touch-move", handleTouchMove)

function handleTouchMove(event){
    if( !props.isHovered ){ return }
    const { x, y } = useGetEventPosition(event)
    const { normalizedX, normalizedY } = useNormalizePosition(x, y, parent.el)
    translateX.value = normalizedX * 10 + "rem"
    translateY.value = -normalizedY * 5 + "rem"

    rotateX.value = -normalizedY * -0.01
    rotateY.value = -normalizedX * -0.01
}

watch(() => props.isHovered, newVal => {
    if( !newVal ){
        translateX.value = 0
        translateY.value = 0
        rotateX.value = 0
        rotateY.value = 0
        
        transitionString.value = "transform var(--transitionDurationLong)"
    } else {
        transitionString.value = "transform var(--transitionDurationShort)"
        setTimeout(() => {
            transitionString.value = "unset"
        }, 200)
    }
})
</script>

<template>
    <button 
        ref="buttonRef"
        :style="{ transition: transitionString }"
    >
        <h4 class="text">
            {{ text }}
        </h4>
        <img src="/images/core/hud.png" alt="hud picture">
    </button>
</template>

<style lang="scss" scoped>
button {
    cursor: pointer;
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
        15deg
    );

    


    // transition: transform var(--transitionDurationShort);
    

    .text {
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
    }

    img {
        width: 100%;
        object-fit: contain;
        // width: $hudWidth;
        // // height: 0;
        // padding-bottom: 3.75%;
    }
}
</style>