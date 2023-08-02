<template>
  <div class="main-content" @scroll="mScroll">
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam nostrum eveniet maxime praesentium iste aliquid repudiandae perferendis ut molestiae cumque dolorem perspiciatis tempora, quia, quam eaque voluptate dolor quis quos.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum animi numquam consequuntur aspernatur quisquam suscipit sed nobis, vel cum earum, in atque, at nesciunt a repellat eveniet reiciendis distinctio delectus?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, magni eum? Totam placeat dolores aut, eos sed, recusandae, animi nostrum soluta assumenda veritatis voluptatum dicta quos excepturi modi. Hic, accusamus.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores error accusamus harum eos debitis saepe? Quae nemo commodi molestias dolores beatae ducimus, tempora, nobis itaque nisi sed veritatis voluptate tempore.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, modi accusamus quisquam odio, culpa expedita praesentium iste maiores explicabo nulla harum voluptates ullam libero eius laudantium, doloribus illo porro voluptatem.
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus, distinctio doloribus quisquam modi, eveniet, est numquam quae nihil dolorem voluptate debitis velit! Incidunt suscipit, maiores consequuntur porro accusantium excepturi ad?
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum enim nihil odio quidem magni dicta debitis illo accusantium qui rerum quos facere dignissimos reiciendis nobis similique explicabo deleniti, cum esse?
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda omnis velit, nobis molestiae placeat voluptatem blanditiis architecto officia! Nobis quisquam minima neque aperiam necessitatibus nesciunt doloribus nihil aut assumenda sed?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti dolorem odit aliquam voluptatem dolores. Magnam officiis distinctio aliquid repudiandae rem aperiam dolorem. Consequuntur dolorem reprehenderit quia fugit explicabo officia commodi.
    </div>
  </div>
</template>

<script lang="ts" setup>
function mScroll(e: any) {
  console.log('scroll', e)
}
</script>

<style lang="scss" scoped>
.main-content {
  // height: 2000px;
}
</style>