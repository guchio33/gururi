<template>
  <div>
    {{ isSignedIn }}
    <!-- 以下サインアップ機能 -->
    <div v-if="!isSignedIn">
      <h1>サインアップ</h1>
      <input
        type="text"
        placeholder="ユーザー名"
        v-model="displayName"
        required
      />
      <br />
      プロフィール画像<input type="file" />
      <input
        type="email"
        placeholder="メールアドレス"
        v-model="email"
        required
      />
      <input
        type="password"
        placeholder="パスワード"
        v-model="password"
        required
      />
      <button @click="signUp">サインアップ</button>
      <!-- 以下サインイン機能 -->
      <h1>サインイン</h1>
      <input type="email" placeholder="メールアドレス" v-model="email2" />
      <input type="password" placeholder="パスワード" v-model="password2" />
      <button @click="signIn">サインイン</button>
    </div>
    <!-- 以下サインアウト -->
    <div v-else>
      <h1>サインアウト</h1>
      <button @click="signOut">サインアウト</button>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'

export default {
  data() {
    return {
      email: '',
      password: '',
      email2: '',
      password2: '',
      displayName: '',
      photoURL:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRABORT0Pf1bkxpOsQMlTk6G9VmNasbrCKoPA&usqp=CAU',
      user: null,
    }
  },
  computed: {
    isSignedIn() {
      return this.$auth.currentUser.uid
    },
  },
  methods: {
    signUp() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          userCredential.user.updateProfile({
            displayName: this.displayName,
            photoURL: this.photoURL,
          })
        })
    },
    signIn() {
      firebase.auth().signInWithEmailAndPassword(this.email2, this.password2)
      // .then((userCredential) => {
      // })
    },
    signOut() {
      firebase.auth().signOut()
    },
  },
}
</script>
