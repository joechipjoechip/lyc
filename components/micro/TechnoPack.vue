<template>
    <section class="tecnhopack-wrapper">

        <div class="item">
            <img src="/images/logos/solana.png" alt="logo solana">
        </div>

        <div class="item">
            <img src="/images/logos/unity.png" alt="logo unity">
        </div>

        <div class="item">
            <img src="/images/logos/arcore.png" alt="logo arcore">
        </div>

    </section>
</template>

<style lang="scss" scoped>
.tecnhopack {
    &-wrapper {
        z-index: 50;
        width: 100%;
        position: relative;
        display: grid;
        grid-template-columns: 20% 20% 20% 20% 20%;
        grid-template-rows: auto;
        grid-template-areas: 
            "header header header header"
            "slot slot . slot slot";
    }
}
.item {
    display: block;
    width: 100%;
    // height: unset;

    grid-area: slot;
    
    &:first-of-type {
        margin-bottom: 1rem;
        grid-area: header;
    }

    img {
        width: 100%;
    }
}


</style>