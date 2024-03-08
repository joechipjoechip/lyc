<script setup>
import { useElementVisibility } from '@vueuse/core';

const maxIndex = 4
const wrapper = ref(null)
const wrapperIsVisible = useElementVisibility(wrapper)
const imgLeft = ref(null)
const imgRight = ref(null)
const leftIndex = ref("1")
const rightIndex = ref("2")
const isShowed = ref(true)

watch(wrapperIsVisible, (newVal) => {
    if(newVal){
        setTimeout(() => {
            handleClick()
        }, 1000)
    }
})

function handleClick(){
    console.log("clicked")
    isShowed.value = false
    setTimeout(() => {
        isShowed.value = true
    }, 1000)

    setTimeout(() => {
        changeImages()
    }, 500)
    
      
}

function changeImages(){
    let oldLeftInt = parseInt(imgLeft.value.src.split("xx")[1].split(".")[0])
    let oldRighttInt = oldLeftInt + 1

    if(oldRighttInt >= maxIndex){
        oldRighttInt = 0
    }
    if(oldLeftInt >= maxIndex){
        oldLeftInt = 0
        oldRighttInt = 1
    }

    leftIndex.value = new String(oldLeftInt + 1)
    rightIndex.value = new String(oldRighttInt + 1)  
}

</script>

<template>
    <section ref="wrapper" class="phones-wrapper" @click="handleClick" >
        <div class="phones-inner">
            <img class="frame" src="/images/visuals/phones.png" alt="">
            <div class="left">
                <Transition name="anim-photo">
                    <img ref="imgLeft" class="imgLeft"
                        :src="`/images/visuals/phones-slider/xx${leftIndex}.jpg`" 
                        alt=""
                        v-show="isShowed"
                        :class="{ isShowed }"
                    >
                </Transition>
            </div>
            <div class="right">
                <Transition name="anim-photo">
                    <img ref="imgRight" class="imgRight"
                        :src="`/images/visuals/phones-slider/xx${rightIndex}.jpg`" 
                        alt=""
                        v-show="isShowed"
                        :class="{ isShowed }"
                    >
                </Transition>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.phones {
    &-wrapper {
        position: relative;
    }

    &-inner {
        position: relative;
        perspective: 500px;
        .frame {
            position: relative;
            z-index: 50;
        }
    }
}

.left {
    z-index: 40;
    background-color: var(--color-contrast-100);
    position: absolute;
    top: 5%;
    left: 5%;
    width: 40%;
    height: 82%;
    border-radius: 1rem;
    transform: rotate3d(0, -20, 0, 15deg);
}
.right {
    z-index: 40;
    background-color: var(--color-contrast-100);
    position: absolute;
    top: 5%;
    right: 7%;
    width: 40%;
    height: 82%;
    border-radius: 1rem;
    transform: rotate3d(0, 20, 0, 15deg);
}


.imgLeft,
.imgRight {
    position: relative;
    object-fit: cover;
    // object-position: 50% 50%;
    height: 100%;
    width: 100%;

    opacity: 0;

    &.isShowed {
        opacity: 1;
    }
}


.anim-photo {
    &-enter-active, 
    &-leave-active {
        transition: opacity 1s;
    }

    &-enter-from,
    &-leave-to {
        // opacity: 0;
        &.imgLeft,
        &.imgRight {
            animation: positionLeave 0.75s;
        }
    }
    &-enter-to, 
    &-leave-from {
        // opacity: 1;
        &.imgLeft,
        &.imgRight {
            animation: positionEnter 1s;
        }
    }
}

@keyframes positionEnter {
    0% {
        opacity: 0;
        object-position: 10% 50%;
    }
    100% {
        opacity: 1;
        object-position: 50% 50%;
    }
}
@keyframes positionLeave {
    0% {
        opacity: 1;
        object-position: 50% 50%;
    }
    100% {
        opacity: 0;
        object-position: 90% 50%;
    }
}

</style>

