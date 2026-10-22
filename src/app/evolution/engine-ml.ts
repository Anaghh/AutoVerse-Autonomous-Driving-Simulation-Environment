import {Scene} from 'three';
import {Road} from './road';
import {Car} from './car';
import {NeuralNetwork} from './neural-network';
import {Visualizer} from './visualizer';
import {disposeObject} from './resources';
import {makePopulation, parseCheckpoint, STORAGE_KEY} from './checkpoint';

export class EngineMl {
  readonly carNum = 40;
  cars: Car[] = [];
  car?: Car;
  road: Road;
  generation = 1;
  steps = 0;
  bestRun = 0;
  champion: NeuralNetwork | null = null;
  paused = false;
  status = 'Training';
  constructor(private scene: Scene, private networkCtx: CanvasRenderingContext2D) {
    try { this.champion = parseCheckpoint(localStorage.getItem(STORAGE_KEY)); }
    catch { this.status = 'Browser storage unavailable; training in memory'; }
    this.road = new Road(512, 1024);
    scene.add(this.road);
    this.startRace();
  }
  get carsRunning() { return this.cars.filter(car => car.isOn).length; }
  get bestDistance() { return Math.floor(this.champion?.distance ?? 0); }
  get distance() { return Math.floor(this.bestRun); }
  startRace() {
    this.cars.forEach(disposeObject);
    this.road.reset();
    this.bestRun = 0;
    this.steps = 0;
    this.cars = makePopulation(this.champion, this.carNum).map((brain, uid) => {
      const car = new Car(0, 0, this.road);
      car.position.set(0, 0.3, 6);
      car.uid = uid;
      car.carBrain.brain = brain;
      this.scene.add(car);
      return car;
    });
    this.car = this.cars[0];
    this.car.smart = true;
  }
  save() {
    const leader = this.cars.reduce((best, car) => car.y < best.y ? car : best);
    const distance = Math.max(0, -leader.y);
    if (distance <= (this.champion?.distance ?? 0)) return false;
    const brain = structuredClone(leader.carBrain.brain);
    brain.version = (this.champion?.version ?? 0) + 1;
    brain.distance = distance;
    this.champion = brain;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brain));
      this.status = 'Best controller saved';
    } catch { this.status = 'Best controller retained in memory; storage unavailable'; }
    return true;
  }
  nextGeneration() {
    this.save();
    this.generation++;
    this.startRace();
  }
  reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* In-memory reset still works. */ }
    this.champion = null;
    this.generation = 1;
    this.status = 'Training restarted';
    this.startRace();
  }
  update() {
    if (this.paused) return;
    this.steps++;
    this.road.car = this.car;
    this.road.update();
    // Raycasting must see this tick's transforms before the renderer runs.
    this.scene.updateMatrixWorld(true);
    for (const car of this.cars) {
      car.update(this.steps / 60);
      car.updateMatrixWorld(true);
    }
    const alive = this.cars.filter(car => car.isOn);
    this.car = alive.reduce<Car | undefined>((best, car) => !best || car.y < best.y ? car : best, undefined);
    this.bestRun = Math.max(this.bestRun, ...this.cars.map(car => -car.y));
    this.cars.forEach(car => car.smart = car === this.car);
    if (this.car) Visualizer.drawNetwork(this.networkCtx, this.car.carBrain.brain);
    // Bound each generation to 30 simulated seconds, even if a controller survives.
    if (!alive.length || this.steps >= 1800) this.nextGeneration();
  }
  dispose() {
    this.cars.forEach(disposeObject);
    this.road.texture.dispose();
    disposeObject(this.road);
  }
}

