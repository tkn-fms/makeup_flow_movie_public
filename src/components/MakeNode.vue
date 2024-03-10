<script setup>
import { Handle, Position } from '@braks/vue-flow'
import { defineProps, } from 'vue'

//変数設定
const images = ["base", "eyebrow", "eye", "nose", "mouth"]
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  data: {
    required: true,
  },
})

//関数設定
const temp = props.label.split('(指定なし)')
/*
//画像をassetsから取ってくる場合の記述
computed,
const setUrl = computed({
  get: () => (
    require('https://takano.nkmr.io/b4/makeflowchart/img/icon/'+images[props.data.partNum]+'.png')
  ),
})
*/
</script>

<template>
  <div class="node-makeup" style="display: flex;">
    <Handle type="target" :position="Position.Top" />
    <img id="icon" :src="'https://takano.nkmr.io/b4/makeflowchart/img/icon/'+images[props.data.partNum]+'.png'">
    <template v-if="!props.label.includes('指定なし')">
      <p id="title">{{props.label}}</p>
    </template>
    <template v-else>
      <p id="title">{{temp[0]+temp[1]}}</p>
    </template>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style>
.node-makeup{
  padding: 10px;
  border-radius: 3px;
  min-width: 150px;
  max-width: 150px;
  font-size: 11px;
  color: var(--vf-node-text);
  text-align: center;
  border-width: 1px;
  border-style: solid;
  background: var(--vf-node-bg);
  border-color: var(--vf-node-color);
}
.node-makeup.selected, .node-makeup.selected:hover{
  box-shadow: 0 0 0 0.5px var(--vf-box-shadow);
}
#icon{
  width: 25px;
  height: 25px;
  padding: 0px 0px 0px 0px; /* 上 | 右 | 下 | 左 */
}
#title{
  white-space: pre-wrap;
  margin: 0px 0px 0px 0px;
  padding-top: 3px;
}
</style>