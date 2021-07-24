import Vue from 'vue'
import VueRouter from 'vue-router'
import Map from '@/views/Map.vue'
import ShowHistoricSite from '@/views/ShowHistoricSite.vue'
import PostHistoricSite from '@/views/PostHistoricSite.vue'
import SignUp from '@/views/SignUp.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Map',
    component: Map,
  },
  {
    path: '/show-historic-site/:id',
    name: 'ShowHistoricSite',
    component: ShowHistoricSite,
  },
  {
    path: '/post-historic-site',
    name: 'PostHistoricSite',
    component: PostHistoricSite,
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
