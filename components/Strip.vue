<script setup>
const props = defineProps({
    name: {
        type: String,
        required: true
    },
    wording: {
        type: Object,
        required: true
    },
    direction: {
        type: String,
        required: true
    },
})

</script>
<template>
    <section class="strip-wrapper" :class="[name, direction]">
        <img :src="`/images/visuals/strip-${name}.jpg`" :alt="`visual ${name}`">
        <div class="strip-inner">

            <h3 class="title" v-html="wording.title"></h3>

            <div v-for="paragraph in wording.paragraphs" 
                class="paragraph"
            >
                <p v-for="line in paragraph" class="line">
                    {{ line }}
                </p>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.strip {
    &-wrapper {
        position: relative;
        height: 50rem;

        &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        img {
            z-index: 30;
            width: 100%;
            object-fit: cover;
            object-position: center;
            height: inherit;
        }

        &.explore {
            img {
                object-position: 50% 71%;
            }
        }
        &.loot {
            img {
                object-position: 50% 35%;
            }
        }

        &.right {
            &:after {
                background: linear-gradient(to left, var(--color-contrast-100) 20%, transparent 50%);
            }
            .strip-inner {
                align-items: flex-end;
                text-align: right;
            }
        }
        &.left {
            &:after {
                background: linear-gradient(to right, var(--color-contrast-100) 20%, transparent 50%);
            }
            .strip-inner {
                align-items: flex-start;
                text-align: left;
            }
        }
    }

    &-inner {
        z-index: 50;
        position: absolute;
        top: 0;
        left: calc((100vw - $layoutMaxWidthDesktop) / 2);
        // width: 100%;
        height: 100%;
        width: $layoutMaxWidthDesktop;
        margin: 0 auto;

        display: flex;
        flex-flow: column nowrap;
        justify-content: center;

        font-family: "Lexend Zetta";
        text-transform: uppercase;
        color: var(--color-main-100);
    }
}

.title {
    font-size: var(--font-size-bigest);
    font-weight: 800;
    margin-bottom: var(--font-size-bigest);
}
.paragraph {
    margin-bottom: var(--font-size-bigest);
    font-size: var(--font-size-medium);
    font-weight: 600;
    
    
    
    &:last-of-type {
        margin-bottom: unset;
    }

    
}

.line {
    margin-top: var(--font-size-smallest);
}
</style>
