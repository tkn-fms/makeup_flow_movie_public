<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

//変数設定
const parts = ['肌', '眉', '目', '鼻', '口']
const items = [
  '日焼け止め', '化粧下地', 'コントロールカラー下地', 'ファンデーション', 'BBクリーム', 'CCクリーム', 'コンシーラー', //0~6
  'フェイスパウダー', 'アイブロウ', 'スクリューブラシ', 'アイシャドウ下地', 'アイシャドウ', 'グリッター', 'アイライナー', //7~13
  'ダブルライナー', '二重ライナー', '涙袋ライナー', 'ビューラー', 'ホットビューラー', 'マスカラ下地', 'マスカラ', 'コーム', 'チーク', //14~22
  'リップクリーム', '口紅', 'リップグロス', 'リップライナー', 'ハイライト', 'シェーディング', 'メイクキープミスト', //23~29
]
const normals = ['指定なし'] /* 1,4,6,9,10,12,14,15,16,17,18,19,20,21,23,24,25,28 */
const sunscreens = ['無色', '色付き'] //0
const ccbases = ['イエロー', 'オレンジ', 'ピンク', 'グリーン', 'ブルー', 'パープル',] //2,5
const fandetions = ['パウダー', 'リキッド', 'クリーム', 'ジェル', 'クッション'] //3
const facepowders = ['ルース', 'プレスト'] //7
const eyebrows = ['ペンシル', 'パウダー', 'マスカラ'] //8
const eyeshadows = ['パウダー', 'リキッド', 'クリーム', 'ジェル'] //11
const eyeliners = ['リキッド', 'ペンシル', 'ジェル'] //13
const cheeks = ['パウダー', 'クリーム', 'ジェル'] //22
const highlights = ['パウダー', 'リキッド', 'クリーム', 'スティック'] //27
const shadings = ['パウダー', 'リキッド', 'クリーム', 'スティック'] //28

//selectの値保管変数
let partNum = ref(0)
let itemNum = ref(0)
let typeNum = ref(0)

//selectの値をstoreにセットする関数
const store = useStore()
const changeSelectPart = computed({
  get:() => partNum.value,
  set: (value) => {
    partNum.value = value
    store.commit('setPart', {num: value, name: parts[value]})
  },
})
const changeSelectItem = computed({
  get:() => itemNum.value,
  set(value) {
    itemNum.value = value
    store.commit('setItem', {num: value, name: items[value]})
    //初期値の設定
    typeNum.value = 0
    if(value == 0){
      store.commit('setType', {num: 0, name: sunscreens[0]})
    }else if(value == 2 || value == 5){
      store.commit('setType', {num: 0, name: ccbases[0]})
    }else if(value == 3){
      store.commit('setType', {num: 0, name: fandetions[0]})
    }else if(value == 7){
      store.commit('setType', {num: 0, name: facepowders[0]})
    }else if(value == 8){
      store.commit('setType', {num: 0, name: eyebrows[0]})
    }else if(value == 11){
      store.commit('setType', {num: 0, name: eyeshadows[0]})
    }else if(value == 13){
      store.commit('setType', {num: 0, name: eyeliners[0]})
    }else if(value == 22){
      store.commit('setType', {num: 0, name: cheeks[0]})
    }else if(value == 27){
      store.commit('setType', {num: 0, name: highlights[0]})
    }else if(value == 28){
      store.commit('setType', {num: 0, name: shadings[0]})
    }else{
      store.commit('setType', {num: 0, name: '指定なし'})
    }
  },
})
const changeSelectType = computed({
  get:() => typeNum.value,
  set(value){
    typeNum.value = value
    if(itemNum.value == 0){
      store.commit('setType', {num: value, name: sunscreens[value]})
    }else if(itemNum.value == 2 || itemNum.value == 5){
      store.commit('setType', {num: value, name: ccbases[value]})
    }else if(itemNum.value == 3){
      store.commit('setType', {num: value, name: fandetions[value]})
    }else if(itemNum.value == 7){
      store.commit('setType', {num: value, name: facepowders[value]})
    }else if(itemNum.value == 8){
      store.commit('setType', {num: value, name: eyebrows[value]})
    }else if(itemNum.value == 11){
      store.commit('setType', {num: value, name: eyeshadows[value]})
    }else if(itemNum.value == 13){
      store.commit('setType', {num: value, name: eyeliners[value]})
    }else if(itemNum.value == 22){
      store.commit('setType', {num: value, name: cheeks[value]})
    }else if(itemNum.value == 27){
      store.commit('setType', {num: value, name: highlights[value]})
    }else if(itemNum.value == 28){
      store.commit('setType', {num: value, name: shadings[value]})
    }else{
      store.commit('setType', {num: 0, name: '指定なし'})
    }
  },
})
</script>

<template>
  <div class='selects'>
    <div class='box'>
        <p>施術部位：</p>
        <select name='parts' v-model='changeSelectPart' style='margin-left: 34px;'>
          <option v-for='(part, index) in parts' :key='index' :value='index'>{{part}}</option>
        </select>
    </div>
    <div class='box'>
      <p>使用アイテム：</p>
      <select name='items' v-model='changeSelectItem' style='margin-left: 12px;'>
        <option v-for='(item, index) in items' :key='index' :value='index'>{{item}}</option>
      </select>
    </div>
    <div class='box'>
      <p>タイプ(形状/色)：</p>
      <select name='types' v-model='changeSelectType'>
        <!--日焼け止め-->
        <template v-if='itemNum == 0'>
          <option v-for='(sunscreen, index) in sunscreens' :key='index' :value='index'>{{sunscreen}}</option>
        </template>
        <!--コントロールカラー下地・CCクリーム-->
        <template v-else-if='itemNum == 2 || itemNum == 5'>
          <option v-for='(ccbase, index) in ccbases' :key='index' :value='index'>{{ccbase}}</option>
        </template>
        <!--ファンデーション-->
        <template v-else-if='itemNum == 3'>
          <option v-for='(fandetion, index) in fandetions' :key='index' :value='index'>{{fandetion}}</option>
        </template>
        <!--フェイスパウダー-->
        <template v-else-if='itemNum == 7'>
          <option v-for='(facepowder, index) in facepowders' :key='index' :value='index'>{{facepowder}}</option>
        </template>
        <!--アイブロウ-->
        <template v-else-if='itemNum == 8'>
          <option v-for='(eyebrow, index) in eyebrows' :key='index' :value='index'>{{eyebrow}}</option>
        </template>
        <!--アイシャドウ-->
        <template v-else-if='itemNum == 11'>
          <option v-for='(eyeshadow, index) in eyeshadows' :key='index' :value='index'>{{eyeshadow}}</option>
        </template>
        <!--アイライナー-->
        <template v-else-if='itemNum == 13'>
          <option v-for='(eyeliner, index) in eyeliners' :key='index' :value='index'>{{eyeliner}}</option>
        </template>
        <!--チーク-->
        <template v-else-if='itemNum == 22'>
          <option v-for='(cheek, index) in cheeks' :key='index' :value='index'>{{cheek}}</option>
        </template>
        <!--ハイライト-->
        <template v-else-if='itemNum == 27'>
          <option v-for='(highlight, index) in highlights' :key='index' :value='index'>{{highlight}}</option>
        </template>
        <!--シェーディング-->
        <template v-else-if='itemNum == 28'>
          <option v-for='(shading, index) in shadings' :key='index' :value='index'>{{shading}}</option>
        </template>
        <!--普通のやつ-->
        <template v-else>
          <option v-for='(normal, index) in normals' :key='index' :value='index'>{{normal}}</option>
        </template>
      </select>
    </div>
  </div>
</template>

<style>
.selects{
  display:flex;
  flex-flow: column;
  border-top: 1px solid #E8E8EF;
  border-bottom: 1px solid #E8E8EF;
  padding: 5px 5px 10px 20px; /* 上 | 右 | 下 | 左 */
  margin: 5px 0px 0px 0px;
}
.selects p{
  font-size: 12px;
}
.selects select{
  width: 170px;
}
.box{
  display: flex;
  margin-top: 5px;
}
</style>