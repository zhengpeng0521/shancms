/**
 * 机构数据
 */
<template>
  <el-card
    v-loading="loading"
    shadow="never"
    element-loading-text="拼命加载中"
  >
    <div class="data-title">
      <h3>机构概况<i
        v-if="dataVisible"
        class="iconfont icon_sy_ck icon-common icon-eye"
        @click="toggle"
      /><i
        v-else
        class="iconfont icon_sy_ys icon-common icon-eye"
        @click="toggle"
      /></h3>
      <div
        class="date-type"
        @click="changeDate"
      >{{ dateRender(dateType) }}<i class="el-icon-sort icon-change" /></div>
      <div>
        <span class="update-time">更新时间: {{ orgDate }}</span>
        <i
          :style="{fontSize: '16px'}"
          class="iconfont icon_gb_jgsz icon-common"
          @click="$emit('openDialog', 'orgData')"
        />
      </div>
    </div>
    <div v-if="dataList.length > 4">
      <div class="data-content">
        <div
          v-for="(item, index) in newData[0]"
          :key="'data-'+index"
          :style="item.link !== 'hover' ? {cursor: 'pointer'} : {}"
          class="data-item"
          @click="() => {item.link !== 'hover' && goPage(item.link)}"
        >
          <img
            :src="item.icon"
            class="data-item-pic"
          >
          <div class="item-right">
            <p class="data-item-name">{{ item.name }}</p>
            <p class="data-item-num">
              <el-tooltip
                v-if="item.link === 'hover'"
                placement="right"
              >
                <div slot="content">
                  <p
                    v-for="(info, key) in item.numInfo"
                    :key="'info'+key"
                  >{{ subIsShow(info) }}</p>
                </div>
                <span>{{ isShow(item.num) }}</span>
              </el-tooltip>
              <a v-else>{{ isShow(item.num) }}</a>
              <img v-show="dataVisible" :src="upDown(item.num, item.preNum)">
            </p>
            <p class="data-item-pre">{{ preDateRender(dateType) + isShow(item.preNum) }}</p>
          </div>
        </div>
      </div>
      <div class="data-content data-content-next">
        <div
          v-for="(item, index) in newData[1]"
          :key="'data-'+index"
          :style="item.link !== 'hover' ? {cursor: 'pointer'} : {}"
          class="data-item"
          @click="() => {item.link !== 'hover' && goPage(item.link)}"
        >
          <img
            :src="item.icon"
            class="data-item-pic"
          >
          <div class="item-right">
            <p class="data-item-name">{{ item.name }}</p>
            <p class="data-item-num">
              <el-tooltip
                v-if="item.link === 'hover'"
                placement="right"
              >
                <div slot="content">
                  <p
                    v-for="(info, key) in item.numInfo"
                    :key="'info'+key"
                  >{{ subIsShow(info) }}</p>
                </div>
                <span>{{ isShow(item.num) }}</span>
              </el-tooltip>
              <a v-else>{{ isShow(item.num) }}</a>
              <img v-show="dataVisible" :src="upDown(item.num, item.preNum)">
            </p>
            <p class="data-item-pre">{{ preDateRender(dateType) + isShow(item.preNum) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="data-content"
    >
      <div
        v-for="(item, index) in newData"
        :key="'data-'+index"
        :style="item.link !== 'hover' ? {cursor: 'pointer'} : {}"
        class="data-item"
        @click="() => {item.link !== 'hover' && goPage(item.link)}"
      >
        <img
          :src="item.icon"
          class="data-item-pic"
        >
        <div class="item-right">
          <p class="data-item-name">{{ item.name }}</p>
          <p class="data-item-num">
            <el-tooltip
              v-if="item.link === 'hover'"
              placement="right"
            >
              <div slot="content">
                <p
                  v-for="(info, key) in item.numInfo"
                  :key="'info'+key"
                >{{ subIsShow(info) }}</p>
              </div>
              <span>{{ isShow(item.num) }}</span>
            </el-tooltip>
            <a v-else>{{ isShow(item.num) }}</a>
            <img v-show="dataVisible" :src="upDown(item.num, item.preNum)">
          </p>
          <p class="data-item-pre">{{ preDateRender(dateType) + isShow(item.preNum) }}</p>
        </div>
      </div>
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
    orgDate: {
      type: String,
      required: true
    },
    dataList: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      dateType: 1, // 日期类型
      dataVisible: true // 数据显隐
    }
  },

  computed: {
    newData() {
      let newData = [...this.dataList]
      if (newData.length > 4) {
        newData = [newData.slice(0, 4), newData.slice(4)]
      } else {
        newData = [...this.dataList]
      }
      return newData
    }
  },

  mounted() {
    this.$emit('didMount', 'orgData')
  },

  methods: {
    /** 日期类型渲染 */
    dateRender(key) {
      const dates = ['今日', '本周', '本月']
      return dates[key - 1]
    },

    /** 往期日期类型渲染 */
    preDateRender(key) {
      const dates = ['昨日', '上周', '上月']
      return dates[key - 1]
    },

    /** 是否显示数据 */
    isShow(num) {
      if (this.dataVisible) {
        return num || '0'
      } else {
        return '****'
      }
    },

    /** 弹窗数据显示 */
    subIsShow(info) {
      if (this.dataVisible) {
        return info
      } else {
        const text = info.split('：')[0] + '：****'
        return text
      }
    },

    /** 增加减少 */
    upDown(newNum, oldNum) {
      if (Number(newNum) > Number(oldNum)) {
        return 'https://img.ishanshan.com/gimg/user/n///1552985024.png'
      } else if (Number(newNum) < Number(oldNum)) {
        return 'https://img.ishanshan.com/gimg/user/n///1552984892.png'
      }
    },

    /** 控制数据显隐 */
    toggle() {
      this.dataVisible = !this.dataVisible
    },

    /** 改变机构日期 */
    changeDate() {
      let index = this.dateType
      if (index === 3) {
        index = 1
      } else {
        index += 1
      }
      this.dateType = index
      this.$emit('changeDate', index + '')
    },

    /** 跳转页面 */
    goPage(link) {
      let routerDateType = 'today'
      if (this.dateType === 2) {
        routerDateType = 'thisWeek'
      } else if (this.dateType === 3) {
        routerDateType = 'thisMonth'
      }
      const linkList = link.split('?')
      if (linkList.length === 2) {
        this.$router.push({ name: linkList[0], params: { activeTab: linkList[1], routerDateType }})
      } else if (linkList.length === 1) {
        this.$router.push({ name: linkList[0], params: { routerDateType }})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.data-title {
  position: relative;
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
    font-size: 16px;
    line-height: 24px;
    margin-left: 6px;
    @include transition(color 0.4s);
    &:hover {
      color: #56c0f5;
    }
  }
  .icon-eye {
    vertical-align: middle;
    font-size: 18px;
  }

  .icon-change {
    @include transform(rotate(90deg));
  }

  .date-type {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid #bbb;
    border-radius: 12px;
    font-size: 14px;
    color: #666;
    line-height: 22px;
    padding: 0 10px;
    @include transition(all 0.4s);
    &:hover {
      border: 1px solid #56c0f5;
      color: #56c0f5;
    }
  }

  .update-time {
    font-size: 12px;
    color: #999;
    line-height: 24px;
  }
}

.data-content {
  @include flex;
  margin-top: 20px;
  .data-item {
    position: relative;
    @include flexWidth;
    @include flex;
    @include flexCenter(center);
    @include itemCenter(center);
    &:not(:last-child):after {
      content: "";
      width: 1px;
      height: 30px;
      background: #ddd;
      display: inline-block;
      position: absolute;
      right: 0;
    }
    // &:hover .data-item-pic {
    //   @include transform(scale(1.2, 1.2));
    // }
    &:hover .data-item-name {
      color: #46b6ee;
    }
  }

  .data-item-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 26px;
    @include transition(all 0.3s);
  }
  .data-item-name {
    color: #333;
  }
  .data-item-num {
    font-size: 22px;
    font-weight: bold;
    margin-top: 10px;

    img {
      margin-left: 6px;
    }
  }
  .data-item-pre {
    color: #999;
    margin-top: 10px;
  }
}

.data-content-next {
  margin-top: 40px;
}

.item-right {
  width: 130px;
}
</style>
