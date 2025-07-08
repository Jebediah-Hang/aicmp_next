import { twoline2satrec, propagate, eciToGeodetic, gstime, degreesLat, degreesLong } from 'satellite.js';
import type { EciVec3 } from 'satellite.js';
import type { Satellite, SatellitePos, MapOrbitConfig, OrbitWorkerMessage } from '@/types/models/satellite';
import { defaultMapOrbitGraphConfig } from '@/utils/constant';

let allSatellites: Array<Satellite> = [];
let displaySatellites: Array<Satellite> = [];

const orbitGraphConfig: MapOrbitConfig = {
  ...defaultMapOrbitGraphConfig,
  sampleInterval: defaultMapOrbitGraphConfig.sampleInterval * 1000,
  updateFrequency: defaultMapOrbitGraphConfig.updateFrequency * 1000,
  positionFrequency: defaultMapOrbitGraphConfig.positionFrequency * 1000
};

interface TimeRangeGroupItem {
  start: number;
  end: number;
}
interface SatelliteCoordGroupItem {
  groupId: string;
  coords: Array<SatellitePos>;
}

const orbitSegmentIndexs: Record<string, number> = {};
const orbitCoordTimeRange: Record<string, Array<TimeRangeGroupItem>> = {};
const orbitCoordGroups: Record<string, Array<SatelliteCoordGroupItem>> = {};

// 记录变更状态
let changeStatus = false;

function resetAll() {
  Object.keys(orbitSegmentIndexs).forEach(cosparId => delete orbitSegmentIndexs[cosparId]);
  Object.keys(orbitCoordTimeRange).forEach(cosparId => delete orbitCoordTimeRange[cosparId]);
  Object.keys(orbitCoordGroups).forEach(cosparId => delete orbitCoordGroups[cosparId]);
}

self.onmessage = (e: MessageEvent) => {
  const { type, data } = <OrbitWorkerMessage<Array<any> | MapOrbitConfig>>e.data;

  // 加载全部satellite基础信息
  if (type === 'initSat') {
    allSatellites = <Array<Satellite>>data;
  }

  // 设置轨迹显示
  if (type === 'setDisplay') {

    // 原来已经有数据的需要记录变更
    changeStatus = Boolean(displaySatellites.length);

    displaySatellites = allSatellites.filter(sat => (<Array<string>>data).includes(sat.cosparId));
    resetAll();
  }

  // 更新轨迹显示配置
  if (type === 'setConfig') {
    // 有已计算数据的记录变更
    changeStatus = Boolean(displaySatellites.length);

    // 合并配置，精度和频率转换成毫秒
    const { sampleInterval, updateFrequency, positionFrequency } = <MapOrbitConfig>data;
    Object.assign(orbitGraphConfig, {
      ...<MapOrbitConfig>data,
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

    displaySatellites.forEach(sat => {
      const { cosparId, tleLine1, tleLine2 } = sat;
      const satrec = twoline2satrec(tleLine1, tleLine2);

      // 当前计算对象的时间和点集分组
      const satOrbitTimeRanges = orbitCoordTimeRange[cosparId] || (orbitCoordTimeRange[cosparId] = []);
      const satOrbitCoordGroups = orbitCoordGroups[cosparId] || (orbitCoordGroups[cosparId] = []);

      // 循环分组的结束时间，如果分组的结束时间小于等于开始时间可直接剔除
      while (satOrbitTimeRanges.length && satOrbitTimeRanges[0].end <= start) {
        satOrbitTimeRanges.shift();
        satOrbitCoordGroups.shift();
      }

      // 如果分组还有剩余，开始处理第1组
      if (satOrbitTimeRanges.length) {

        // 根据时间差和采样率向上取整，确定需要删除的点个数
        const diffCounts = Math.ceil((start - satOrbitTimeRanges[0].start) / sampleInterval);
        // 从剩余的第1个coords分组中删除对应数量的点
        satOrbitCoordGroups[0].coords.splice(0, diffCounts);
        // 更新时间组的开始时间
        satOrbitTimeRanges[0].start = satOrbitTimeRanges[0].start + diffCounts * sampleInterval;
      }

      // 如果分组还有剩余，取最后一个作为起始时间开始计算，否则使用start
      const startTime = satOrbitTimeRanges.length ? (<TimeRangeGroupItem>satOrbitTimeRanges.at(-1)).end : start;

      // 开始循环计算
      for (let t = startTime + sampleInterval; t < end; t += sampleInterval) {
        const time = new Date(t);
        const positionAndVelocity = propagate(satrec, time);
        const positionGd = eciToGeodetic(<EciVec3<number>>positionAndVelocity.position, gstime(time));

        // 计算出位置
        const latitude = degreesLat(positionGd.latitude);
        const longitude = degreesLong(positionGd.longitude);

        // 最后一个点组和时间组
        const currentGroup = satOrbitCoordGroups.at(-1);
        const currentRange = satOrbitTimeRanges.at(-1);

        // 点组和时间组一定同时有或同时没有
        if (currentGroup && currentRange) {
          // 获得分组最后一个点
          const lastPoint = currentGroup.coords.at(-1);

          // 最后一个点经度和当前计算点差值超过300即认为需要重开一个分组
          if (lastPoint && Math.abs(lastPoint[0] - longitude) > 300) {
            // 更新段索引
            orbitSegmentIndexs[cosparId] = orbitSegmentIndexs[cosparId] ? orbitSegmentIndexs[cosparId] + 1 : 1;
            // 添加时间组
            satOrbitTimeRanges.push({ start: t, end: t });
            // 添加点组
            satOrbitCoordGroups.push({
              groupId: `${cosparId}_orbit_${orbitSegmentIndexs[cosparId]}`,
              coords: [[longitude, latitude]]
            });
          } else {
            // 在当前组添加点
            currentGroup.coords.push([longitude, latitude]);
            // 更新结束时间
            currentRange.end = t;
          }
        } else {
          // 不存在最后一个点组时，更新段索引
          orbitSegmentIndexs[cosparId] = orbitSegmentIndexs[cosparId] ? orbitSegmentIndexs[cosparId] + 1 : 1;
          // 添加时间组
          satOrbitTimeRanges.push({ start: t, end: t });
          // 添加点组
          satOrbitCoordGroups.push({
            groupId: `${cosparId}_orbit_${orbitSegmentIndexs[cosparId]}`,
            coords: [[longitude, latitude]]
          });
        }
      }
    });

    // changeStatus为true则有变更，丢弃已经计算的组
    if (currentChangeStatue === changeStatus) {
      self.postMessage({ data: orbitCoordGroups });
    } else {
      changeStatus = false;
    }
  }
};
