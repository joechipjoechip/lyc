<script setup>
import navData from "@/assets/data/navData.js"
import { handleAnchorNav } from "@/composables/anchorNav"

const props = defineProps({
    type: {
        type: String,
        required: true
    }
})

const goodNavData = computed(() => {
    if( props.type === "top" || props.type === "mobile"){
        return navData.filter(item => item.displayInTopNav)
    } else if( props.type === "prefooter" ){
        return navData.filter(item => item.displayInPreFooter)
    }
})

function handleAnchorNavClick(e){
    handleAnchorNav(e)
}

</script>

<template>
    <div :class="`nav-inner ${type}`">
        <p 
            v-for="navItem in goodNavData.filter(item => item.anchor)" :key="navItem.id"
            :data-anchor="navItem.anchor"
            class="nav-item"
            @click="handleAnchorNavClick"
        >
            {{ navItem.name }}
        </p>
        <NuxtLink 
            v-for="navItem in goodNavData.filter(item => item.route)" :key="navItem.id"
            :to="navItem.route"
            class="nav-item"
        >
            {{ navItem.name }}
        </NuxtLink>
    </div>
</template>

<style lang="scss" scoped>

.nav {
    &-inner {
        font-family: "Lexend Zetta";
        font-weight: 700;

        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: center;

        &.top {
            margin-right: 2rem;
        }

        &.mobile {
            position: relative;
            // border: solid 2px red;
            flex-flow: column nowrap;
            justify-content: center;
            height: 100%;

           .nav-item {
                font-size: var(--font-size-bigest-plus);
                text-transform: uppercase;
                position: relative;
                color: white;
                z-index: 130;
                display: block;
                margin-bottom: 1.25rem;

                &:last-child {
                    margin-bottom: 0;
                }
           }
        }

        &.prefooter {
            .nav-item {
                font-size: var(--font-size-big-plus);
            }
        }
    }

    &-item {
        font-size: var(--font-size-medium);
        text-transform: uppercase;
        color: var(--color-main-100);
        cursor: pointer;

        text-decoration: none;
        margin: 0 1.75rem;

        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 0;
        }
    }
}
</style>
