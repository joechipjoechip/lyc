<template>
    <section class="hero-wrapper">

        <div class="hero-inner">
            <HeroPortal />
            <MicroTitle text="The first crypto treasure hunt" />
            <MicroTitle text="Augmented reality play-to-earn" :isGradient="true"/>
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