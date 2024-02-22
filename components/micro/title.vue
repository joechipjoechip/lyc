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
    font-family: "Mada Bold";
    font-size: var(--font-size-big-plus);
    text-transform: uppercase;

    &.isGradient {
        background: var(--gradient-one);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    &.isBig {
        font-size: var(--font-size-bigest);
    }
}
</style>