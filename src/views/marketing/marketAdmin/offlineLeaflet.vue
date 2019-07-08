<template>
  <div class="leaflet-container">
    <pull-to
      :is-top-bounce="false"
      @infinite-scroll="loadMore"
    >
      <leaflet :data="data" />

    </pull-to>
    <div
      v-if="textInfo"
      class="leads-bottom-text"
    >没有更多了</div>
  </div>
</template>
<script>
import leaflet from './components/leaflet'
import { orgLeafletModelList } from '@/api/marketing/offlineLeaflet.js'
import PullTo from 'vue-pull-to'
export default {
  components: {
    leaflet,
    'pull-to': PullTo
  },
  data() {
    return {
      data: [],
      // loadmore组件参数
      pageSize: 50,
      pageIndex: 0,
      pageCount: 0,
      textInfo: false
    }
  },
  mounted() {
    const params = {
      pageSize: this.pageSize,
      pageIndex: 0
    }
    orgLeafletModelList(params).then((res) => {
      if (res.data.errorCode === 0) {
        this.data = res.data.results
        this.pageCount = res.data.data.pageCount
      } else {
        this.$message.error(res.errorMessage)
      }
    })
  },
  methods: {
    loadMore() {
      this.pageIndex++
      const params = {
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize
      }
      if (this.pageIndex < this.pageCount) {
        const loading = this.$loading({
          lock: true,
          fullscreen: false,
          target: document.querySelector('.pic-box')
        })
        orgLeafletModelList(params).then(res => {
          if (res.data.errorCode === 0) {
            const arr = [...this.data]
            res.data.results.map((val) => {
              arr.push(val)
            })
            this.data = arr
          } else {
            this.$message.error(res.errorMessage)
          }
          loading.close()
        })
      } else {
        this.textInfo = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.leaflet-container {
  min-width: 1060px;
  height: calc(100vh - 150px);
}
.leads-bottom-text {
  text-align: center;
  color: #999;
  width: 100%;
  height: 20px;
}
</style>

