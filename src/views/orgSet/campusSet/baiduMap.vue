
<template>
  <div>

    <baidu-map
      :zoom="zoom"
      :scroll-wheel-zoom="false"
      :inertial-dragging="true"
      :continuous-zoom="true"
      :center="locationData"
      class="map"
      @ready="handler"
      @click="getClickInfo"
      @moving="syncCenterAndZoom"
      @moveend="syncCenterAndZoom"
      @zoomend="syncCenterAndZoom"
    >
      <!-- 拖拽点 -->
      <bm-marker
        :position="{lng: center.lng, lat: center.lat}"
        :dragging="true"
        animation="BMAP_ANIMATION_BOUNCE"
      >
        <!-- 缩放控件 -->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT" />
        <!-- 比例尺 -->
        <bm-scale anchor="BMAP_ANCHOR_TOP_LEFT" />
        <!-- 点击定位 -->
        <bm-geolocation
          :show-address-bar="true"
          :auto-location="true"
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        />

        <!-- 检索地址
      <bm-local-search
        :keyword="keyword"
        :auto-viewport="true"
        :panel="false"
        :location="location"
        :select-first-result="true"
        :page-capacity="1"
      /> -->
      </bm-marker>
    </baidu-map>
  </div>
</template>

<script>
import { BmlMarkerClusterer } from 'vue-baidu-map'
export default {
  components: {
    BmlMarkerClusterer
  },
  props: {
    locationData: {
      type: String,
      default: '浙江省杭州市滨江区滨康路101号海威大厦18楼'
    }

  },

  data() {
    return {
      center: { lng: 116.404, lat: 39.915 },
      location: '杭州',
      keyword: '海威大厦',
      zoom: 15
    }
  },
  methods: {
    handler({ BMap, map }) {
      // console.log('定位数据bmap', BMap, 'map-------->', map.Oe)
    },

    getClickInfo(e) {
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
    },
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
      this.$emit('show-lng', e.target.getCenter())
      // console.log('点击e.target.getCenter()', e.target.getCenter())
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  width: 360px;
  height: 300px;
}
</style>
