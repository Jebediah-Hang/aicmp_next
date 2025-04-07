<template>
  <div class="wrapper">
    <div ref="container" class="three-container"></div>
  </div>
</template>

<script setup lang="ts">
import {
  Scene,
  WebGLRenderer,
  TextureLoader,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  SphereGeometry,
  BufferGeometry,
  Mesh,
  Line,
  Sprite,
  MeshPhongMaterial,
  LineBasicMaterial,
  SpriteMaterial,
  BufferAttribute,
  CanvasTexture,
  Vector3,
  LinearFilter
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gstime } from 'satellite.js';
import { getPosition } from 'suncalc';
import type { Satellite, EarthOrbitConfig } from '@/types/models/satellite';

const props = defineProps<{
  satelliteList: Array<Satellite>;
  orbitDisplay: Array<string>;
  positionDisplay: Array<string>;
  graphConfig: EarthOrbitConfig;
}>();

watch(() => props.satelliteList, (data) => {
  orbitWorker?.postMessage({ type: 'initSat', data: toRaw(data) });
  positionWorker?.postMessage({ type: 'initSat', data: toRaw(data) });
});

watch(() => props.orbitDisplay, (data, oldData) => {
  orbitWorker?.postMessage({ type: 'setDisplay', data: toRaw(data) });
  clearOrbitGraph(oldData);
  lastOrbitUpdateTime = -Infinity;
});

watch(() => props.positionDisplay, (data, oldData) => {
  positionWorker?.postMessage({ type: 'setDisplay', data: toRaw(data) });
  oldData.forEach(cosparId => {
    scene.remove(satelliteMeshGroup[cosparId]);
    delete satelliteMeshGroup[cosparId];
  });
  lastPositonUpdateTime = -Infinity;
});

watch(() => props.graphConfig, (data) => {
  orbitWorker?.postMessage({ type: 'setConfig', data: toRaw(data) });
  clearOrbitGraph();
  lastOrbitUpdateTime = -Infinity;
});

function clearOrbitGraph(displayOrbitSatList: Array<string> = props.orbitDisplay) {
  displayOrbitSatList.forEach(cosparId => {
    scene.remove(orbitLineGroup[cosparId]);
    delete orbitGeometryGroup[cosparId];
    delete orbitLineGroup[cosparId];
  });
}

const allSatellite = computed(() => {
  const data: Record<string, Satellite> = {};
  props.satelliteList.forEach(sat => data[sat.cosparId] = sat);
  return data;
});

const container = useTemplateRef('container');

const initNowTime = new Date();
const earthInitRotationRad = gstime(initNowTime);
const earthRotationSpeed = 0.00007292123516990375;

let scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer, controls: OrbitControls;
let earthMesh: Mesh, directionalLight: DirectionalLight;

let orbitWorker: Worker | null = null;
let positionWorker : Worker | null = null;

function initScene() {

  const { clientWidth, clientHeight } = <HTMLDivElement>container.value;

  scene = new Scene();

  camera = new PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(clientWidth, clientHeight);
  container.value?.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.rotateSpeed = 0.35;
  controls.enablePan = false;

  const geometry = new SphereGeometry(2, 64, 64);
  const textureLoader = new TextureLoader();
  const earthTexture = textureLoader.load('/api/static/image?name=earth.jpg');
  const material = new MeshPhongMaterial({ map: earthTexture });
  earthMesh = new Mesh(geometry, material);

  // 调整地球初始自转角
  earthMesh.rotation.y = earthInitRotationRad;
  scene.add(earthMesh);

  // 平行光模拟太阳光
  directionalLight = new DirectionalLight(0xffffff, 4);
  directionalLight.position.set(0, 0, 1);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const ambientLight = new AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);

  const hemisphereLight = new HemisphereLight(0xb0b0b0, 0xb0b0b0, 0.2);
  scene.add(hemisphereLight);

  const spaceTexture = textureLoader.load('/api/static/image?name=starfield.jpg');
  scene.background = spaceTexture;
}

// 模拟太阳光照
function initSunshine() {

  // 匹配地球初始旋转角度
  const earthInitDeg = 180 / Math.PI * earthInitRotationRad;
  const pointFixLongitude = earthInitDeg < 90 ? (-90 - earthInitDeg) : (270 - earthInitDeg);
  const sunPosition = getPosition(initNowTime, 0, pointFixLongitude);

  // 方位角和高度角
  const azimuth = sunPosition.azimuth;
  const altitude = sunPosition.altitude;

  // 平行光位置
  const x = -Math.sin(azimuth);
  const y = -Math.cos(azimuth);
  const z = Math.tan(altitude);

  directionalLight.position.set(x, y, z);
};

let rafId: number = 0;
let frameTime: number = 0;

let lastOrbitUpdateTime: number = -Infinity;
let lastPositonUpdateTime: number = -Infinity;

const orbitUpdateFrequency = computed(() => props.graphConfig.updateFrequency * 1000);
const positionUpdateFrequency = computed(() => props.graphConfig.positionFrequency * 1000);

function animate(timestamp: number) {
  rafId = requestAnimationFrame(animate);

  const deltaTime = timestamp - frameTime;
  earthMesh.rotation.y += earthRotationSpeed * deltaTime / 1000;

  if (props.orbitDisplay.length) {
    // 计算轨迹
    if (timestamp - lastOrbitUpdateTime >= orbitUpdateFrequency.value) {
      lastOrbitUpdateTime = timestamp;
      orbitWorker?.postMessage({ type: 'calcOrbit' });
    }
  }

  if (props.positionDisplay.length) {

    // 更新位置标记缩放
    const cameraPosition = camera.position;
    const cameraWorldDirection = camera.getWorldDirection(new Vector3());
    Object.values(satelliteMeshGroup).forEach(satelliteMesh => {
      const satellitePosition = satelliteMesh.position;
      const distance = cameraPosition.distanceTo(satellitePosition);
      const diff = new Vector3().subVectors(satellitePosition, cameraPosition);
      const scaleFactor = distance / 6;
      const screenCenterDistance = Math.abs(diff.dot(cameraWorldDirection));
      const correctedScale = scaleFactor * (screenCenterDistance / distance);
      satelliteMesh.scale.set(correctedScale, correctedScale, correctedScale);
    });

    // 计算位置
    if (timestamp - lastPositonUpdateTime >= positionUpdateFrequency.value) {
      lastPositonUpdateTime = timestamp;
      positionWorker?.postMessage({ type: 'calcPos' });
    }
  }

  controls.update();
  renderer.render(scene, camera);

  frameTime = timestamp;
}

function onWindowResize() {
  const { clientWidth, clientHeight } = <HTMLDivElement>container.value;
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight);
}

const orbitGeometryGroup: Record<string, BufferGeometry> = {};
const orbitLineGroup: Record<string, Line> = {};

function initOrbitWorker() {
  orbitWorker = new Worker(new URL('@/assets/workers/satEarthOrbitWorker.ts', import.meta.url), { type: 'module' });

  orbitWorker.onmessage = (e: MessageEvent) => {
    const { data: orbitData }: { data: object } = e.data;

    Object.entries(orbitData).forEach(([cosparId, data]: [cosparId: string, data: Float32Array ]) => {

      // 创建轨迹线
      if (!orbitGeometryGroup[cosparId]) {
        const orbitGeometry = new BufferGeometry();
        orbitGeometry.setAttribute('position', new BufferAttribute(new Float32Array(data.length), 3));
        orbitGeometryGroup[cosparId] = orbitGeometry;
        const orbitMaterial = new LineBasicMaterial({ color: allSatellite.value[cosparId].color });
        const orbitLine = new Line(orbitGeometry, orbitMaterial);
        orbitLineGroup[cosparId] = orbitLine;
        scene.add(orbitLine);
      }

      // 更新点集
      const position = orbitGeometryGroup[cosparId].attributes.position.array;
      position.forEach((point, index) => position[index] = data[index]);
      orbitGeometryGroup[cosparId].attributes.position.needsUpdate = true;
    });
  };
}

const satelliteMeshGroup: Record<string, Mesh> = {};

function initPositionWorker() {
  positionWorker = new Worker(new URL('@/assets/workers/satEarthPositionWorker.ts', import.meta.url), { type: 'module' });

  positionWorker.onmessage = (e: MessageEvent) => {
    const { data: posData }: { data: object } = e.data;

    Object.entries(posData).forEach(([cosparId, pos]: [cosparId: string, pos: Vector3]) => {

      // 创建物体
      if (!satelliteMeshGroup[cosparId]) {
        const satelliteGeometry = new SphereGeometry(0.04, 32, 32);
        const satelliteMaterial = new MeshPhongMaterial({ color: allSatellite.value[cosparId].color, shininess: 100 });
        const satelliteMesh = new Mesh(satelliteGeometry, satelliteMaterial);

        const satelliteLabel = createSatelliteLabel(`${cosparId}-${allSatellite.value[cosparId].name}`);
        if (satelliteLabel) {
          satelliteMesh.add(satelliteLabel);
        }

        satelliteMeshGroup[cosparId] = satelliteMesh;
        scene.add(satelliteMesh);
      }

      // 更新位置
      satelliteMeshGroup[cosparId].position.copy(pos);
    });
  };
}

// 创建label
function createSatelliteLabel(label: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 128;

  if (context) {
    context.font = '32px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, canvas.width / 2, canvas.height / 2);

    const labelTexture = new CanvasTexture(canvas);
    labelTexture.minFilter = LinearFilter;
    labelTexture.magFilter = LinearFilter;
    const labelMaterial = new SpriteMaterial({ map: labelTexture });
    const labelSprite = new Sprite(labelMaterial);
    labelSprite.position.set(0, 0.2, 0);

    return labelSprite;
  }
}

onMounted(() => {
  if (!import.meta.env.SSR) {
    initScene();
    initSunshine();

    initOrbitWorker();
    initPositionWorker();

    rafId = requestAnimationFrame(animate);
    window.addEventListener('resize', onWindowResize);
  }
});

onUnmounted(() => {
  renderer?.dispose();
  
  orbitWorker?.terminate();
  positionWorker?.terminate();

  cancelAnimationFrame(rafId);
  window.removeEventListener('resize', onWindowResize);
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .three-container {
    width: 100%;
    height: 100%;
  }
}
</style>
