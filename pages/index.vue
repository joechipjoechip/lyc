<script setup>
import { wording } from '@/assets/data/wording';
const store = useMainStore()

const route = useRoute()
const isVisible = ref(route.fullPath.split("?")[0] === "/")

onMounted(() => {
    if( route.query.anchor ){
        const anchor = route.query.anchor
        const target = document.querySelector(anchor)

        console.log("target", target)
        
        setTimeout(() => {
            target && target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
        }, 800)
    }
})

</script>

<template>
    <div class="page-index">
        <HeroPortal v-if="isVisible"/>
        
        <div class="punchlines">
            <MicroTitle text="The first crypto treasure hunt" />
            <MicroTitle text="Augmented reality play-to-earn" :isGradient="true" :isBig="true"/>
            <img src="/images/logos/solana.png" alt="logo solana" />
        </div>

        <div class="strips">
            <Strip name="explore" :wording="wording.explore" direction="right"/>
            <Phones class="phones" v-show="!store.isMobile"/>
            <Strip name="loot" :wording="wording.loot" direction="left"/>
        </div>

        <div class="punchlines">
            <MicroTitle text="PARIS, NEW YORK, LONDON, TOKYO, ISTANBUL, SEOUL, MIAMI" :isGradient="true" :isBig="true"/>
            <MicroTitle text="... AND MANY MORE!" />
        </div>

        <HeroKey v-if="isVisible" :wording="wording.premint" />

        <!-- ici module floating boxes -->

        <VideoDisplayer videoUrl="/videos/master-2.mp4"/>

        <img src="/images/core/logo-typo-chrome.png" alt="arrow down" class="logo-lonely" />

        <!-- ici module roadmap -->

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
}

.logo-lonely {
    display: block;
    width: 25rem;
    margin: 0 auto;
}

</style>
