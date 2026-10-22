import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Scene} from 'three';
import {NeuralNetwork} from '../src/app/evolution/neural-network';
import {makePopulation, parseCheckpoint, STORAGE_KEY} from '../src/app/evolution/checkpoint';
import {CarBrain} from '../src/app/evolution/car-brain';
import {EngineMl} from '../src/app/evolution/engine-ml';

test('checkpoint parsing rejects malformed and incompatible data', () => {
  const brain = new NeuralNetwork([9,5,5,2]);
  assert.ok(parseCheckpoint(JSON.stringify(brain)));
  for (const raw of [null, '{', '{}', JSON.stringify(new NeuralNetwork([2,2]))]) assert.equal(parseCheckpoint(raw), null);
  brain.levels[0].weights[0][0] = Infinity;
  assert.equal(parseCheckpoint(JSON.stringify(brain)), null);
});

test('mutation preserves the champion and isolates candidate arrays', () => {
  const champion = new NeuralNetwork([9,5,5,2]);
  const before = JSON.stringify(champion);
  const population = makePopulation(champion, 4);
  assert.equal(JSON.stringify(champion), before);
  assert.equal(JSON.stringify(population[0]), before);
  population[1].levels[0].weights[0][0] = 99;
  assert.notEqual(population[0].levels[0].weights[0][0], 99);
  assert.notEqual(population[2].levels[0].weights[0][0], 99);
});

test('lane normalization stays finite when side readings are missing', () => {
  assert.equal(CarBrain.prototype.calculate(0,0), 0);
  assert.equal(CarBrain.prototype.calculate(1,1), 0);
  assert.equal(CarBrain.prototype.calculate(0,1), 1);
});

function fixture() {
  const values = new Map<string,string>();
  Object.defineProperty(globalThis, 'localStorage', {configurable:true, value:{
    getItem:(key:string)=>values.get(key) ?? null,
    setItem:(key:string,value:string)=>values.set(key,value),
    removeItem:(key:string)=>values.delete(key)
  }});
  const context = {fillRect(){},setLineDash(){},beginPath(){},moveTo(){},lineTo(){},stroke(){}};
  Object.defineProperty(globalThis, 'document', {configurable:true, value:{
    createElement:()=>({getContext:()=>context})
  }});
  const scene = new Scene();
  return {scene, values, engine:new EngineMl(scene, {} as CanvasRenderingContext2D)};
}

test('generation restart removes and disposes old vehicles', () => {
  const {scene, engine} = fixture();
  const oldCars = [...engine.cars];
  const count = scene.children.length;
  let disposed = false;
  oldCars[0].mesh.geometry.addEventListener('dispose', ()=>disposed = true);
  engine.startRace();
  assert.equal(scene.children.length, count);
  assert.ok(oldCars.every(car=>car.parent === null));
  assert.equal(disposed, true);
  engine.dispose();
  assert.equal(scene.children.length, 0);
});

test('saving requires improvement and reset clears the checkpoint', () => {
  const {engine,values} = fixture();
  engine.cars[0].y = -20;
  assert.equal(engine.save(), true);
  assert.equal(engine.bestDistance, 20);
  assert.ok(parseCheckpoint(values.get(STORAGE_KEY)!));
  engine.cars[0].y = -10;
  assert.equal(engine.save(), false);
  assert.equal(engine.bestDistance, 20);
  engine.reset();
  assert.equal(values.has(STORAGE_KEY), false);
  assert.equal(engine.generation, 1);
  assert.equal(engine.champion, null);
  engine.dispose();
});

test('paused updates leave simulation state unchanged', () => {
  const {engine} = fixture();
  engine.paused = true;
  engine.update();
  assert.equal(engine.steps, 0);
  assert.equal(engine.cars[0].y, 0);
  engine.dispose();
});
