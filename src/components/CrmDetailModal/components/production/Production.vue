<template>
  <div class="production_info">
    <el-button
      type="primary"
      @click="addProduction"
    >添加作品</el-button>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      class="production_list"
    />
    <!-- 添加作品弹框 -->
    <StuWorkInfo
      ref="stuWorkInfo"
      @toCrmDetailPro="getProductionList"
    />
  </div>
</template>

<script>
import { getProduction } from '@/api/crmDetail/crmDetail'
import CommonTable from './../../../CommonTable/CommonTable'
import StuWorkInfo from '@/views/teachManage/homeSchoolConnection/stuProduction/dialog/stuWorkInfo.vue'
export default {
  components: {
    CommonTable,
    StuWorkInfo
  },
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
    const height = this.headerHeight + 40 + 30 + 40 + 74
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '作品编号',
          prop: 'id',
          isShowTooltip: true
        },
        {
          label: '作品名称',
          prop: 'title',
          isShowTooltip: true
        },
        {
          label: '作品类型',
          prop: 'tagName',
          isShowTooltip: true
        },
        {
          label: '上传时间',
          prop: 'createTime',
          isShowTooltip: true
        }
      ],
      options: {
        apiService: getProduction, // 表格的数据请求接口
        params: { stuId: this.$props.params.stuId },
        isSettingShow: false // 是否出现设置
      },
      tableHeight: `calc(100vh - ${height}px)`
    }
  },
  methods: {
    /* 添加作品弹框 */
    addProduction() {
      this.$refs.stuWorkInfo.show(this.$props.params)
    },
    /* 更新作品列表 */
    getProductionList() {
      const params = {
        pageIndex: 0,
        stuId: this.$props.params.stuId
      }
      this.$refs.tableCommon.getList(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.production_info {
  padding-left: 20px;
  box-sizing: border-box;
}
.production_list {
  margin-top: 20px;
}
</style>

