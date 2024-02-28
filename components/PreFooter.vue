<script setup>
import navData from "@/assets/data/navData.js"
</script>

<template>
    <section class="prefooter-wrapper">
        <nav class="prefooter-inner">
            <p 
                v-for="navItem in navData.filter(item => item.displayInPreFooter)" :key="navItem.name"
                class="nav-item"
                :data-anchor="navItem.route"
            >
                {{ navItem.name }}
            </p>
        </nav>
    </section>
</template>

<style lang="scss" scoped>

.prefooter {
    &-wrapper {
        z-index: 20;
        position: relative;
        margin-top: calc($dividerVertical * 3);
        background: var(--gradient-one);

        &::after {
            content: "";
            z-index: 20;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 70%;
            background: linear-gradient(to top, var(--color-contrast-100) 0%, transparent 100%);
        }
    }

    &-inner {
        max-width: $layoutMaxWidthDesktop;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: baseline;
    }
}

nav {
    padding: 4rem 0 4rem 0;
}

.nav-item {
    position: relative;
    z-index: 30;
    margin: 0 3.5rem;
    font-size: var(--font-size-big);
    text-transform: uppercase;
    font-family: 'Lexend Zetta';
    font-weight: 800;
    cursor: pointer;
    
    &:first-of-type {
        margin-left: 0;
    }

    &:last-of-type {
        margin-right: 0;
    }

}
</style>
