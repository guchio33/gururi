import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import ShowHistoricSite from '@/views/ShowHistoricSite.vue'
import CommentHistoricSpot from '@/components/CommentHistoricSpot.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/historic-site/:id',
    name: 'ShowHistoricSite',
    component: ShowHistoricSite,
  },
  {
    path: '/comment-site/:id',
    name: 'CommentHistoricSpot',
    component: CommentHistoricSpot,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
