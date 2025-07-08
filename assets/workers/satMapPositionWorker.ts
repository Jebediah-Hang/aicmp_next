import { twoline2satrec, propagate, eciToGeodetic, gstime, degreesLat, degreesLong } from 'satellite.js';
import type { EciVec3 } from 'satellite.js';
import type { Satellite, OrbitWorkerMessage } from '@/types/models/satellite';

let allSatellites: Array<Satellite> = [];
let displaySatellites: Array<Satellite> = [];

self.onmessage = (e: MessageEvent) => {
  const { type, data } = <OrbitWorkerMessage<Array<any>>>e.data;

  // 加载全部satellite基础信息
  if (type === 'initSat') {
    allSatellites = <Array<Satellite>>data;
  }

  // 设置位置显示
  if (type === 'setDisplay') {
    displaySatellites = allSatellites.filter(sat => (<Array<string>>data).includes(sat.cosparId));
  }

  // 计算位置
  if (type === 'calcPos') {
    const now = new Date();

    const results = displaySatellites.map(sat => {
      const { cosparId, name, tleLine1, tleLine2 } = sat;

      const satrec = twoline2satrec(tleLine1, tleLine2);
      const positionAndVelocity = propagate(satrec, now);
      const positionGd = eciToGeodetic(<EciVec3<number>>positionAndVelocity.position, gstime(now));

      const latitude = degreesLat(positionGd.latitude);
      const longitude = degreesLong(positionGd.longitude);

      return { cosparId, name, data: [[longitude, latitude]] };
    })

    self.postMessage({ data: results });
  }
};
