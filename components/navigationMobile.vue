<script setup>
import navData from "@/assets/data/navData.js"

const menuIsOpen = ref(false)

// watch(menuIsOpen, newVal => {

//     if( newVal ){
//         useHead({
//             bodyAttrs: 
//                 { class: "no-scroll" }
            
//         })
//     } else {
//         document.body.classList.contains("no-scroll") && document.body.classList.remove("no-scroll")
//     }


// })


</script>

<template>
    <nav class="nav-wrapper">

        <div class="nav-inner">

            <div class="level-1">
                <div class="logos">
                    <img class="logo-single" src="/images/core/logo-chrome.png" alt="logo lyc">
                    <img class="logo-typo" src="/images/core/logo-typo-chrome-big.png" alt="logo typo lyc">
                </div>
                <img src="/images/core/burger.png" alt="" @click="menuIsOpen = !menuIsOpen">
            </div>

        </div>

        <div class="level-2" :class="{ menuIsOpen }">
            <TransitionGroup 
                tag="ul" 
                name="navItemsAnims" 
                :style="{ '--total': navData.length }"
            >
                <p  v-if="menuIsOpen"
                    v-for="(navItem, index) in navData" :key="navItem.id"
                    class="nav-item"
                    :style="{'--i': index +1}"
                >
                    {{ navItem.name }}
                </p>
            </TransitionGroup>
        </div>
        
    </nav>
</template>

<style lang="scss" scoped>
.nav {

    &-wrapper {
        //
    }

    &-inner {
        z-index: 100;
        position: fixed;
        top: 0;
        width: 100%;
        height: $layoutNavHeightMobile;

        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: center;
        
        background-color: var(--color-contrast-80);
        backdrop-filter: blur(8px);
        
        
        .level-1 {
            z-index: 110;
            height: 60%;
            
            width: calc(100% - 2rem);
            margin: 0 auto;
            // height: inherit;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;

            .logos {
                height: 100%;
            }

            img {
                // height: 70%;
                // height: inherit;
                height: 100%;
            }

            .logo-single {
                margin-right: 1rem;
            }
        }

        

    }

}

.level-2 {
    z-index: 90;
    position: fixed;
    top: $layoutNavHeightMobile;
    right: 0;
    width: 45%;
    height: 0vh;
    
    background: linear-gradient(to bottom, var(--color-contrast-80) 25%, var(--color-contrast-30) 100%);
    backdrop-filter: blur(8px);
    border-radius: 0 0 0 3rem;
    overflow: hidden;

    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    transition: height var(--transitionDurationMedium);

    &.menuIsOpen {
        height: 30vh;
    }

    .nav-item {
        font-size: var(--font-size-bigest);
        text-transform: uppercase;
        position: relative;
        color: white;
        z-index: 130;
        display: block;
        margin-bottom: 1rem;

        &:last-of-type {
            margin-bottom: 0;
        }
    }
}



.navItemsAnims {

    
    
    &-enter-active,
    &-leave-active {
        position: relative;
        opacity: 1;
        transform: translate3d(0,0,0);
        
        transition: 
            transform var(--transitionDurationMedium) ease-in-out,
            opacity var(--transitionDurationMedium) linear;
        
    }
        
    &-enter-active {
        transition-delay: calc( 0.04s * var(--i));
    }
    
    &-leave-active {
        transition-delay: 0;
    }
    
    &-enter-from,
    &-leave-to {
        position: relative;
        transform: translate3d(0,-10rem,0);
        opacity: 0;
    }
	

}
</style>
