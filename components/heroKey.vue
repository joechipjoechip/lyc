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

const props = defineProps({
    wording: {
        type: Object,
        required: true
    }
})


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
const animate = ref(false)
let renderer = null
let composer = null
let renderPass = null
let clock = null
let camera = null
let key = null
let keyTwo = null
let keyMaterial = null
let angle = null

let envMapTexture = null
let deltaTime = 0

// positions
const keyPosition = store.isMobile ? [0,0.35,0] : [0,0.2,0.35]
const anglePosition = store.isMobile ? [-2,0.35,0] : [-0.58,0.37,0]
const cameraPosition =  store.isMobile ? [0, 0.25, 5.15 ] : [0, 0.25, 4.35]


onMounted(() => {
    console.log("mounted du hero key")
    initScene().then(() => initRenderer().then(() => {
        animate.value = true
        mainTick()
    }))
})

onBeforeUnmount(() => {
    animate.value = false
    disposeScene(scene, renderer)
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
        // const lightAmbient = new THREE.AmbientLight( 0xa24dff, 3, 25)
        const lightAmbient = new THREE.AmbientLight( 0xffffff, 5, 25)
        const lightOne = new THREE.PointLight( 0xa24dff, 1, 50)
        // const lightOne = new THREE.PointLight( 0xffffff, 1, 50)

        lightOne.position.set(0, 0.7, 3)
        // lightTwo.position.set(-5, 2, 5)

        // const pointLightHelperOne = new THREE.PointLightHelper( lightOne, 2 );
        // const pointLightHelperTwo = new THREE.PointLightHelper( lightTwo, 2 );
        
    
        // camera
        camera = new THREE.PerspectiveCamera( 15, width / height, 1, 20 )
        camera.position.set(...cameraPosition)


        // glb models
        glbLoader.load("3d/models/key.glb", glb => {
            key = glb.scene

            key.name = "key"
            key.scale.set(0.035, 0.035, 0.035)
            key.position.set(...keyPosition)

            keyTwo = key.clone()
            keyTwo.position.set(0.45, 0, 0)

            initEnvMapAndMaterials(key)
            initEnvMapAndMaterials(keyTwo)

            

            glbLoader.load("3d/models/angle.glb", glb => {
                angle = glb.scene
                angle.name = "angle"
                angle.scale.set(0.2, 0.2, 0.2)
                angle.position.set(...anglePosition)

                initEnvMapAndMaterials(angle)

                scene.add(
                    lightAmbient,
                    lightOne,
                    // lightTwo,
                    camera,
                    key,
                    keyTwo,
                    angle
                )
                
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

                // console.log(child.name)

                if( child.name.includes("emissive") ) {

                    const emissiveMaterial = new THREE.MeshStandardMaterial({ 
                        color: colorEmissive, 
                        emissive: colorEmissive, 
                        emissiveIntensity: emissiveIntentisty
                    })

                    child.material = emissiveMaterial

                } else {

                    // console.log("child name : ", child.name)

                    if( model.name === "key" ){
                        // child.material.envMap = envMapTexture
                        // child.castShadow = true

                        if( child.name === "shader" ){
                            // child.material = new THREE.MeshPhysicalMaterial({
                            //     transmission: 0.4,
                            //     roughness: 0.4,
                            //     envMap: envMapTexture,
                            //     envMapIntensity: 1,
                            //     metalness: 0.55,
                            //     ior: 2.3,
                            //     iridescence: 2.3,
                            //     iridescenceIOR: 2.3,
                            //     reflectivity: 0.25,
                            //     sheenColor: new THREE.Color(0x0000ff),
                            //     clearcoat: 0.8,
                            //     clearcoatRoughness: 0,
                            //     // transparent: true,
                            //     // opacity: 0.7,
                            //     // thickness: 0.8
                            // })

                            console.log("shader layer spotted")

                            child.material = keyMaterial = new THREE.ShaderMaterial({

                                uniforms: {
                                    iTime: { value: 1.0 },
                                    iResolution: { value: new THREE.Vector2(0.6) }
                                },

                                // envMap: envMapTexture,

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

                                    float C_PI = 3.14159265359;


                                    vec3 hash13(float p)
                                    {
                                        vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
                                        p3 += dot(p3, p3.yzx+33.33);
                                        return fract((p3.xxy+p3.yzz)*p3.zyx); 
                                    }


                                    vec3 flower(vec2 p, float t, float id){

                                        vec3 r = hash13(id+floor(t)*13.);    

                                        float lT = fract(-t);
                                        float ilT = 1.-lT;
                                        
                                        lT*=lT;
                                        
                                        float fade = sin(lT*C_PI);
                                        fade = smoothstep(0.0,0.01,fade);
                                        fade*=fract(t);

                                        p+=vec2(r.xy-0.5)*pow(lT,.25);


                                        p*=lT*5.;


                                        float l = length(p);
                                        float m = smoothstep(.9,0.,l);

                                        float a = atan(p.y,p.x);

                                        
                                        a = sin(a*r.x*1.23  + iTime*0.123) * 
                                            sin(a*r.y*2.321 + iTime*1.456) *
                                            sin(a*r.z*1.123 + iTime*0.589) *
                                            sin(a);

                                        l = mix(l,a*(r.x-0.5)*3.*ilT,r.z*0.5+0.2);
                                        
                                        float s1  = smoothstep(.5,0.,l);
                                        float s2  = smoothstep(0.01,0.,l);
                                        float s = (s1-s2)*m;


                                        vec3 c1 =  vec3(sin(s *vec3(0.987,0.765,0.543)*C_PI*2.4));
                                        vec3 c2 =  vec3(sin(s2*vec3(0.13*r.x,0.865*r.y,0.943*r.z)*6.664));

                                        vec3 sOut = (c1*mix(c2,vec3(1.),r.y*0.5+0.5)*c1)*fade;
                                        

                                        return  sOut*l;
                                    }


                                    void main()
                                    {
                                        vec2 uv = vec2(vUv.xy);
                                        uv/=iResolution.xx;

                                        vec3 s = vec3(0.);

                                        const float amount = 10.;
                                        float del = 1./amount;

                                        for(float i = 1.; i <= amount; i++){
                                            s+=flower(uv,iTime*0.05 + del*i,i);
                                        }

                                        gl_FragColor = vec4(pow(s*3.,vec3(0.4545)),1.);
                                    }

                                `
                            })
                        }

                        if( child.name === "transparent" ){
                            child.material = new THREE.MeshPhysicalMaterial({
                                transmission: 1,
                                roughness: 0.05,
                                envMap: envMapTexture,
                                envMapIntensity: 1,
                                metalness: 0.95,
                                ior: 2.3,
                                iridescence: 2.3,
                                iridescenceIOR: 2.3,
                                reflectivity: 0.95,
                                sheenColor: new THREE.Color(0xff0000),
                                clearcoat: 0.8,
                                clearcoatRoughness: 0,
                                transparent: true,
                                opacity: 0.35,
                                // thickness: 0.8
                            })
                        }
                    }

                    if( model.name === "angle" ){

                        if( child.name === "angle" ){

                            child.material = new THREE.MeshPhysicalMaterial({
                                transmission: 0.95,
                                roughness: 0,
                                envMap: envMapTexture,
                                envMapIntensity: 0.9,
                                metalness: 0.5,
                                ior: 1.8,
                                iridescence: 1.8,
                                iridescenceIOR: 1.8,
                                reflectivity: 1,
                                sheen: 1,
                                sheenRoughness: 0,
                                sheenColor: new THREE.Color(0x0000ff),
                                clearcoat: 1,
                                clearcoatRoughness: 0,
                                transparent: true,
                                opacity: 0.7,
                                // thickness: 0.8
                            })
                        }

                        if( child.name === "emissive" ){
                            const colorEmissive = new THREE.Color(0xffffff)

                            const emissiveMaterial = new THREE.MeshStandardMaterial({ 
                                color: colorEmissive, 
                                emissive: colorEmissive, 
                                emissiveIntensity: 1
                            })

                            child.material = emissiveMaterial
                        }
                    }

                }
            }
        })

        res()
    })

}

function initPostProcs(width, height){
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85)
    bloomPass.threshold = 0.5
    bloomPass.strength = 0.25
    bloomPass.radius = 0.45
    composer.addPass(bloomPass)
}

function mainTick(){
    if( !animate.value ){ return }

    deltaTime += clock.getDelta();
    
    // NOW CHECK IF FRAMERATE IS GOOD
    if( deltaTime >= frameRate ){
        key.rotation.y = normalizedPosition.x * 2.9;
        key.rotation.x = normalizedPosition.y * 1.8;

        keyTwo.rotation.y = normalizedPosition.x * 1.9;
        keyTwo.rotation.x = normalizedPosition.y * 2.8;

        angle.rotation.y = normalizedPosition.x * -0.2;
        angle.rotation.x = normalizedPosition.y * -0.2;
        

        // camera.position.set(
        //     normalizedPosition.x * 0.3,
        //     (normalizedPosition.y * 0.25) + 0.1,
        //     cameraPosition[2]
        // )
        // camera.lookAt(0, 0.35, 0)

        // custom shader update
        keyMaterial.uniforms.iTime.value = clock.elapsedTime

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
}

</script>

<template>
    <section 
        id="key"
        class="portal-wrapper"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >

        <canvas ref="canvas"></canvas>

        <MicroHud 
            :text="wording.cta" 
            class="hud" 
            :isHovered="isHovered"
        />

        <h6 class="title" v-html="wording.title"></h6>

        <div class="paragraph" v-for="paragraph in wording.paragraphs" :key="paragraph.id">
            <p v-for="line in paragraph" :key="line.id">
                {{ line }}
            </p>
        </div>

        <img src="/images/core/logo-chrome-typo-and-visu.png" alt="logo lyc">

    </section>

</template>

<style lang="scss" scoped>
    .portal {
        &-wrapper {
            // border: solid 10px green;
            position: relative;
            width: 100%;
            // max-width: calc($layoutMaxWidthDesktop * 1.15);
            margin: 0 auto;
            height: 100vh;
            
            font-size: var(--font-size-big);
            color: var(--color-main-80);

            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
        }
    }

    canvas {
        // border: solid 1px pink;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        
        @media #{$mobile}{
            min-height: 80vh;
        }
    }

    .title,
    .paragraph,
    img {
        z-index: 50;
        text-transform: uppercase;
        font-family: 'Mada Bold';
        color: var(--color-main-100);
    }

    .title {
        margin-top: 5rem;
        font-size: var(--font-size-bigest-plus);
    }
    
    .paragraph {
        text-align: center;
        margin-top: 2rem;
        font-size: var(--font-size-big);

        p {
            line-height: var(--font-size-bigest);
        }
    }

    img {
        // border: solid 1px red;
        width: 35rem;
        position: absolute;
        bottom: 1rem;
        left: calc((100vw - $layoutMaxWidthDesktop) / 2);
    }

</style>