<template>
  <el-dialog
    :visible.sync="findDialogShow"
    title="精确查找"
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
      :no-select-ids="clsStuIdArr"
      @handleSelectionChange="selectionChange"
    />
    <div class="checkList">
      <span>已选({{ checkNum || '0' }}) :</span>
      <span
        v-for="(item, index) of checkList"
        :key="index"
        class="select_block"
      >
        {{ item.name }}
        <img
          src="//img.ishanshan.com/gimg/img/0b36a9ecb8febdd5e9fad8689a512428"
          @click="delName(item)"
        >
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
import { queryCRMStuList } from '@/api/teachManage/grade'
export default {
  components: {
    CommonSearch,
    CommonTable
  },
  data() {
    return {
      clsStuIdArr: [], // 已在班级中的学员
      findDialogShow: false, // 弹窗显示
      formValue: {},
      formInline: {
        searchMethod: this.searchHandle,
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
          prop: 'name'
        }, {
          label: '昵称',
          prop: 'nickName'
        }, {
          label: '性别',
          prop: 'sex',
          formatter: (row, column, cellValue) => {
            if (row.sex == '1') {//eslint-disable-line
              return `<div>男</div>`
            } else {
              return `<div>女</div>`
            }
          }
        }, {
          label: '生日',
          prop: 'birthday'
        }, {
          label: '适用家长',
          prop: 'parentList',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', width: '200', trigger: 'hover'
                }
              }, [
                h('div', params.row.parentList.map((item, index) => {
                  return h('div', { style: 'text-align:center' }, item.parentName + ':' + item.mobile)
                })),
                h('a',
                  { slot: 'reference' }, '查看')
              ])
            ])
          }
        }, {
          label: '销售',
          prop: 'seller'
        }
      ],
      tableHeight: 'calc(100vh - 485px)',
      pagination: {
        show: true,
        sizeChange: this.sizeChange,
        indexChange: this.indexChange
      },
      options: {
        mutiSelect: true,
        selectableFunc: (row, index) => {
          if (this.clsStuIdArr.indexOf(row.id) >= 0) {
            return 0
          } else {
            return 1
          }
        }
      },
      checkNum: '', // 选中的个数
      checkList: [],
      checkedInfo: []
    }
  },
  methods: {
    show(val, clsStuIdArr) {
      this.checkList = val
      this.options.apiService = queryCRMStuList
      this.options.params = {
        type: '2'
      }
      this.options.selected = val
      this.findDialogShow = true
      this.clsStuIdArr = clsStuIdArr
    },
    /** 页数改变 */
    indexChange(pageIndex) {
      const payload = {
        ...this.formValue,
        type: '2',
        pageIndex: pageIndex - 1
      }
      this.$refs.commonTable.getList(payload)
    },
    /** 每页条数改变 */
    sizeChange(pageSize) {
      const payload = {
        ...this.formValue,
        type: '2',
        pageSize
      }
      this.$refs.commonTable.getList(payload)
    },
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      // 搜索的入参
      const params = {
        ...formValue,
        type: '2'
      }
      this.$refs.commonTable.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0,
        type: '2'
      }
      this.$refs.commonTable.getList(params)
    },
    /* 取消 */
    cancelFindDialog() {
      this.findDialogShow = false
      this.$emit('toclose', false)
    },
    /* 确定 */
    submitFindForm() {
      const checkArr = []
      this.findDialogShow = false
      this.checkList.map(item => {
        checkArr.push(item.id)
      })
      this.$emit('toParent', checkArr)
    },
    /* 多选 */
    selectionChange(val) {
      if (val) {
        this.checkNum = val.length
        this.checkList = val
      }
    },
    /* 删除个别 */
    delName(val) {
      const checkArr = []
      let delCheckList = []
      this.checkList.map((item, index) => {
        if (item.id == val.id) { //eslint-disable-line
          delCheckList = this.checkList.splice(index, 1)
          delCheckList && delCheckList.map(item => {
            checkArr.push(item.id)
          })
          this.$refs.commonTable.toggleRowSelection(checkArr)
        }
      })
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
    margin-left: 10px;
    color: #666;
    img {
      position: absolute;
      right: -7px;
      top: -5px;
      cursor: pointer;
    }
  }
}
</style>
