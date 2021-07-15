<template>
  <div style="height: 500px; width: 100%">
    <button @click="getCurrentPosition">現在地</button>
    <button
      v-for="(historicSite, index) in historicSites"
      :key="historicSite.id"
      @click="getHistoricSitePosition(index)"
    >
      {{ historicSite.title }}
    </button>
    <l-map
      ref="map"
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
            <router-link
              :to="{
                name: 'ShowHistoricSite',
                params: { id: historicSite.id },
              }"
              >{{ historicSite.title }}詳細ページへ</router-link
            ><audio
              src="http://pro-video.jp/voice/announce/mp3/ohayo01mayu.mp3"
              controls
            ></audio>
          </div>
        </l-popup>
      </l-marker>
      <l-marker :lat-lng="currentCenter" :icon="currentIcon"> </l-marker>
    </l-map>
  </div>
</template>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import firebase from 'firebase'

export default {
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

      currentIcon: L.icon({
        iconUrl: 'https://icooon-mono.com/i/icon_10976/icon_109760.svg',
        iconSize: [25, 25],
      }),
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
      // zoomとcenter合わせると動きが悪い(原因不明)
      // this.$refs.map.setZoom(13)
      this.$refs.map.setCenter(this.currentCenter)
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
