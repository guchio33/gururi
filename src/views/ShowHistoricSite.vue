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
    <div v-for="(comment, index) in comments" :key="comment.id">
      <img :src="comment.photoURL" width="50" height="50" />{{ comment.name }}
      <p>{{ comment.text }}</p>
      <p>{{ comment.likes.length }}いいね</p>
      <div v-if="comment.likes.find((ob) => ob.uid == $auth.currentUser.uid)">
        いいね済み
      </div>
      <div v-else-if="$auth.currentUser.uid">
        <button @click="likeComment(index, comment)">いいね！</button>
      </div>
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
    likeComment(index, comment) {
      firebase
        .firestore()
        .collection('historicSites')
        .doc(this.$route.params.id)
        .collection('comments')
        .doc(comment.id)
        .collection('likes')
        .add({
          uid: this.$auth.currentUser.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((ref) => {
          this.comments[index].likes.push({
            id: ref.id,
            uid: this.$auth.currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
        })
    },
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
    const historicSiteRef = firebase
      .firestore()
      .collection('historicSites')
      .doc(this.$route.params.id)
    historicSiteRef.get().then((snapshot) => {
      this.historicSite = {
        id: snapshot.id,
        ...snapshot.data(),
      }
    })
    // コメント取得
    const commentsRef = historicSiteRef.collection('comments')
    commentsRef
      .orderBy('createdAt')
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          let likes = []
          commentsRef
            .doc(doc.id)
            .collection('likes')
            .get()
            .then((snapshot2) => {
              snapshot2.docs.forEach((doc2) => {
                likes.push({
                  id: doc2.id,
                  ...doc2.data(),
                })
              })
            })
          this.comments.push({
            id: doc.id,
            likes: likes,
            ...doc.data(),
          })
        })
      })
  },
}
</script>
