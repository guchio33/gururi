<template>
  <div>
    <router-link to="/post-historic-site">史跡一覧へ戻る</router-link>
    <h1>{{ historicSite.title }}</h1>
    <p>{{ historicSite.latLng }}</p>
    <h1>音声スポット登録</h1>
    <form @submit.prevent="postSoundSite">
      <div>
        音声ファイル：<input type="file" @change="soundFile" required />
      </div>
      <div>
        音声スポットタイトル：<input
          type="text"
          required
          v-model="inputSoundSite.title"
        />
      </div>
      <div>
        緯度：<input
          type="text"
          required
          placeholder="-180~180"
          v-model="inputSoundSite.latLng.latitude"
        />
      </div>
      <div>
        経度：<input
          type="text"
          required
          placeholder="-180~180"
          v-model="inputSoundSite.latLng.longitude"
        />
      </div>
      <button type="submit">音声スポット登録</button>
    </form>
    <h1>音声スポット一覧</h1>
    <div v-for="soundSite in soundSites" :key="soundSite.id">
      <p>{{ soundSite.title }}</p>
      <p>{{ soundSite.latLng }}</p>
      <audio :src="soundSite.soundURL" controls></audio>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      historicSite: {},
      soundSites: [],
      inputSoundSite: {
        title: '',
        latLng: { latitude: '', longitude: '' },
        soundURL: '',
      },
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
    firebase
      .firestore()
      .collection('historicSites')
      .doc(this.$route.params.id)
      .collection('soundSites')
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          this.soundSites.push({
            id: doc.id,
            ...doc.data(),
          })
        })
      })
  },
  methods: {
    postSoundSite() {
      this.inputSoundSite.latLng = new firebase.firestore.GeoPoint(
        this.inputSoundSite.latLng.latitude,
        this.inputSoundSite.latLng.longitude
      )
      firebase
        .firestore()
        .collection('historicSites')
        .doc(this.$route.params.id)
        .collection('soundSites')
        .add(this.inputSoundSite)
        .then(
          (this.inputSoundSite = {
            title: '',
            latLng: { latitude: '', longitude: '' },
            soundURL: '',
          }),
          alert('新しい音声スポットが登録されました')
        )
    },
    soundFile(e) {
      firebase
        .storage()
        .ref()
        .child('sounds/' + e.target.files[0].name)
        .put(e.target.files[0])
        .then((snapshot) => {
          snapshot.ref.getDownloadURL().then((url) => {
            this.inputSoundSite.soundURL = url
          })
        })
    },
  },
}
</script>
