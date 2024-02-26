<script setup>
import { wording } from '@/assets/data/wording';

const route = useRoute()
const isVisible = ref(route.fullPath === "/")

</script>

<template>
    <div class="page-index">
        <Hero :isVisible="isVisible"/>
        <!-- here, other slots/modules -->
        <div class="strips">
            <Strip name="explore" :wording="wording.explore" direction="right"/>
            <Strip name="loot" :wording="wording.loot" direction="left"/>
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
</style>