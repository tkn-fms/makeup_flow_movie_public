/*
import { ref, onMounted } from 'vue'
const elements = ref(initialElements) //サーバーから取得したデータ

//最初に一度ノード・エッジのリストを得る
onMounted(() => {
  surveySource()
  changeAllEdgesType()
  checkAllMakeNodes()
})

//ノードとエッジ全体の調査
//起動時に発動して，エッジのsource関係をedgeSNumとSkeysに登録
const surveySource = () => {
  //登録済みのエッジの出自関係を探る
  elements.value.forEach((el) => {
    if (isEdge(el)) {
      Skeys = Object.keys(edgeSNum)
      var tempsource = el.source
      if(Skeys.includes(tempsource)){
        edgeSNum[tempsource].push(el.id)
      }else{
        edgeSNum[tempsource] = []
        edgeSNum[tempsource].push(el.id)
      }
    }
  })
  Skeys = Object.keys(edgeSNum) //最終ループ分のkeyの更新
}
//起動時に発動して，エッジのsourceが同じものがあるかどうかでtypeを変える
const changeAllEdgesType = () => {
  elements.value.forEach((el) => {
    if (isEdge(el)) {
      //sourceが同じものが2つ以上あるか
      var tempS = edgeSNum[el.source]
      if(tempS.length >= 2){
        el.type = "smoothstep"
      }else{
        el.type = "straight"
      }
    }
  })
}
//起動時に発動して，存在するメイクノードによる表示イラストの更新
const checkAllMakeNodes = () => {
  elements.value.forEach((el) => {
    if (isNode(el) && el.type == "customMake") {
      if(el.data.partNum == 1 && el.data.itemNum == 8){
        changeMakeNodes({imgNum: 0, id: el.id, type: "add"})
      }else if(el.data.partNum == 1 && el.data.itemNum == 8 && el.data.typeNum == 2){
        changeMakeNodes({imgNum: 1, id: el.id, type: "add"})
      }else if(el.data.partNum == 2 && el.dataitemNum == 11){
        changeMakeNodes({imgNum: 2, id: el.id, type: "add"})
      }else if(el.data.partNum == 2 && (13 <= el.data.itemNum && el.data.itemNum <= 16)){
        changeMakeNodes({imgNum: 3, id: el.id, type: "add"})
      }else if(el.data.partNum == 2 && (17 <= el.data.itemNum && el.data.itemNum <= 20)){
        changeMakeNodes({imgNum: 4, id: el.id, type: "add"})
      }else if(el.data.partNum == 4 && el.data.itemNum == 24){
        changeMakeNodes({imgNum: 5, id: el.id, type: "add"})
      }else if(el.data.partNum == 4 && el.data.itemNum == 25){
        changeMakeNodes({imgNum: 6, id: el.id, type: "add"})
      }else if(el.data.partNum == 0 && el.data.itemNum == 22){
        changeMakeNodes({imgNum: 7, id: el.id, type: "add"})
      }else{
        return
      }
    }
  })
}
*/