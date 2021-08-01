<template>
  <div style="height: 80vh">
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
      <div v-for="historicSite in historicSites" :key="historicSite.id">
        <!-- 史跡スポット -->
        <l-marker
          :lat-lng="[
            historicSite.latLng.latitude,
            historicSite.latLng.longitude,
          ]"
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
            </div>
          </l-popup>
        </l-marker>
        <!-- 音声スポット -->
        <div v-for="soundSite in historicSite.soundSites" :key="soundSite.id">
          <l-marker
            :lat-lng="[soundSite.latLng.latitude, soundSite.latLng.longitude]"
            :icon="soundIcon"
          >
            <l-popup>
              <div>
                {{ soundSite.title }}
                <audio :src="soundSite.soundURL" controls></audio>
              </div>
            </l-popup>
          </l-marker>
        </div>
      </div>
      <!-- 現在地アイコン -->
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
          <div
            v-for="(soundSite, index2) in historicSite.soundSites"
            :key="soundSite.id"
          >
            <button
              class="soundSite"
              @click="getSoundSitePosition(index, index2)"
            >
              {{ soundSite.title }}
            </button>
          </div>
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
.soundSite {
  width: 50% !important;
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
      soundIcon: L.icon({
        iconUrl:
          'data:image/png;base64,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',
        iconSize: [25, 25],
      }),
      listHistoricSite: false,
    }
  },
  mounted() {
    const historicSitesRef = firebase.firestore().collection('historicSites')

    historicSitesRef.get().then((snapshot1) => {
      snapshot1.docs.forEach((doc1) => {
        let soundSites = []
        historicSitesRef
          .doc(doc1.id)
          .collection('soundSites')
          .get()
          .then((snapshot2) => {
            snapshot2.docs.forEach((doc2) => {
              soundSites.push({
                id: doc2.id,
                ...doc2.data(),
              })
            })
          })
        this.historicSites.push({
          id: doc1.id,
          ...doc1.data(),
          soundSites: soundSites,
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
    // 音声ガイドに位置に移動
    getSoundSitePosition(index, index2) {
      this.center = [
        this.historicSites[index].soundSites[index2].latLng.latitude,
        this.historicSites[index].soundSites[index2].latLng.longitude,
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
