/**
 * banner
 */
<template>
  <el-card
    v-loading="loading"
    :body-style="{padding: 0}"
    shadow="never"
    element-loading-text="拼命加载中"
  >
    <el-carousel
      trigger="click"
      height="200px"
      class="home-banner-carousel"
    >
      <el-carousel-item
        v-for="(item, index) in bannerList"
        :key="'banner'+index"
      >
        <a
          :style="{backgroundImage: `url(${item.image})`}"
          :href="item.link"
          target="_blank"
          class="banner-pic"
        />
      </el-carousel-item>
    </el-carousel>
    <div class="banner-news">
      <div
        v-for="(text, index) in bannerNews"
        :key="'news'+index"
        class="banner-new-item"
      ><a
        :href="text.link"
        target="_blank"
      >{{ text.title || '新闻标题' }}</a></div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    bannerList: {
      type: Array,
      required: true
    },
    bannerNews: {
      type: Array,
      required: true
    }
  },

  data() {
    return {

    }
  },

  mounted() {
    this.$emit('didMount', 'banner')
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.banner-pic {
  display: block;
  width: 100%;
  height: 200px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: auto 200px;
}

.banner-news {
  height: 70px;
  padding: 14px 10px;
  @include flex;
  @include flexWrap;
}
.banner-new-item {
  width: 50%;
  padding: 0 10px;
  margin-bottom: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  a {
    color: #666;

    &:hover {
      color: #46b6ee;
    }
  }
}
</style>

<style lang="scss">
.home-banner-carousel .el-carousel__button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d8d8d8;
}
.home-banner-carousel .is-active .el-carousel__button {
  background: #46b6ee;
}
</style>
