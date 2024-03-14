<script setup>
import { useMainStore } from '#imports';
import { wording } from '@/assets/data/wording';
const store = useMainStore()
const route = useRoute()

onMounted(() => {
    if( route.query.anchor ){
        const anchor = route.query.anchor
        const target = document.querySelector(anchor)

        setTimeout(() => {
            target && target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
        }, 800)
    }
})

</script>

<template>
    <div class="page-index">
        <HeroPortal />
        
        <div class="punchlines">
            <MicroTitle text="The first crypto treasure hunt" />
            <MicroTitle text="Augmented reality play-to-earn" :isGradient="true" :isBig="true"/>
            <img src="/images/logos/solana.png" alt="logo solana" />
        </div>

        <HeroKey :wording="wording.premint" />

        <div class="strips">
            <Strip name="explore" :wording="wording.explore" direction="right"/>
            <Phones class="phones" />
            <div class="punchlines" v-if="store.isMobile">
                <Cities />
            </div>
            <Strip name="loot" :wording="wording.loot" direction="left"/>
        </div>

        <div class="punchlines" v-if="!store.isMobile">
            <Cities />
        </div>

        <HeroBoxes :wording="wording.boxes" />

        <VideoDisplayer videoName="master" videoFileName="master-2.mp4" :checkVisibility="true" />

        <img src="/images/core/logo-typo-chrome.png" alt="arrow down" class="logo-lonely" />

        <Roadmap />

        <NextStep :wording="wording.nextStep" />

        <PreFooter />

        <Footer />
    </div>
</template>

<style lang="scss" scoped>
.page-index {
    //
}

.strips {
    z-index: 60;
    position: relative;
    margin: 10rem 0;
}

.punchlines {
    position: relative;
    z-index: 70;
    margin: $dividerVertical 0;
    text-align: center;

    img {
        max-width: 18rem;
        margin-top: 0.5rem;
    }
}

.phones {
    position: absolute;
    z-index: 50;
    top: 20rem;
    left: calc((max(100vw, $layoutMaxWidthDesktop) - $layoutMaxWidthDesktop) / 2);

    :deep(.phones-wrapper) {
        margin-left: -2.2rem;
    }

    :deep(.frame){
        width: $phonesWidth;
    }

    @media #{$mobile} {
        position: relative;
        top: unset;
        left: unset;
        padding: 2rem 0;

        :deep(.phones-wrapper) {
            margin-left: unset;
        }
        
        :deep(.frame){
            width: 100vw;
        }
    }
}

.logo-lonely {
    display: block;
    width: 25rem;
    margin: calc($dividerVertical *5) auto;
}

</style>
