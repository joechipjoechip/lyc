<template>
    <section class="hero-wrapper">

        <div class="hero-inner">
            <HeroPortal class="heroPortal-wrappper" />
            <div class="text">
                <MicroTitle text="The first crypto treasure hunt" />
                <MicroTitle text="Augmented reality play-to-earn" :isGradient="true"/>
            </div>
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

            .heroPortal-wrapper {
                position: relative;
                z-index: 50;
            }

            .text {
                position: relative;
                z-index: 70;
                @media #{$mobile}{
                    margin-top: -25rem;
                }
            }
        }
    }
</style>