<template>
  <div class="home-page">
    <div class="count-dowm">
      {{ countDown.day }} . {{ countDown.hour }} : {{ countDown.minute }} : {{ countDown.seconds }}
    </div>
    <div class="light-line">
      <div class="light-core"></div>
    </div>
    <div class="mission-detail">
      <div class="mission-name">Europa Clipper</div>
      <div class="mission-info">Thu Oct 10, 2024 23:51 GMT+8</div>
      <div class="mission-info">LC-39A, Kennedy Space Center, Florida, USA</div>
      <div class="mission-info">Falcon Heavy</div>
      <div class="mission-info">Heliocentric Orbit</div>
      <div class="mission-info">SpaceX</div>
      <div class="mission-desc">
        Europa Clipper will conduct a detailed survey of Europa and use a sophisticated suite of science instruments to investigate whether the icy moon has conditions suitable for life. Key mission objectives are to produce high-resolution images of Europa's surface, determine its composition, look for signs of recent or ongoing geological activity, measure the thickness of the moon’s icy shell, search for subsurface lakes, and determine the depth and salinity of Europa's ocean.
      </div>
    </div>
    <div class="more-block">
      <div class="more-btn">{{ $t('desktop.home.more') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { setInterval, clearInterval } from 'worker-timers'
import { type CountTime } from '@/types/homePage'

const countDown = ref<CountTime>({
  day: '00',
  hour: '00',
  minute: '00',
  seconds: '00'
})

const endTime: number = new Date('2024-10-10 23:51:00').getTime()
const countTimer = ref<number | null>(null)

function numberPad(val: number): string {
  return val < 10 ? `0${val}` : String(val)
}

onMounted(() => {
  countTimer.value = setInterval(() => {
    const diffTime: number = Math.floor((endTime - new Date().getTime()) / 1000)
    if (diffTime > 0) {
      countDown.value = {
        day: numberPad(Math.floor(diffTime / 24 / 60 / 60)),
        hour: numberPad(Math.floor(diffTime / 60 / 60 % 24)),
        minute: numberPad(Math.floor(diffTime / 60 % 60)),
        seconds: numberPad(Math.floor(diffTime % 60))
      }
    } else {
      countDown.value = {
        day: '00',
        hour: '00',
        minute: '00',
        seconds: '00'
      }
      if (countTimer.value) {
        clearInterval(<number>countTimer.value)
      }
    }
  }, 1000)
})
onBeforeUnmount(() => {
  if (countTimer.value) {
    clearInterval(<number>countTimer.value)
  }
})

</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: calc(100vh - 64px);
  color: #fff;
  background-color: rgba(0, 0, 0, .9);
  .count-dowm {
    width: 100%;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;
  }
  .light-line {
    margin-bottom: 40px;
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    .light-core {
      width: 80%;
      height: 4px;
      background: radial-gradient(white 10%, rgba(0, 0, 0, 0) 70%);
    }
  }
  .mission-detail {
    margin: 0 auto;
    width: 80%;
    display: flex;
    align-items: center;
    flex-direction: column;
    .mission-name {
      font-size: 36px;
      margin-bottom: 30px;
      text-align: center;
    }
    .mission-info {
      font-size: 20px;
      margin-bottom: 14px;
      text-align: center;
    }
    .mission-desc {
      padding-top: 12px;
      font-size: 16px;
      text-align: center;
    }
  }
  .more-block {
    width: 100%;
    position: fixed;
    bottom: 30px;
    display: flex;
    justify-content: center;
    .more-btn {
      font-size: 12px;
      cursor: pointer;
      text-decoration: underline;
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>