import * as THREE from "https://cdn.skypack.dev/three@0.130.1/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.130.1/examples/jsm/controls/OrbitControls.js";
import {ARButton} from "https://cdn.skypack.dev/three@0.130.1/examples/jsm/webxr/ARButton.js";

const canvas = document.querySelector(".webxr");

// Scene
const scene = new THREE.Scene()

// Cube 
const box = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color:0x00ff00})
const mesh = new THREE.Mesh(box, material)
scene.add(mesh) 

// Sizes 
const sizes = {
    width: innerWidth,
    height: innerHeight
}

// Camera 
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.z = 5;
scene.add(camera)

const controls = new OrbitControls(camera, canvas)

// Renderer
const renderer = new THREE.WebGLRenderer(
    {
        canvas:canvas
    }
)
renderer.setSize(sizes.width, sizes.height)

// Enable XR
renderer.xr.enabled = true;

document.body.appendChild(renderer.domElement)

controls.enableDamping = true 
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    mesh.rotation.y = elapsedTime * 2
    mesh.position.z = Math.sin(elapsedTime)
    controls.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}

tick()

console.log("Hello World")

const button = ARButton.createButton(renderer);
document.body.appendChild(button);
