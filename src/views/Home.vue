<template>
  <div style="height: 500px; width: 100%">
    <!-- <div style="height: 200px; overflow: auto">
      <p>First marker is placed at {{ withPopup.lat }}, {{ withPopup.lng }}</p>
      <p>Center is at {{ currentCenter }} and the zoom is: {{ currentZoom }}</p>
      <button @click="showLongText">Toggle long popup</button>
      <button @click="showMap = !showMap">Toggle map</button>
    </div> -->
    <button @click="now">現在地</button>
    <l-map
      v-if="showMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 80%"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-marker :lat-lng="withPopup">
        <l-popup>
          <div>
            ポップアップだよ<router-link to="/about"
              >鎌倉大仏の詳細へ</router-link
            >
            <p v-show="showParagraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
              Donec finibus semper metus id malesuada.
            </p>
          </div>
        </l-popup>
      </l-marker>
      <l-marker :lat-lng="withTooltip">
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div @click="innerClick">
            I am a tooltip
            <p v-show="showParagraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
              Donec finibus semper metus id malesuada.
            </p>
          </div>
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
      withPopup: latLng(35.316715, 139.536041),
      withTooltip: latLng(35.319065, 139.550412),
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
      currentLocation: latLng(0, 0),
    }
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom
    },
    centerUpdate(center) {
      this.currentCenter = center
    },
    showLongText() {
      this.showParagraph = !this.showParagraph
    },
    innerClick() {
      alert('Click!')
    },
    now() {
      // Geolocation API で現在位置を取得
      // アロー関数にしないとthis使えない
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = latLng(
            position.coords.latitude,
            position.coords.longitude
          )
          this.center = latLng(
            position.coords.latitude,
            position.coords.longitude
          )

          console.log(position.coords.latitude, position.coords.longitude)
          console.log(position.coords.accuracy)
        },
        (error) => {
          alert(error.code)
        },
        { enableHighAccuracy: true }
      )
    },
  },
}
</script>
