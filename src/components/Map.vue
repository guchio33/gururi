<template>
  <div style="height: 500px; width: 100%">
    <button @click="getCurrentPosition">現在地</button>
    <button @click="kamakura">鎌倉</button>
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
        :lat-lng="historicSite.latLng"
        :
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
import { latLng } from 'leaflet'
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
      zoom: 13,
      center: latLng(35.319065, 139.550412),
      currentCenter: latLng(35.319065, 139.550412),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      tileLayerOptions: {
        maxNativeZoom: 18,
        maxZoom: 21,
      },
      historicSites: [],
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
    // 下記二つ必須 ※これがないとzoomが更新されない
    zoomUpdated(zoom) {
      this.zoom = zoom
    },
    centerUpdated(center) {
      this.center = center
    },
    kamakura() {
      this.center = latLng(35.319065, 139.550412)
    },
    getCurrentPosition() {
      this.center = this.currentCenter
    },
  },

  mounted() {
    // 現在地を追跡
    navigator.geolocation.watchPosition((position) => {
      this.currentCenter = latLng(
        position.coords.latitude,
        position.coords.longitude
      )
    })
  },
}
</script>
