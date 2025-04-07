<template>
  <div class="wrapper">
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import * as Echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { TooltipComponent } from 'echarts/components';
import { MapChart, LinesChart, ScatterChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import type { LinesSeriesOption, ScatterSeriesOption } from 'echarts';
import type { Satellite, MapOrbitConfig } from '@/types/models/satellite';

Echarts.use([
  LabelLayout,
  TooltipComponent,
  MapChart,
  LinesChart,
  ScatterChart,
  CanvasRenderer
]);

const props = defineProps<{
  satelliteList: Array<Satellite>;
  orbitDisplay: Array<string>;
  positionDisplay: Array<string>;
  graphConfig: MapOrbitConfig;
}>();

watch(() => props.satelliteList, (data) => {
  orbitWorker?.postMessage({ type: 'initSat', data: toRaw(data) });
  positionWorker?.postMessage({ type: 'initSat', data: toRaw(data) });
});

watch(() => props.orbitDisplay, (data) => {
  orbitWorker?.postMessage({ type: 'setDisplay', data: toRaw(data) });
  initChartOption();
  orbitSeriesData = [];
  lastOrbitUpdateTime = -Infinity;
});

watch(() => props.positionDisplay, (data) => {
  positionWorker?.postMessage({ type: 'setDisplay', data: toRaw(data) });
  initChartOption();
  positionSeriesData = [];
  lastPositonUpdateTime = -Infinity;
});

watch(() => props.graphConfig, (data) => {
  orbitWorker?.postMessage({ type: 'setConfig', data: toRaw(data) });
  initChartOption();
  orbitSeriesData = [];
  lastOrbitUpdateTime = -Infinity;
});

const allSatellite = computed(() => {
  const data: Record<string, Satellite> = {};
  props.satelliteList.forEach(sat => data[sat.cosparId] = sat);
  return data;
});

const chartElm = useTemplateRef('chart');

let mapChart: Echarts.ECharts | null = null;

let orbitWorker: Worker | null = null;
let positionWorker: Worker | null = null;

let orbitSeriesData: Array<LinesSeriesOption> = [];
let positionSeriesData: Array<ScatterSeriesOption> = [];

async function initChart() {
  if (chartElm.value) {
    const WorldMap: any = await import('@/assets/maps/world.geo.json');
    Echarts.registerMap('world', WorldMap);

    mapChart = Echarts.init(chartElm.value, null, { devicePixelRatio: 1 });

    initChartOption();
  }
};

function initChartOption() {
  mapChart?.clear();
  mapChart?.setOption({
    backgroundColor: '#00051F',
    tooltip: {},
    geo: {
      id: 'world',
      map: 'world',
      roam: false,
      silent: true,
      width: '100%',
      height: '100%',
      itemStyle: {
        areaColor: '#323c48',
        borderColor: '#111'
      },
      emphasis: {
        disabled: true
      },
      select: {
        disabled: true
      },
      tooltip: {
        show: false
      }
    },
    series: []
  });
}

function onWindowResize() {
  mapChart?.resize();
}

let rafId: number = 0;

let lastOrbitUpdateTime: number = -Infinity;
let lastPositonUpdateTime: number = -Infinity;

const orbitUpdateFrequency = computed(() => props.graphConfig.updateFrequency * 1000);
const positionUpdateFrequency = computed(() => props.graphConfig.positionFrequency * 1000);

function animate(timestamp: number) {
  rafId = requestAnimationFrame(animate);

  if (props.orbitDisplay.length) {
    // 计算轨迹
    if (timestamp - lastOrbitUpdateTime >= orbitUpdateFrequency.value) {
      lastOrbitUpdateTime = timestamp;
      orbitWorker?.postMessage({ type: 'calcOrbit' });
    }
  }

  if (props.positionDisplay.length) {
    // 计算位置
    if (timestamp - lastPositonUpdateTime >= positionUpdateFrequency.value) {
      lastPositonUpdateTime = timestamp;
      positionWorker?.postMessage({ type: 'calcPos' });
    }
  }
};

function initOrbitWorker() {
  orbitWorker = new Worker(new URL('@/assets/workers/satMapOrbitWorker.ts', import.meta.url), { type: 'module' });

  orbitWorker.onmessage = (e: MessageEvent) => {
    const { data: orbitData }: { data: object } = e.data;

    orbitSeriesData = Object.entries(orbitData).map(([cosparId, data]: [cosparId: string, data: any]) => ({
      name: `${cosparId}_orbit`,
      type: 'lines',
      coordinateSystem: 'geo',
      polyline: true,
      zlevel: 0,
      lineStyle: {
        width: 1,
        opacity: 0.7,
        color: allSatellite.value[cosparId].color
      },
      data
    }));

    mapChart?.setOption({ series: [...positionSeriesData, ...orbitSeriesData] });
  };
}

function initPositionWorker() {
  positionWorker = new Worker(new URL('@/assets/workers/satMapPositionWorker.ts', import.meta.url), { type: 'module' });

  positionWorker.onmessage = (e: MessageEvent) => {
    const { data: posData }: { data: Array<any> } = e.data;

    positionSeriesData = posData.map((item: any) => ({
      name: item.name,
      type: 'scatter',
      coordinateSystem: 'geo',
      symbol: 'rect',
      label: {
        show: true,
        position: 'top',
        formatter: '{a}',
        color: '#ccc',
        distance: 6
      },
      labelLine: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      tooltip: {
        show: true,
        borderColor: '#888',
        backgroundColor: '#333',
        padding: [4, 10],
        formatter: (params) => {
          const { seriesName, value } = params;
          if (seriesName && Array.isArray(value)) {
            return `
              <div style="color: #ccc; font-size: 12px; line-height: 18px;">
                <div>${seriesName}</div>
                <div>经度: ${(<number>value[0]).toFixed(4)}</div>
                <div>纬度: ${(<number>value[1]).toFixed(4)}</div>
              </div>
            `;
          }
          return '';
        },
      },
      itemStyle: {
        color: allSatellite.value[item.cosparId].color
      },
      data: item.data
    }));

    mapChart?.setOption({ series: [...positionSeriesData, ...orbitSeriesData] });
  };
}

onMounted(() => {
  if (!import.meta.env.SSR) {
    initChart();
    
    initOrbitWorker();
    initPositionWorker();

    rafId = requestAnimationFrame(animate);
    window.addEventListener('resize', onWindowResize);
  }
});

onUnmounted(() => {
  mapChart?.dispose();

  orbitWorker?.terminate();
  positionWorker?.terminate();

  cancelAnimationFrame(rafId);
  window.removeEventListener('resize', onWindowResize);
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style>
