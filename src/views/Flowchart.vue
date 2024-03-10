<script setup>
import { Background, Controls, MiniMap, VueFlow, isNode, isEdge, MarkerType, ConnectionMode, useVueFlow } from '@braks/vue-flow'
import { markRaw, ref, } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { initialElements } from '../js/initial-elements.js'
//カスタムノードの追加
import MakeNode from '@/components/MakeNode.vue'
import MotivationNode from '@/components/MotivationNode.vue'
import SeasonNode from '@/components/SeasonNode.vue'
import TimeNode from '@/components/TimeNode.vue'
//子コンポーネントの追加
import NodeSettings from '@/components/NodeSettings.vue'
import FaceImage from '@/components/FaceImage.vue'
import NodeField from '@/components/NodeField.vue'
import TopMenu from '@/components/TopMenu.vue'
//ライブラリの追加
import VueSimpleContextMenu from 'vue-simple-context-menu'
//import 'vue-simple-context-menu/dist/vue-simple-context-menu.css'
import axios from "axios"
//import * as htmlToImage from "html-to-image"

//初期設定
/* vue-flowの初期設定 */
const { onPaneReady, onConnect, onEdgesChange, onNodesChange, addEdges, addNodes, toObject, project, getNode, getEdge, } = useVueFlow()
const elements = ref(initialElements)
const nodeTypes = {
  customMake: markRaw(MakeNode),
  customMotivation: markRaw(MotivationNode),
  customSeason: markRaw(SeasonNode),
  customTime: markRaw(TimeNode),
}
/* storeとrouterの開始 */
const store = useStore()
const router = useRouter()
/* ノードの管理変数 */
var Skeys = [] //source
var edgeSNum = [] //sourceから見たedgeの重複 source:[id]
var makeNodeNum = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []} //imgNum:[id]
/* vue-simple-context-menuの初期設定 */
const options = [{name: "Copy", slug: "copy"}]
const vueContextMenu = ref(initialElements)


/* vue-simple-context-menuの関数 */
const handleClick =  (event) => {
  // overwrite readonly properties pageX and pageY and set correct values
  Object.defineProperty(event, 'pageX', {
    value: event.pageX - 350,
    writable: true
  })
  Object.defineProperty(event, 'pageY', {
    value: event.pageY - 100, //event.pageY - 100
    writable: true
  })
  vueContextMenu.value.showMenu(event)
}
//コンテキストメニューを呼び出す
const selectMenu = (params) => {
  store.commit("setSelectNodeList", params.nodes)
}
//コンテキストメニューのクリック
const optionClicked = () => {
  var copyNode
  var copyNodesData = store.state.selectnodeList
  for(var s=0; s<copyNodesData.length; s++){
    var copyNodeData = store.state.selectnodeList[s]
    if(copyNodeData.type == 'input' || copyNodeData.type == 'output'){
      //開始ノードか終了ノード
      //コピーさせない
      copyNode = {
        id: ss_getId(),
        type: copyNodeData.type,
        position: project({ x: copyNodeData.position.x + 100, y: copyNodeData.position.y + 100 }),
        label: copyNodeData.label,
      }
    }else if(copyNodeData.type == 'customMake'){
      //メイクノード
      copyNode = {
        id: m_getId(),
        type: copyNodeData.type,
        position: project({ x: copyNodeData.position.x + 100, y: copyNodeData.position.y + 100 }),
        label: copyNodeData.label,
        style: copyNodeData.style,
        data: copyNodeData.data,
      }
    }else{
      //分岐（ブランチ）ノード
      copyNode = {
        id: copyNodeData.type == 'customMotivation'
          ? mv_getId()
          : copyNodeData.type == 'customSeason'
            ? s_getId()
            : t_getId(),
        type: copyNodeData.type,
        position: project({ x: copyNodeData.position.x + 100, y: copyNodeData.position.y + 100 }),
        label: copyNodeData.label,
        style: copyNodeData.style,
      }
    }
    addNodes([copyNode])
  }
}

/* 起動時の挙動 */
//onPaneReadyは、viewpaneとノードに表示可能なディメンションがある場合に呼び出されます
onPaneReady(({fitView}) => {
  fitView()
})
const onLoad = (flowInstance) => flowInstance.fitView()

/* 対象のノードとエッジの調査 */
//対象エッジと同じノードから出ているエッジの本数を返す(return)
const surveySameSource = (source) => {
  if(Skeys.includes(source)){
    var temp2 = edgeSNum[source]
    return temp2.length
  }else{
    return 0
  }
}
//対象エッジの追加/削除に伴うSkeysとedgeSNumの更新
const changeEdges = (edge, type) => {
  //データ受け取り
  var eid = edge.id
  var source = edge.source
  //Skeysの更新
  Skeys = Object.keys(edgeSNum)
  if(type == "add"){
    console.log("edgeSNumの更新(追加)")
    if(Skeys.includes(source)){
      edgeSNum[source].push(eid)
    }else{
      edgeSNum[source] = []
      edgeSNum[source].push(eid)
      Skeys = Object.keys(edgeSNum)
    }
  }else if(type == "remove"){
    console.log("edgeSNumの更新(削除)")
    var sameEdgeSNum = edgeSNum[source]
    if(sameEdgeSNum.length >= 2){
      for(var j=0; j<sameEdgeSNum.length; j++){
        if(sameEdgeSNum[j] == eid){
          edgeSNum[source].splice(j, 1)
        }
      }
    }else{
      delete edgeSNum[source]
      Skeys = Object.keys(edgeSNum)
    }
  }else if(type == "change"){
    console.log("edgeSNumの更新(変更)")
  }else{
    return
  }
}
//対象メイクノードの追加/削除時のmakeNodeNumの値と表示イラストの更新
const changeMakeNodes = (nodeData) => {
  if(nodeData.type == "add"){
    makeNodeNum[nodeData.imgNum].push(nodeData.id)
  }else if(nodeData.type == "remove"){
    var lengthNum = makeNodeNum[nodeData.imgNum]
    for(var n=0; n<lengthNum.length; n++){
      if(lengthNum[n] == nodeData.id){
        makeNodeNum[nodeData.imgNum].splice(n, 1)
      }
    }
  }else{
    return
  }

  //メイクノードの追加/削除に伴う表示イラストの更新
  for(var l=0; l<Object.keys(makeNodeNum).length; l++){
    var tempLengthNum = makeNodeNum[l]
    if(tempLengthNum.length >= 1){
      store.commit("setMakeNodeList", {imgNum:l, imgState: true})
    }else{
      store.commit("setMakeNodeList", {imgNum:l, imgState: false})
    }
  }
}
//turn2に移る前にメイク開始・終了ノードが設置されているか確認する
const checkOutput = () => {
  var inputNode = false
  var outputNode = false
  elements.value.forEach((el) => {
    if (isNode(el)) {
      if(el.type == "input"){
        inputNode = true
      }else if(el.type == "output"){
        outputNode = true
      }
    }
  })
  store.commit("setInOutput", {input: inputNode, output: outputNode})
  if(!store.state.inputN || !store.state.outputN){
    alert("メイク開始・終了ノードを設置してください．")
    return
  }
}

/* ノードの変更時に発火する関数 */
onNodesChange((params) => {
  //type: dimensions(配置？/サイズ情報), select, add, remove
  //params add:[type, item{}] remove:[type, id] select:[type, id, selected]
  for(var q=0; q<params.length; q++){
    if(params[q].type == "add"){
      console.log("ノードの追加")
      //メイクノードだったら
      if(params[q].item.type == "customMake"){
        var nodeitems = params[q].item
        var nodeData = nodeitems.data
        //化粧工程の判定
        if(nodeData.partNum == 1 && nodeData.itemNum == 8){
          changeMakeNodes({imgNum: 0, id: nodeitems.id, type: "add"})
        }else if(nodeData.partNum == 1 && nodeData.itemNum == 8 && nodeData.typeNum == 2){
          changeMakeNodes({imgNum: 1, id: nodeitems.id, type: "add"})
        }else if(nodeData.partNum == 2 && nodeData.itemNum == 11){
          changeMakeNodes({imgNum: 2, id: nodeitems.id, type: "add"})
        }else if(nodeData.partNum == 2 && (13 <= nodeData.itemNum && nodeData.itemNum <= 16)){
          changeMakeNodes({imgNum: 3, id: nodeitems.id, type: "add"})
        }else if(nodeData.partNum == 2 && (17 <= nodeData.itemNum && nodeData.itemNum <= 20)){
          changeMakeNodes({imgNum: 4, id: nodeitems.id, type: "add"})
        }else if(nodeData.partNum == 4 && nodeData.itemNum == 24){
          changeMakeNodes({imgNum: 5, id: nodeitems.id, type: "add"})
        }else if(nodeData.partNum == 4 && nodeData.itemNum == 25){
          changeMakeNodes({imgNum: 6, id: nodeitems.id, type: "add"})
        }else if(nodeData.partNum == 0 && nodeData.itemNum == 22){
          changeMakeNodes({imgNum: 7, id: nodeitems.id, type: "add"})
        }else{
          return
        }
      }
    }else if(params[q].type == "remove"){
      console.log("ノードの削除")
      if(params[q].id.indexOf('make') > -1){ //メイクノードだったら
        const rnode = getNode.value(params[q].id)
        const rdata = rnode.data
        if(rdata.partNum == 1 && rdata.itemNum == 8){
          changeMakeNodes({imgNum: 0, id: params[q].id, type: "remove"})
        }else if(rdata.partNum == 1 && rdata.itemNum == 8 && rdata.typeNum == 2){
          changeMakeNodes({imgNum: 1, id: params[q].id, type: "remove"})
        }else if(rdata.partNum == 2 && rdata.itemNum == 11){
          changeMakeNodes({imgNum: 2, id: params[q].id, type: "remove"})
        }else if(rdata.partNum == 2 && (13 <= rdata.itemNum && rdata.itemNum <= 16)){
          changeMakeNodes({imgNum: 3, id: params[q].id, type: "remove"})
        }else if(rdata.partNum == 2 && (17 <= rdata.itemNum && rdata.itemNum <= 20)){
          changeMakeNodes({imgNum: 4, id: params[q].id, type: "remove"})
        }else if(rdata.partNum == 4 && rdata.itemNum == 24){
          changeMakeNodes({imgNum: 5, id: params[q].id, type: "remove"})
        }else if(rdata.partNum == 4 && rdata.itemNum == 25){
          changeMakeNodes({imgNum: 6, id: params[q].id, type: "remove"})
        }else if(rdata.partNum == 0 && rdata.itemNum == 22){
          changeMakeNodes({imgNum: 7, id: params[q].id, type: "remove"})
        }else{
          return
        }
      }
    }else if(params[q].type == "select"){
      var snode
      if(params[q].id.indexOf('make') > -1 || params[q].id.indexOf('branch') > -1){
        //メイクノードかブランチノードだったら
        snode = getNode.value(params[q].id)
        if(params[q].selected){
          snode.style["--vf-node-color"] = '#3cb371'
        }else{
          snode.style["--vf-node-color"] = 'black'
        }
      }
      if(store.state.turn == 2){
        if(params[q].id.indexOf('make') > -1){
          //メイクノードだったら
          if(params[q].selected){
            if(!snode.data["skip"]){
              //skipがfalseだったら
              snode.style["--vf-node-text"] = '#ff8c00'
              snode.data["skip"] = true
            }else{
              //skipがtrueだったら
              snode.style["--vf-node-text"] = 'black'
              snode.data["skip"] = false
            }
          }
        }
      }else if(store.state.turn == 3){
        if(params[q].id.indexOf('make') > -1){
          //メイクノードだったら
          if(params[q].selected){
            if(!snode.data["forget"]){
              //forgetがfalseだったら
              snode.style["--vf-node-bg"] = "pink"
              snode.data["forget"] = true
            }else{
              //forgetがtrueだったら
              snode.style["--vf-node-bg"] = "white"
              snode.data["forget"] = false
            }
          }
        }
      }
    }
    else{
      return
    }
  }
})
/* エッジの変更時に発火する関数 */
onEdgesChange((params) => {
  var NumOfSameSources
  //params add:[type, item{}]  remove:[type, id]  select:[type, id, selected]
  for(var i=0; i<params.length; i++){
    if(params[i].type == "add"){
      var edgeItem = params[i].item
      //edgeSNumに新しいエッジを追加する
      Skeys = Object.keys(edgeSNum) //最新版に更新
      if(Skeys.includes(edgeItem.source)){
        edgeSNum[edgeItem.source].push(edgeItem.id)
      }else{
        edgeSNum[edgeItem.source] = []
        edgeSNum[edgeItem.source].push(edgeItem.id)
        Skeys = Object.keys(edgeSNum)
      }
      //追加するエッジと同じsourceのエッジが何本あるか調べる
      NumOfSameSources = surveySameSource(edgeItem.source)
      //エッジが現状で1本以上あったらエッジをsmoothstepに切り替える
      if(NumOfSameSources >= 1){
        elements.value.forEach((el) => {
          if (isEdge(el) && el.source == edgeItem.source) {
            el.type = 'smoothstep'
          }
        })
      }
    }else if(params[i].type == "remove"){
      var source
      var edgeData
      //消すエッジと同じsourceのエッジが何本あるか調べる
      elements.value.forEach((el) => {
        if (el.id == params[i].id) {
          edgeData = el
          source = el.source
          NumOfSameSources = surveySameSource(source)
        }
      })
      //エッジが現状で2本以下だったらエッジをstraightに切り替える
      if(NumOfSameSources == 2){
        elements.value.forEach((el) => {
          if (isEdge(el) && el.source == source) {
            el.type = 'straight'
          }
        })
      }
      //edgeListの状態変更
      changeEdges(edgeData, "remove")
    }else if(params[i].type == "select"){
      var sedge = getEdge.value(params[i].id)
      if(params[i].selected){
        sedge.animated = true
        //turn2だったらラベル設定用にidを保存する
        if(store.state.turn == 2){
          store.commit("setEdgeId", params[i].id)
        }
      }else{
        sedge.animated = false
        //turn2だったらラベル設定用にidを保存する
        if(store.state.turn == 2){
          store.commit("setEdgeId", "")
        }
      }
    }else{
      return
    }
  }
})
/* エッジの追加時に発火する関数 onConnect->onEdgesChange */
onConnect((params) => {
  console.log("エッジの追加")
  //params:[source, sourceHandle, target, targetHandle]

  //同じソースのエッジの本数を取得する
  var NumOfEdge
  Skeys = Object.keys(edgeSNum)
  if(Skeys.includes(params.source)){
    NumOfEdge = surveySameSource(params.source) +1
  }else{
    NumOfEdge = 1
  }

  //新しいエッジの追加
  var newEdge
  const getEdgeId = () => `e${params.source}_${params.target}`
  if(NumOfEdge < 3){
    if(params.source.indexOf('make') > -1){
      //customMakeだったら
      if(NumOfEdge < 2){
        newEdge = {
          id: getEdgeId(),
          source: params.source,
          target: params.target,
          type: 'straight',
          style: { stroke: 'black' },
          markerEnd: MarkerType.ArrowClosed,
          animated: false,
        }
      }else{
        //メイクノードではエッジを1本しか生やせない
        alert("1つの化粧ノードから出せる矢印は1本だけです.追加で分岐させたい場合は分岐ノードを繋げてください")
        return
      }
    }else if(params.source.indexOf('branch') > -1){
      //customBranchだったら
      var addEdgeLabel
      var addEdgeColor
      var addEdgeType
      if(params.source.indexOf('mvbranch') > -1){
        //やる気ノード
        addEdgeLabel = NumOfEdge%2 == 0 ? 'なし' : 'あり'
        addEdgeColor = NumOfEdge%2 == 0 ? 'blue' : 'red'
        addEdgeType = NumOfEdge%2 == 0 ? 'no' : 'max'
      }else if(params.source.indexOf('sbranch') > -1){
        //季節ノード
        addEdgeLabel = NumOfEdge%2 == 0 ? '冬' : '夏'
        addEdgeColor = NumOfEdge%2 == 0 ? 'gray' : 'blue'
        addEdgeType = NumOfEdge%2 == 0 ? 'winter' : 'summer'
      }else{
        //時間ノード
        addEdgeLabel = NumOfEdge%2 == 0 ? '短い' : '長い'
        addEdgeColor = NumOfEdge%2 == 0 ? 'blue' : 'red'
        addEdgeType = NumOfEdge%2 == 0 ? 'short' : 'long'
      }
      newEdge = {
        id: getEdgeId(),
        source: params.source,
        target: params.target,
        type: NumOfEdge>1 ? 'smoothstep' : 'straight',
        label: addEdgeLabel,
        style: { stroke: addEdgeColor },
        labelStyle: { fill: 'white' },
        labelBgStyle: { fill: addEdgeColor },
        markerEnd: MarkerType.ArrowClosed,
        animated: false,
        data: {
          type: addEdgeType
        },
      }
    }else{
      //input/outputだったら
      if(NumOfEdge < 2){
        newEdge = {
          id: getEdgeId(),
          source: params.source,
          target: params.target,
          type: 'straight',
          style: { stroke: 'black' },
          markerEnd: MarkerType.ArrowClosed,
          animated: false,
        }
      }else{
        //メイクノードではエッジを1本しか生やせない
        alert("1つのメイク開始/終了ノードから出せる矢印は1本だけです.追加で分岐させたい場合は分岐ノードを繋げてください")
        return
      }
    }
  }else{
    //新しく足すエッジが3本目だったら追加させない
    alert("1つのノードから出せる矢印は2本までです.追加で分岐させたい場合は分岐ノードを繋げてください")
    return
  }
  addEdges([newEdge])
})

/* マウス操作に結びつけた関数 */
//ノードのドラッグ操作
const onDragOver = (event) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}
//ノードのドロップによる，新規ノードの追加
let id = 0
const ss_getId = () => `ss_${id++}`
const m_getId = () => `make_${id++}`
const mv_getId = () => `mvbranch_${id++}`
const s_getId = () => `sbranch_${id++}`
const t_getId = () => `tbranch_${id++}`
const onDrop = (event) => {
  const type = event.dataTransfer?.getData('application/vueflow')
  const position = project({ x: event.clientX - 400, y: event.clientY - 150 })
  var newNode
  if(type == 'input' || type == 'output'){
    //開始ノードか終了ノード
    newNode = {
      id: ss_getId(), type, position,
      label: type == 'input' ? 'メイク開始' : 'メイク終了',
    }
  }else if(type == 'customMake'){
    //メイクノード
    newNode = {
      id: m_getId(),
      type, position,
      label: store.state.itemName.length >= 7
        ? store.state.itemName+'\n('+store.state.typeName+')'
        : store.state.itemName+'('+store.state.typeName+')',
      style: { "--vf-node-color": 'black' },
      data: {
        partName: store.state.partName,
        partNum: store.state.partNum,
        itemName: store.state.itemName,
        itemNum: store.state.itemNum,
        typeName: store.state.typeName,
        typeNum: store.state.typeNum,
        skip: false,
        forget: false,
      }
    }
  }else{
    //分岐ノード
    var nodeLabel
    var nodeId
    if(type == 'customMotivation'){
      nodeLabel = '気合い'
      nodeId = mv_getId()
    }else if(type == 'customSeason'){
      nodeLabel = '季節'
      nodeId = s_getId()
    }else{
      nodeLabel = '外出時間'
      nodeId = t_getId()
    }
    newNode = {
      id: nodeId,
      type, position,
      label: nodeLabel,
      style: { "--vf-node-color": 'black' },
    }
  }
  addNodes([newNode])
}

const submitFlowchart = () => {
  console.log("データのmysqlへの送信&実験終了")
  const params2 = new URLSearchParams()
  params2.append('userId', store.state.userId)
  params2.append('userName', store.state.userName)
  params2.append('flowchart', JSON.stringify(toObject()))
  axios.post('https://takano.nkmr.io/flowchart_post.php', params2)
  .then((response)=>{
    //上手く行った時
    console.log('status:',response.status)
  }).catch((error)=>{
    //失敗した時
    console.log('err:',error)
  })
  //フローチャートデータのダウンロード
  const fileName2 = store.state.userName+".json"
  const flowData2 = JSON.stringify(toObject())
  const link2 = document.createElement("a")
  link2.href = "data:text/plain," + encodeURIComponent(flowData2)
  link2.download = fileName2
  link2.click()
  //フローチャート画像のダウンロード
  /*
  htmlToImage.toSvg(document.querySelector('.vue-flow__container'))
  .then(function (dataUrl2) {
    // 私の場合はダウンロード処理を実行
    const a2 = document.createElement('a')
    a2.download = store.state.userName+'.svg'
    a2.href = dataUrl2
    a2.click()
  })
  */
  //実験終了画面へ移動
  setTimeout(function(){
    router.push('/finish')
  }, 1000)
}
</script>

<template>
  <TopMenu @submitObject="submitFlowchart" @checkTurn1="checkOutput" />
  <div class="dndflow" @drop="onDrop">
    <div class="sidemenu">
      <FaceImage />
      <NodeSettings />
      <NodeField />
    </div>
    <VueFlow
      class="basicflow" v-model="elements"
      :node-types="nodeTypes" :default-zoom="1.5" :min-zoom="0.2" :max-zoom="4"
      :fit-view-on-init="true" :snap-to-grid="true" :connection-mode="ConnectionMode.Loose"
      @dragover="onDragOver" @pane-ready="onLoad" @selection-context-menu="selectMenu"
      @contextmenu.prevent.stop="handleClick($event)"
    >
      <Background pattern-color="#000000" gap="8" />
      <MiniMap />
      <Controls />
      <!--カスタムノードの設定-->
      <template #node-Make="props">
        <MakeNode v-bind="props" />
      </template>
      <template #node-Motivation="props">
        <MotivationNode v-bind="props" />
      </template>
      <template #node-Season="props">
        <SeasonNode v-bind="props" />
      </template>
      <template #node-Time="props">
        <TimeNode v-bind="props" />
      </template>
      <!--context-menuの設定-->
      <vue-simple-context-menu
        element-id="myUniqueId"
        :options="options"
        ref="vueContextMenu"
        @option-clicked="optionClicked"
      />
    </VueFlow>
  </div>
</template>

<style>
@import '../css/flowchart.css';
@import '../css/vue-simple-context-menu.css';
</style>