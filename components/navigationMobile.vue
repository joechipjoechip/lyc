<script setup>
import { onClickOutside } from "@vueuse/core";

const { $on } = useNuxtApp()
const menuIsOpen = ref(false)
const menu = ref(null)

$on("main-scroll", () => menuIsOpen.value = false)

onClickOutside(menu, (el) => {
    if( el.target.dataset.hasOwnProperty("opener") ){
        menuIsOpen.value = !menuIsOpen.value
    } else {
        menuIsOpen.value = false
    }
})

</script>

<template>
    <nav class="nav-wrapper">

        <div class="nav-inner">

            <div class="level-1">
                
                <div class="logos">
                    <img class="logo-single" src="/images/core/logo-chrome.png" alt="logo lyc">
                    <img class="logo-typo" src="/images/core/logo-typo-chrome-big.png" alt="logo typo lyc">
                </div>

                <img class="burger" data-opener src="/images/core/burger.png" alt="burger menu">

            </div>

        </div>

        <div ref="menu" class="level-2" :class="{ menuIsOpen }" @click="menuIsOpen = false">

            <MicroNavCore type="mobile" />
            
        </div>
        
    </nav>
</template>

<style lang="scss" scoped>
.nav {

    &-wrapper {
        //
        width: 100%;
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
        
        background-color: var(--color-contrast-90);
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
                img {
                    height: 100%;
                }
            }

            .burger {
                // height: 70%;
                // height: inherit;
                height: 80%;
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
    
    background: linear-gradient(to bottom, var(--color-contrast-90) 25%, var(--color-contrast-40) 100%);
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
}

</style>
