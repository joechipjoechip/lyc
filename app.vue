<template>
    <NuxtLayout />
</template>

<style>

.page-enter-active,
.page-leave-active {
    transition: all 0.7s;
    transform: translateY(0);
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
}
.page-enter-from {
    transform: translateY(4rem);
}

.page-leave-to {
    transform: translateY(-4rem);
}

</style>
