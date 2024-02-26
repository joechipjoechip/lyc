<script setup>
import { wording } from '@/assets/data/wording';

const route = useRoute()
const isVisible = ref(route.fullPath === "/")

</script>

<template>
    <div class="page-index">
        <Hero :isVisible="isVisible"/>
        
        <div class="punchlines">
            <MicroTitle text="The first crypto treasure hunt" />
            <MicroTitle text="Augmented reality play-to-earn" :isGradient="true" :isBig="true"/>
            <img src="/images/logos/logo-solana.png" alt="logo solana" />
        </div>

        <div class="strips">
            <Strip name="explore" :wording="wording.explore" direction="right"/>
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
    margin-top: 4rem;
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
</style>