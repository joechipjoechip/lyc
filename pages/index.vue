<script setup>
import { wording } from '@/assets/data/wording';

const route = useRoute()
const isVisible = ref(route.fullPath === "/")

</script>

<template>
    <div class="page-index" v-if="isVisible">
        <Hero :isVisible="isVisible"/>
        
        <div class="punchlines">
            <MicroTitle text="The first crypto treasure hunt" />
            <MicroTitle text="Augmented reality play-to-earn" :isGradient="true" :isBig="true"/>
            <img src="/images/logos/logo-solana.png" alt="logo solana" />
        </div>

        <div class="strips">
            <Strip name="explore" :wording="wording.explore" direction="right"/>
            <Phones class="phones"/>
            <Strip name="loot" :wording="wording.loot" direction="left"/>
        </div>

        <div class="punchlines">
            <MicroTitle text="PARIS, NEW YORK, LONDON, TOKYO, ISTANBUL, SEOUL, MIAMI" :isGradient="true" :isBig="true"/>
            <MicroTitle text="... AND MANY MORE!" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-index {
    //
}

.strips {
    z-index: 60;
    margin-top: 4rem;
    position: relative;
}

.punchlines {
    position: relative;
    z-index: 70;
    margin-top: 2rem;
    text-align: center;

    img {
        max-width: 18rem;
    }
}

.phones {
    position: absolute;
    z-index: 50;
    top: 20rem;
    left: calc((max(100vw, $layoutMaxWidthDesktop) - $layoutMaxWidthDesktop) / 2);
    pointer-events: none;
}
</style>