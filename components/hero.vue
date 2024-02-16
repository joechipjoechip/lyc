<script setup>
import { useElementVisibility } from "@vueuse/core"

const heroPortal = ref(null)
const heroPortalIsVisible = useElementVisibility(heroPortal)

</script>

<template>
    <section class="hero-wrapper">

        <div class="hero-inner">

            <HeroPortal 
                ref="heroPortal"
                :isVisible="heroPortalIsVisible"
            />

            <p>The first crypto treasure hunt</p>
            <p>Augmented reality play-to-earn</p>

        </div>

    </section>

</template>

<style lang="scss" scoped>
    .hero {
        &-wrapper {
            // border: solid 10px green;
            font-size: var(--font-size-big);
            color: var(--color-main-80);
        }

        &-inner {
            max-width: $layoutMaxWidthDesktop;
            margin: 0 auto;
            // border: solid 4px orange;
            text-align: center;

            p {
                text-transform: uppercase;
            }
        }
    }
</style>