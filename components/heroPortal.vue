<script setup>
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const glbLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("js/draco/");
glbLoader.setDRACOLoader(dracoLoader);

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
    initScene().then(() => initRenderer().then(() => mainTick()))
})

async function initScene(){
    return new Promise(res => {

        const { width, height } = canvas.value.getBoundingClientRect()
    
        // portal dummy (box)
        // const geometry = new THREE.BoxGeometry(1,1,1)
        // const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF })
        // portal = new THREE.Mesh(geometry, material)
        // portal.rotation.set(0.5, 0.5, 0.5)
        
        // lights
        const lightOne = new THREE.HemisphereLight(0xFF0000, 0x0000FF, 1)
        const lightTwo = new THREE.PointLight( 0x0000ff, 2, 20 )
        lightTwo.position.set( 0, 0.25, 1 )
    
        // camera
        camera = new THREE.PerspectiveCamera( 45, width / height, 1, 20 )
        camera.position.set(0, 0.25, 2)

        // glb model
        glbLoader.load("3d/models/portal.glb", (glb) => {
            portal = glb.scene

            console.log("portal", portal)

            portal.scale.set(0.05, 0.05, 0.05)
            portal.position.set(0, 0, 0)

            // fill scene
            scene = new THREE.Scene()
            scene.add(camera)
            scene.add(lightOne)
            scene.add(lightTwo)
            scene.add(portal)
        
            res()
        })
    })
}

async function initRenderer(){
    return new Promise(res => {

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

        res()
    })
}

function mainTick(){

    deltaTime += clock.getDelta();
    
    // NOW CHECK IF FRAMERATE IS GOOD
    if( deltaTime >= frameRate ){
        portal.rotation.y += 0.01;

        composer.render();
        // renderer.render(scene, camera);
        deltaTime = deltaTime % frameRate;
    }

    window.requestAnimationFrame(mainTick);
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