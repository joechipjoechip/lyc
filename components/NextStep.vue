<script setup>
const props = defineProps({
    wording: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <section class="nextstep-wrapper">
        <div class="nextstep-inner">
            <img src="/images/visuals/applevision.jpg" alt="">
            <div class="paragraph">
                <p v-for="line in wording.paragraphs[0]" class="line">
                    {{ line }}
                </p>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.nextstep {
    &-wrapper {
        display: block;
        width: $layoutMaxWidthDesktop;
        margin: 0 auto;
        margin-top: calc($dividerVertical * 6);
    }

    &-inner {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
    }
}

img {
    width: 50rem;
}

.paragraph {
    margin-left: 2rem;
}

.line {
    font-family: 'Lexend Zetta';
    font-size: var(--font-size-bigest-plus);
    text-transform: uppercase;
    font-weight: 800;
}
</style>
