<template>
  <div>
    <router-link to="/">マップへ戻る</router-link>
    <!-- 以下サインアップ機能 -->
    <div v-if="!$auth.currentUser.uid">
      <form @submit.prevent="signUp">
        <h1>サインアップ</h1>
        <input
          type="email"
          placeholder="メールアドレス"
          v-model="signUpEmail"
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          v-model="signUpPassword"
          required
          autocomplete="on"
        />
        <button type="submit">サインアップ</button>
      </form>
      <!-- 以下サインイン機能 -->
      <form @submit.prevent="signIn">
        <h1>サインイン</h1>
        <input
          type="email"
          placeholder="メールアドレス"
          v-model="signInEmail"
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          v-model="signInPassword"
          required
          autocomplete="on"
        />
        <button type="submit">サインイン</button>
      </form>
    </div>
    <!-- 以下ログイン後 -->
    <!-- プロフィール編集 -->
    <div v-else-if="isEditedProfile">
      <form @submit.prevent="updateProfile">
        <h1>プロフィール編集</h1>
        <div>プロフィール画像:<input type="file" @change="profileImage" /></div>
        <div>
          ユーザー名:
          <input
            type="text"
            placeholder="ユーザー名"
            v-model="$auth.currentUser.displayName"
            required
          />
        </div>
        <button type="submit">更新する</button>
      </form>
    </div>
    <!-- プロフィール表示 -->
    <div v-else>
      <h1>プロフィール</h1>
      <img :src="$auth.currentUser.photoURL" width="150" height="150" />
      <div>メールアドレス:{{ $auth.currentUser.email }}</div>
      <div>ユーザー名:{{ $auth.currentUser.displayName }}</div>
      <button @click="editProfile">プロフィールを編集する</button>
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
      signUpEmail: '',
      signUpPassword: '',
      signInEmail: '',
      signInPassword: '',
      isEditedProfile: false,
    }
  },
  methods: {
    signUp() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.signUpEmail, this.signUpPassword)
    },
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.signInEmail, this.signInPassword)
    },
    signOut() {
      firebase.auth().signOut()
    },
    updateProfile() {
      let updateState
      firebase
        .storage()
        .ref()
        .child('photoImages/' + this.$auth.currentUser.uid)
        .getDownloadURL()
        .then((url) => {
          this.$auth.currentUser.photoURL = url
        })
        .then(
          (updateState = {
            displayName: this.$auth.currentUser.displayName,
            photoURL: this.$auth.currentUser.photoURL,
          }),
          firebase.auth().currentUser.updateProfile({
            updateState,
          }),
          firebase
            .firestore()
            .collection('users')
            .doc(this.$auth.currentUser.uid)
            .update(updateState)
        )
      // Object.assign(this.$auth.currentUser, updateState)
      this.isEditedProfile = false
    },
    editProfile() {
      this.isEditedProfile = true
    },
    profileImage(e) {
      // console.log(e.target.files[0])
      firebase
        .storage()
        .ref()
        .child('photoImages/' + this.$auth.currentUser.uid)
        .put(e.target.files[0])
    },
  },
}
</script>
