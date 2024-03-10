<script setup>
import { Handle, Position } from '@braks/vue-flow'
</script>

<template>
  <div class="time-node">
    <Handle type="target" :position="Position.Top" />
    <div class="tdiamond">
      <div class="tdiamond-inner">
        <p id="ttitle">外出時間</p>
      </div>
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style>
.time-node{
  width: 130px;
  margin: 0px;
  padding: 0px;
}
.tdiamond {
  width: 60px;
  height: 60px;
  position: relative;
  transform: rotate(135deg) skew(20deg, 20deg);
  margin: 0px;
  padding: 0px;
  left: 35px;
  border-width: 1px;
  border-radius: 3px;
  border-style: solid;
  background: var(--vf-node-bg);
  border-color: var(--vf-node-color);
}
.tdiamond-inner {
  position: absolute;
  width: 160%;
  transform: skew(-20deg, -20deg) rotate(-135deg); /* 傾き・回転をリセット */
  font-size: 12px;
  display: flex;
  top: 23px;
  right: -14px;
}
#ttitle{
  top: -10px;
  margin: 0px 0px 0px 20px; /* 上 | 右 | 下 | 左 */
  font-size: 14px;
  color: var(--vf-node-text);
  white-space: pre-wrap;
}
</style>