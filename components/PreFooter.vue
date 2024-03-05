<template>
    <section class="prefooter-wrapper">
        <div class="prefooter-inner">
            <MicroNavCore type="prefooter" />
        </div>
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
        z-index: 30;
        position: relative;
        max-width: $layoutMaxWidthDesktop;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: baseline;
        padding: 5rem 0;
    }
}

</style>
