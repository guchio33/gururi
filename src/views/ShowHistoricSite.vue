<template>
  <div>
    {{ historicSite.title }}
    <div>コメント</div>
    <div v-if="isSignedIn">
      <input type="text" placeholder="コメントしてください" v-model="comment" />
      <input type="button" @click="postComment" value="投稿" />
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      historicSite: {},
      comment: '',
    }
  },
  computed: {
    isSignedIn() {
      return this.$auth.currentUser.uid
    },
  },
  methods: {
    postComment() {
      firebase
        .firestore()
        .collection('historicSites')
        .doc(this.$route.params.id)
        .collection('comments')
        .add({
          comment: this.comment,
          name: this.$auth.currentUser.displayName,
          uid: this.$auth.currentUser.uid,
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
  },
}
</script>
