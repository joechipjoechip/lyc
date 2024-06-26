<script setup>
import gsap from 'gsap';
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { useElementVisibility } from "@vueuse/core" 
import { useGetEventPosition } from '@/composables/getEventPosition'
import { useNormalizePosition } from '@/composables/getNormalizedPosition'
import { disposeScene } from '@/composables/sceneDisposer'
import { clamp } from '@/composables/computes'
import { Benchmark } from '@/composables/benchmark'

import { useMainStore } from '@/stores/main';
import { useLocalStorageStore } from '@/stores/localStorageStore';

const store = useMainStore()
const localStore = useLocalStorageStore()
const { $on } = useNuxtApp()
const isHovered = ref(false)
const curtainIsActive = ref(true)

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const glbLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("js/draco/");
glbLoader.setDRACOLoader(dracoLoader);

const canvas = ref(null)
const canvasIsVisible = useElementVisibility(canvas)
const animate = ref(false)
const scene = new THREE.Scene()
let lightOne = null
let lightTwo = null
let multiplicatorRatio = store.isMobile ? 1 : 2
let canvasBaseRatio = null
let deltaTime = 0
let renderer = null
let composer = null
let renderPass = null
let clock = null
let camera = null
let portal = null
let plane = null
let box = null
let boxMaterial = null
let boxMap = null
let envMapTexture = null
let envMapTextureNight = null
let curtainMaterial = null
let planeTexture = null
const groundTextures = {}

// positions
const portalPosition = store.isMobile ? [0,-0.05,0] : [0,0,0.35]
const boxPosition = store.isMobile ? [0, 0.35, 0.25] : [0, 0.375, 0.75]
const cameraPosition =  store.isMobile ? [0, 0.1, 3] : [0, 0.25, 4.8]
const lookAtPosition =  store.isMobile ? [0, 0.28, 0] : [0, 0.32, 0]
const cameraFov = store.isMobile ? 40 : 22

// effetcs
const vignetteOffset = store.isMobile ? 0.05 : 0.5
const vignetteDarkness = store.isMobile ? 1.05 : 1.75
let bloom = null
let vignette = null
let blurPass = null

// benchmark
let frameRate = 1/60
const idealFPSValueLimit = 45
const benchmark = new Benchmark(frameRate, idealFPSValueLimit)
let benchmarkIsActive = false


onMounted(() => {
    // console.log("mounted du hero portal")
    initScene().then(() => initRenderer().then(() => {

        if( store.isBadComputer ){
            console.log("au mounted, on capte que c'est badComputer direct, donc downgrade()")
            downgrade()
        }

        animate.value = true

        if( store.isMobile || store.isBadComputer ) {
            setTimeout(() => {
                mainTick()
                benchmarkLaunch()
            }, 2000)
        } else {
            mainTick()
            benchmarkLaunch()
        }

        
        
    }))
})

onBeforeUnmount(() => {
    animate.value = false
    disposeScene(scene, renderer)
})

watch(() => canvasIsVisible.value, newVal => {
    if( newVal ){
        renderer && mainTick()
        // console.log("start tick")
    } else {
        // dispose
        // console.log("stop tick")
    }
})

function benchmarkLaunch(){
    if( !store.benchmarkAlreadyDone ){
        benchmarkIsActive = true
        
        setTimeout(() => {
            benchmarkIsActive = false
            store.setBenchmarkAlreadyDone(true)
            benchmarkResultsManager()
        }, 3000)
    }
}

function benchmarkResultsManager(){
    if( benchmark.missingFrames >  70 ){
        console.log("bad computer spotted -> downgrade()")
        store.setIsBadComputer(true)
        downgrade()
    }
    // console.log("missingFrames : ", benchmark.missingFrames)
}

function downgrade(){
    removePostProc()
    handleResize()
    downgradeComposer()
    scene.remove(lightOne)
    scene.remove(lightTwo)
}

function removePostProc(){
    composer.removePass(bloom)
    composer.removePass(vignette)
    composer.removePass(blur)
}

function downgradeComposer(){
    renderer.setPixelRatio(1)
    composer.setPixelRatio(1)
    // composer.removePass(bloom)
    frameRate = 1/45
    multiplicatorRatio = 1
    composer = null
}

$on("main-resize", handleResize)
function handleResize(){
    if( canvas.value ){
        if( !canvas.value.parentNode ){ return }
        const { width } = canvas.value.parentNode.getBoundingClientRect()
        const computedHeight = width / canvasBaseRatio
        renderer && renderer.setSize(width, computedHeight)
        composer && composer.setSize(width * multiplicatorRatio, computedHeight * multiplicatorRatio)
    }
}


$on("main-touch-move", handleTouchMove)
const normalizedPosition = reactive({ x: 0, y: 0 })
function handleTouchMove(event){
    if( localStore.gyroIsAllowed ){ return }

    const { x, y } = useGetEventPosition(event)
    const { normalizedX, normalizedY } = useNormalizePosition(x, y)
    normalizedPosition.x = normalizedX
    normalizedPosition.y = normalizedY

    // console.log("normalizedPosition.x", normalizedPosition.x)
}

$on("main-device-motion", handleGyro)

function handleGyro(event){
    const { x, y, z } = event.accelerationIncludingGravity
    const animatedObject = { x: normalizedPosition.x, y: normalizedPosition.y }

    // console.log("gyro y : ", y)

    gsap.to(animatedObject, {
        x: clamp(x / 1.5, -1.5, 1.5),
        y: clamp((y * 35 + 300) / 9, -0.25, 9),
        duration: 0.2,
        ease: "linear",
        onUpdate: () => {
            normalizedPosition.x = animatedObject.x
            normalizedPosition.y = animatedObject.y
        }
    })
}

async function initScene(){
    return new Promise(res => {
        const { width, height } = canvas.value.getBoundingClientRect()
    
        // lights
        const lightAmbient = new THREE.AmbientLight( 0xffffff, 5.7)
        
        // camera
        camera = new THREE.PerspectiveCamera( cameraFov, width / height, 0.001, 25 )
        camera.position.set(...cameraPosition)

        // textures loads
        groundTextures.color = textureLoader.load("3d/textures/heroPortal/ground/aerial_beach_01_diff.jpg")
        groundTextures.roughness = textureLoader.load("3d/textures/heroPortal/ground/aerial_beach_01_rough.jpg")
        groundTextures.displacement = textureLoader.load("3d/textures/heroPortal/ground/aerial_beach_01_disp.jpg")
        groundTextures.alpha = textureLoader.load("3d/textures/heroPortal/ground/aerial_beach_01_alpha.jpg")
        planeTexture = textureLoader.load("3d/textures/heroPortal/background-pyramid-last-large1.jpg")
        boxMap = textureLoader.load("3d/textures/box/boxMap.jpg")

        // glb models
        glbLoader.load("3d/models/portal.glb", glb => {
            portal = glb.scene

            portal.name = "portal"
            portal.scale.set(0.05, 0.05, 0.05)
            portal.position.set(...portalPosition)

            initEnvMapAndMaterials(portal).then(() => {
                // fill scene
                // scene.background = envMapTexture
				// scene.environment = envMapTexture

                glbLoader.load("3d/models/box.glb", (glb) => {
                    box = glb.scene

                    box.name = "box"
                    box.scale.set(0.45, 0.45, 0.45)
                    box.position.set(...boxPosition)

                    initEnvMapAndMaterials(box)

                    scene.add(
                        portal, 
                        box,
                        camera,
                        lightAmbient
                    )

                    if( !store.isBadComputer ){
                        lightOne = new THREE.PointLight( 0x96e7ff, 30, 50)
                        lightTwo = new THREE.PointLight( 0x631fff, 30, 50)

                        lightOne.position.set(3, 6, -10)
                        lightTwo.position.set(0, 3, -10)
                        
                        scene.add(lightOne)
                        scene.add(lightTwo)
                    }
                    
                    res()
                })
            
            })

        })

       
    })
}

async function initRenderer(){
    return new Promise(res => {
        const { width, height } = canvas.value.getBoundingClientRect()
        canvasBaseRatio = width / height
    
        renderer = new THREE.WebGLRenderer({
            canvas: canvas.value,
            antialias: true,
            // precision: "highp"
        });
    
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // renderer.setClearColor();

        renderer.outputColorSpace = THREE.SRGBColorSpace
        // renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = THREE.PCFShadowMap;
        // render.toneMapping = THREE.ACESFilmicToneMapping
    
        
        composer = new EffectComposer(renderer)
        composer.setSize(width * multiplicatorRatio, height * multiplicatorRatio)
        composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderPass = new RenderPass(scene, camera)
        composer.addPass(renderPass)

        initPostProcs(width, height)
        
        clock = new THREE.Clock()

        res()
    })
}

async function initEnvMapAndMaterials(model){

    const colorEmissive = new THREE.Color(model.name === "portal" ? 0x4BBCFF : 0x7724cf)
    const emissiveIntentisty = model.name === "portal" ? 30 : 35

    return new Promise(res => {

        const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
        envMapTexture = cubeTextureLoader.load(
            [
                "3d/envMap/3/px.png",
                "3d/envMap/3/nx.png",
                "3d/envMap/3/py.png",
                "3d/envMap/3/ny.png",
                "3d/envMap/3/pz.png",
                "3d/envMap/3/nz.png",
            ]
        )

        envMapTextureNight = cubeTextureLoader.load(
            [
                "3d/envMap/5/px.png",
                "3d/envMap/5/nx.png",
                "3d/envMap/5/py.png",
                "3d/envMap/5/ny.png",
                "3d/envMap/5/pz.png",
                "3d/envMap/5/nz.png",
            ]
        )

		envMapTexture.mapping = THREE.CubeRefractionMapping;
		envMapTextureNight.mapping = THREE.CubeRefractionMapping;

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

                    if( model.name === "portal" ){

                        if( child.name === "gate" ){
                            child.castShadow = true
                            child.material = new THREE.MeshPhysicalMaterial({
                                transmission: 1,
                                roughness: 0.15,
                                envMap: envMapTextureNight,
                                envMapIntensity: 0.95,
                                metalness: 0.95,
                                ior: 2.3,
                                iridescence: 2.3,
                                iridescenceIOR: 2,
                                reflectivity: 1,
                                sheenColor: new THREE.Color(0x780bfe),
                                clearcoat: 1.8,
                                clearcoatRoughness: 0,
                                transparent: true,
                                opacity: 0.95,
                                thickness: 1
                            })
                        }

                        if( child.name === "curtain" ){
                            
                            child.material = curtainMaterial = new CustomShaderMaterial({

                                baseMaterial: THREE.MeshPhysicalMaterial,

                                uniforms: {
                                    iTime: { value: 1.0 },
                                    iResolution: { value: new THREE.Vector2(1) }
                                },

                                vertexShader: `
                                    varying vec2 vUv;
                                    varying vec2 iResolution;
                                    void main()
                                    {
                                        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                                        vec4 viewPosition = viewMatrix * modelPosition;
                                        vec4 projectedPosition = projectionMatrix * viewPosition;
                                        csm_PositionRaw = projectedPosition;
                                        //csm_Position = position * vec3(1.0);
                                        vUv = uv;
                                    }
                                `,
                                fragmentShader: `
                                    uniform float iTime;
                                    uniform vec2 iResolution;

                                    varying vec2 vUv;

                                    // float PI = 3.14159265359;
                                    
                                    vec2 rot(vec2 p,float a)
                                    {
                                        float c=cos(a*10.);
                                        float s=sin(a*10.);
                                        return p*mat2(s,c,c,-s);
                                    }

                                    void main()
                                    {
                                        vec2 uv = vec2(vUv.xy);
                                        // vec2 uv = clamp(vUv.xy,0.,0.8);
                                        uv/=iResolution.xx;
                                        uv=vec2(.125,.75)+(uv-vec2(-.9125,.75))*.23;
                                        float T=iTime;

                                        vec3 c = clamp(1.-.4*vec3(
                                            length(uv-vec2(.01,0)),
                                            length(uv-vec2(.1,1.2)),
                                            length(uv-vec2(.05,1))
                                        ),0.,1.)*1.7-1.;

                                        vec3 c0=vec3(csm_Emissive);
                                        float w0=0.;
                                        const float N=9.;
                                        for(float i=0.;i<N;i++)
                                        {
                                            float wt=(i*i/N/N-.2)*.3;
                                            float wp=.5+(i+1.)*(i+22.5)*0.0001;
                                            // here
                                            float wb=.48+i/N*0.001;
                                            c.zx=rot(c.zx,1.6+T*0.65*wt+(uv.x+.7)*3.*wp);
                                            c.xy=rot(c.xy,c.z*c.x*wb+1.7+T*wt+(uv.y+1.1)*15.*wp);
                                            c.yz=rot(c.yz,c.x*c.y*wb+2.4-T*0.79*wt+(uv.x+uv.y*(fract(i/5.)-0.925)*2.)*1.*wp);
                                            c.zx=rot(c.zx,c.y*c.z*wb+1.6-T*0.65*wt+(uv.x+.17)*23.*wp);
                                            c.xy=rot(c.xy,c.z*c.x*wb+1.7-T*wt+(uv.y+1.1)*15.*wp);
                                            float w=(1.5-i/N)*.5;
                                            c0+=c*w;
                                            //c0/=csm_Metalness;
                                            w0+=w;
                                        }
                                        c0=c0/w0*1.9+.5;//*(1.-pow(uv.y-.5,2.)*2.)*10.+.5;
                                        c0*=.5+dot(c0,vec3(1,1,1))/sqrt(2.)*.6;
                                        c0+=pow(length(sin(c0*.5))/sqrt(3.)*1.0,20.)*(.3+.7*c0);
                                        //c0 = clamp(c0, 0., uv.y);

                                        // Limitation du blanc
                                        float threshold = 0.9; // Seuil de seuillage
                                        vec3 att = vec3(1.0 / (1.0 + exp(-0.5 * (c0.r - threshold))));
                                        c0 = c0 * att;

                                        // Gestion constrast/light
                                        float contrast = 0.99; // Contraste
                                        float brightness = 0.7; // Luminosité
                                        c0 = (c0 - 0.5) * contrast + brightness;
                                        // c0.r = clamp(c0.r, 0., 0.9);
                                        // c0.g = clamp(c0.g, 0.2, 0.8);
                                        // c0.b = clamp(c0.b, 0., 0.9);
                                        
                                        csm_FragColor=vec4(c0,1.);
                                    }
                                `,

                                emissive: new THREE.Color(0x0000FF),

                            })
                        }

                        if( child.name === "ground" ){
                            // child.receiveShadow = true
                            child.material = new THREE.MeshStandardMaterial({ 
                                metalnessMap: groundTextures.displacement,
                                metalness: 0.92,
                                map: groundTextures.color,
                                envMap: envMapTexture,
                                envMapIntensity: 0.9,

                                aoMap: groundTextures.displacement,
                                aoMapIntensity: 0.95,
                                roughnessMap: groundTextures.roughness,
                                roughness: 1,

                                alphaMap: groundTextures.alpha,
                                transparent: true
                            })

                        }

                        if( child.name === "plane" ){
                            plane = child
                            planeTexture.center.x = 0.5;
                            planeTexture.center.y = 0.5;
                            planeTexture.rotation = Math.PI * 1;

                            child.material = new THREE.MeshBasicMaterial({ 
                                map: planeTexture
                            })
                        }
                    }

                    if( model.name === "box" ){
                         
                        // child.castShadow = true
                        // child.material = new THREE.MeshPhysicalMaterial( {
                        //     transmission: 1.3,
                        //     roughness: 0.3,
                        //     envMap: envMapTexture,
                        //     envMapIntensity: 1,
                        //     metalness: 0.85,
                        //     ior: 1.9,
                        //     iridescence: 2,
                        //     iridescenceIOR: 2.3,
                        //     reflectivity: 0.95,
                        //     sheenColor: new THREE.Color(0xfe34e3),
                        //     clearcoat: 0.8,
                        //     clearcoatRoughness: 0,
                        //     transparent: true,
                        //     opacity: 0.75,
                        //     thickness: 0.8
                        // })

                        child.material = boxMaterial = new THREE.MeshPhongMaterial( {
                            reflectivity: 1,
                            refractionRatio: 0.75,
                            specularMap: boxMap,
                            envMap: envMapTextureNight,
                            color: new THREE.Color(0x924944),
                            emissive: new THREE.Color(0xd9d9d9),
                            // emissiveIntentisty: 10,
                            specular: new THREE.Color(0x76749c),
                            shininess: 90,
                            transparent: true,
                            opacity: 0.75
                        })

                        boxMaterial.combine = parseInt( THREE.MultiplyOperation );
                        boxMaterial.needsUpdate = true;
                    }

                }
            }
        })

        res()
    })

}

function initPostProcs(width, height){
    
    if( !store.isBadComputer ){
        bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85)
        bloom.threshold = 0.212
        bloom.strength = 0.24
        bloom.radius = 0.92
    
        composer.addPass(bloom)


        vignette = new ShaderPass( VignetteShader );
    
        vignette.uniforms["offset"].value = vignetteOffset
        vignette.uniforms["darkness"].value = vignetteDarkness
        
    
        const blurConfig = {
            focus: cameraPosition[2] - portalPosition[2],
            aperture: 0.0025,
            maxblur: 0.002
        }
    
        blurPass = new BokehPass( 
            scene, 
            camera, 
            {
                ...blurConfig,
                width: width,
                height: height
            }
        );

        composer.addPass(vignette)
        composer.addPass(blurPass)
    }

}

function mainTick(){
    if( !animate.value ){ return }
    if( curtainIsActive.value ) { curtainIsActive.value = false }

    deltaTime += clock.getDelta();
    
    // NOW CHECK IF FRAMERATE IS GOOD
    if( deltaTime >= frameRate ){

        if( benchmarkIsActive ){
            benchmark.computeFPS()
        }

        portal.rotation.y = normalizedPosition.x * 0.3;
        plane.rotation.z = normalizedPosition.x * -0.1;
        plane.position.x = normalizedPosition.x * 20;
        // portal.rotation.x = normalizedPosition.y * -0.05;

        // box.rotation.y = normalizedPosition.x * 0.9;
        // box.rotation.x = normalizedPosition.y * -0.4;
        // box.position.z = boxPosition[2] + normalizedPosition.y * -0.4;
        box.rotation.set(
            localStore.gyroIsAllowed ? 
                clamp(normalizedPosition.y * -0.15, -0.4, 0.4)  
                : normalizedPosition.y * -0.4,
            normalizedPosition.x * 0.9,
            0
        )

        camera.position.set(
            normalizedPosition.x * 0.3,
            ((normalizedPosition.y + 1) * 0.1) - cameraPosition[1],
            cameraPosition[2]
        )
        camera.lookAt(...lookAtPosition)

        // custom shader update
        curtainMaterial.uniforms.iTime.value = clock.elapsedTime

        if( !store.isBadComputer ){
            composer.render();
        } else {
            renderer.render(scene, camera);
        }
        deltaTime = deltaTime % frameRate;
    }

    // console.log("hey tick")
    canvasIsVisible.value && window.requestAnimationFrame(mainTick);
}

</script>

<template>
    <section class="portal-wrapper" id="portal">

        <div class="curtain" :class="{ curtainIsActive }">
            <IconsLoading />
        </div>

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

            &::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 10%;
                background: linear-gradient(to top, black 0%, transparent 100%);
            }
        }
    }

    canvas {
        // border: solid 1px pink;
        width: 100%;
        height: calc(100vh - 18rem);
        // min-height: 70vh;
        
        @media #{$mobile}{
            height: calc(100vh - 30rem);
        }

        @media #{ $landscape }{
            height: calc(100vh);
        }
        
    }

    .curtain {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--color-contrast-100);
        // background-color: red;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;

        opacity: 0;
        pointer-events: none;

        transition: opacity var(--transitionDurationMediumPlus);

        &.curtainIsActive {
            opacity: 1;
        }
    }
</style>