<template>
  <div>
    {{ historicSite.title }}
    <div>コメント・いいね</div>
  </div>
</template>
<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      historicSite: {},
    }
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
