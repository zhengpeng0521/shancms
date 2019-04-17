/**
 * 最新推荐
 */
<template>
  <el-card
    v-loading="loading"
    shadow="never"
    element-loading-text="拼命加载中"
  >
    <div class="recommond-title">
      <h3>最新推荐</h3>
    </div>
    <el-row :gutter="10">
      <el-col
        v-for="(col, index) in recommendList"
        :span="6"
        :key="'recommend' + index"
      >
        <div
          :style="{backgroundImage: `url(${col.image})`}"
          class="recommend-item"
          @click="() => {goLink(col.link)}"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    recommendList: {
      type: Array,
      required: true
    }
  },

  data() {
    return {

    }
  },

  mounted() {
    this.$emit('didMount', 'recommend')
  },

  methods: {
    goLink(link) {
      const linkList = link.split('?')
      if (linkList.length === 3) {
        this.$router.push({ name: linkList[0], params: { activeTab: linkList[1], action: linkList[2] }})
      } else if (linkList.length === 2) {
        this.$router.push({ name: linkList[0], params: { activeTab: linkList[1] }})
      } else if (linkList.length === 1) {
        this.$router.push({ name: linkList[0] })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.recommond-title {
  margin-bottom: 12px;
  h3 {
    font-size: 16px;
    line-height: 24px;
    color: #333;
  }
}
.recommend-item {
  cursor: pointer;
  height: 80px;
  font-size: 16px;
  color: #fff;
  line-height: 80px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(158, 158, 158, 0.1);
  background-repeat: no-repeat;
  background-position: center;
}
</style>
