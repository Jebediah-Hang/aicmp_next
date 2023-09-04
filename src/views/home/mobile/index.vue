<template>
  <div class="home-page">
    <div class="count-dowm">
      {{ countDown.day }} . {{ countDown.hour }} : {{ countDown.minute }} : {{ countDown.seconds }}
    </div>
    <div class="breathing-light">
      <div class="light-core"></div>
    </div>
    <div class="mission-detail">
      <div class="mission-name">Psyche</div>
      <div class="mission-info">Thu Oct 5, 2023 22:38 GMT+8</div>
      <div class="mission-info">LC-39A, Kennedy Space Center, Florida, USA</div>
      <div class="mission-info">Falcon Heavy B1079.1</div>
      <div class="mission-info">Heliocentric Orbit</div>
      <div class="mission-info">SpaceX</div>
      <div class="mission-desc">
        Psyche is a planned orbiter mission that will explore the origin of planetary cores by studying the metallic asteroid 16 Psyche. Lindy Elkins-Tanton of Arizona State University is the Principal Investigator who proposed this mission for NASA's Discovery Program. NASA's Jet Propulsion Laboratory (JPL) will manage the project.
        <br/>
        16 Psyche is the heaviest known M-type asteroid, and is thought to be the exposed iron core of a protoplanet, the remnant of a violent collision with another object that stripped off its outer crust. Radar observations of the asteroid from Earth indicate an iron–nickel composition. On 4 January 2017, the Psyche mission was selected for NASA's Discovery #14 mission
      </div>
    </div>
    <div class="more-block">
      <div class="more-btn">{{ $t('mobile.home.more') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import { setInterval, clearInterval } from 'worker-timers'
import { type CountTime } from '@/types/homePage'

const countDown: CountTime = reactive({
  day: '00',
  hour: '00',
  minute: '00',
  seconds: '00'
})

const endTime: number = new Date('2023-10-05 22:38:00').getTime()
const countTimer = ref<number | null>(null)

function numberPad(val: number): string {
  return val < 10 ? `0${val}` : String(val)
}

onMounted(() => {
  countTimer.value = setInterval(() => {
    const diffTime: number = Math.floor((endTime - new Date().getTime()) / 1000)
    if (diffTime > 0) {
      countDown.day = numberPad(Math.floor(diffTime / 24 / 60 / 60))
      countDown.hour = numberPad(Math.floor(diffTime / 60 / 60 % 24))
      countDown.minute = numberPad(Math.floor(diffTime / 60 % 60))
      countDown.seconds = numberPad(Math.floor(diffTime % 60))
    } else {
      countDown.day = '00'
      countDown.hour = '00'
      countDown.minute = '00'
      countDown.seconds = '00'
      clearInterval(<number>countTimer.value)
    }
  }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(<number>countTimer.value)
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
  .breathing-light {
    margin-bottom: 40px;
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    @keyframes breathing {
      0% {
        width: 50%;
        opacity: 0.6;
      }
      50% {
        width: 90%;
        opacity: 1;
      }
      100% {
        width: 50%;
        opacity: 0.6;
      }
    }
    .light-core {
      height: 4px;
      animation: breathing 5s infinite ease-in-out;
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