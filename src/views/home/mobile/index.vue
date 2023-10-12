<template>
  <div class="home-page">
    <div class="count-dowm">
      {{ countDown.day }} . {{ countDown.hour }} : {{ countDown.minute }} : {{ countDown.seconds }}
    </div>
    <div class="light-line">
      <div class="light-core"></div>
    </div>
    <div class="mission-detail">
      <div class="mission-name">Psyche</div>
      <div class="mission-info">Thu Oct 13, 2023 22:19 GMT+8</div>
      <div class="mission-info">LC-39A, Kennedy Space Center, Florida, USA</div>
      <div class="mission-info">Falcon Heavy B1079.1</div>
      <div class="mission-info">Heliocentric Orbit</div>
      <div class="mission-info">SpaceX</div>
      <div class="mission-desc">
        Psyche is a planned orbiter mission that will explore the origin of planetary cores by studying the metallic asteroid 16 Psyche. Lindy Elkins-Tanton of Arizona State University is the Principal Investigator who proposed this mission for NASA's Discovery Program. NASA's Jet Propulsion Laboratory (JPL) will manage the project.
      </div>
    </div>
    <div class="more-block">
      <div class="more-btn">{{ $t('mobile.home.more') }}</div>
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

const endTime: number = new Date('2023-10-13 22:19:00').getTime()
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
  margin-top: 30px;
  height: calc(100vh - 100px);
  width: 100%;
  color: #fff;
  .count-dowm {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
  }
  .light-line {
    margin-bottom: 40px;
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    .light-core {
      width: 90%;
      height: 4px;
      background: radial-gradient(white 10%, rgba(0, 0, 0, 0) 70%);
    }
  }
  .mission-detail {
    margin: 0 auto;
    width: 90%;
    display: flex;
    align-items: center;
    flex-direction: column;
    .mission-name {
      font-size: 26px;
      margin-bottom: 30px;
      text-align: center;
    }
    .mission-info {
      font-size: 16px;
      margin-bottom: 14px;
      text-align: center;
    }
    .mission-desc {
      padding-top: 12px;
      font-size: 12px;
      text-align: center;
    }
  }
  .more-block {
    width: 100%;
    position: fixed;
    bottom: 90px;
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