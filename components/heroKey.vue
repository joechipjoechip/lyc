<script setup>
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { useElementVisibility } from "@vueuse/core" 
import { useGetEventPosition } from '@/composables/getEventPosition'
import { useNormalizePosition } from '@/composables/getNormalizedPosition'
import { disposeScene } from '@/composables/sceneDisposer'

import { useMainStore } from '@/stores/main';
const store = useMainStore()
const { $on } = useNuxtApp()
const isHovered = ref(false)

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const glbLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("js/draco/");
glbLoader.setDRACOLoader(dracoLoader);

const canvas = ref(null)
const canvasIsVisible = useElementVisibility(canvas)
const frameRate = 1/60
const scene = new THREE.Scene()
let renderer = null
let composer = null
let renderPass = null
let clock = null
let camera = null
let key = null

let envMapTexture = null
let deltaTime = 0
let curtainMaterial = null
let planeTexture = null
const groundTextures = {}

// positions
const keyPosition = store.isMobile ? [0,0.35,0] : [0,0,0.35]
const cameraPosition =  store.isMobile ? [0, 0.25, 5.15 ] : [0, 0.25, 4.35]

onMounted(() => {
    console.log("mounted du hero portal")
    initScene().then(() => initRenderer().then(() => mainTick()))
})

watch(() => canvasIsVisible.value, newVal => {
    if( newVal ){
        renderer && mainTick()
        console.log("start tick")
    } else {
        // dispose
        console.log("stop tick")
    }
})

$on("main-touch-move", handleTouchMove)
const normalizedPosition = reactive({ x: 0, y: 0 })

function handleTouchMove(event){
    if( store.gyroIsAllowed ){ return }
    if( !store.gyroIsAllowed && !isHovered.value ){ return }

    const { x, y } = useGetEventPosition(event)
    const { normalizedX, normalizedY } = useNormalizePosition(x, y, canvas.value)
    normalizedPosition.x = normalizedX
    normalizedPosition.y = normalizedY
}

async function initScene(){

    // scene.fog = new THREE.Fog(0xffffff, 5, 8.5);

    return new Promise(res => {

        const { width, height } = canvas.value.getBoundingClientRect()
    
        // lights
        const lightAmbient = new THREE.AmbientLight( 0xa24dff, 1,25)
        const lightOne = new THREE.PointLight( 0xa24dff, 5, 50)
        // const lightTwo = new THREE.PointLight( 0xffa129, 30, 50)

        lightOne.position.set(0, 0,5, 3)
        // lightTwo.position.set(-5, 2, 5)

        // const pointLightHelperOne = new THREE.PointLightHelper( lightOne, 2 );
        // const pointLightHelperTwo = new THREE.PointLightHelper( lightTwo, 2 );
        
    
        // camera
        camera = new THREE.PerspectiveCamera( 22, width / height, 1, 20 )
        camera.position.set(...cameraPosition)


        // glb models
        glbLoader.load("3d/models/key.glb", glb => {
            key = glb.scene

            key.name = "key"
            key.scale.set(0.05, 0.05, 0.05)
            key.position.set(...keyPosition)

            initEnvMapAndMaterials(key)

            scene.add(
                lightAmbient,
                lightOne,
                // lightTwo,
                camera,
                key
            )

            res()
            
        })       
    })
}

async function initRenderer(){
    return new Promise(res => {

        const { width, height } = canvas.value.getBoundingClientRect()
    
        renderer = new THREE.WebGLRenderer({
            canvas: canvas.value,
            // antialias: true,
            // precision: "highp"
        });
    
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        // renderer.setClearColor();
        // renderer.outputEncoding = THREE.sRGBEncoding
        renderer.outputColorSpace = THREE.SRGBColorSpace
        // renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = THREE.PCFShadowMap;
    
        
        composer = new EffectComposer(renderer)
        composer.setSize(width * 2, height * 2)
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
    const emissiveIntentisty = model.name === "portal" ? 30 : 12

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

                    console.log("child name : ", child.name)

                    if( model.name === "key" ){
                        // child.castShadow = true
                        child.material = new THREE.MeshPhysicalMaterial({
                            transmission: 0.4,
                            roughness: 0.02,
                            envMap: envMapTexture,
                            envMapIntensity: 1,
                            metalness: 0.55,
                            ior: 2.3,
                            iridescence: 2.3,
                            iridescenceIOR: 2.3,
                            reflectivity: 0.25,
                            sheenColor: new THREE.Color(0x0000ff),
                            clearcoat: 0.8,
                            clearcoatRoughness: 0,
                            transparent: true,
                            opacity: 0.7,
                            // thickness: 0.8
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
    bloomPass.threshold = 0.0005
    bloomPass.strength = 0.5
    bloomPass.radius = 0.35
    composer.addPass(bloomPass)
}

function mainTick(){

    deltaTime += clock.getDelta();
    
    // NOW CHECK IF FRAMERATE IS GOOD
    if( deltaTime >= frameRate ){
        key.rotation.y = normalizedPosition.x * 0.9 + 20;
        key.rotation.x = normalizedPosition.y * 1.8;
        

        // camera.position.set(
        //     normalizedPosition.x * 0.3,
        //     (normalizedPosition.y * 0.25) + 0.1,
        //     cameraPosition[2]
        // )
        // camera.lookAt(0, 0.35, 0)

        // custom shader update
        // curtainMaterial.uniforms.iTime.value = clock.elapsedTime;

        composer.render();
        // renderer.render(scene, camera);
        deltaTime = deltaTime % frameRate;
    }

    // console.log("hey tick")
    canvasIsVisible.value && window.requestAnimationFrame(mainTick);
}

// - - - - 
$on("main-device-motion", handleGyro)

function handleGyro(event){
    const { x, y, z } = event.accelerationIncludingGravity
    normalizedPosition.x = x / 4
    normalizedPosition.y = z / 6

    console.log("x gyro : ", normalizedPosition.z)
}

</script>

<template>
    <section class="portal-wrapper">

        <canvas 
            ref="canvas"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
        ></canvas>

    </section>

</template>

<style lang="scss" scoped>
    .portal {
        &-wrapper {
            // border: solid 10px green;
            font-size: var(--font-size-big);
            color: var(--color-main-80);

            position: relative;

            // &::after {
            //     content: "";
            //     position: absolute;
            //     bottom: 0;
            //     left: 0;
            //     width: 100%;
            //     height: 15rem;
            //     background: linear-gradient(to top, black 0%, transparent 100%);
            // }
        }
    }

    canvas {
        // border: solid 1px pink;
        width: 100%;
        height: 100vh;
        // min-height: 70vh;
        
        @media #{$mobile}{
            min-height: 80vh;
        }

        
    }
</style>