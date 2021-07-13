<template>
  <div style="height: 500px; width: 100%">
    <Form @submit.prevent="postHistoricSite">
      史跡名(例:鎌倉大仏)<input
        type="text"
        v-model="inputHistoricTitle"
        required
        placeholder="鎌倉大仏"
      /><br />
      緯度(例:35.319065)<input
        type="text"
        v-model="inputHistoricLatitude"
        required
        placeholder="-90~90"
      /><br />
      経度(例:139.550412)<input
        type="text"
        v-model="inputHistoricLongitude"
        required
        placeholder="-180~180"
      /><br />
      <button type="submit">登録</button>
    </Form>
    <button @click="getCurrentPosition">現在地</button>
    <button
      v-for="(historicSite, index) in historicSites"
      :key="historicSite.id"
      @click="getHistoricSitePosition(index)"
    >
      {{ historicSite.title }}
    </button>
    <l-map
      :zoom="zoom"
      :center="center"
      style="height: 80%"
      @ready="onReady"
      @locationfound="onLocationFound"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
        :options="tileLayerOptions"
      />
      <l-marker
        v-for="historicSite in historicSites"
        :key="historicSite.id"
        :lat-lng="[historicSite.latLng.latitude, historicSite.latLng.longitude]"
      >
        <l-popup>
          <div>
            <router-link to="/about">{{ historicSite.title }}</router-link>
          </div>
        </l-popup>
      </l-marker>
      <l-marker :lat-lng="currentCenter"> </l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import firebase from 'firebase'

export default {
  name: 'Example',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  data() {
    return {
      // 初期zoomレベル
      zoom: 13,
      // 初期地図位置(鎌倉駅)
      center: [35.319065, 139.550412],
      currentCenter: [35.319065, 139.550412],
      // 使用する地図のレイヤー
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      // 地図の参照
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      // maxZoomを18→21
      tileLayerOptions: {
        maxNativeZoom: 18,
        maxZoom: 21,
      },
      // マーカー用の史跡data
      historicSites: [],
      // 登録用の史跡data
      inputHistoricTitle: '',
      inputHistoricLatitude: '',
      inputHistoricLongitude: '',
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
    //   コンポーネントが読み込まれたら位置情報取得
    onReady(mapObject) {
      mapObject.locate()
    },
    onLocationFound(location) {
      // 取得した位置情報を中心にする
      this.center = location.latlng
      // 取得した位置情報にマーカーをおく
      this.currentCenter = location.latlng
    },
    //zommレベルをデータに格納(必須)
    zoomUpdated(zoom) {
      this.zoom = zoom
    },
    // 中心位置をデータに格納(必須)
    centerUpdated(center) {
      this.center = center
    },
    getHistoricSitePosition(index) {
      this.center = [
        this.historicSites[index].latLng.latitude,
        this.historicSites[index].latLng.longitude,
      ]
    },
    getCurrentPosition() {
      this.center = this.currentCenter
    },
    postHistoricSite() {
      const inputHistoricSite = {
        title: this.inputHistoricTitle,
        latLng: new firebase.firestore.GeoPoint(
          this.inputHistoricLatitude,
          this.inputHistoricLongitude
        ),
      }
      firebase
        .firestore()
        .collection('historicSites')
        .add(inputHistoricSite)
        .then((ref) => {
          this.historicSites.push({
            id: ref.id,
            ...inputHistoricSite,
          })
          ;(this.inputHistoricTitle = ''),
            (this.inputHistoricLatitude = ''),
            (this.inputHistoricLongitude = '')
          alert('新しい史跡が登録されました')
        })
    },
  },

  mounted() {
    // 現在地を追跡
    navigator.geolocation.watchPosition((position) => {
      this.currentCenter = [position.coords.latitude, position.coords.longitude]
    })
  },
}
</script>
