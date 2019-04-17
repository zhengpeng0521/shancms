<template>
  <div class="findTableDialog_container">
    <!-- 精确查找弹框 -->
    <el-dialog
      :visible.sync="findDialogShow"
      title="精确查找"
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
        :columns="columnsFind"
        :table-height="tableFindHeight"
        :pagination="listQuery"
        :options="optionsFind"
        @handleRowSelect="stuTableSelect"
      />
      <div>
        <span>已选: {{ selectName || '--' }}</span>
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
import { queryCRMStuList } from '@/api/crm/stuAccount/stuAccount.js'
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
      tableFindHeight: 'calc(100vh - 607px)',
      columnsFind: [
        {
          label: '姓名',
          prop: 'name',
          isShowSet: false,
          isShowTooltip: true
        },
        {
          label: '昵称',
          prop: 'nickName',
          isShowTooltip: true
        },
        {
          label: '性别',
          prop: 'sex',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.sex == '1') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'男'}
                      </div>`
            }
            if (row.sex == '2') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'女'}
                      </div>`
            }
          }
        },
        {
          label: '生日',
          prop: 'birthday',
          isShowTooltip: true
        },
        {
          label: '家长',
          prop: 'parentList',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.parentList && params.row.parentList.length > 1
                  ? [
                    h('span', params.row.parentList[0].parentName + ' '),
                    h('el-popover', {
                      props: { placement: 'top', trigger: 'click' }
                    },
                    [
                      h('div',
                        params.row.parentList.map(item => {
                          return h('span', { class: 'manyParent' }, item.parentName + '  ')
                        })
                      ),
                      h('a',
                        { slot: 'reference' }, '共' + params.row.parentList.length + '人')
                    ])
                  ]
                  : params.row.parentList && params.row.parentList.map((item, index) => {
                    return h('span', item.parentName)
                  })
              )
            ])
          }
        },
        {
          label: '家长手机号',
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
                      return h('span', item.parentName + ' : ' + item.mobile + ' ')
                    })
                  ),
                  h('a', { slot: 'reference' }, '查看')
                ]
              )
            ])
          }
        }
      ],
      optionsFind: {
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
      selectName: ''
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog() {
      this.findDialogShow = !this.findDialogShow
    },
    /* 关闭弹框 */
    closeDialog() {
      this.findDialogShow = false
    },
    /* 提交弹框 */
    submitDialog() {
      this.findDialogShow = false
    },
    stuTableSelect(row) {
      this.selectName = row.name
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue
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
.findTableDialog_container /deep/ {
  .el-dialog {
    width: 700px !important;
  }
}
</style>

