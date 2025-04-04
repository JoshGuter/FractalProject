import * as THREE from 'three';

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

const fractals = createSierpinski(2, 1);
fractals.forEach(f => scene.add(f));

// Animate
function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.003;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
