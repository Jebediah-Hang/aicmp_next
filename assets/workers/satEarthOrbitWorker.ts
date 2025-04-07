import { twoline2satrec, propagate } from 'satellite.js';
import type { EciVec3 } from 'satellite.js';
import { Vector3 } from 'three';
import type { Satellite, EarthOrbitConfig, OrbitWorkerMessage } from '@/types/models/satellite';
import { defaultEarthOrbitGraphConfig } from '@/utils/constant';

let allSatellites: Array<Satellite> = [];
let displaySatellites: Array<Satellite> = [];

const orbitGraphConfig: EarthOrbitConfig = {
  ...defaultEarthOrbitGraphConfig,
  sampleInterval: defaultEarthOrbitGraphConfig.sampleInterval * 1000,
  updateFrequency: defaultEarthOrbitGraphConfig.updateFrequency * 1000,
  positionFrequency: defaultEarthOrbitGraphConfig.positionFrequency * 1000
};

const orbitTimeRange = { start: 0, end: 0 };
const orbitPointGroup: Record<string, Array<number>> = {};

// 记录变更状态
let changeStatus = false;

function resetAll() {
  Object.keys(orbitPointGroup).forEach(cosparId => delete orbitPointGroup[cosparId]);
  orbitTimeRange.start = 0;
  orbitTimeRange.end = 0;
}

self.onmessage = (e: MessageEvent) => {
  const { type, data } = <OrbitWorkerMessage<Array<any> | EarthOrbitConfig>>e.data;

  // 加载全部satellite基础信息
  if (type === 'initSat') {
    allSatellites = <Array<Satellite>>data;
  }

  // 设置轨迹显示
  if (type === 'setDisplay') {
    // 有已计算数据的记录变更
    changeStatus = Boolean(displaySatellites.length);

    displaySatellites = allSatellites.filter(sat => (<Array<string>>data).includes(sat.cosparId));
    resetAll();
  }

  // 更新绘图配置
  if (type === 'setConfig') {
    // 有已计算数据的记录变更
    changeStatus = Boolean(displaySatellites.length);

    // 合并配置，精度和频率转换成毫秒
    const { sampleInterval, updateFrequency, positionFrequency } = <EarthOrbitConfig>data;
    Object.assign(orbitGraphConfig, {
      ...<EarthOrbitConfig>data,
      sampleInterval: sampleInterval * 1000,
      updateFrequency: updateFrequency * 1000,
      positionFrequency: positionFrequency * 1000
    });
    resetAll();
  }

  // 计算轨迹
  if (type === 'calcOrbit') {

    // 记录开始计算时的状态
    let currentChangeStatue = changeStatus;

    // 获取配置
    const { historyLength, futureLength, sampleInterval } = orbitGraphConfig;

    // 需要计算的时间范围
    const now = Date.now();
    const start = now - historyLength * 60000;
    const end = now + futureLength * 60000;

    // 记录是否有计算
    let isCalc = false;

    displaySatellites.forEach(sat => {
      const { cosparId, tleLine1, tleLine2 } = sat;
      const satrec = twoline2satrec(tleLine1, tleLine2);

      // 当前计算对象的点集
      const satOrbitPointArray = orbitPointGroup[cosparId] || (orbitPointGroup[cosparId] = []);

      // 有历史计算结果的处理历史数据
      if (orbitTimeRange.start && orbitTimeRange.end) {
        // 根据时间差和采样率向下取整，确定需要删除的点个数
        const diffCounts = Math.floor((start - orbitTimeRange.start) / sampleInterval);
        satOrbitPointArray.splice(0, diffCounts * 3);
      }

      // 实际开始时间，历史end有值时使用历史end作为起始，否则取start
      const startTime = orbitTimeRange.end ? orbitTimeRange.end + sampleInterval : start;

      // 循环计算
      for (let t = startTime; t <= end; t += sampleInterval) {
        // 进入循环计算后更新状态
        isCalc = true;

        const positionAndVelocity = propagate(satrec, new Date(t));
        const positionEci = positionAndVelocity.position;

        if (positionEci) {
          const { x, y, z } = <EciVec3<number>>positionEci;

          // 转换ECI匹配three坐标，并按地球比例缩放
          const point = new Vector3(x, z, -y).divideScalar(3185);
          satOrbitPointArray.push(point.x, point.y, point.z);
        }
      }
    });

    // 计算完成后更新时间范围
    if (isCalc) {
      orbitTimeRange.start = start;
      orbitTimeRange.end = end;
    }

    // 转换为Float32Array
    const orbitData: Record<string, Float32Array> = {};
    Object.entries(orbitPointGroup).forEach(([cosparId, group]) => {
      orbitData[cosparId] = new Float32Array(group);
    });

    // changeStatus为true则有变更，丢弃已经计算的组
    if (currentChangeStatue === changeStatus) {
      self.postMessage({ data: orbitData });
    } else {
      changeStatus = false;
    }
  }
};
