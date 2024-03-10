<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const imageState = computed(() => store.state.makenodeList)
</script>

<template>
  <div class="face-image" style="pointer-events: none;">
    <div class="image-area">
      <img src="https://takano.nkmr.io/b4/makeflowchart/img/face/base.png">
      <!--眉-->
      <img src="https://takano.nkmr.io/b4/makeflowchart/img/face/eyebrow.png" :class="imageState[0] ? 'visible1' : 'hidden1'">
      <img src="https://takano.nkmr.io/b4/makeflowchart/img/face/eyebrowmascara.png" :class="imageState[1] ? 'visible1' : 'hidden1'">
      <!--目-->
      <img src="https://takano.nkmr.io/b4/makeflowchart/img/face/eyeshadow.png" :class="imageState[2] ? 'visible1' : 'hidden1'">
      <img src="https://takano.nkmr.io/b4/makeflowchart/img/face/eyeliner.png" :class="imageState[3] ? 'visible1' : 'hidden1'">
      <img src="https://takano.nkmr.io/b4/makeflowchart/img/face/buehlerandmascara.png" :class="imageState[4] ? 'visible1' : 'hidden1'">
      <!--口-->
      <img src="https://takano.nkmr.io/b4/makeflowchart/img/face/rip.png" :class="imageState[5] ? 'visible1' : 'hidden1'">
      <img src="https://takano.nkmr.io/b4/makeflowchart/img/face/gross.png" :class="imageState[6] ? 'visible1' : 'hidden1'">
      <!--肌-->
      <img src="https://takano.nkmr.io/b4/makeflowchart/img/face/cheek.png" :class="imageState[7] ? 'visible1' : 'hidden1'">
    </div>
  </div>
</template>

<style>
.visible1{
  visibility: visible;
}
.hidden1{
  visibility: hidden;
}
.face-image{
  width: 300px;
}
.image-area{
  position: relative;
  width: 300px;
  height: 275px!important;
}
.image-area img{
  width: 280px;
  height: 280px;
  position: absolute;
  left: 10px;
}
</style>