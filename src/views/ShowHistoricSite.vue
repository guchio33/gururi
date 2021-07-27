<template>
  <div>
    <router-link to="/">マップへ戻る</router-link>
    <h1>
      {{ historicSite.title }}
    </h1>
    <div v-if="$auth.currentUser.uid">
      <form @submit.prevent="postComment">
        <h2>コメント投稿</h2>
        <input
          type="text"
          placeholder="コメントしてください"
          v-model="inputText"
        />
        <input type="submit" value="投稿" />
      </form>
    </div>
    <h2>コメント一覧</h2>
    <div v-for="comment in comments" :key="comment.id">
      <img :src="comment.photoURL" width="50" height="50" />{{ comment.name }}
      <p>{{ comment.text }}</p>
      <!-- <button @click="likeComment(comment)">いいね！</button> -->
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      historicSite: {},
      inputText: '',
      comments: [],
    }
  },
  methods: {
    // likeComment(comment) {
    //   firebase
    //     .firestore()
    //     .collection('historicSites')
    //     .doc(this.$route.params.id)
    //     .collection('comments')
    //     .doc(comment.id)
    //     .collection('likes')
    //     .add({ uid: this.$auth.currentUser.uid })
    // },
    postComment() {
      let comment = {
        text: this.inputText,
        name: this.$auth.currentUser.displayName,
        uid: this.$auth.currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: this.$auth.currentUser.photoURL,
      }
      firebase
        .firestore()
        .collection('historicSites')
        .doc(this.$route.params.id)
        .collection('comments')
        .add(comment)
        .then((ref) => {
          this.comments.push({
            id: ref.id,
            ...comment,
          })
          this.inputText = ''
        })
    },
  },
  created() {
    firebase
      .firestore()
      .collection('historicSites')
      .doc(this.$route.params.id)
      .get()
      .then((snapshot) => {
        this.historicSite = {
          id: snapshot.id,
          ...snapshot.data(),
        }
      })
    // コメント取得
    firebase
      .firestore()
      .collection('historicSites')
      .doc(this.$route.params.id)
      .collection('comments')
      .orderBy('createdAt')
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          this.comments.push({
            id: doc.id,
            ...doc.data(),
          })
        })
      })
  },
}
</script>
