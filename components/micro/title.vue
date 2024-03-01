<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true
    },
    isGradient: {
        type: Boolean,
        default: false
    },
    isBig: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <h2 class="title"
        :class="{ isGradient, isBig }"
    >{{ text }}</h2>
</template>

<style lang="scss" scoped>
.title {
    // font-family: "Mada Bold";
    font-family: "Lexend Zetta";
    font-weight: 800;
    font-size: var(--font-size-big-plus);
    text-transform: uppercase;

    @media #{$mobile} {
        // margin-bottom: 1rem;
        font-size: var(--font-size-bigest);
        line-height: var(--font-size-bigest-plus);
    }

    &.isGradient {
        background: var(--gradient-one);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    &.isBig {
        font-size: var(--font-size-bigest-plus);
    }
}
</style>