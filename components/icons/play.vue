
<script setup>
const props = defineProps({
    width: {
        type: String,
        default: "12em"
    },
    height: {
        type: String,
        default: "12em"
    },
})
</script>
<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="width || '12em'" :height="height || '12em'" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2M9.5 16.5v-9l7 4.5z"></path></svg>
</template>