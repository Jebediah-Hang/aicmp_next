<template>
  <div class="detail-header">
    <el-button
      plain
      color="#306edd"
      @click="handleClose"
    >
      <el-icon><el-icon-d-arrow-left /></el-icon>
      返回
    </el-button>
  </div>
  <div class="page-wapper">
    <div class="detail-wapper">
      <div class="base-title">任务状态</div>
      <div class="base-card text-card">
        <div
          class="mission-status"
          :style="{ backgroundColor: missionStatusColors[missionObj.status] || '#999' }"
        >
          {{ missionStatusDict[missionObj.status] }}
        </div>
        <div class="mission-name">{{ missionObj.name }}</div>
        <div class="status-item">
          <div class="status-label">发射场</div>
          <div class="status-value">{{ missionObj.launchSite }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">发射时间</div>
          <div class="status-value">{{ missionObj.launchTime }}</div>
        </div>
        <div v-show="missionObj.remarks" class="status-remark">{{ missionObj.remarks }}</div>
      </div>
      <div class="base-title">任务载具</div>
      <div class="base-card vehicle-card">
        <div class="vehicle-img">
          <img :src="vehicleImg" :alt="vehicleObj.name" />
        </div>
        <div class="vehicle-info">
          <div
            class="vehicle-status"
            :style="{ backgroundColor: vehicleStatusColors[vehicleObj.status] || '#999' }"
          >
            {{ vehicleStatusDict[vehicleObj.status] }}
          </div>
          <div class="vehicle-name">{{ vehicleObj.name }}</div>
          <div class="vehicle-props">
            <div v-for="(item, key) in vehiclePropsMap" :key="key" class="prop-item">
              {{ item?.label }}: {{ (<number>vehicleObj[key]).toFixed(item?.decimal) }} {{ item?.unit }}
            </div>
          </div>
          <div class="vehicle-desc">{{ vehicleObj.description }}</div>
        </div>
      </div>
      <div class="base-title">任务详情</div>
      <div class="base-card text-card">
        <div class="mission-name">{{ missionObj.payload }}</div>
        <div class="status-item">
          <div class="status-label">载荷客户</div>
          <div class="status-value">{{ missionObj.customer }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">目标轨道</div>
          <div class="status-value">{{ missionObj.targetOrbit }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">任务介绍</div>
          <div class="status-value">{{ missionObj.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Mission } from '@/types/models/mission';
import type { Vehicle } from '@/types/models/vehicle';

const props = defineProps<{
  mission: Mission | undefined;
}>();

const emits = defineEmits<{
  close: [];
}>();

const missionObj = computed(() => <Mission>props.mission);
const vehicleObj = computed(() => <Vehicle>missionObj.value?.launchVehicle);

const vehiclePropsMap = ref<Partial<Record<keyof Vehicle, { label: string; unit: string; decimal: number; }>>>({
  leoPayload: {
    label: 'LEO载荷',
    unit: 'kg',
    decimal: 0
  },
  gtoPayload: {
    label: 'GTO载荷',
    unit: 'kg',
    decimal: 0
  },
  weight: {
    label: '起飞质量',
    unit: 't',
    decimal: 0
  },
  thrust: {
    label: '起飞推力',
    unit: 'kN',
    decimal: 0
  },
  height: {
    label: '高度',
    unit: 'm',
    decimal: 1
  },
  diameter: {
    label: '直径',
    unit: 'm',
    decimal: 1
  }
});

function handleClose() {
  emits('close');
}

const vehicleImg = ref<string>('');
function getVehicleImage() {
  $request<string>({
    url: '/api/service/picture/content',
    method: 'GET',
    params: {
      id: vehicleObj.value.photoId
    }
  }).then(res => {
    const { code, data } = res;
    if (code === 200 && data) {
      vehicleImg.value = data;
    }
  });
}

onMounted(() => {
  getVehicleImage();
});

</script>

<style lang="scss" scoped>
.detail-header {
  width: 100%;
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: #e0e0e0 solid 1px;
  position: sticky;
  z-index: 1;
  top: 0;
  .el-icon {
    margin-right: 4px;
  }
}
.page-wapper {
  width: 100%;
  min-height: calc(100vh - 106px);
  padding: 20px 0 10px 0;
  background-color: #f6f6f6;
}
.detail-wapper {
  margin: 0 auto;
  width: 100%;
  max-width: 980px;
}
.base-title {
  margin: 0 auto;
  padding: 0 8px;
  color: #666;
  font-size: 30px;
  line-height: 40px;
}
.base-card {
  width: 100%;
  margin: 20px auto 36px auto;
  border-radius: 14px;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12), 0 3px 5px -1px rgba(0, 0, 0, .2);
  overflow: hidden;
  position: relative;
  &.text-card {
    padding: 16px;
  }
  .mission-status {
    position: absolute;
    right: 16px;
    width: 72px;
    height: 36px;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    line-height: 36px;
    text-align: center;
    border-radius: 16px;
  }
  .mission-name {
    width: calc(100% - 80px);
    color: #666;
    font-size: 24px;
    line-height: 36px;
  }
  .status-item {
    margin-top: 12px;
    color: #666;
    font-size: 14px;
    line-height: 20px;
    .status-label {
      font-weight: 600;
    }
    .status-value {
      font-weight: 400;
    }
  }
  .status-remark {
    margin-top: 18px;
    color: #666;
    font-size: 16px;
    line-height: 22px;
  }
  .payload-name {
    color: #666;
    font-size: 24px;
    line-height: 36px;
  }
}
.vehicle-card {
  width: 100%;
  .vehicle-img {
    height: 490px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    img {
      width: auto;
      height: 100%;
    }
  }
  .vehicle-info {
    padding: 16px;
    height: 490px;
    position: relative;
    .vehicle-status {
      position: absolute;
      right: 16px;
      width: 64px;
      height: 30px;
      color: #fff;
      font-size: 16px;
      line-height: 30px;
      text-align: center;
      border-radius: 8px;
    }
    .vehicle-name {
      width: calc(100% - 70px);
      color: #666;
      font-size: 22px;
      line-height: 30px;
    }
    .vehicle-props {
      padding: 16px 0;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(3, 30px);
      gap: 8px;
      .prop-item {
        color: #666;
        font-size: 14px;
        line-height: 30px;
      }
    }
    .vehicle-desc {
      color: #666;
      font-size: 14px;
      line-height: 22px;
    }
  }
}
@media (max-width: 490px) {
  .vehicle-card {
    height: 980px;
    .vehicle-img {
      width: 100%;
    }
    .vehicle-info {
      width: 100%;
    }
  }
}
@media (min-width: 491px) {
  .vehicle-card {
    height: 490px;
    display: flex;
    .vehicle-img {
      width: 50%;
    }
    .vehicle-info {
      width: 50%;
    }
  }
}
</style>
