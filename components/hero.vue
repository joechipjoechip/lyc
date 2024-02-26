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
            <div class="text">
                <MicroTitle text="The first crypto treasure hunt" />
                <MicroTitle text="Augmented reality play-to-earn" :isGradient="true" :isBig="true"/>
                <img src="/images/logos/logo-solana.png" alt="logo solana" />
            </div>
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

            .text {
                position: relative;
                z-index: 70;
                margin-top: 2rem;

                @media #{$mobile}{
                    margin-top: -20rem;
                }

                img {
                    max-width: 18rem;
                }
            }
        }
    }
</style>