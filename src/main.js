import * as THREE from 'three';
import { GUI } from 'dat.gui';

function createSierpinski(level, size, position = new THREE.Vector3()) {
  if (level === 0) {
    const geometry = new THREE.TetrahedronGeometry(size);
    const material = new THREE.MeshNormalMaterial();
    const tetra = new THREE.Mesh(geometry, material);
    tetra.position.copy(position);
    return [tetra];
  }

  const newSize = size / 2;
  const offsets = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(newSize, 0, 0),
    new THREE.Vector3(newSize / 2, newSize * Math.sqrt(3) / 2, 0),
    new THREE.Vector3(newSize / 2, newSize * Math.sqrt(3) / 6, newSize * Math.sqrt(6) / 3),
  ];

  let children = [];
  for (let offset of offsets) {
    const newPos = new THREE.Vector3().addVectors(position, offset);
    children.push(...createSierpinski(level - 1, newSize, newPos));
  }
  return children;
}

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let group = new THREE.Group();
scene.add(group);

function generateFractal(level) {
  group.clear();
  const fractals = createSierpinski(level, 1);
  fractals.forEach(f => group.add(f));
}

const settings = {
  level: 2,
  rotationSpeed: 0.003,
};

generateFractal(settings.level);

// GUI
const gui = new GUI();
gui.add(settings, 'level', 0, 4, 1).name('Fractal Level').onChange(() => {
  generateFractal(settings.level);
});
gui.add(settings, 'rotationSpeed', 0.001, 0.05).name('Rotation Speed');

// Animate
function animate() {
  requestAnimationFrame(animate);
  group.rotation.y += settings.rotationSpeed;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
