<template>
  <div :class="{ 'cfg-panel sat-pane': true, 'sat-show': satPaneShow }">
    <div class="exp-icon">
      <el-icon @click="toggleSatPaneShow"><el-icon-more /></el-icon>
      <div v-show="satPaneShow">显示设置</div>
    </div>
    <template v-if="satPaneShow">
      <div class="list-header">
        <div class="header-name">名称</div>
        <div class="header-type">轨迹</div>
        <div class="header-type">位置</div>
      </div>
      <div class="sat-list">
        <div
          v-for="(sat, index) in allSatellite"
          :key="index"
          class="sat-item"
        >
          <div class="name-text">{{ sat.name }}</div>
          <div class="check-column">
            <el-checkbox
              :model-value="orbitDisplay.includes(sat.cosparId)"
              @change="state => orbitCheckChange(sat, <boolean>state)"
            />
          </div>
          <div class="check-column">
            <el-checkbox
              :model-value="positionDisplay.includes(sat.cosparId)"
              @change="state => positionCheckChange(sat, <boolean>state)"
            />
          </div>
        </div>
      </div>
      <div class="btn-group">
        <el-button
          size="small"
          color="#006080"
          :disabled="isDisplayNoChange"
          @click="applyDisplay"
        >
          确定
        </el-button>
        <el-button
          size="small"
          color="#006080"
          :disabled="isSelectAll"
          @click="displayAll"
        >
          全选
        </el-button>
      </div>
    </template>
  </div>
  <div :class="{ 'cfg-panel cfg-pane': true, 'cfg-show': cfgPaneShow }">
    <div class="exp-icon">
      <div v-show="cfgPaneShow">绘图设置</div>
      <el-icon @click="toggleCfgPaneShow"><el-icon-operation /></el-icon>
    </div>
    <template v-if="cfgPaneShow">
      <div class="cfg-title">轨迹</div>
      <div class="cfg-item">
        <div class="cfg-label">历史长度</div>
        <div class="cfg-set">
          <el-slider
            v-model="operateGraphConfig.historyLength"
            :step="1"
            :min="1"
            :max="configValueLimits.historyMax"
            :show-tooltip="false"
            :show-input="true"
            :show-input-controls="false"
            size="small"
          />
        </div>
        <div class="cfg-unit">min</div>
      </div>
      <div class="cfg-item">
        <div class="cfg-label">未来长度</div>
        <div class="cfg-set">
          <el-slider
            v-model="operateGraphConfig.futureLength"
            :step="1"
            :min="1"
            :max="configValueLimits.futureMax"
            :show-tooltip="false"
            :show-input="true"
            :show-input-controls="false"
            size="small"
          />
        </div>
        <div class="cfg-unit">min</div>
      </div>
      <div class="cfg-item">
        <div class="cfg-label">轨迹精度</div>
        <div class="cfg-set">
          <el-slider
            v-model="operateGraphConfig.sampleInterval"
            :step="1"
            :min="1"
            :max="operateGraphConfig.updateFrequency"
            :disabled="operateGraphConfig.updateFrequency === 1"
            :show-tooltip="false"
            :show-input="true"
            :show-input-controls="false"
            size="small"
          />
        </div>
        <div class="cfg-unit">s</div>
      </div>
      <div class="cfg-item">
        <div class="cfg-label">更新频率</div>
        <div class="cfg-set">
          <el-slider
            v-model="operateGraphConfig.updateFrequency"
            :step="1"
            :min="1"
            :max="300"
            :show-tooltip="false"
            :show-input="true"
            :show-input-controls="false"
            size="small"
          />
        </div>
        <div class="cfg-unit">s</div>
      </div>
      <div class="cfg-title">位置</div>
      <div class="cfg-item">
        <div class="cfg-label">更新频率</div>
        <div class="cfg-set">
          <el-slider
            v-model="operateGraphConfig.positionFrequency"
            :step="1"
            :min="1"
            :max="300"
            :show-tooltip="false"
            :show-input="true"
            :show-input-controls="false"
            size="small"
          />
        </div>
        <div class="cfg-unit">s</div>
      </div>
      <div class="cfg-item fill-item"></div>
      <div class="btn-group">
        <el-button
          size="small"
          color="#006080"
          :disabled="isGraphCfgNoChange"
          @click="applyGraphCfg"
        >
          确定
        </el-button>
        <el-button
          size="small"
          color="#006080"
          :disabled="isDefaultGraphCfg"
          @click="defaultGraphCfg"
        >
          默认
        </el-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { isEqual, cloneDeep } from 'lodash-es';
import type { Satellite, GraphType, GraphValueLimit, EarthOrbitConfig, MapOrbitConfig } from '@/types/models/satellite';

const props = defineProps<{
  type: GraphType;
}>();

const configValueLimitMap = ref<Record<GraphType, GraphValueLimit>>({
  earth: {
    historyMax: 10080,
    futureMax: 20160
  },
  map: {
    historyMax: 1440,
    futureMax: 2880
  }
});
const configValueLimits = computed(() => configValueLimitMap.value[props.type]);

const allSatellite = defineModel<Array<Satellite>>('allSatellite', { required: true, default: () => [] });
function getAllSatellite(initChecK?: boolean) {
  $request<Array<Satellite>>({
    url: '/api/service/satellite/list',
    method: 'GET'
  }).then(res => {
    const { code, data } = res;
    if (code === 200 && Array.isArray(data)) {
      allSatellite.value = data;
      if (initChecK) {
        displayAll();
      }
    }
  });
}

const allCosparIds = computed(() => allSatellite.value.map(sat => sat.cosparId).sort());

const savedOrbitDisplay = defineModel<Array<string>>('orbitDisplay', { required: true, default: () => [] });
const savedPositionDisplay = defineModel<Array<string>>('positionDisplay', { required: true, default: () => [] });

const orbitDisplay = ref<Array<string>>([]);
const positionDisplay = ref<Array<string>>([]);

const isDisplayNoChange = computed(() => isEqual(savedOrbitDisplay.value, orbitDisplay.value) && isEqual(savedPositionDisplay.value, positionDisplay.value));
const isSelectAll = computed(() => isEqual(orbitDisplay.value, allCosparIds.value) && isEqual(positionDisplay.value, allCosparIds.value));

function initDisplay() {
  orbitDisplay.value = cloneDeep(allCosparIds.value);
  positionDisplay.value = cloneDeep(allCosparIds.value);
}
function applyDisplay() {
  savedOrbitDisplay.value = cloneDeep(orbitDisplay.value);
  savedPositionDisplay.value = cloneDeep(positionDisplay.value);
}
function displayAll() {
  nextTick(() => {
    initDisplay();
    applyDisplay();
  });
}

function orbitCheckChange(sat: Satellite, state: boolean) {
  if (state) {
    orbitDisplay.value.push(sat.cosparId);
  } else {
    orbitDisplay.value = orbitDisplay.value.filter(id => id !== sat.cosparId);
  }
  orbitDisplay.value.sort();
}

function positionCheckChange(sat: Satellite, state: boolean) {
  if (state) {
    positionDisplay.value.push(sat.cosparId);
  } else {
    positionDisplay.value = positionDisplay.value.filter(id => id !== sat.cosparId);
  }
  positionDisplay.value.sort();
}

const satPaneShow = ref(true);
function toggleSatPaneShow() {
  satPaneShow.value = !satPaneShow.value;
}

const defaultConfig: EarthOrbitConfig | MapOrbitConfig = cloneDeep(defaultEarthOrbitGraphConfig);

const operateGraphConfig = ref<EarthOrbitConfig | MapOrbitConfig>(cloneDeep(defaultEarthOrbitGraphConfig));
const savedGraphConfig = defineModel<EarthOrbitConfig | MapOrbitConfig>('graphConfig', { required: true, default: () => ({}) });

const isGraphCfgNoChange = computed(() => isEqual(savedGraphConfig.value, operateGraphConfig.value));
const isDefaultGraphCfg = computed(() => isEqual(operateGraphConfig.value, defaultConfig));

function getDefaultConfig() {
  switch (props.type) {
    case 'earth':
      Object.assign(defaultConfig, defaultEarthOrbitGraphConfig);
      break;
    case 'map':
      Object.assign(defaultConfig, defaultMapOrbitGraphConfig);
      break;
  }
  defaultGraphCfg();
}

function applyGraphCfg() {
  savedGraphConfig.value = cloneDeep(operateGraphConfig.value);
}
function defaultGraphCfg() {
  operateGraphConfig.value = cloneDeep(defaultConfig);
  applyGraphCfg();
}

const cfgPaneShow = ref(true);
function toggleCfgPaneShow() {
  cfgPaneShow.value = !cfgPaneShow.value;
}

onMounted(() => {
  getAllSatellite(true);
  getDefaultConfig();
});

</script>

<style lang="scss" scoped>
.cfg-panel {
  width: 40px;
  height: 40px;
  max-height: calc(100% - 20px);
  position: absolute;
  padding: 10px;
  color: #fff;
  user-select: none;
  border-radius: 10px;
  background-color: rgba(0, 30, 60, 0.7);
  border: 2px solid rgba(0, 120, 180, 0.5);
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.3), 0 0 20px rgba(0, 200, 255, 0.2);
  transition: all .2s;
  .exp-icon {
    width: 100%;
    height: 16px;
    display: flex;
    .el-icon {
      font-size: 16px;
      cursor: pointer;
      &:hover {
        color: var(--el-color-primary);
      }
    }
    > div {
      margin: 0 10px;
      font-size: 14px;
      line-height: 16px;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .btn-group {
    width: 100%;
    height: 32px;
    padding-top: 6px;
    text-align: center;
  }
  &.sat-pane {
    top: 10px;
    left: 10px;
    &.sat-show {
      width: 180px;
      height: 400px;
    }
    .list-header {
      margin-top: 10px;
      padding: 0 6px;
      display: flex;
      height: 32px;
      color: #fff;
      line-height: 32px;
      border-bottom: #666 solid 1px;
      .header-name {
        width: 40%;
      }
      .header-type {
        width: 30%;
        text-align: center;
      }
    }
    .sat-list {
      height: calc(100% - 90px);
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 5px;
      }
      .sat-item {
        padding: 0 6px;
        width: 100%;
        height: 32px;
        display: flex;
        border-bottom: #666 solid 1px;
        &:last-of-type {
          border-bottom: none;
        }
        .name-text {
          width: 40%;
          color: #fff;
          font-size: 14px;
          line-height: 32px;
        }
        .check-column {
          width: 30%;
          text-align: center;
          :deep(.el-checkbox) {
            .el-checkbox__input {
              vertical-align: middle;
              .el-checkbox__inner {
                background-color: transparent;
              }
            }
          }
        }
      }
    }
  }
  &.cfg-pane {
    top: 10px;
    right: 10px;
    &.cfg-show {
      width: 300px;
      height: 400px;
    }
    .exp-icon {
      justify-content: flex-end;
    }
    .cfg-title {
      margin: 10px 0 2px 0;
      line-height: 32px;
      border-bottom: #666 solid 1px;
    }
    .cfg-item {
      width: 100%;
      height: 32px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      &.fill-item {
        height: calc(100% - 297px);
      }
      .cfg-label {
        padding-right: 6px;
        width: 60px;
        line-height: 32px;
        text-align: right;
      }
      .cfg-set {
        padding: 4px 6px 4px 12px;
        width: calc(100% - 86px);
      }
      .cfg-unit {
        width: 26px;
        line-height: 32px;
      }
    }
    :deep(.el-slider) {
      height: 24px;
      --el-slider-button-size: 16px;
      --el-slider-button-wrapper-size: 24px;
      --el-slider-button-wrapper-offset: -9px;
      .el-slider__runway {
        &.show-input {
          margin-right: 14px;
        }
      }
      .el-slider__input {
        width: 40px;
        .el-input {
          --el-input-height: 20px;
          .el-input__wrapper {
            padding-left: 1px;
            padding-right: 1px;
            background-color: transparent;
            box-shadow: 0 0 0 1px #aaa inset;
            &.is-focus {
              box-shadow: 0 0 0 1px rgba(60, 200, 255, 0.8) inset;
            }
            .el-input__inner {
              color: #fff;
              &::selection {
                background-color: var(--el-color-primary);
              }
            }
          }
        }
      }
    }
  }
}

</style>
