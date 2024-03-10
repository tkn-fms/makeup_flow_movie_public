<script setup>
import { computed, ref } from 'vue'
// import { useStore } from 'vuex'
// import { useRouter } from 'vue-router'
// import axios from "axios"

//変数
const userName = ref("")
const userUrl = ref("")
// const store = useStore()
// const router = useRouter()

const checkName = computed({
  get: () => userName.value,
  set: (value) => {
    userName.value = value
    checkForm
  }
})
const checkUrl = computed({
  get: () => userUrl.value,
  set: (value) => {
    userUrl.value = value
    checkForm
  }
})
const checkForm = computed({
  get: () => {
    if(userName.value != "" && userUrl.value != ""){
      return false
    }else{
      return true
    }
  },
  set: (value) => {
    console.log(value)
  }
})

//追加機能//
const googleClientId = prosess.env.GOOGLE_CLIENT_ID // Google API Consoleで取得したクライアントID
const googleApiKey = prosess.env.GOOGLE_API_KEY // 必要に応じてAPIキーを指定
const loggedIn = ref(false)
const googleUser = ref(null)

// YouTubeリンクがルールに沿っているかの確認
const extractVideoId = (url) => {
  const videoIdMatch = url.match(/v=([a-zA-Z0-9_-]+)/)
  if (videoIdMatch) {
      return videoIdMatch[1]
  }
  return null;
}

//Googleログインの関数
const handleLogin = (googleUser) => {
  loggedIn.value = true
  googleUser.value = googleUser.getBasicProfile()
}
const handleLogout = () => {
  loggedIn.value = false
  googleUser.value = null
}
const handleError = (error) => {
  console.error('Google Login Error: ', error)
}

//データを出す関数
const submitUserData = () => {
  //ユーザーidの生成
  const userId = Math.floor(1000+Math.random() * 9000)

  //YouTubeリンクから動画情報を取得
  const youtubeUrl = document.getElementById('youtubeUrl').value
  const videoId = extractVideoId(youtubeUrl)
  if (videoId) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${googleApiKey}`

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          if (data.items && data.items.length > 0) {
              const videoInfo = data.items[0].snippet
              const videoTitle = videoInfo.title
              const channelTitle = videoInfo.channelTitle
              const infoElement = document.getElementById('videoInfo')
              infoElement.innerHTML = `動画タイトル: ${videoTitle}<br>チャンネル名: ${channelTitle}`
          } else {
              alert("動画情報を取得できませんでした")
          }
      })
      .catch(error => {
          alert("エラーが発生しました: " + error)
      });
  } else {
      alert("有効なYouTubeリンクを入力してください")
  }

  //送信データの生成
  const userParams = new URLSearchParams()
  userParams.append('userId', userId)
  userParams.append('userName', userName.value)
  userParams.append('userUrl', userUrl.value)
  //データをDBに送信
  // axios.post('https://takano.nkmr.io/flowchart_user_post.php', userParams)
  // .then((response)=>{
  //   //上手く行った時
  //   console.log('status:',response.status)
  // }).catch((error)=>{
  //   //失敗した時
  //   console.log('err:',error)
  // })
  // //ユーザーデータの保持
  // store.commit("setUserData", { name: userName.value, id: userId })
  // console.log(store.state.userId)
  // console.log(store.state.userName)
  // //フローチャート作成ページへ移行
  // router.push('/flowchart')
}
</script>

<template>
  <div class="home">
    <h1>化粧フローチャート作成実験</h1>
    <hr>
    <div class="description">
      <!-- 説明 -->
      <p id="desc-title">化粧のチュートリアル動画からの化粧フローチャート作成実験にご協力下さりありがとうございます．</p>
      <p id="desc-check">詳細な実験手順は<a href="https://takano.nkmr.io/b4/description/" target="_blank">こちら</a>に記載してありますので，</p>
      <p id="desc-check"><strong>説明を全て読んでから</strong>実験にご参加頂くようよろしくお願い致します．</p>
      <!-- 注意事項 -->
      <div id="heading">注意事項</div>
      <ul>
        <table>
          <tr><td><li>実験にはPCを用いて，ブラウザーをフルスクリーンの状態で行ってください．</li></td></tr>
          <tr><td><li>ブラウザーのリロードボタン及び戻るボタンは押さないでください．</li></td></tr>
          <tr><td><li>時間制限は無いため，適度に休憩を取りながらリラックスした状態で作成してください．</li></td></tr>
        </table>
      </ul>
      <!-- 問い合わせ先 -->
      <div id="heading"><a>問い合わせ先</a></div>
      <ul id="none">
        <table>
          <tr><td><li>氏名：髙野沙也香</li></td></tr>
          <tr><td><li>メールアドレス：cs232026@meiji.ac.jp または Slackまで</li></td></tr>
        </table>
      </ul>
      <div class="login">
        <div id="heading">ログイン</div>
        <vue3-google-login
          :clientId="googleClientId"
          :api="googleApi"
          @login="handleLogin"
          @logout="handleLogout"
          @error="handleError"
        >
          <button>Login with Google</button>
        </vue3-google-login>
        <div v-if="loggedIn">
          <p>Logged in as: {{ googleUser.name }}</p>
          <p>Email: {{ googleUser.email }}</p>
        </div>
        <ul id="none">
          <table>
            <tr><td><li>お名前（漢字表記・姓名間にスペースなし）とパスワード（自由）を入力してください．</li></td></tr>
            <tr><td>
              <label for="name">名前(フローチャート作成者名)：</label>
              <input type="text" id="name" v-model="checkName">
              <label for="youtubeUrl" class="youtubeUrl">動画URL：</label>
              <input type="text" id="youtubeUrl" v-model="checkUrl" placeholder="YouTubeのリンクを入力">
              <button @click="submitUserData" :disabled="checkForm" :class="checkForm ? '' : 'ableButton'">ログイン</button>
              <div id="videoInfo"></div>
            </td></tr>
          </table>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c");
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+JP");
.home {
  width: 800px;
  height: 700px;
  margin: 5px auto;
  border: 3px solid #3cb371;
  border-radius: 30px;
  font-family: "Noto Sans JP"; /* "M PLUS Rounded 1c" */
  text-transform: none;
}
hr {
  border-top: 3px solid #3cb371;
}
.description {
  padding: 10px 20px;
}
#desc-check{
  margin: 3px 10px;
}
#heading{
  font-size: 17px;
  font-weight: bold;
  text-align: left;
  /* 上 左右 下 */
  margin: 20px 0px 5px;
  padding: 5px;
  color: #333333;
}
table {
  text-align: left;
}
table tr{
  /* 上下 左右 */
  margin: 5px 0px;
}
table td{
  /* 上下 左右 */
  padding: 5px 10px;
}
ol, ul{
  /* 上 右 下 左 */
  margin: 3px 0px 5px 0px;
}
#none{
  list-style: none;
}
.youtubeUrl{
  margin-left: 10px;
}
.login button {
  text-align: left;
  margin: 5px 5px 5px 30px;
  display       : inline-block;
  border-radius : 10%;          /* 角丸       */
  font-size     : 13pt;        /* 文字サイズ */
  text-align    : center;      /* 文字位置   */
  cursor        : pointer;     /* カーソル   */
  padding       : 12px 12px;   /* 余白       */
  background    : #f5f5f5;     /* 背景色     */
  color         : #ffffff;     /* 文字色     */
  line-height   : 1em;         /* 1行の高さ  */
  transition    : .3s;         /* なめらか変化 */
  border        : 2px solid #f5f5f5;    /* 枠の指定 */
}
.ableButton {
  background: rgba(16,185,129,.75)!important;
}
</style>
