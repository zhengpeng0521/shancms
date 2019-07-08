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
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="pagination"
      :options="options"
      @handleSelectionChange="selectionChange"
    />

    <span
      slot="footer"
      class="dialog-footer"
    >
      <div class="checkList">
        <span>已选({{ checkNum || '0' }}) :</span>
        <span
          v-for="(item, index) of checkList"
          :key="index"
          class="select_block"
        >
          {{ item.stuName }}
          <img
            src="//img.ishanshan.com/gimg/img/0b36a9ecb8febdd5e9fad8689a512428"
            @click="delName(item)"
          >
        </span>
      </div>
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
import { batchStuList } from '@/api/crm/stuAccount/stuAccount.js'
export default {
  components: {
    CommonSearch,
    CommonTable
  },
  props: {
    selectCourse: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      findDialogShow: false, // 弹窗显示
      formInline: {
        searchMethod: (formInline) => {
          this.searchHandle(formInline)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名/家长电话',
            modelValue: 'nameOrTel',
            isClearable: true
          }, {
            itemType: 'input',
            placeholder: '学员账户号',
            modelValue: 'cardId',
            isClearable: true
          }
        ]
      },
      columns: [
        {
          label: '学员姓名',
          prop: 'stuName',
          width: '120',
          isShowTooltip: true
        },
        {
          label: '手机号',
          prop: 'mobile',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: { placement: 'top', trigger: 'click' }
                },
                [
                  h('div',
                    params.row.tel
                  ),
                  h('a', { slot: 'reference' }, '查看')
                ]
              )
            ])
          }
        },
        {
          label: '学员账户',
          prop: 'cardId',
          isShowSet: false,
          width: '120'
        },
        {
          label: '总课时(赠送)',
          prop: 'periodAll',
          isShowTooltip: true,
          width: '110px;',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span', { slot: 'reference' }, parseInt(params.row.periodAll) + ' (' + (parseInt(params.row.periodExt) || 0) + ')'
              )
            ])
          }
        },
        {
          label: '剩余课时',
          prop: 'periodLeft',
          isShowTooltip: true
        }
      ],
      tableHeight: 'calc(100vh - 585px)',
      pagination: {
        show: true,
        sizeChange: this.sizeChange,
        indexChange: this.indexChange
      },
      options: {
        mutiSelect: true
      },
      checkList: [], // 选中的学员信息
      checkArr: [], // 选中的学员ID
      checkedInfo: [],
      checkValBefore: []
    }
  },
  computed: {
    checkNum() { // 选中的学员个数
      return this.checkList.length || 0
    }
  },
  methods: {
    show(stuIdArr, stuList) {
      this.checkList = stuList
      this.checkArr = stuIdArr

      this.options.apiService = batchStuList
      this.options.params = {
        courseId: this.selectCourse
      }
      this.options.selected = stuIdArr
      this.findDialogShow = true
    },
    /** 页数改变 */
    indexChange(pageIndex) {
      const payload = {
        courseId: this.selectCourse,
        pageIndex: pageIndex - 1
      }
      this.$refs.tableCommon.getList(payload)
    },
    /** 每页条数改变 */
    sizeChange(pageSize) {
      const payload = {
        courseId: this.selectCourse,
        pageSize
      }
      this.$refs.tableCommon.getList(payload)
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue,
        courseId: this.selectCourse
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      this.searchHandle({})
    },
    /* 取消 */
    cancelFindDialog() {
      this.findDialogShow = false
      this.formInline.nameOrTel = ''
      this.formInline.cardId = ''
      this.$emit('toclose', false)
    },
    /* 确定 */
    submitFindForm() {
      this.findDialogShow = false
      this.$emit('toParent', this.checkArr, this.checkList)
    },
    /* 多选 */
    selectionChange(val) {
      if (val && val.length > 0) {
        if (val.length > this.checkValBefore.length) { // 如果现在的之前的长度长就是添加
          val && val.map(item => {
            if (item && this.checkArr.indexOf(item.id) < 0) { // item有，checkArr没有这一项就添加
              this.checkArr.push(item.id)
              this.checkList.push(item)
            }
          })
        } else if (this.checkValBefore.length > val.length) { // 如果之前的比现在的长度长就是删除
          const checkValBeforeDel = this.getSubtract(this.checkValBefore, val) // 求出删除的id
          this.checkArr.map((value, index, Array) => {
            if (value === checkValBeforeDel[0].id) {
              this.checkArr.splice(index, 1)
            }
            return
          })
          this.checkList.map((value, index, Array) => {
            if (value.id === checkValBeforeDel[0].id) {
              this.checkList.splice(index, 1)
            }
          })
        }
      }
      this.checkValBefore = val
      return val
    },

    // 两个数组对象的差集
    getSubtract(unionArr, subsetArr) {
      var new_tmp = []
      for (var i = 0; i < unionArr.length; i++) {
        var flag = true
        for (var j = 0; j < subsetArr.length; j++) {
          if (unionArr[i].id === subsetArr[j].id) {
            flag = false
          }
        }
        if (flag) {
          new_tmp.push(unionArr[i])
        }
      }
      return new_tmp
    },

    /* 删除个别 */
    delName(val) {
      const checkArr = []
      let delCheckList = []
      this.checkList.map((item, index) => {
        if (item.id == val.id) { //eslint-disable-line
          delCheckList = this.checkList.splice(index, 1)
          this.checkArr.splice(index, 1)
          delCheckList && delCheckList.map(item => {
            checkArr.push(item.id)
          })
          this.$refs.tableCommon.toggleRowSelection(checkArr)
        }
      })
      this.options.selected = this.checkArr
    }
  }
}
</script>
<style lang="scss" scoped>
.checkList {
  text-align: left;
  .select_block {
    padding: 2px 8px;
    display: inline-block;
    border-radius: 3px;
    background: #eef7ff;
    position: relative;
    margin-left: 10px;
    color: #666;
    margin-top: 10px;
    img {
      position: absolute;
      right: -7px;
      top: -5px;
      cursor: pointer;
    }
  }
}
</style>
