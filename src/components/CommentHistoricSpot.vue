<template>
  <div>
    <a href="comment-site/hi9JzlVY6d9CalsvLMky">テスト</a>
    <Form @submit.prevent="postCommentSite">
      <input type="text" v-model="inputCommentSite.text" />
      <button type="submit">コメントを追加</button>
    </Form>
    <ul>
      <li v-for="comment in comments" :key="comment.id">
        {{ comment.text }}
      </li>
    </ul>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  data() {
    return {
      inputCommentSite: {
        text: '',
      },
      comments: [],
    }
  },
  created() {
    firebase
      .firestore()
      .collection('commentSites')
      .get()
      .then((text) => {
        text.docs.forEach((doc) => {
          this.comments.push({
            id: doc.id,
            // textを取得
            ...doc.data(),
          })
        })
      })
  },
  methods: {
    postCommentSite() {
      const inputCommentSite = {
        ...this.inputCommentSite,
      }
      firebase
        .firestore()
        .collection('commentSites')
        .add(inputCommentSite)
        .then((ref) => {
          this.inputCommentSite.push({
            id: ref.id,
            text: inputCommentSite,
          })(
            (this.inputCommentSite = {
              text: '',
            })
          )
          alert('コメントが追加されました')
        })
    },
  },
}
</script>
