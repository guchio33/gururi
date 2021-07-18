<template>
  <div>
    <!-- 以下サインアップ機能 -->
    <h1>サインアップ</h1>
    <input type="email" placeholder="メールアドレス" v-model="email" />
    <input type="password" placeholder="パスワード" v-model="password" />
    <button @click="signUp">サインアップ</button>
    <!-- 以下サインイン機能 -->
    <h1>サインイン</h1>
    <input type="email" placeholder="メールアドレス" v-model="email2" />
    <input type="password" placeholder="パスワード" v-model="password2" />
    <button @click="signIn">サインイン</button>
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
    }
  },
  methods: {
    signUp() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user
          console.log(user)
          // ...
        })
    },
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email2, this.password2)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user
          console.log(user)
          // ...
        })
    },
  },
}
</script>
