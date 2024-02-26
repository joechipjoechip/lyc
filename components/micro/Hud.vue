<script setup>
const props = defineProps({
    text: String,
    required: true
})

</script>

<template>
    <button>
        <h4 class="text">
            {{ text }}
        </h4>
        <img src="/images/core/hud.png" alt="hud picture">
    </button>
</template>

<style lang="scss" scoped>
button {
    cursor: pointer;
    position: relative;

    width: $hudWidth;
    height: calc($hudWidth / $hudRatio);
    

    .text {
        text-transform: uppercase;
        font-weight: 900;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;

        font-size: var(--font-size-bigest);
    }

    img {
        width: 100%;
        object-fit: contain;
        // width: $hudWidth;
        // // height: 0;
        // padding-bottom: 3.75%;
    }
}
</style>
