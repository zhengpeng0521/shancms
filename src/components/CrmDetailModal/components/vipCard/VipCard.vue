<template>
  <div
    :style="{maxHeight: height}"
    class="tab-pane-content detail-tab-vip"
  >
    <p>
      <span class="vip-top-label">学员账户号 : </span><span>{{ cardInfo.cardId }}</span>
      <span class="vip-top-label vip-top-right">创建时间 : </span><span>{{ cardInfo.createTime }}</span>
    </p>
    <p class="vip-top-wrap">
      <span class="vip-top-label">余额 : </span><span>{{ cardInfo.balance }}</span>
    </p>
    <el-table
      :data="courseList"
      border
      style="width: 481px;margin-top:20px;"
    >
      <el-table-column
        prop="courseName"
        label="课时类型"
        width="120"
      />
      <el-table-column
        prop="periodLeft"
        label="剩余课时"
        width="120"
      />
      <el-table-column
        prop="periodFreeze"
        label="已预约课时"
        width="120"
      />
      <el-table-column
        prop="periodLeft"
        label="可用课时"
        width="120"
      />
    </el-table>
  </div>
</template>

<script>
import { getVipCard } from '@/api/crmDetail/crmDetail'

export default {
  props: {
    headerHeight: {
      type: Number,
      required: true
    },
    params: {
      type: Object,
      required: true
    }
  },

  data() {
    const moreHeight = this.headerHeight + 68 + 64
    return {
      cardInfo: {},
      courseList: [],
      height: `calc(100vh - ${moreHeight}px)`
    }
  },

  mounted() {
    this.getVipCard()
  },

  methods: {
    /** 获取学员账户信息 */
    async getVipCard() {
      const params = {
        stuId: this.$props.params.stuId
      }
      const { data } = await getVipCard(params)
      this.cardInfo = data.cardInfo
      this.courseList = data.results
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-pane-content {
  padding-left: 20px;
  overflow: auto;
}
.vip-top-label {
  color: rgb(153, 153, 153);
}
.vip-top-right {
  margin-left: 20px;
}
.vip-top-wrap {
  margin-top: 10px;
}
</style>

<style lang="scss">
.detail-tab-vip .el-table .cell {
  font-size: 14px;
  font-weight: normal;
  color: #666;
}
.detail-tab-vip .el-table th {
  background: #f5f6f8;
}
</style>
