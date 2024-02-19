<script setup>
import * as THREE from 'three'
import { gsap } from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { useElementVisibility } from "@vueuse/core" 
import { useGetEventPosition } from '@/composables/getEventPosition'
import { useNormalizePosition } from '@/composables/getNormalizedPosition'

import { useMainStore } from '@/stores/main';

const store = useMainStore()

const { $on } = useNuxtApp()
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
let box = null
let envMapTexture = null
let deltaTime = 0

// positions
const portalPosition = [0,0,0]
const boxPosition = [0, 0.5, 0]
const cameraPosition = [0, 0.25, store.isMobile ? 3.2 : 2.35]



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

$on("main-touch-move", handleTouchMove)
const normalizedPosition = reactive({ x: 0, y: 0 })

function handleTouchMove(event){
    if( store.gyroIsAllowed ){ return }

    const { x, y } = useGetEventPosition(event)
    const { normalizedX, normalizedY } = useNormalizePosition(x, y)
    normalizedPosition.x = normalizedX
    normalizedPosition.y = normalizedY
}

async function initScene(){
    return new Promise(res => {

        const { width, height } = canvas.value.getBoundingClientRect()
    
        // lights
        const lightOne = new THREE.AmbientLight( 0xffffff, 0.5)
    
        // camera
        camera = new THREE.PerspectiveCamera( 45, width / height, 1, 20 )
        camera.position.set(...cameraPosition)

        // glb models
        glbLoader.load("3d/models/portal.glb", (glb) => {
            portal = glb.scene

            portal.name = "portal"
            portal.scale.set(0.05, 0.05, 0.05)
            portal.position.set(...portalPosition)

            initEnvMapAndMaterials(portal).then(() => {
                // fill scene
                scene = new THREE.Scene()
                scene.add(camera)
                scene.add(lightOne)
                scene.add(portal)

                glbLoader.load("3d/models/box.glb", (glb) => {
                    box = glb.scene

                    box.name = "box"
                    box.scale.set(0.5, 0.5, 0.5)
                    box.position.set(...boxPosition)

                    initEnvMapAndMaterials(box)

                    scene.add(box)
                    
                    res()
                })
            
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

async function initEnvMapAndMaterials(model){

    const colorEmissive = new THREE.Color(model.name === "portal" ? 0x4BBCFF : 0xffdc5f)
    const emissiveIntentisty = model.name === "portal" ? 30 : 8

    return new Promise(res => {

        const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
        envMapTexture = cubeTextureLoader.load(
            [
                "3d/envMap/1/px.png",
                "3d/envMap/1/nx.png",
                "3d/envMap/1/py.png",
                "3d/envMap/1/ny.png",
                "3d/envMap/1/pz.png",
                "3d/envMap/1/nz.png",
            ]
        )

        model.traverse((child) => {
            if(child instanceof THREE.Mesh){

                console.log(child.name)

                if( child.name.includes("emissive") ) {

                    const emissiveMaterial = new THREE.MeshStandardMaterial({ 
                        color: colorEmissive, 
                        emissive: colorEmissive, 
                        emissiveIntensity: emissiveIntentisty
                    })

                    child.material = emissiveMaterial

                } else {

                    if( model.name === "portal" ){
                        child.material = new THREE.MeshPhysicalMaterial( {
                            transmission: 1,
                            roughness: 0.05,
                            envMap: envMapTexture,
                            envMapIntensity: 0.55,
                            metalness: 0.75,
                            ior: 0.9,
                            iridescence: 1,
                            iridescenceIOR: 2,
                            reflectivity: 0.9,
                            sheenColor: new THREE.Color(0x780bfe),
                            clearcoat: 0.8,
                            clearcoatRoughness: 0,
                            transparent: 0.5,
                            opacity: 0.95,
                            thickness: 0.8
                        })
                    }

                    if( model.name === "box" ){
                        child.material = new THREE.MeshPhysicalMaterial( {
                            transmission: 1.3,
                            roughness: 0.3,
                            envMap: envMapTexture,
                            envMapIntensity: 1,
                            metalness: 0.8,
                            ior: 0.9,
                            iridescence: 1,
                            iridescenceIOR: 1.3,
                            reflectivity: 0.55,
                            sheenColor: new THREE.Color(0xfe34e3),
                            clearcoat: 0.8,
                            clearcoatRoughness: 0,
                            transparent: true,
                            opacity: 0.85,
                            thickness: 0.8
                        })
                    }

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
    bloomPass.radius = 0.15
    composer.addPass(bloomPass)
}

function mainTick(){

    deltaTime += clock.getDelta();
    
    // NOW CHECK IF FRAMERATE IS GOOD
    if( deltaTime >= frameRate ){
        portal.rotation.y = normalizedPosition.x * 0.7;
        portal.rotation.x = normalizedPosition.y * -0.05;

        box.rotation.y = normalizedPosition.x * 1.4;
        box.rotation.x = normalizedPosition.y * -0.6;

        composer.render();
        // renderer.render(scene, camera);
        deltaTime = deltaTime % frameRate;
    }

    // console.log("hey tick")
    canvasIsVisible.value && window.requestAnimationFrame(mainTick);
}

// - - - - 
$on("main-device-motion", handleGyro)
const gyroEvent = ref()

function handleGyro(event){
    const { x, y } = event.accelerationIncludingGravity
    const goToX = x.toFixed(3) / 4
    const goToY = y.toFixed(3) / 6

    makeTween(goToX, goToY)

    console.log("x gyro : ", normalizedPosition.x)
}

function makeTween(goToX, goToY){
    const animatedObject = {
        x: normalizedPosition.x,
        y: normalizedPosition.y
    }

    gsap.to(animatedObject, {
        duration: 0.099,
        x: goToX,
        y: goToY,
        
        onUpdate: () => {
            normalizedPosition.x = animatedObject.x
            normalizedPosition.y = animatedObject.y
        }
    })

}

</script>

<template>
    <section class="portal-wrapper">

        <canvas ref="canvas"></canvas>

        <p>{{ gyroEvent }}</p>

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

        @media #{$mobile}{
            height: 80vh;
        }
    }
</style>