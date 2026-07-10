import * as THREE
from "https://unpkg.com/three@0.165.0/build/three.module.js";

import { EffectComposer }
from "https://unpkg.com/three@0.165.0/examples/jsm/postprocessing/EffectComposer.js";

import { RenderPass }
from "https://unpkg.com/three@0.165.0/examples/jsm/postprocessing/RenderPass.js";

import { UnrealBloomPass }
from "https://unpkg.com/three@0.165.0/examples/jsm/postprocessing/UnrealBloomPass.js";
/* =====================================================
   CORE
===================================================== */

let scene;
let camera;
let renderer;
let composer;

let neuralGroup;
let DViewNode;
let dashboardNode;
let cameraNode;
let chatNode;

let raycaster;
let mouse;

let animationClock;

let targetScale = 1;
const scaleVector = new THREE.Vector3();

const clickableObjects = [];

let dashboardCallback = null;
let cameraCallback = null;
let chatCallback = null;

/* =====================================================
   INIT
===================================================== */

export function initScene(canvas) {

    scene = new THREE.Scene();

    animationClock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = 7;

    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    createBloom();
    createLights();
    createNeuralSphere();
    createInteractiveNodes();
    createBackgroundParticles();

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener(
        "pointerdown",
        handlePointer
    );

    window.addEventListener(
        "resize",
        handleResize
    );

    animate();
}

/* =====================================================
   BLOOM
===================================================== */

function createBloom() {

    composer = new EffectComposer(renderer);

    const renderPass =
        new RenderPass(scene, camera);

    composer.addPass(renderPass);

    const bloomPass =
        new UnrealBloomPass(
            new THREE.Vector2(
                window.innerWidth,
                window.innerHeight
            ),
            1.2,
            0.4,
            0.8
        );

    bloomPass.threshold = 0;
    bloomPass.strength = 1.6;
    bloomPass.radius = 0.5;

    composer.addPass(bloomPass);
}

/* =====================================================
   LIGHTS
===================================================== */

function createLights() {

    const ambient =
        new THREE.AmbientLight(
            0x00ffff,
            0.7
        );

    scene.add(ambient);

    const point =
        new THREE.PointLight(
            0x00ffff,
            8,
            50
        );

    point.position.set(
        0,
        0,
        8
    );

    scene.add(point);
}

/* =====================================================
   NEURAL SPHERE
===================================================== */

function createNeuralSphere() {

    neuralGroup = new THREE.Group();

    scene.add(neuralGroup);

    const material =
        new THREE.MeshBasicMaterial({
            color: 0x00ffff
        });

    const geometry =
        new THREE.SphereGeometry(
            0.035,
            8,
            8
        );

    const points = [];

    for (let i = 0; i < 500; i++) {

        const phi =
            Math.acos(
                -1 + (2 * i) / 500
            );

        const theta =
            Math.sqrt(
                800 * Math.PI
            ) * phi;

        const x =
            Math.cos(theta) *
            Math.sin(phi);

        const y =
            Math.sin(theta) *
            Math.sin(phi);

        const z =
            Math.cos(phi);

        const node =
            new THREE.Mesh(
                geometry,
                material
            );

        node.position.set(
            x * 2.2,
            y * 2.2,
            z * 2.2
        );

        neuralGroup.add(node);

        points.push(
            new THREE.Vector3(
                x * 2.2,
                y * 2.2,
                z * 2.2
            )
        );
    }

    createConnections(points);
}

/* =====================================================
   CONNECTIONS
===================================================== */

function createConnections(points) {

    const lineMaterial =
        new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.12
        });

    const maxDistance = 0.55;

    const positions = [];

    for (let i = 0; i < points.length; i++) {

        for (
            let j = i + 1;
            j < points.length;
            j++
        ) {

            const distance =
                points[i].distanceTo(
                    points[j]
                );

            if (distance < maxDistance) {

                positions.push(
                    points[i].x,
                    points[i].y,
                    points[i].z
                );

                positions.push(
                    points[j].x,
                    points[j].y,
                    points[j].z
                );
            }
        }
    }

    const geometry =
        new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );

    const lines =
        new THREE.LineSegments(
            geometry,
            lineMaterial
        );

    neuralGroup.add(lines);
}

/* =====================================================
   INTERACTIVE NODES
===================================================== */

function createInteractiveNodes() {

    const geometry =
        new THREE.SphereGeometry(
            0.18,
            32,
            32
        );

    dashboardNode =
        createNode(
            geometry,
            -1.6,
            0.8,
            1.8
        );

    cameraNode =
        createNode(
            geometry,
            1.6,
            -0.8,
            1.8
        );

    chatNode =
        createNode(
            geometry,
            0,
            1.7,
            1.8
        );
    DViewNode =
        createNode(
            geometry,
            0,
            -1.7,
            1.8
        );
    clickableObjects.push(
        dashboardNode,
        cameraNode,
        chatNode
    );
}

function createNode(
    geometry,
    x,
    y,
    z
) {

    const mesh =
        new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({
                color: 0x00ffff
            })
        );

    mesh.position.set(
        x,
        y,
        z
    );

    neuralGroup.add(mesh);

    return mesh;
}

/* =====================================================
   STARFIELD
===================================================== */

function createBackgroundParticles() {

    const count = 3000;

    const geometry =
        new THREE.BufferGeometry();

    const positions = [];

    for (let i = 0; i < count; i++) {

        positions.push(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80
        );
    }

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({
            color: 0x00ffff,
            size: 0.03,
            transparent: true,
            opacity: 0.7
        });

    const stars =
        new THREE.Points(
            geometry,
            material
        );

    scene.add(stars);
}

/* =====================================================
   INTERACTION
===================================================== */

function handlePointer(event) {

    mouse.x =
        (event.clientX /
            window.innerWidth) *
            2 -
        1;

    mouse.y =
        -(
            event.clientY /
            window.innerHeight
        ) *
            2 +
        1;

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const hits =
        raycaster.intersectObjects(
            clickableObjects
        );

    if (!hits.length) return;

    const object =
        hits[0].object;

    if (
        object === dashboardNode &&
        dashboardCallback
    ) {
        dashboardCallback();
    }

    if (
        object === cameraNode &&
        cameraCallback
    ) {
        cameraCallback();
    }

    if (
        object === chatNode &&
        chatCallback
    ) {
        chatCallback();
    }
}

/* =====================================================
   CALLBACKS
===================================================== */

export function setDashboardCallback(fn) {
    dashboardCallback = fn;
}

export function setCameraCallback(fn) {
    cameraCallback = fn;
}

export function setChatCallback(fn) {
    chatCallback = fn;
}

/* =====================================================
   ZOOM
===================================================== */

export function zoomIn() {
    targetScale = 8;
}

export function zoomOut() {
    targetScale = 1;
}

/* =====================================================
   FPS
===================================================== */

let frameCounter = 0;
let lastFpsUpdate = performance.now();
let currentFPS = 0;

export function getFPS() {
    return currentFPS;
}

/* =====================================================
   ANIMATE
===================================================== */

function animate() {

    requestAnimationFrame(
        animate
    );

    const elapsed =
        animationClock.getElapsedTime();

    neuralGroup.rotation.y +=
        0.002;

    neuralGroup.rotation.x +=
        0.0006;

    dashboardNode.scale.setScalar(
        1 +
            Math.sin(
                elapsed * 3
            ) *
                0.15
    );

    cameraNode.scale.setScalar(
        1 +
            Math.sin(
                elapsed * 3 + 1
            ) *
                0.15
    );

    chatNode.scale.setScalar(
        1 +
            Math.sin(
                elapsed * 3 + 2
            ) *
                0.15
    );

    scaleVector.set(
        targetScale,
        targetScale,
        targetScale
    );

    neuralGroup.scale.lerp(
        scaleVector,
        0.04
    );

    frameCounter++;

    const now =
        performance.now();

    if (
        now - lastFpsUpdate >
        1000
    ) {

        currentFPS =
            frameCounter;

        frameCounter = 0;

        lastFpsUpdate = now;
    }

    composer.render();
}

/* =====================================================
   RESIZE
===================================================== */

function handleResize() {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    composer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}