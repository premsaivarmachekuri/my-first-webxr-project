import * as THREE from "https://cdn.skypack.dev/three@0.130.1/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.130.1/examples/jsm/controls/OrbitControls.js";
import { ARButton } from "https://cdn.skypack.dev/three@0.130.1/examples/jsm/webxr/ARButton.js";

const canvas = document.querySelector(".webxr");

// Scene
const scene = new THREE.Scene();

// Cube 
const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(box, material);
scene.add(mesh);

// Sizes 
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

// Enable XR
renderer.xr.enabled = true;

document.body.appendChild(renderer.domElement);

controls.enableDamping = true;
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  mesh.rotation.y = elapsedTime * 2;
  mesh.position.y = Math.sin(elapsedTime);
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

// Start AR session and place virtual object in real world
let arSession = null;
const button = ARButton.createButton(renderer);
button.addEventListener("click", function () {
  if (arSession === null) {
    renderer.xr.getSession().then(function (session) {
      arSession = session;
      arSession.addEventListener("end", function () {
        arSession = null;
      });
      // create AR session object and start placing objects in the real world
      createARSessionObject();
    });
  } else {
    arSession.end();
  }
});

// create AR session object
function createARSessionObject() {
  // create XRFrameOfReferenceType object
  const referenceSpaceType = "local-floor";
  const referenceSpace = renderer.xr.getReferenceSpace();
  const frameOfRef = new THREE.XRFrameOfReferenceType(
    referenceSpaceType,
    referenceSpace
  );

  // create XRAnchorSystem object
  const anchorSystem = new THREE.XRAnchorSystem(arSession, frameOfRef);

  // create virtual object and place it in the real world using an anchor point
  const virtualObject = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  );
  virtualObject.position.set(0, 0.5, -1);
  scene.add(virtualObject);

  // listen for 'select' event to create anchor point and place virtual object
  renderer.xr.addEventListener("select", function (event) {
    const anchorPoint = anchorSystem.createAnchorPoint(event.frame);
    if (anchorPoint) {
      virtualObject.position.set(0, 0, 0);
      anchorPoint.add(virtualObject);
      scene.add(anchorPoint);
    }
  });
}

tick();
console.log("Hello World");
document.body.appendChild(button);
