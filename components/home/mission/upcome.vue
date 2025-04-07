<template>
  <div class="upcome-card" ref="mission-card">
    <div class="vehicle-img">
      <img :src="vehicleImg" :alt="vehicleObj.name" />
    </div>
    <div class="mission-info">
      <div class="mission-name">
        {{ mission.customer }} | {{ missionObj.name }}
      </div>
      <div class="mission-overview">
        <div class="info-line">{{ missionObj.launchTime }}</div>
        <div class="info-line">{{ missionObj.launchSite }}</div>
        <div class="info-line">{{ vehicleObj.developers }} | {{ vehicleObj.name }}</div>
      </div>
      <div class="btn-group">
        <div class="btn" @click="handleDetail">任务详情</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Mission } from '@/types/models/mission';

const props = defineProps<{
  mission: Mission;
}>();

const emits = defineEmits<{
  detail: [data: Mission];
}>();

const missionObj = computed(() => props.mission);
const vehicleObj = computed(() => missionObj.value.launchVehicle);

function handleDetail() {
  emits('detail', missionObj.value);
}

let isInRequest: boolean = false;
const vehicleImg = ref<string>('');
function getVehicleImage() {
  isInRequest = true;
  $request<string>({
    url: '/api/service/picture/content',
    method: 'GET',
    params: {
      id: missionObj.value.launchVehicle.photoId
    }
  }).then(res => {
    isInRequest = false;
    const { code, data } = res;
    if (code === 200 && data) {
      vehicleImg.value = data;
    }
  }).catch(() => {
    isInRequest = false;
  });
}

watch(vehicleImg, (img) => {
  if (img) {
    observer.disconnect();
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      !isInRequest && getVehicleImage();
    }
  });
});

const missionElm = useTemplateRef('mission-card');

onMounted(() => {
  observer.observe(<HTMLDivElement>missionElm.value);
});

onUnmounted(() => {
  observer.disconnect();
});

</script>

<style lang="scss" scoped>
.upcome-card {
  width: 400px;
  height: 240px;
  border-radius: 14px;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12), 0 3px 5px -1px rgba(0, 0, 0, .2);
  display: flex;
  overflow: hidden;
  .vehicle-img {
    width: 50%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    img {
      width: auto;
      height: 100%;
    }
  }
  .mission-info {
    width: 50%;
    height: 100%;
    .mission-name {
      padding: 10px 8px 10px 12px;
      width: 100%;
      height: 104px;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      letter-spacing: 0.2px;
      word-break: normal;
    }
    .mission-overview {
      padding: 10px 14px;
      width: 100%;
      height: 92px;
      border-top: #ccc solid 1px;
      .info-line {
        color: #666;
        font-size: 14px;
        line-height: 24px;
      }
    }
    .btn-group {
      padding: 2px 10px;
      .btn {
        padding: 0 4px;
        width: fit-content;
        height: 32px;
        color: #306edd;
        font-size: 14px;
        line-height: 32px;
        user-select: none;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
