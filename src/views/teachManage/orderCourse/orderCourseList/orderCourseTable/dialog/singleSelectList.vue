<template>
  <el-dialog
    :visible.sync="findDialogShow"
    :close-on-click-modal="false"
    title="选择学员"
    width="800px"
    @close="cancelFindDialog()"
  >
    <!-- 精确查找搜索框 -->
    <div class="search">
      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
    </div>
    <!-- 精确查找表格 -->
    <CommonTable
      ref="commonTable"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="pagination"
      :options="options"
      @handleRowSelect="stuTableSelect"
    />
    <div class="checkList">
      <span>已选：</span>
      <span
        v-if="checkName"
        class="select_block"
      >
        {{ checkName }}
      </span>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="cancel_btn"
        @click="cancelFindDialog()"
      >取消</el-button>
      <el-button
        type="primary"
        @click="submitFindForm()"
      >确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { queryClueStuList } from '@/api/teachManage/orderCourse'
export default {
  components: {
    CommonSearch,
    CommonTable
  },
  data() {
    return {
      findDialogShow: false, // 弹窗显示
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名',
            modelValue: 'name',
            isClearable: true,
            itemStyle: 'width:120px'
          },
          {
            itemType: 'input',
            placeholder: '昵称',
            modelValue: 'nickName',
            isClearable: true,
            itemStyle: 'width:120px'
          },
          {
            itemType: 'input',
            placeholder: '家长手机号',
            modelValue: 'mobile',
            isClearable: true,
            itemStyle: 'width:140px'
          }
        ]
      },
      columns: [
        {
          label: '姓名',
          prop: 'name',
          isShowTooltip: true
        }, {
          label: '昵称',
          prop: 'nickName',
          isShowTooltip: true
        }, {
          label: '性别',
          prop: 'sex',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.sex == '1') {//eslint-disable-line
              return `<div>男</div>`
            } else {
              return `<div>女</div>`
            }
          }
        }, {
          label: '生日',
          prop: 'birthday',
          width: '120',
          isShowTooltip: true
        }, {
          label: '适用家长',
          prop: 'parentList',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', width: '200', trigger: 'hover'
                }
              }, [
                h('div', params.row.list.map((item, index) => {
                  return h('div', { style: 'text-align:center' }, item.parentName + ':' + item.parentMobile)
                })),
                h('a',
                  { slot: 'reference' }, '查看')
              ])
            ])
          }
        }, {
          label: '销售',
          prop: 'seller',
          isShowTooltip: true
        }
      ],
      tableHeight: 'calc(100vh - 585px)',
      pagination: {
        show: true,
        sizes: true
      },
      options: {},
      checkName: '', // 选中的名字
      checkValue: '' // 选中的id
    }
  },
  methods: {
    show(val) {
      this.findDialogShow = true
      this.options.apiService = queryClueStuList
      this.options.params = {
        pageIndex: 0,
        pageSize: 20
      }
      if (val) {
        this.checkName = val.name
        this.checkValue = val.id
      }
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      const params = {
        ...formValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.$refs.commonTable.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0
      }
      this.formValue = {}
      this.$refs.commonTable.getList(params)
    },
    /* 查找选择 */
    stuTableSelect(val) {
      this.checkValue = val.id
      this.checkName = val.name
    },
    /* 取消 */
    cancelFindDialog() {
      this.findDialogShow = false
      // this.checkName = ''
      this.$emit('toClose', false)
    },
    /* 确定 */
    submitFindForm() {
      this.findDialogShow = false
      // this.checkName = ''
      this.$emit('toParent', this.checkValue)
    }
  }
}
</script>
<style lang="scss" scoped>
.checkList {
  margin-bottom: 14px;
  .select_block {
    padding: 2px 8px;
    display: inline-block;
    border-radius: 3px;
    background: #eef7ff;
    position: relative;
    color: #666;
  }
}
</style>
