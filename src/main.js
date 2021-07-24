import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './firebase'
//ここからvue2-leaflet
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})
//ここまでvue2-leaflet

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')

// 位置情報追跡
const $position = Vue.observable({
  latitude: 0,
  longitude: 0,
})
navigator.geolocation.watchPosition((position) => {
  Object.assign($position, {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  })
})
Vue.prototype.$position = $position
