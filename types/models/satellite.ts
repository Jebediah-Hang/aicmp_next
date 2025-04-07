export interface Satellite {
  id: number;
  name: string;
  cosparId: string;
  tleLine1: string;
  tleLine2: string;
  color: string;
}

export type SatellitePos = [number, number];

export type GraphType = 'earth' | 'map';

export interface GraphValueLimit {
  historyMax: number;
  futureMax: number;
}

export interface SatOrbitConfig {
  historyLength: number;
  futureLength: number;
  sampleInterval: number;
  updateFrequency: number;
  positionFrequency: number;
}

export interface MapOrbitConfig extends SatOrbitConfig {}

export interface EarthOrbitConfig extends SatOrbitConfig {}

export interface OrbitWorkerMessage<T> {
  type: string;
  data: T;
}
