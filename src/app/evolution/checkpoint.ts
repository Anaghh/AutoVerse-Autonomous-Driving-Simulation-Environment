import {NeuralNetwork} from './neural-network';

export const STORAGE_KEY = 'autoverse.controller.v1';
export function parseCheckpoint(raw: string | null): NeuralNetwork | null {
  try {
    const value = JSON.parse(raw ?? 'null');
    const sizes = [9, 5, 5, 2];
    if (!value || !Number.isInteger(value.version) || value.version < 0 ||
        !Number.isFinite(value.distance) || value.distance < 0 || value.levels?.length !== 3) return null;
    for (let n = 0; n < 3; n++) {
      const level = value.levels[n];
      if (level.inputs?.length !== sizes[n] || level.outputs?.length !== sizes[n + 1] ||
          level.biases?.length !== sizes[n + 1] || !level.biases.every(Number.isFinite) ||
          level.weights?.length !== sizes[n] ||
          !level.weights.every((row: number[]) => Array.isArray(row) && row.length === sizes[n + 1] && row.every(Number.isFinite))) return null;
    }
    return value;
  } catch { return null; }
}

export function makePopulation(champion: NeuralNetwork | null, count: number): NeuralNetwork[] {
  return Array.from({length: count}, (_, index) => {
    const brain = champion ? structuredClone(champion) : new NeuralNetwork([9, 5, 5, 2]);
    if (champion && index > 0) NeuralNetwork.mutate(brain, 0.1);
    return brain;
  });
}

