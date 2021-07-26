<template>
  <div style="height: 95vh">
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      @ready="onReady"
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
            >
            <!-- <audio :src="soundUrl" controls></audio> -->
          </div>
        </l-popup>
      </l-marker>
      <l-marker :lat-lng="currentCenter" :icon="currentIcon"> </l-marker>
      <l-control position="bottomleft">
        <button @click="listHistoricSiteSeen">リスト</button>
      </l-control>
      <l-control position="bottomleft">
        <button @click="getCurrentPosition">現在地</button>
      </l-control>
      <l-control position="bottomleft">
        <router-link to="/sign-up"
          ><button v-if="!$auth.currentUser.uid">ログイン</button>
          <button v-else>ログイン済み</button>
        </router-link>
      </l-control>
      <l-control position="bottomleft">
        <router-link to="/post-historic-site"
          ><button>史跡管理</button>
        </router-link>
      </l-control>
    </l-map>
    <div class="list">
      <div v-if="listHistoricSite">
        <button @click="listHistoricSiteHidden">表示を隠す</button>
        <div
          v-for="(historicSite, index) in historicSites"
          :key="historicSite.id"
        >
          <button @click="getHistoricSitePosition(index)">
            {{ historicSite.title }}
          </button>
        </div>
      </div>
      <button v-else @click="listHistoricSiteSeen">
        ListHistoricSiteを表示する
      </button>
    </div>
  </div>
</template>
<style scoped>
.list {
  /* position: relative; */
  /* top: -40px; */
  /* z-index: 1000; */
}
.list button {
  width: 100%;
}
</style>
<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup, LControl } from 'vue2-leaflet'
import firebase from 'firebase'

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LControl,
  },
  data() {
    return {
      // 初期zoomレベル
      zoom: 13,
      // 初期地図位置(鎌倉駅)
      center: [35.319065, 139.550412],
      // 現在地マーカーの位置
      // currentCenter: [35.319065, 139.550412],
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
      // soundUrl: '',
      listHistoricSite: false,
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
  computed: {
    currentCenter() {
      return [this.$position.latitude, this.$position.longitude]
    },
  },
  methods: {
    //   コンポーネントが読み込まれたら位置情報取得
    onReady() {
      this.center = [this.$position.latitude, this.$position.longitude]
    },
    // onLocationFound(location) {
    //   // 取得した位置情報を中心にする
    //   this.center = location.latlng
    //   // 取得した位置情報にマーカーをおく
    //   this.currentCenter = location.latlng
    // },
    //zommレベルをデータに格納(必須)
    zoomUpdated(zoom) {
      this.zoom = zoom
    },
    // 中心位置をデータに格納(必須)
    centerUpdated(center) {
      this.center = center
    },
    // 史跡の位置に移動
    getHistoricSitePosition(index) {
      this.center = [
        this.historicSites[index].latLng.latitude,
        this.historicSites[index].latLng.longitude,
      ]
    },
    getCurrentPosition() {
      // zoomとcenter合わせると動きが悪い(原因不明)
      // this.$refs.map.setZoom(13)
      // this.$refs.map.setCenter(this.currentCenter)
      this.center = [this.$position.latitude, this.$position.longitude]
    },
    listHistoricSiteSeen() {
      this.listHistoricSite = true
    },
    listHistoricSiteHidden() {
      this.listHistoricSite = false
    },
  },

  // mounted() {
  //   // 現在地を追跡
  //   navigator.geolocation.watchPosition((position) => {
  //     this.currentCenter = [position.coords.latitude, position.coords.longitude]
  //     console.log('追跡')
  //   })
  // },
}
</script>
