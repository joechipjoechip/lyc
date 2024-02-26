<script setup>
const props = defineProps({
    isVisible: Boolean,
    required: true
})
</script>

<template>
    <section class="hero-wrapper">

        <div class="hero-inner">
            <HeroPortal class="heroPortal-wrappper" :isVisible="isVisible"/>
        </div>

    </section>

</template>

<style lang="scss" scoped>
    .hero {
        &-wrapper {
            font-size: var(--font-size-big);
            color: var(--color-main-80);
        }

        &-inner {
            // max-width: $layoutMaxWidthDesktop;
            margin: 0 auto;
            text-align: center;

            .heroPortal-wrapper {
                position: relative;
                z-index: 50;
            }
        }
    }
</style>