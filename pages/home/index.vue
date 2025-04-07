<template>
  <div v-show="!isShowDetail" class="home-page">
    <div v-if="missionObj" class="mission-card">
      <div class="name-title">{{ missionObj.name }}</div>
      <div class="time-text">{{ countdown.d }}days, {{ countdown.h }} : {{ countdown.m }} : {{ countdown.s }}</div>
      <div class="sec-title">{{ vehicleObj.developers }} | {{ vehicleObj.name }}</div>
      <div class="sec-title">{{ missionObj.launchSite }}</div>
      <div class="sec-title">{{ missionObj.launchTime }}</div>
      <div class="mission-desc">{{ missionObj.description }}</div>
      <div class="btn-group">
        <span class="more-btn" @click="handleDetail">了解更多</span>
      </div>
    </div>
  </div>
  <template v-if="isShowDetail">
    <HomeMissionDetail
      :mission="missionObj"
      @close="closeDetail"
    />
  </template>
</template>

<script setup lang="ts">
import type { Mission, MissionCountdown } from '@/types/models/mission';

const emits = defineEmits<{
  scrollParentPage: [];
}>();

const nextMission = ref<Mission>();
const missionObj = computed(() => <Mission>nextMission.value);
const vehicleObj = computed(() => missionObj.value.launchVehicle);

function getNextMission() {
  $request<Mission>({
    url: '/api/service/mission/next',
    method: 'GET'
  }).then(res => {
    const { code, data } = res;
    if (code === 200 && data) {
      nextMission.value = data;
      rafId = requestAnimationFrame(calcCountdown);
    }
  });
}

const countdown = ref<MissionCountdown>({ d: '0', h: '00', m: '00', s: '00' });

let rafId: number = 0;
let lastUpdate: number = -Infinity;

function calcCountdown(timestamp: number) {
  rafId = requestAnimationFrame(calcCountdown);

  if (timestamp - lastUpdate > 500) {
    lastUpdate = timestamp;
    countdown.value = getCountdown(missionObj.value.launchTime);
  }
}

const isShowDetail = ref(false);
function handleDetail() {
  isShowDetail.value = true;
  emits('scrollParentPage');
}
function closeDetail() {
  isShowDetail.value = false;
  emits('scrollParentPage');
}

onMounted(() => {
  getNextMission();
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
});

</script>

<style lang="scss" scoped>
.home-page {
  color: #fff;
  text-align: center;
  width: 100%;
  height: calc(100vh - 46px);
  overflow: auto;
  background-color: rgba($color: #000, $alpha: .96);
  background-image: url('/public/images/homebg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  .mission-card {
    padding: 48px 32px;
    margin: 48px auto 32px auto;
    min-width: 560px;
    min-height: 70vh;
    border-radius: 16px;
    background-color: rgba($color: #000, $alpha: .4);
    .name-title {
      font-size: 48px;
      line-height: 120px;
    }
    .time-text {
      color: #ddd;
      font-size: 32px;
      line-height: 100px;
      margin-bottom: 24px;
    }
    .sec-title {
      color: #bbb;
      font-size: 18px;
      line-height: 36px;
    }
    .mission-desc {
      padding: 0 32px;
      margin-top: 36px;
      color: #eee;
      font-size: 14px;
      line-height: 22px;
    }
    .btn-group {
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      .more-btn {
        cursor: pointer;
        color: #ccc;
        font-size: 16px;
        font-weight: 300;
        line-height: 28px;
        user-select: none;
        text-decoration: underline;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
@media (max-width: 900px) {
  .mission-card {
    width: calc(100% - 48px);
  }
}
@media (min-width: 901px) {
  .mission-card {
    width: 900px;
  }
}
</style>
