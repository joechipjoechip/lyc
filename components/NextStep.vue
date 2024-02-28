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
        // margin-top: calc($dividerVertical);
    }

    &-inner {
        width: 100%;
        height: 80vh;
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
    font-weight: 800;
    font-size: var(--font-size-bigest-plus);
    text-transform: uppercase;
    margin-bottom: var(--font-size-bigest);
    
    &:last-of-type {
        margin-bottom: 0;
    }
}
</style>
