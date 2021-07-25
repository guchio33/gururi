<template>
  <div><Map /> <PostHistoricSite /><CommentHistoricSpot /></div>
</template>
<script>
import Map from '@/components/Map.vue'
import PostHistoricSite from '../components/PostHistoricSite.vue'
import CommentHistoricSpot from '../components/CommentHistoricSpot.vue'

export default {
  components: {
    Map,
    PostHistoricSite,
    CommentHistoricSpot,
  },
}
</script>
