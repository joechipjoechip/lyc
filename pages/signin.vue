<script setup>
const isMounted = ref(false)
onMounted(() => {
    useHead({
        script: {
            src: "https://tally.so/widgets/embed.js",
            async: true,
            defer: true
        }
    })
})

onMounted(() => {
    isMounted.value = true
})
</script>

<template>
    <div class="signin-wrapper">
        <div class="signin-inner" v-if="isMounted">
            <iframe data-tally-src="https://tally.so/embed/mZNEvV?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="120" frameborder="0" marginheight="0" marginwidth="0" title="Emails"></iframe>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.signin {
    &-wrapper {
        position: relative;
        width: 100%;
        max-width: $layoutMaxWidthDesktop;
        margin: 0 auto;
        min-height: 60vh;

        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
    }

    &-inner {
        max-width: 30rem;
        margin: 0 auto;
    }
}
</style>
