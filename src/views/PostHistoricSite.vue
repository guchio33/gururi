<template>
  <Form @submit.prevent="postHistoricSite">
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
</template>

<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      // 登録用の史跡data
      inputHistoricSite: {
        title: '',
        latLng: { latitude: '', longitude: '' },
      },
    }
  },
  methods: {
    postHistoricSite() {
      this.inputHistoricSite.latLng = new firebase.firestore.GeoPoint(
        this.inputHistoricSite.latLng.latitude,
        this.inputHistoricSite.latLng.longitude
      )
      const inputHistoricSite = {
        ...this.inputHistoricSite,
      }
      firebase
        .firestore()
        .collection('historicSites')
        .add(inputHistoricSite)
        .then((ref) => {
          // this.historicSites.push({
          //   id: ref.id,
          //   ...inputHistoricSite,
          // })
          console.log(ref)
          // inputHistoricSiteを初期化
          ;(this.inputHistoricSite = {
            title: '',
            latLng: { latitude: '', longitude: '' },
          }),
            alert('新しい史跡が登録されました')
        })
    },
  },
}
</script>
