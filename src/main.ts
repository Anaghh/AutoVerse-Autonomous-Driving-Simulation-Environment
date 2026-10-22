import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {EngineMl} from './app/evolution/engine-ml';

const container = document.querySelector<HTMLDivElement>('#world')!;
const canvas = document.querySelector<HTMLCanvasElement>('#network')!;
const status = document.querySelector<HTMLElement>('#status')!;
let cleanup = () => {};
try {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0b1420');
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  camera.position.set(0, 12, 17);
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xd6eeff, 0x48515c, 2));
  const sun = new THREE.DirectionalLight(0xffffff, 2);
  sun.position.set(8, 20, 10);
  scene.add(sun);
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.target.set(0, 0, -1);
  orbit.update();
  const engine = new EngineMl(scene, canvas.getContext('2d')!);
  // Fixed 60 Hz simulation prevents training speed changing with display refresh rate.
  let last = performance.now(), accumulator = 0, frame = 0, disposed = false;
  const resize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  const pause = document.querySelector<HTMLButtonElement>('#pause')!;
  pause.onclick = () => {
    engine.paused = !engine.paused;
    pause.textContent = engine.paused ? 'Resume' : 'Pause';
    pause.setAttribute('aria-pressed', String(engine.paused));
  };
  document.querySelector<HTMLButtonElement>('#save')!.onclick = () => {
    if (!engine.save()) engine.status = 'Current run has not beaten the saved best';
  };
  document.querySelector<HTMLButtonElement>('#reset')!.onclick = () => engine.reset();
  function render(now: number) {
    if (disposed) return;
    accumulator += Math.min((now - last) / 1000, 0.1);
    last = now;
    while (accumulator >= 1 / 60) { engine.update(); accumulator -= 1 / 60; }
    document.querySelector('#generation')!.textContent = String(engine.generation);
    document.querySelector('#alive')!.textContent = engine.carsRunning + ' / ' + engine.carNum;
    document.querySelector('#distance')!.textContent = engine.distance + ' units';
    document.querySelector('#best')!.textContent = engine.bestDistance + ' units';
    status.textContent = engine.paused ? 'Paused' : engine.status;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }
  frame = requestAnimationFrame(render);
  cleanup = () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    orbit.dispose();
    engine.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
  window.addEventListener('pagehide', cleanup, {once: true});
} catch (error) {
  cleanup();
  status.textContent = 'Unable to start the simulation';
  container.textContent = 'AutoVerse needs a browser with WebGL enabled. Check your browser settings and reload.';
  console.error(error);
}

