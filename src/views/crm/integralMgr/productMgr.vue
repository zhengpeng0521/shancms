<template>
  <div class="productMgr_container">
    <!-- 搜索栏 -->
    <div class="search">
      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <div>
        <el-button
          v-log="{compName:'积分账户',eventName:'web-【学员CRM】-积分账户-商品管理-新增商品'}"
          class="green_btn"
          @click="productDialog()"
        >新增商品</el-button>
      </div>
    </div>
    <!-- 已选数据操作 -->
    <div class="table_checked_box">
      <span class="table_checked_text">已选
        <span class="checked_nums">{{ checkedData || '0' }}</span>条数据
      </span>
      <span>
        <el-popover
          v-model="visible2"
          placement="top"
          width="160"
        >
          <p class="pop_content">确定要删除吗？</p>
          <div class="br">
            <el-button
              size="mini"
              class="delete_btn"
              @click="visible2 = false"
            >取消</el-button>
            <el-button
              type="primary"
              size="mini"
              class="edit_btn"
              @click="deleteProduct"
            >确定</el-button>
          </div>
          <el-button
            v-log="{compName:'积分账户',eventName:'web-【学员CRM】-积分账户-商品管理-删除商品'}"
            slot="reference"
            class="cancel_btn edit_btn"
            size="mini"
          >删除</el-button>
        </el-popover>
      </span>
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      table-key="crm_integral_product"
      @handleSelectionChange="selectionChange"
    />
    <!-- 新增商品弹框 -->
    <AddProductDialog
      ref="addProductDialog"
      @toProductList="getProductList"
    />
  </div>
</template>

<script>
import { queryIntegralGoods, deleteIntegralGoods } from '@/api/crm/Integral/accountMgr'
import CommonTable from '../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../components/CommonSearch/CommonSearch'
import AddProductDialog from './components/addProductDialog.vue'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AddProductDialog // 新增商品弹框组件
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '商品名称',
          prop: 'goodsName',
          isShowTooltip: true,
          isShowSet: false,
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'proName',
                on: {
                  click: () => {
                    this.productDialog(params.row)
                  }
                }
              }, params.row.goodsName
            )
          }
        },
        {
          label: '商品类别',
          prop: 'sourceType',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if(row.sourceType == '1') { //eslint-disable-line
              return `<div>${'物资'}</div>`
            }
            if(row.sourceType == '2') { //eslint-disable-line
              return `<div>${'课时包'}</div>`
            }
          }
        },
        {
          label: '库存数量',
          prop: 'stockNum',
          isShowTooltip: true
        },
        {
          label: '消耗积分',
          prop: 'integral',
          isShowTooltip: true
        }
      ],
      options: {
        mutiSelect: true, // 是否多选
        apiService: queryIntegralGoods, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 260px)',
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '商品名称',
            modelValue: 'goodsName',
            isClearable: true
          }
        ]
      },
      checkedData: '',
      visible2: false,
      formValue: {},
      selectValRow: [] // 被选中的商品数据
    }
  },
  methods: {
    /* 删除商品 */
    deleteIntegralGoodsFun(rowList) {
      const params = {
        id: this.selectValRow.join(','),
        status: 'INVALID'
      }
      deleteIntegralGoods(params).then(res => {
        if (res.data.errorCode === 0) {
          this.visible2 = false
          this.$message.success(res.data.errorMessage)
          this.$refs.tableCommon.getList({ pageIndex: 0 })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 确定删除 */
    deleteProduct() {
      this.deleteIntegralGoodsFun(this.selectValRow)
    },
    /* 商品弹框显示 */
    productDialog(row) {
      this.$refs.addProductDialog.showDialog(row)
    },
    /* 更新列表 */
    getProductList() {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 选择数据条数操作 */
    selectionChange(val) {
      this.checkedData = val.length
      this.selectValRow = []
      val.map((item, index) => {
        this.selectValRow.push(item.id)
      })
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue
        // goodsName: this.formInline.goodsName
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
.search {
  display: flex;
  justify-content: space-between;
  height: 48px;
}
.table_checked_box {
  height: 32px;
  .table_checked_text {
    margin-right: 10px;
  }
  .checked_nums {
    margin: 0 3px;
    color: #46b6ee;
  }
}
</style>
<style lang="scss">
.productMgr_container {
  .proName {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
