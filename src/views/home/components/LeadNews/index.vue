/**
 * 闪闪头条
 */
<template>
  <el-card
    v-loading="loading"
    shadow="never"
    element-loading-text="拼命加载中"
  >
    <div class="news-title">
      <h3>闪闪头条</h3>
      <a @click="openOfficalWindow">查看更多</a>
    </div>
    <div class="news-content">
      <ul
        v-if="leadNewsList.length > 0"
        class="news-content-list"
      >
        <li
          v-for="(item, index) in leadNewsList"
          :key="'news'+index"
          class="news-content-item"
        >
          <a
            v-log="{compName:'闪闪头条',eventName:`${item.title||''}`}"
            target="_blank"
            @click="openLink(item.url)"
          >{{ item.classify === '1' ? '【问题】' : item.classify === '2' ? '【操作】' : item.classify === '3' ? '【新闻】' : item.classify === '4' ? '【更新】': '【其他】' }}{{ item.title }}</a>
        </li>
      </ul>
      <a v-else>暂无数据</a>
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
    leadNewsList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {

    }
  },
  computed: {
  },
  mounted() {
    this.$emit('didMount', 'leadNews')
  },
  methods: {
    // 打开官网新闻中心
    openOfficalWindow() {
      window.open(`http://www.ishanshan.com/#/newHelp`)
    },
    openLink(link) {
      window.open(link)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.news-title {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  h3 {
    font-size: 16px;
    line-height: 24px;
    color: #333;
  }
  a {
    line-height: 24px;
    color: #46b6ee;
  }
  &:hover {
    a {
      color: #56c0f5;
    }
  }
}

.news-content {
  @include flex;
}

.news-content-left {
  display: block;
  width: 122px;
  height: 187px;
  background: rgba(240, 242, 245, 0.6);

  img {
    width: 122px;
    height: 122px;
  }

  .news-left-text {
    padding: 12px 10px;
  }
  p {
    line-height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  &:hover p {
    color: #46b6ee;
  }
}

.news-content-list {
  margin-left: -8px;
  width: calc(100% + 8px);
}
.news-content-item {
  margin-top: 8px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:first-child {
    margin: 0;
  }

  .news-circle {
    display: inline-block;
    width: 4px;
    height: 4px;
    background: #46b6ee;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 5px;
  }

  &:hover {
    a {
      color: #46b6ee;
    }
  }
}
</style>
