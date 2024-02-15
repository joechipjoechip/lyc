<script setup>
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const canvas = ref(null)
const frameRate = 1/60
let renderer = null
let composer = null
let renderPass = null
let clock = null
let camera = null
let scene = null
let portal = null
let deltaTime = 0

onMounted(() => {
    console.log("mounted du hero portal")
    initScene()
    initRenderer()
    // mainTick()
    composer.render()
    // renderer.render(scene, camera)
})

function initScene(){
    const { width, height } = canvas.value.getBoundingClientRect()

    scene = new THREE.Scene()

    // box
    const geometry = new THREE.BoxGeometry(1,1,1)
    const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF })
    portal = new THREE.Mesh(geometry, material)
    portal.rotation.set(0.5, 0.5, 0.5)
    
    // lights
    const lightOne = new THREE.HemisphereLight(0xFF0000, 0x0000FF, 1)

    // camera
    camera = new THREE.PerspectiveCamera( 45, width / height, 1, 20 )
    camera.position.set(0, 0, -2)
    camera.lookAt(portal.position)
    

    scene.add(camera)
    scene.add(lightOne)
    scene.add(portal)
}

function initRenderer(){
    const { width, height } = canvas.value.getBoundingClientRect()

    renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
        antialias: true
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // renderer.setClearColor();
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFShadowMap;

    
    composer = new EffectComposer(renderer);
    composer.setSize(width, height);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass)
    
    clock = new THREE.Clock();
}

function mainTick(){

    deltaTime += clock.getDelta();
    
    // NOW CHECK IF FRAMERATE IS GOOD
    if( deltaTime >= frameRate ){

        this.sequencesManager.current.checkStuffsToAnimateAtRender(deltaTime, this.viewPos);

        // NOW COMPUTE RENDER
        if( this.sequencesManager.current.composer ){
            // console.log("use composer : ", this.sequencesManager.current.name);
            
            this.sequencesManager.current.composer.render();
            
        } else {
            // console.log("use classic renderer : ", this.sceneBundle.current.name);

            this.renderer.render(this.sceneBundle.current.scene, this.sceneBundle.current.camera);

        }

        deltaTime = deltaTime % frameRate;

    }

    window.requestAnimationFrame(this.mainTick);
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
        width: 100%;
    }
</style>