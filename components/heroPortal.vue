<script setup>
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { useElementVisibility } from "@vueuse/core" 

const loadingManager = new THREE.LoadingManager();
const glbLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("js/draco/");
glbLoader.setDRACOLoader(dracoLoader);

const canvas = ref(null)
const canvasIsVisible = useElementVisibility(canvas)
const frameRate = 1/60
let renderer = null
let composer = null
let renderPass = null
let clock = null
let camera = null
let scene = null
let portal = null
let envMapTexture = null
let deltaTime = 0

onMounted(() => {
    console.log("mounted du hero portal")
    initScene().then(() => initRenderer().then(() => mainTick()))
})

watch(() => canvasIsVisible.value, newVal => {
    if( newVal ){
        renderer && mainTick()
    } else {
        // dispose ?
    }
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
        const lightOne = new THREE.AmbientLight( 0xffffff, 0.05)
    
        // camera
        camera = new THREE.PerspectiveCamera( 45, width / height, 1, 20 )
        camera.position.set(0, 0.25, 2)

        // glb model
        glbLoader.load("3d/models/portal.glb", (glb) => {
            portal = glb.scene

            console.log("portal", portal)

            portal.scale.set(0.05, 0.05, 0.05)
            portal.position.set(0, 0, 0)

            initEnvMap().then(() => {
                // fill scene
                scene = new THREE.Scene()
                scene.add(camera)
                scene.add(lightOne)
                scene.add(portal)
            
                res()
            })

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
    
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        // renderer.setClearColor();
        // renderer.outputEncoding = THREE.sRGBEncoding
        renderer.outputColorSpace = THREE.SRGBColorSpace
        // renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = THREE.PCFShadowMap;
    
        
        composer = new EffectComposer(renderer)
        composer.setSize(width, height)
        composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderPass = new RenderPass(scene, camera)
        composer.addPass(renderPass)

        initPostProcs(width, height)
        
        clock = new THREE.Clock()

        res()
    })
}

async function initEnvMap(){

    return new Promise(res => {

        const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
        envMapTexture = cubeTextureLoader.load(
            [
                "3d/envMap/0/px.jpg",
                "3d/envMap/0/nx.jpg",
                "3d/envMap/0/py.jpg",
                "3d/envMap/0/ny.jpg",
                "3d/envMap/0/pz.jpg",
                "3d/envMap/0/nz.jpg",
            ]
        )

        portal.traverse((child) => {
            if(child instanceof THREE.Mesh){

                console.log(child.name)

                if( child.name.includes("emissive") ) {

                    const emissiveMaterial = new THREE.MeshStandardMaterial({ 
                        color: 0x4BBCFF, 
                        emissive: 0x4BBCFF, 
                        emissiveIntensity: 30
                    })

                    child.material = emissiveMaterial

                    console.log("emissive spotted and replaced")

                } else {
                    child.material.envMap = envMapTexture;
                    child.material.envMapIntensity = 0.45;
                    // child.material.transparent = true;
                    // child.material.opacity = 0.7;
                    child.material.metalness = 0.9;
                    child.material.roughness = 0.05;
                }
            }
        })

        res()
    })

}

function initPostProcs(width, height){
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85)
    bloomPass.threshold = 0.05
    bloomPass.strength = 0.35
    bloomPass.radius = 0.95
    composer.addPass(bloomPass)
}

function mainTick(){

    deltaTime += clock.getDelta();
    
    // NOW CHECK IF FRAMERATE IS GOOD
    if( deltaTime >= frameRate ){
        portal.rotation.y -= 0.0025;

        composer.render();
        // renderer.render(scene, camera);
        deltaTime = deltaTime % frameRate;
    }

    // console.log("hey tick")
    canvasIsVisible.value && window.requestAnimationFrame(mainTick);
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
            // border: solid 10px green;
            font-size: var(--font-size-big);
            color: var(--color-main-80);
        }
    }

    canvas {
        // border: solid 1px pink;
        width: 100%;
    }
</style>