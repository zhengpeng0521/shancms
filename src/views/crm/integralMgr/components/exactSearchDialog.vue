<template>
  <div>
    <!-- 精确查找弹框 -->
    <el-dialog
      :visible.sync="findDialogShow"
      :append-to-body="true"
      title="精确查找"
      class="exactSearch"
      @close="closeDialog()"
    >
      <!-- 精确查找搜索框 -->
      <div class="search">
        <CommonSearch
          :is-inline="true"
          :params="formInlineFind"
          :forms="formInlineFind"
          @toParent="resetFieldHanle"
        />
      </div>
      <!-- 精确查找表格 -->
      <CommonTable
        ref="tableCommon"
        :columns="columns"
        :table-height="tableHeight"
        :pagination="listQuery"
        :options="options"
        :is-high-light="true"
        @handleRowSelect="stuTableSelect"
      />
      <div>
        <span>已选: {{ selectName || '' }}</span>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="closeDialog()"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitDialog()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryCRMStuList } from '@/api/crm/Integral/accountMgr'
import CommonTable from '../../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../../components/CommonSearch/CommonSearch'
export default {
  components: {
    CommonTable,
    CommonSearch
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      findDialogShow: false, // 是否显示精确查找弹框
      tableHeight: 'calc(100vh - 607px)',
      columns: [
        {
          label: '姓名',
          prop: 'name',
          isShowSet: false,
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.name}</div>`
          }
        },
        {
          label: '昵称',
          prop: 'nickName',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.nickName}</div>`
          }
        },
        {
          label: '性别',
          prop: 'sex',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if(row.sex == '1') { //eslint-disable-line
              return `<div>${'男'}</div>`
            }
            if(row.sex == '2') { //eslint-disable-line
              return `<div>${'女'}</div>`
            }
          }
        },
        {
          label: '生日',
          prop: 'birthday',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.birthday) {
              return `<div>${row.birthday}</div>`
            } else {
              return `<div></div>`
            }
          }
        },
        {
          label: '适用家长',
          prop: 'parentList',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: { placement: 'top', trigger: 'hover' }
                },
                [
                  h('div',
                    params.row.parentList.map(item => {
                      return h('div', item.parentName + ':' + item.mobile)
                    })
                  ),
                  h('a', { slot: 'reference' }, '查看')
                ]
              )
            ])
          }
        },
        {
          label: '销售',
          prop: 'seller',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.seller}</div>`
          }
        }
      ],
      options: {
        apiService: queryCRMStuList // 表格的数据请求接口
      },
      formInlineFind: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名',
            modelValue: 'name',
            isClearable: true,
            itemStyle: 'width:130px'
          },
          {
            itemType: 'input',
            placeholder: '昵称',
            modelValue: 'nickName',
            isClearable: true,
            itemStyle: 'width:130px'
          },
          {
            itemType: 'input',
            placeholder: '家长手机号',
            modelValue: 'mobile',
            isClearable: true,
            itemStyle: 'width:130px'
          }
        ]
      },
      formValue: {},
      selectName: '' // 被选学员姓名
    }
  },
  methods: {
    stuTableSelect(row) {
      this.selectStuName(row)
    },
    /* 选中某个学员的数据 */
    selectStuName(row) {
      this.selectName = row.name
    },
    /* 显示弹框 */
    showDialog(nameRow) {
      // eslint-disable-next-line
      if(nameRow == 'contract'){
        this.findDialogShow = !this.findDialogShow
      } else {
        this.selectName = nameRow.name || ''
        this.findDialogShow = !this.findDialogShow
      }
    },
    /* 关闭弹框 */
    closeDialog() {
      this.findDialogShow = false
    },
    /* 提交弹框 */
    submitDialog() {
      this.$emit('toStudentName', this.selectName)
      this.findDialogShow = false
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue
        // name: this.formInlineFind.name,
        // nickName: this.formInlineFind.nickName,
        // mobile: this.formInlineFind.mobile
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0
      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.exactSearch /deep/ {
  .el-dialog__body {
    margin-bottom: 14px;
  }
}
</style>

