import { createStore } from 'vuex'

export default createStore({
  state: {
    /* ユーザーデータ */
    userName: "",
    userId: "",
    turn: 1, //ターン数
    /* 開始・終了ノードの有無 */
    outputN: false,
    inputN: false,
    /* メイクノードの情報 */
    partNum: 0,
    partName: "肌",
    itemNum: 0,
    itemName: "日焼け止め",
    typeNum: 0,
    typeName: "無色",
    /* 登録のノードの化粧工程情報 */
    makenodeList: [false, false, false, false, false, false, false, false, false],
    /* 範囲選択しているノードのリスト */
    selectnodeList :[],
  },
  mutations: {
    setUserData: function(state, userData){
      state.userName = userData.name,
      state.userId = userData.id
    },
    setTurn: function(state, num){
      state.turn = state.turn + num
    },
    setInOutput: function(state, exist){
      state.inputN = exist.input
      state.outputN = exist.output
    },
    setPart: function(state, part) {
      state.partNum = part.num
      state.partName = part.name
    },
    setItem: function(state, item) {
      state.itemNum = item.num
      state.itemName = item.name
    },
    setType: function(state, type) {
      state.typeNum = type.num
      state.typeName = type.name
    },
    setMakeNodeList: function(state, makeNodeData){
      state.makenodeList[makeNodeData.imgNum] = makeNodeData.imgState
    },
    setSelectNodeList: function(state, nodeData){
      state.selectnodeList = nodeData
    },
  },
  actions: {
    /*
    getPart: function({ commit }, part) {
      commit('setPart', part)
    },
    */
  },
  modules: {
  }
})
