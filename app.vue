<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
*,
::after,
::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: hsla(220, 0%, 50%, 0.6);
}
::-webkit-scrollbar-corner {
  background-color: transparent;
}
::-webkit-scrollbar-track-piece {
  background-color: transparent;
}
</style>
