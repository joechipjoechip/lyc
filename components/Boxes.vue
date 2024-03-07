<script setup>
const props = defineProps({
  wording: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <div class="boxes-wrapper">
    <div class="boxes-inner">
        <h6 class="title" v-html="wording.title"></h6>
    
        <div class="paragraph" v-for="paragraph in wording.paragraphs" :key="paragraph.id">
            <p v-for="line in paragraph" :key="line.id">
                {{ line }}
            </p>
        </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.boxes {
    &-wrapper {
        border: solid 1px orange;
        position: relative;
        width: 100%;
        max-width: $layoutMaxWidthDesktop;
        margin: 0 auto;
        height: 100vh;
        
        font-size: var(--font-size-big);
        color: var(--color-main-80);
        text-align: center;

        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
    }

    &-inner {

    }
}

.title,
.paragraph {
    z-index: 50;
    text-transform: uppercase;
    font-family: 'Mada Bold';
    color: var(--color-main-100);
}

.title {
    margin-top: 5rem;
    font-size: var(--font-size-bigest-plus);
}

.paragraph {
    text-align: center;
    margin-top: 2rem;
    font-size: var(--font-size-big);

    p {
        line-height: var(--font-size-bigest);
    }
}
</style>
