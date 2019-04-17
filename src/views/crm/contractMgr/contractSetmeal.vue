<template>
  <div class="contractSetmeal_container">
    <!-- 搜索栏 -->
    <div class="search">
      <div>
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
      </div>
      <div>
        <el-button
          class="green_btn"
          size="mini"
          @click="addSetmealDialog()"
        >新增产品</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      table-key="crm_contract_setmeal"
    />
    <!-- 新增产品合同套餐弹框 -->
    <AddSetmealDialog
      v-if="addSetmealVisible"
      ref="addSetmealDialog"
      @toSetmealPage="toSetmealList"
      @toClose="getCloseAddSetmeal"
    />
  </div>
</template>

<script>
import { queryContractProduct, deleteContractProduct } from '@/api/crm/contract/contract.js'
import CommonTable from './../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../components/CommonSearch/CommonSearch'
import AddSetmealDialog from './components/addSetmealDialog.vue'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AddSetmealDialog
  },
  data() {
    return {
      addSetmealVisible: false, // 合同套餐的弹窗
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '名称',
          prop: 'name',
          isShowTooltip: true,
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'name',
                on: {
                  click: () => {
                    this.editSetmealDialog(params.row)
                  }
                }
              }, params.row.name
            )
          }
        },
        {
          label: '套餐类型',
          prop: 'type',
          isShowTooltip: true
        },
        {
          label: '产品状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if(row.status == '上架'){ //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(93, 156, 236);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已上架'}
                      </div>`
            }
            if(row.status == '下架'){ //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(169, 180, 188);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已下架'}
                      </div>`
            }
          }
        },
        {
          label: '原价',
          prop: 'price',
          align: 'right',
          isShowTooltip: true
        },
        {
          label: '售卖价',
          prop: 'realPrice',
          align: 'right',
          isShowTooltip: true
        },
        {
          label: '课时数',
          prop: 'amount',
          isShowTooltip: true
        },
        {
          label: '销量',
          prop: 'saleNum',
          isShowTooltip: true
        },
        {
          label: '创建日期',
          prop: 'createTime',
          isShowTooltip: true
        },
        {
          label: '所属校区',
          prop: 'orgName',
          isShowTooltip: true
        }
      ],
      options: {
        apiService: queryContractProduct, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 244px)',
      operates: {
        width: '120',
        fixed: 'right',
        list: [
          {
            label: '删除',
            type: 'normal',
            method: (row) => {
              this.deleteHandle(row)
            },
            popoverCon: [
              {
                contentText: '确定要删除吗？'
              }
            ]
          }
        ]
      },
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '名称',
            modelValue: 'name',
            isClearable: true,
            itemStyle: 'width: 140px'
          }, {
            itemType: 'select',
            placeholder: '状态',
            modelValue: 'status',
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '上架',
                value: '1'
              }, {
                label: '下架',
                value: '2'
              }
            ]
          }, {
            itemType: 'select',
            placeholder: '套餐类型',
            modelValue: 'type',
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '课时套餐',
                value: '1'
              }, {
                label: '托班套餐',
                value: '3'
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    /* 删除合同 */
    deleteHandle(row) {
      const params = {
        ids: row.id
      }
      deleteContractProduct(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.errorMessage)
          this.$refs.tableCommon.getList({ pageIndex: 0 })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 新增产品合同套餐弹框 */
    addSetmealDialog() {
      this.addSetmealVisible = true
      this.$nextTick(() => {
        this.$refs.addSetmealDialog.showDialog('1')
      })
    },
    getCloseAddSetmeal() {
      this.addSetmealVisible = false
    },
    /* 更新合同套餐列表 */
    toSetmealList() {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 编辑产品合同套餐弹框 */
    editSetmealDialog(row) {
      this.addSetmealVisible = true
      this.$nextTick(() => {
        this.$refs.addSetmealDialog.showDialog(row)
      })
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue
        // name: this.formInline.name,
        // status: this.formInline.status,
        // type: this.formInline.type
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
.contractSetmeal_container {
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
}
</style>
<style lang="scss">
.contractSetmeal_container {
  .name {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
