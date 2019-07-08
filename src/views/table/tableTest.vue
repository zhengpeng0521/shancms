<template>
  <div class="table">
    <div class="search">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="审批人">
          <el-input
            v-model="formInline.user"
            placeholder="审批人"
          />
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select
            v-model="formInline.region"
            placeholder="活动区域"
            filterable
          >
            <el-option
              label="区域一"
              value="shanghai"
            />
            <el-option
              label="区域二"
              value="beijing"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >查询</el-button>
        </el-form-item>
      </el-form>
      <CrmDetailModal
        ref="crmDetailModal"
        v-bind="detailProps"
        :name="'令狐冲'"
        :header-data="headerData"
        :base-data="baseData"
      />
      <div class="add">
        <el-button
          type="primary"
          @click="openDetail"
        >查看详情</el-button>
        <el-button
          type="primary"
          size="mini"
        >管理课系</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="newCourse"
        >新增课程</el-button>
      </div>
    </div>
    <common-table
      :get-list="getList"
      :table-data="tableData"
      :isloading="loading"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="pagination"
      :defaultcheck="defaultcheck"
    />
    <NewCourse ref="addNewCourse" />
  </div>
</template>
<script>
import CommonTable from '../../components/CommonTable/CommonTable'
import NewCourse from './dialog/addNewCourse'
import CrmDetailModal from '@/components/CrmDetailModal'
export default {
  components: {
    CommonTable,
    NewCourse,
    CrmDetailModal
  },
  data() {
    return {
      // 详情
      detailProps: {
        btns: [
          { type: 'primary', label: '报名', clickHandle: this.clickOne.bind(this, '1') },
          { label: '编辑', clickHandle: this.clickOne.bind(this, '2') },
          { label: '转给他人', clickHandle: this.clickOne.bind(this, '3') },
          { label: '删除', clickHandle: this.clickOne.bind(this, '4') }
        ],
        headerInfo: [
          { label: '最后跟进时间', key: 'last' },
          { label: '下次跟进时间', key: 'next' },
          { label: '跟进状态', key: 'stutas' },
          { label: '负责销售', key: 'saler' }
        ],
        baseInfo: [
          { label: '姓名', key: 'name' },
          { label: '昵称', key: 'nickname' },
          { label: '生日', key: 'birthday' },
          { label: '年龄(月龄)', key: 'ageMonth' },
          { label: '名族', key: 'nation' },
          { label: '爱好', key: 'like' }
        ],
        defaultTab: 'visiteRecord'
      },
      // 头部数据
      headerData: {
        last: '2018-01-01',
        next: null
      },
      // 基础信息数据
      baseData: {
        stuId: '111',
        name: '令狐冲',
        ageMonth: '10(1)'
      },

      formInline: {
        user: '',
        region: ''
      },
      loading: false, // loading加载
      tableData: [], // 表格数据
      columns: [
        {
          label: '课程名称',
          prop: 'id'
        }, {
          label: '课系',
          prop: 'timestamp',
          hasSort: 'true',
          formatter: (row, column, cellValue) => {
            return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.timestamp}</div>`
          },
          methods: (row) => {
            this.openSideDialog(row)
          }
        }, {
          label: '每节消耗',
          prop: 'author'
        }, {
          label: '上课月龄/年龄',
          prop: 'importance'
        }, {
          label: '课程介绍',
          prop: 'pageviews'
        }, {
          label: '创建时间',
          prop: 'status',
          formatter: (row, column, cellValue) => {
            if (row.status != 'published') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden"><div style="width:8px;height:8px;background-color: #D0021B;display:inline-block;border-radius: 50px;margin-right: 5px;"></div>${row.status}</div>`
            } else {
              return `<div style="text-overflow:ellipsis;overflow:hidden"><div style="width:8px;height:8px;background-color: #87D068;display:inline-block;border-radius: 50px;margin-right: 5px;"></div>${row.status}</div>`
            }
          }
        }, {
          label: '所属校区',
          prop: 'payType'
        }
      ], // 列
      tableHeight: 'calc(100vh - 255px)', // 表格高度
      pagination: {
        show: true, // 是否显示
        totalCount: 20, // 总条数
        pageSize: 20, // 一页条数
        pageIndex: 1 // 当前位置
      },
      defaultcheck: ['id', 'timestamp', 'author', 'importance', 'pageviews', 'status', 'payType'] // 默认选中
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    getList() {

    },
    newCourse() {
      this.$refs.addNewCourse.show()
    },

    /** 查看详情 */
    openDetail() {
      this.$refs.crmDetailModal.visible = true
    },
    clickOne(type) {
      console.log('报名', type)
    }
  }
}
</script>
<style lang="scss" scoped>
.table {
  padding: 20px 20px 0;
  overflow: hidden;
  .demo-form-inline {
    display: inline-block;
  }
  .add {
    float: right;
  }
}
</style>
