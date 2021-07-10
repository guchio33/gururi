<template>
  <div style="height: 500px; width: 100%">
    <button @click="now">現在地</button>
    <!-- <button @click="kamakura">鎌倉</button> -->
    <l-map
      v-if="showMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 80%"
      @ready="onReady"
      @locationfound="onLocationFound"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
        :options="tileLayerOptions"
      />
      <l-marker :lat-lng="withPopup">
        <l-popup>
          <div>
            ポップアップだよ<router-link to="/about"
              >鎌倉大仏の詳細へ</router-link
            >
          </div>
        </l-popup>
      </l-marker>
      <l-marker :lat-lng="withTooltip">
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div>I am a tooltip</div>
        </l-tooltip>
      </l-marker>
      <l-marker :lat-lng="currentLocation"> </l-marker>
    </l-map>
  </div>
</template>

<script>
import { latLng } from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet'

export default {
  name: 'Example',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
  },
  data() {
    return {
      zoom: 13,
      center: latLng(35.319065, 139.550412),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      tileLayerOptions: {
        maxNativeZoom: 18,
        maxZoom: 21,
      },
      withPopup: latLng(35.316715, 139.536041),
      withTooltip: latLng(35.319065, 139.550412),
      //   currentZoom: 11.5,
      //   currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
      currentLocation: latLng(0, 0),
      watch: true,
    }
  },
  //   created() {
  //     console.dir(LMap.options)
  //   },
  methods: {
    //   初期状態で現在地表示
    onReady(mapObject) {
      mapObject.locate()
      //   console.log(this.$currentLocation)
    },
    onLocationFound(location) {
      //   console.log(this.currentLocation)
      this.currentLocation = location.latlng
      this.center = location.latlng
      //   console.log(location.latlng)
    },
    // kamakura(){

    // }
    now() {
      this.center = this.currentLocation
      console.log('現在地取得した！')
      // 緯度経度が全く同じ値だと地図中心が移動してくれないため、無理やり変更している。その後、現在地をセット
      //   this.center = latLng(35.319065, 139.550412)
      // Geolocation API で現在位置を取得
      //   アロー関数にしないとthis使えない
      //   navigator.geolocation.getCurrentPosition(
      //     (position) => {
      //       //   this.currentLocation = latLng(
      //       //     position.coords.latitude,
      //       //     position.coords.longitude
      //       //   )

      //       //   this.center = latLng(
      //       //     position.coords.latitude,
      //       //     position.coords.longitude
      //       //   )

      //       this.center = this.currentLocation
      //       console.log('現在地取得した！')
      //       //   console.log(position.coords.latitude, position.coords.longitude)
      //       //   console.log(position.coords.accuracy)
      //     },
      //     (error) => {
      //       alert(error.code)
      //     },
      //     { enableHighAccuracy: true }
      //   )
      //   this.center = this.currentLocation
      //   console.log(this.currentLocation.lat)
      //   console.dir(this.center)
    },
  },
  mounted() {
    //   ページ開いたとき現在地を表示→methodsに記載
    // navigator.geolocation.getCurrentPosition((position) => {
    //   this.currentLocation = latLng(
    //     position.coords.latitude,
    //     position.coords.longitude
    //   )
    //   this.center = latLng(position.coords.latitude, position.coords.longitude)
    // })
    // 現在地を追跡→ちょっと難しい
    navigator.geolocation.watchPosition((position) => {
      this.currentLocation = latLng(
        position.coords.latitude,
        position.coords.longitude
      )
      console.log('追跡した！')
    })
  },
}
</script>
