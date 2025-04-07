import type { EarthOrbitConfig, MapOrbitConfig } from '@/types/models/satellite';

export const vehicleStatusDict: Record<number, string> = {
  0: '退役',
  1: '现役',
  2: '开发'
}

export const vehicleStatusColors: Record<number, string> = {
  0: '#E6A23C',
  1: '#409EFF',
  2: '#909399'
}

export const missionStatusDict: Record<number, string> = {
  0: '未执行',
  1: '成功',
  2: '失败',
  3: '部分成功',
  4: '未知'
}

export const missionStatusColors: Record<number, string> = {
  0: '#409EFF',
  1: '#45CF5D',
  2: '#DA3432',
  3: '#FF9900',
  4: '#999999'
}

export const defaultEarthOrbitGraphConfig: EarthOrbitConfig = {
  historyLength: 10,
  futureLength: 110,
  sampleInterval: 1,
  updateFrequency: 1,
  positionFrequency: 1
}

export const defaultMapOrbitGraphConfig: MapOrbitConfig = {
  historyLength: 10,
  futureLength: 110,
  sampleInterval: 1,
  updateFrequency: 1,
  positionFrequency: 1
}

export const constantVariable: Record<string, string> = {
  sessionTokenKey: 'aicmp-authorization'
}
