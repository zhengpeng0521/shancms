/**
 * 快捷入口
 */
<template>
  <el-card
    v-loading="loading"
    shadow="never"
    element-loading-text="拼命加载中"
  >
    <div class="entry-title">
      <h3>快捷入口</h3>
      <i
        :style="{fontSize: '16px'}"
        class="iconfont icon_gb_jgsz icon-common"
        @click="$emit('openDialog', 'shortCut')"
      />
    </div>
    <div v-if="entryList.length > 4">
      <el-row class="entry-list">
        <el-col
          v-for="(item, index) in newData[0]"
          :span="6"
          :key="'entry-' + index"
          class="entry-item"
        >
          <div v-log="{compName:'快捷入口',eventName:`${item.name||''}点击`}" @click="() => {goPage(item.link)}">
            <img :src="item.icon">
            <p>{{ item.name }}</p>
          </div>
        </el-col>
      </el-row>
      <el-row class="entry-list entry-list-next">
        <el-col
          v-for="(item, index) in newData[1]"
          :span="6"
          :key="'entry-' + index"
          class="entry-item"
        >
          <div v-log="{compName:'快捷入口',eventName:`${item.name||''}点击`}" @click="() => {goPage(item.link)}">
            <img :src="item.icon">
            <p>{{ item.name }}</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row
      v-else
      class="entry-list"
    >
      <el-col
        v-for="(item, index) in newData"
        :span="6"
        :key="'entry-' + index"
        class="entry-item"
      >
        <div v-log="{compName:'快捷入口',eventName:`${item.name||''}点击`}" @click="() => {goPage(item.link)}">
          <img :src="item.icon">
          <p>{{ item.name }}</p>
        </div>
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
    entryList: {
      type: Array,
      required: true
    }
  },

  data() {
    return {

    }
  },

  computed: {
    newData() {
      let newData = [...this.entryList]
      if (newData.length > 4) {
        newData = [newData.slice(0, 4), newData.slice(4)]
      } else {
        newData = [...this.entryList]
      }
      return newData
    }
  },

  mounted() {
    this.$emit('didMount', 'entry')
  },

  methods: {
    /** 跳转页面 */
    goPage(link) {
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
@import "@/styles/mixin.scss";

.entry-title {
  @include flex;
  @include flexCenter(space-between);

  h3 {
    font-size: 16px;
    line-height: 24px;
    color: #333;
  }

  .icon-common {
    cursor: pointer;
    color: #bbb;
    font-size: 14px;
    line-height: 24px;
    margin-left: 6px;
    @include transition(color 0.4s);
    &:hover {
      color: #56c0f5;
    }
  }
}

.entry-list {
  margin-top: 20px;
  @include flex;
}
.entry-list-next {
  margin-top: 30px;
}
.entry-item {
  cursor: pointer;
  text-align: center;
  color: #333;

  img {
    width: 50px;
    height: 50px;
    margin-bottom: 6px;
    // @include transition(all 0.4s);
  }

  &:hover {
    p {
      color: #46b6ee;
    }
    // img {
    //   @include transform(scale(1.2, 1.2));
    // }
  }
}
</style>
