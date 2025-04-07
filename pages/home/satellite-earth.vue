<template>
  <div class="sat-page">
    <HomeSatelliteEarth
      :satellite-list="allSatellite"
      :orbit-display="orbitDisplay"
      :position-display="positionDisplay"
      :graph-config="graphConfig"
    />
    <HomeSatelliteGraphConfig
      type="earth"
      v-model:all-satellite="allSatellite"
      v-model:orbit-display="orbitDisplay"
      v-model:position-display="positionDisplay"
      v-model:graph-config="graphConfig"
    />
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import type { Satellite, EarthOrbitConfig } from '@/types/models/satellite';

const allSatellite = ref<Array<Satellite>>([]);
const orbitDisplay = ref<Array<string>>([]);
const positionDisplay = ref<Array<string>>([]);
const graphConfig = ref<EarthOrbitConfig>(cloneDeep(defaultEarthOrbitGraphConfig));

</script>

<style lang="scss" scoped>
.sat-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #000;
}
</style>
