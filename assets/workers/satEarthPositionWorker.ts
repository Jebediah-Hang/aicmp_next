import { twoline2satrec, propagate } from 'satellite.js';
import type { EciVec3 } from 'satellite.js';
import { Vector3 } from 'three';
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
    const pointGroups: Record<string, Vector3> = {};

    displaySatellites.forEach(sat => {
      const { cosparId, tleLine1, tleLine2 } = sat;
      const satrec = twoline2satrec(tleLine1, tleLine2);

      const positionAndVelocity = propagate(satrec, now);
      const positionEci = positionAndVelocity.position;

      if (positionEci) {
        const { x, y, z } = <EciVec3<number>>positionEci;

        // 转换ECI匹配three坐标，并按地球比例缩放
        pointGroups[cosparId] = new Vector3(x, z, -y).divideScalar(3185);
      }
    });

    self.postMessage({ data: pointGroups });
  }
};
