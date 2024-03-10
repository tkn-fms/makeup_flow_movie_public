<script setup>
import { computed } from "@vue/runtime-core"
import { useStore } from 'vuex'

//初期設定
const images = ["base", "eyebrow", "eye", "nose", "mouth"]
const store = useStore()

const onDragStart = (event, nodeType, datas) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType, datas)
    event.dataTransfer.effectAllowed = 'move'
  }
}

const storePartNum = computed(() => store.state.partNum)
const storeItemName = computed(() => store.state.itemName)
const storeTypeName = computed(() => store.state.typeName)
</script>

<template>
  <aside>
    <div class="nodes">
      <!-- メイクノード -->
      <div class="makeup-node" style="display: flex" :draggable="true"
        @dragstart="onDragStart($event, 'customMake')"
      >
        <img id="m-icon" :src="'https://takano.nkmr.io/b4/makeflowchart/img/icon/'+images[storePartNum]+'.png'" />
        <template v-if="storeTypeName != '指定なし'">
          <template v-if="storeItemName.length >= 7">
            <p id="m-title">{{storeItemName+"\n("+storeTypeName+")"}}</p>
          </template>
          <template v-else>
            <p id="m-title">{{storeItemName+"("+storeTypeName+")"}}</p>
          </template>
        </template>
        <template v-else>
          <p id="m-title">{{storeItemName}}</p>
        </template>
      </div>
      <!-- メイク開始・終了ノード -->
      <div class="vue-flow__node-input" :draggable="true" @dragstart="onDragStart($event, 'input')">メイク開始</div>
      <div class="vue-flow__node-output" :draggable="true" @dragstart="onDragStart($event, 'output')">メイク終了</div>
      <!-- 気合いノード -->
      <div class="mvbranch-node" :draggable="true" @dragstart="onDragStart($event, 'customMotivation')">
        <div class="mv-diamond">
          <div class="mv-diamond-inner">
            <p id="mv-title">気合い</p>
          </div>
        </div>
      </div>
      <!-- 季節ノード -->
      <div class="sbranch-node" :draggable="true" @dragstart="onDragStart($event, 'customSeason')">
        <div class="s-diamond">
          <div class="s-diamond-inner">
            <p id="s-title">季節</p>
          </div>
        </div>
      </div>
      <!-- 外出時間ノード -->
      <div class="tbranch-node" :draggable="true" @dragstart="onDragStart($event, 'customTime')">
        <div class="t-diamond">
          <div class="t-diamond-inner">
            <p id="t-title">外出時間</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style>
@import '../css/branch.css';
</style>