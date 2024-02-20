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
let curtainMaterial = null

// positions
const portalPosition = store.isMobile ? [0,0.35,0] : [0,0,0]
const boxPosition = store.isMobile ? [0, 0.75, 0] : [0, 0.4, 0]
const cameraPosition =  store.isMobile ? [0, 0.25, 3.15 ] : [0, 0.25, 2.35]



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
        const lightOne = new THREE.AmbientLight( 0xffffff, 0.9)
    
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
            antialias: true,
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

                    if( model.name === "portal" ){

                        if( child.name === "gate" ){
                            child.material = new THREE.MeshPhysicalMaterial( {
                                transmission: 1,
                                roughness: 0.15,
                                envMap: envMapTexture,
                                envMapIntensity: 0.5,
                                metalness: 0.95,
                                ior: 1.9,
                                iridescence: 1.9,
                                iridescenceIOR: 2,
                                reflectivity: 0.9,
                                sheenColor: new THREE.Color(0x780bfe),
                                clearcoat: 1.8,
                                clearcoatRoughness: 0,
                                transparent: true,
                                opacity: 0.99,
                                thickness: 0.8
                            })
                        }

                        if( child.name === "curtain" ){

                            child.material = curtainMaterial = new THREE.ShaderMaterial({

                                uniforms: {
                                    iTime: { value: 1.0 },
                                    iResolution: { value: new THREE.Vector2(2) }
                                },

                                vertexShader: `
                                    varying vec2 vUv;
                                    varying vec2 iResolution;
                                    void main()
                                    {
                                        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                                        vec4 viewPosition = viewMatrix * modelPosition;
                                        vec4 projectedPosition = projectionMatrix * viewPosition;
                                        gl_Position = projectedPosition;
                                        vUv = uv;
                                    }
                                `,
                                fragmentShader: `
                                    uniform float iTime;
                                    uniform vec2 iResolution;

                                    varying vec2 vUv;

                                    float PI = 3.14159265359;
                                    
                                    vec2 rot(vec2 p,float a)
                                    {
                                        float c=cos(a*15.);
                                        float s=sin(a*15.);
                                        return p*mat2(s,c,c,-s);
                                    }

                                    void main()
                                    {
                                        vec2 uv = vec2(vUv.xy);
                                        // vec2 uv = clamp(vUv.xy,0.,0.8);
                                        uv/=iResolution.xx;
                                        uv=vec2(.125,.75)+(uv-vec2(-0.9125,.75))*.23;
                                        float T=iTime*0.75;

                                        vec3 c = clamp(1.-.4*vec3(
                                            length(uv-vec2(.1,0)),
                                            length(uv-vec2(.01,0)),
                                            length(uv-vec2(.05,1))
                                            ),0.,1.)*2.-1.;

                                        vec3 c0=vec3(0);
                                        float w0=0.;
                                        const float N=30.;
                                        for(float i=0.;i<N;i++)
                                        {
                                            float wt=(i*i/N/N-.2)*.3;
                                            float wp=0.5+(i+1.)*(i+2.5)*0.0001;
                                            float wb=.005+i/N*0.1;
                                            c.zx=rot(c.zx,1.6+T*0.65*wt+(uv.x+.7)*23.*wp);
                                            c.xy=rot(c.xy,c.z*c.x*wb+1.7+T*wt+(uv.y+1.1)*15.*wp);
                                            c.yz=rot(c.yz,c.x*c.y*wb+2.4-T*0.79*wt+(uv.x+uv.y*(fract(i/5.)-0.925)*2.)*17.*wp);
                                            c.zx=rot(c.zx,c.y*c.z*wb+1.6-T*0.65*wt+(uv.x+.17)*23.*wp);
                                            c.xy=rot(c.xy,c.z*c.x*wb+1.7-T*wt+(uv.y+1.1)*15.*wp);
                                            float w=(1.5-i/N)*.5;
                                            c0+=c*w;
                                            w0+=w;
                                        }
                                        c0=c0/w0*1.9+.5;//*(1.-pow(uv.y-.5,2.)*2.)*10.+.5;
                                        c0*=.5+dot(c0,vec3(1,1,1))/sqrt(3.)*.4;
                                        c0+=pow(length(sin(c0*PI*10.))/sqrt(3.)*1.0,20.)*(.03+.7*c0);
                                        c0 = clamp(c0, 0., vUv.x);
                                        gl_FragColor=vec4(c0,1.0);
                                    }
                                `
                            })
                        }
                    }

                    if( model.name === "box" ){
                        child.material = new THREE.MeshPhysicalMaterial( {
                            transmission: 1.7,
                            roughness: 0.3,
                            envMap: envMapTexture,
                            envMapIntensity: 1,
                            metalness: 0.85,
                            ior: 1.9,
                            iridescence: 2,
                            iridescenceIOR: 2.3,
                            reflectivity: 0.95,
                            sheenColor: new THREE.Color(0xfe34e3),
                            clearcoat: 0.8,
                            clearcoatRoughness: 0,
                            transparent: true,
                            opacity: 0.75,
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
    bloomPass.threshold = 0.005
    bloomPass.strength = 0.27
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

        curtainMaterial.uniforms.iTime.value = clock.elapsedTime;

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
        // min-height: 70vh;
        
        @media #{$mobile}{
            min-height: 80vh;
        }
    }
</style>