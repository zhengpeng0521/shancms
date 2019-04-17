<template>
  <div v-if="readingStuDialogShow" class="readingStuDialog_container">
    <el-dialog
      :visible.sync="readingStuDialogShow"
      title="在读学员列表"
      @close="cancelDialog('distributeDialogForm')"
    >
      <div class="search">
        <div>
          <CommonSearch
            :is-inline="true"
            :params="formInline"
            :forms="formInline"
            @toParent="resetFieldHanle"
          />
        </div>
      </div>
      <CommonTable
        ref="tableCommon"
        :columns="columns"
        :pagination="listQuery"
        :table-height="tableHeight"
        :options="options"
        table-key="crm_studentInfo_reading_dialog"
        @handleSelectionChange="handleSelectionChange"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('distributeDialogForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('distributeDialogForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getZjlCRMStuList // 在读学员列表
} from '@/api/crm/studentInfo/readingStu.js'
import CommonTable from './../../../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../../../components/CommonSearch/CommonSearch'
export default {
  components: {
    CommonTable,
    CommonSearch
  },
  data() {
    return {
      selectRow: [],
      tableHeight: 'calc(500px - 56px - 59px)',
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名',
            modelValue: 'mobileOrStuName',
            isFilterable: true,
            isClearable: true
          }
        ]
      },
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '学员姓名',
          prop: 'name',
          isShowTooltip: true,
          width: '120',
          formatter: row => {
            // eslint-disable-next-line
            if (row.sex == '2') {
              return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${
                row.name
              }<img src="https://img.ishanshan.com/gimg/n/20190318/03fdc2ea05f27c74f5d8c706ef4f03c0">
              </div>`
            } else {
              return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.name +
                ' '}<img src="https://img.ishanshan.com/gimg/n/20190318/d56924830405313c7dc47fbc1763f10e">
              </div>`
            }
          }
        }, {
          label: '家长姓名',
          prop: 'parentName',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.parents &&
                  params.row.parents.map((item, index) => {
                    return h('span', item.name + ' ')
                  })
              )
            ])
          }
        }, {
          label: '负责销售',
          prop: 'sellerName',
          isShowTooltip: true
        }
      ],
      options: {
        mutiSelect: true, // 是否多选
        apiService: getZjlCRMStuList, // 表格的数据请求接口
        isSettingShow: false // 是否出现设置
      },
      readingStuDialogShow: false
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.selectRow = val
    },
    /* 搜索 */
    searchHandle(formValue) {
      const params = formValue
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0
      }
      this.selectRow = []
      this.$refs.tableCommon.getList(params)
    },
    /* 显示弹框 */
    showDialog() {
      this.selectRow = []
      this.readingStuDialogShow = true
      // this.resetFieldHanle()
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.readingStuDialogShow = false
    },
    submitForm() {
      if (this.selectRow.length > 1) {
        alert('只能选择一个学员')
      } else {
        if (this.selectRow && this.selectRow.length > 0) {
          this.$emit('afterSumit', this.selectRow[0])
        } else {
          this.$emit('afterSumit')
        }
        this.readingStuDialogShow = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.readingStuDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
  .title_text {
    margin-bottom: 10px;
  }
}
</style>

