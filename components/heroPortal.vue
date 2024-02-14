<script setup>
import * as THREE from 'three';

const canvas = ref(null)
let renderer = null
let clock = null
let camera = null
let scene = null
let portal = null

onMounted(() => {
    console.log("mounted du hero portal")
    initRenderer()
    initScene()
    renderer.render(scene, camera)
})

function initRenderer(){
    renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
        antialias: true
    });

    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // renderer.setClearColor();
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFShadowMap;
    clock = new THREE.Clock();
}

function initScene(){
    scene = new THREE.Scene()

    // camera
    camera = new THREE.PerspectiveCamera( 45, (window.innerWidth /2) / (window.innerHeight /2), 1, 20 )
    camera.position.set(0, 0, -2)
    
    // box
    const geometry = new THREE.BoxGeometry(1,1,1)
    const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF })
    portal = new THREE.Mesh(geometry, material)
    
    // lights
    const lightOne = new THREE.HemisphereLight(0xFF0000, 0x0000FF, 1)
    
    portal.rotation.set(0.5, 0.5, 0.5)
    camera.lookAt(portal.position)


    scene.add(camera)
    scene.add(lightOne)
    scene.add(portal)
}

</script>

<template>
    <section class="portal-wrapper">

        <canvas ref="canvas"></canvas>

    </section>

</template>

<style lang="scss" scoped>
    .portal {
        &-wrapper {
            border: solid 10px green;
            font-size: var(--font-size-big);
            color: var(--color-main-80);
        }
    }

    canvas {
        border: solid 1px pink;
    }
</style>