<script setup>
import { defineEmits, computed } from 'vue'
import { useStore } from 'vuex'

//初期設定
const store = useStore()
const emit = defineEmits(['checkTurn1', 'submitObject'])

//各ターンの説明文
const labelList = [
  "マスクを外す機会がある場合の自身の理想の化粧フローチャートを作成してください．\nなお，化粧にかけられる時間が十分にあるとします．",
  "化粧にかけられる時間が短い時に飛ばす工程をクリックしてください．\n飛ばす工程が無ければ右上にある「次へ」ボタンを押してください．",
  "化粧をする時に，やろうと思ったのについ忘れてしまう工程をクリックしてください．\n忘れる工程が無ければ右上にある「終わり」ボタンを押してください．"
]
//変数
const storeTurn = computed(() => store.state.turn)

const back = () => {
  if(store.state.turn > 1){
    store.commit("setTurn", -1) //ターンの更新
  }
}
const next = () => {
  if(store.state.turn == 1){
    //turn2に移る前にメイク終了ノードが1つでもあるか確認する
    emit('checkTurn1')
  }
  if(store.state.inputN && store.state.outputN){
    store.commit("setTurn", 1) //ターンの更新
  }
}
//Flowchart.vueにデータ送信関数のトリガーを送る
const finish = () => {
  emit('submitObject')
}
</script>

<template>
  <div class="topmenu">
    <div class="leftside">
      <div class="stepicon">
        <div id="circle">{{storeTurn}}</div>
        <div id="step">STEP</div>
      </div>
      <label id="description" v-text="labelList[storeTurn-1]"></label>
    </div>
    <div class="rightside">
      <template v-if="storeTurn > 1">
        <button class="button-68" role="button" @click="back">戻る</button>
      </template>
      <template v-if="storeTurn < 3">
        <button class="button-68" role="button" @click="next">次へ</button>
      </template>
      <template v-else>
        <button class="button-68" role="button" @click="finish">終わり</button>
      </template>
    </div>
  </div>
</template>

<style>
.visible2 {
  visibility: visible!important;
}

.topmenu {
  height: 55px;
  padding: 5px 10px;
  border: 1px solid #E8E8EF;
}
.leftside {
  position: relative;
  vertical-align: middle;
  margin-left: 10px;
}
.stepicon {
  position: relative;
}
#step {
  position: absolute;
}
#circle {
  position: absolute;
  left: 18px;
  margin: 5px 10px 5px 10px; /* 上 | 右 | 下 | 左 */
  width: 50px;
  height: 50px;
  background-color: rgba(16,185,129,.75);
  border-radius: 50%; /* ←円を作る */
  text-align: center; /* ←文字を左右に中央揃え */
  line-height: 50px; /* ←文字を上下に中央揃え */
}
#description {
  position: absolute;
  left: 85px;
  margin-top: 5px;
  text-align: left;
  white-space: pre-wrap;
  font-size: 14px;
}
.rightside {
  float: right;
  margin-top: 10px;
}

/* button */
.button-68 {
  appearance: none;
  backface-visibility: hidden;
  background-color: rgba(16,185,129,.75);
  border-radius: 8px;
  border-style: none;
  box-shadow: rgba(39, 174, 96, .15) 0 4px 9px;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: Inter,-apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif;
  font-size: 14px;
  letter-spacing: normal;
  line-height: 1.5;
  outline: none;
  overflow: hidden;
  padding: 10px 20px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transform: translate3d(0, 0, 0);
  transition: all .3s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;
  margin-right: 10px;
}
.button-68:hover {
  background-color: #1e8449;
  opacity: 1;
  transform: translateY(0);
  transition-duration: .35s;
}
.button-68:hover {
  box-shadow: rgba(39, 174, 96, .2) 0 6px 12px;
}
</style>