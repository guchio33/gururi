<template>
  <div>
    <router-link to="/">マップへ戻る</router-link>
    <h1>史跡登録</h1>
    <Form @submit="postHistoricSite">
      史跡名(例:鎌倉大仏)<input
        type="text"
        v-model="inputHistoricSite.title"
        required
        placeholder="鎌倉大仏"
      /><br />
      緯度(例:35.319065)<input
        type="text"
        v-model="inputHistoricSite.latLng.latitude"
        required
        placeholder="-90~90"
      /><br />
      経度(例:139.550412)<input
        type="text"
        v-model="inputHistoricSite.latLng.longitude"
        required
        placeholder="-180~180"
      /><br />
      <button type="submit">登録</button>
    </Form>
    <h1>登録史跡一覧</h1>
    <div v-for="historicSite in historicSites" :key="historicSite.id">
      <router-link
        :to="{
          name: 'EditHistoricSite',
          params: { id: historicSite.id },
        }"
      >
        {{ historicSite.title }}
      </router-link>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      historicSites: [],
      // 登録用の史跡data
      inputHistoricSite: {
        title: '',
        latLng: { latitude: '', longitude: '' },
      },
    }
  },
  created() {
    firebase
      .firestore()
      .collection('historicSites')
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          this.historicSites.push({
            id: doc.id,
            ...doc.data(),
          })
        })
      })
  },
  methods: {
    postHistoricSite() {
      this.inputHistoricSite.latLng = new firebase.firestore.GeoPoint(
        this.inputHistoricSite.latLng.latitude,
        this.inputHistoricSite.latLng.longitude
      )
      firebase
        .firestore()
        .collection('historicSites')
        .add(this.inputHistoricSite)
        .then(
          (this.inputHistoricSite = {
            title: '',
            latLng: { latitude: '', longitude: '' },
          }),
          alert('新しい史跡が登録されました')
        )
    },
  },
}
</script>
