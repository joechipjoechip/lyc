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

const isHovered = ref(false)
const backgroundImageSrc = ref(`/images/visuals/strip-${props.name}.jpg`)

</script>
<template>
    <section 
        class="strip-wrapper" 
        :class="[name, direction]"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        :style="`background-image: url(${backgroundImageSrc})`"
    >
        <div class="strip-inner">

            <MicroHud 
                :text="wording.cta" 
                class="hud" 
                :isHovered="isHovered"
            />

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
        height: $stripHeight;


        background-size: cover;

        &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 30;
        }
        
        img {
            z-index: 30;
            width: 100%;
            object-fit: cover;
            object-position: center;
            height: inherit;
        }

        &.explore {
            background-position: 50% 71%;
        }
        &.loot {
            background-position: 50% 35%;
        }

        &.right {
            &:after {
                background: linear-gradient(to left, var(--color-contrast-100) 20%, transparent 50%);
            }
            .strip-inner {
                align-items: flex-end;
                text-align: right;
                padding-right: $gutter;
            }
        }
        &.left {
            &:after {
                background: linear-gradient(to right, var(--color-contrast-100) 20%, transparent 50%);
            }
            .strip-inner {
                align-items: flex-start;
                text-align: left;
                padding-left: $gutter;
            }
        }
    }

    &-inner {
        // for the 3d of huds
        perspective: 1000px;
        
        position: relative;
        z-index: 50;
        
        height: 100%;
        // width: 100%;
        max-width: $layoutMaxWidthDesktop;
        // padding: 0 $gutter 0 0;
        margin: 0 auto;

        display: flex;
        flex-flow: column nowrap;
        justify-content: center;

        font-family: "Lexend Zetta";
        text-transform: uppercase;
        color: var(--color-main-100);
    }
}

.hud {
    position: absolute;
    top: calc(($stripHeight - ($hudWidth / $hudRatio)) / 2); 
    left: calc((min(100vw, $layoutMaxWidthDesktop) - $hudWidth) / 2);
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
