<template>
  <div class="marketMgr_container">
    <!-- 搜索栏 -->
    <div class="search">
      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <el-button
        class="green_btn"
        @click="materialDialog('materialForm')"
      >新增物资</el-button>
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      table-key="crm_inventory_materials"
    />
    <!-- 新增物资弹框 -->
    <el-dialog
      :visible.sync="materialsDialogShow"
      :title="materialTitle"
      @close="cancelDialog('materialForm')"
    >
      <el-form
        v-loading="dialogLoading"
        ref="materialForm"
        :model="materialData"
        :rules="rules"
        element-loading-text="拼命加载中"
        label-suffix=":"
        label-width="90px"
      >
        <el-form-item
          label="物资名称"
          prop="name"
        >
          <el-input
            v-model="materialData.name"
            clearable
            placeholder="请输入物资名称,例如教材、耗材、礼品等"
          />
        </el-form-item>
        <el-form-item
          label="物资描述"
          prop="describes"
        >
          <el-input
            v-model="materialData.describes"
            clearable
            type="textarea"
            placeholder="请输入物资描述"
          />
        </el-form-item>
        <el-form-item
          label="原价"
          prop="price"
        >
          <el-input
            v-model="materialData.price"
            clearable
            placeholder="请输入原价(正数,可精确到小数点后2位)"
          />
        </el-form-item>
        <el-form-item
          label="售卖价"
          prop="realPrice"
        >
          <el-input
            v-model="materialData.realPrice"
            clearable
            placeholder="请输入售卖价(正数,可精确到小数点后2位)"
          />
        </el-form-item>
        <el-form-item
          label="销售单位"
          prop="unit"
        >
          <el-input
            v-model="materialData.unit"
            clearable
            placeholder="请输入销售单位"
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-select
            v-model="materialData.status"
            placeholder="请选择状态"
            clearable
            style="width:100%"
          >
            <el-option
              v-for="item in statusType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :loading="loading"
          class="cancel_btn"
          @click="cancelDialog('materialForm')"
        >取 消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="submitForm('materialForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getMaterialsMgr } from '@/api/crm/market/materialsMgr'
import CommonTable from '../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../components/CommonSearch/CommonSearch'
import StatusPoint from '@/components/MiniCommon/StatusPoint'

export default {
  components: {
    CommonTable,
    CommonSearch,
    StatusPoint
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      dialogType: 'add',
      editId: '',
      listQuery: {
        show: true // 是否显示
      },
      oldList: [],
      newList: [],
      columns: [
        {
          label: '物资名称',
          prop: 'name',
          isShowSet: true,
          isShowTooltip: true,
          width: '110px',
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'materialName',
                on: {
                  click: () => {
                    this.editDialogShow(params.row)
                  }
                }
              }, params.row.name
            )
          }
        },
        {
          label: '原价',
          prop: 'price',
          align: 'right',
          isShowTooltip: true,
          isShowSet: true,
          width: '110px',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'hover', content: params.row.price }
              }, [
                h('span', { slot: 'reference' }, params.row.price + '元/' + params.row.unit)
              ])
            ])
          }
        },
        {
          label: '售卖价',
          prop: 'realPrice',
          align: 'right',
          isShowTooltip: true,
          isShowSet: true,
          width: '110px',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'hover', content: params.row.realPrice }
              }, [
                h('span', { slot: 'reference' }, params.row.realPrice + '元/' + params.row.unit)
              ])
            ])
          }
        },
        {
          label: '销量',
          prop: 'sell',
          isShowSet: true
        },
        {
          label: '销售单位',
          prop: 'unit',
          isShowTooltip: true,
          isShowSet: true,
          formatter: (row, column, cellValue) => {
            return `<div style="text-overflow:ellipsis;overflow:hidden">${row.unit}</div>`
          }
        },
        {
          label: '库存',
          prop: 'stock',
          isShowTooltip: true,
          isShowSet: true
        },
        {
          label: '物资状态',
          prop: 'status',
          isShowTooltip: true,
          isShowSet: true,
          render: (h, params) => {
            let color = ''
            let text = ''
            if (params.row.status === '0') {
              color = '#ccc'
              text = '无效'
            } else if (params.row.status === '1') {
              color = '#87D068'
              text = '已上架'
            } else {
              color = '#D0021B'
              text = '已下架'
            }

            return h('span', {}, [
              h(StatusPoint, {
                props: { text, color }
              })
            ])
          }
        },
        {
          label: '创建日期',
          prop: 'createTime',
          isShowTooltip: true,
          isShowSet: true,
          width: '170px',
          formatter: (row, column, cellValue) => {
            return `<div style="text-overflow:ellipsis;overflow:hidden">${row.createTime}</div>`
          }
        }
        // {
        //   label: '所属校区',
        //   prop: 'orgName',
        //   isShowTooltip: true,
        //   isShowSet: true,
        //   width: '150px',
        //   formatter: (row, column, cellValue) => {
        //     return `<div style="text-overflow:ellipsis;overflow:hidden">${row.orgName}</div>`
        //   }
        // }
      ],
      tableHeight: 'calc(100vh - 239px)',
      options: {
        apiService: getMaterialsMgr, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      operates: {
        width: '130',
        fixed: 'right',
        list: [
          {
            label: '删除',
            type: 'normal',
            method: this.deleteHandle,
            popoverCon: [
              {
                contentText: '确定要删除吗？'
              }
            ]
          }
        ]
      },
      formInline: {
        searchMethod: this.searchHandle,
        forms: [
          {
            itemType: 'input',
            placeholder: '物资名称',
            modelValue: 'name',
            isClearable: true
          }, {
            itemType: 'select',
            placeholder: '状态',
            modelValue: 'status',
            isFilterable: true,
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
          }
        ]
      },
      materialsDialogShow: false,
      materialTitle: '新增物资',
      materialData: {
        name: '',
        describes: '',
        price: '',
        realPrice: '',
        unit: '',
        status: ''
      },
      statusType: [
        {
          value: '1',
          label: '上架'
        },
        {
          value: '2',
          label: '下架'
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入物资名称', trigger: 'change' }
        ],
        price: [
          { required: true, message: '正数，可精确到小数点后2位', trigger: 'change' },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '正数，可精确到小数点后2位', trigger: 'change' }
        ],
        realPrice: [
          { required: true, message: '正数，可精确到小数点后2位', trigger: 'change' },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '正数，可精确到小数点后2位', trigger: 'change' }
        ],
        unit: [
          { required: true, message: '请输入售卖单位', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },

  computed: {
    ...mapState('saleAchivement', [
      'loading',
      'dialogLoading'
    ])
  },

  methods: {
    ...mapActions('materials', [
      'removeMaterials',
      'addMaterials',
      'getMaterialsDetail',
      'editMaterials'
    ]),

    /** 删除物资 */
    deleteHandle(row) {
      this.removeMaterials({ id: row.id, callback: this.searchHandle })
    },

    /* 新增物资弹框显示 */
    materialDialog() {
      this.materialTitle = '新增物资'
      this.dialogType = 'add'
      this.editId = ''
      this.materialsDialogShow = !this.materialsDialogShow
    },
    /* 关闭新增弹框 */
    cancelDialog(formName) {
      this.materialsDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交新增表单 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const payload = {
            search: this.materialData,
            close: this.cancelDialog,
            refresh: this.searchHandle
          }
          if (this.dialogType === 'add') {
            this.addMaterials(payload)
          } else {
            payload.search.id = this.editId
            this.editMaterials(payload)
          }
        } else {
          return false
        }
      })
    },

    /* 编辑物资弹框显示 */
    editDialogShow(row) {
      this.materialTitle = '编辑物资'
      this.dialogType = 'edit'
      this.editId = row.id
      this.materialsDialogShow = !this.materialsDialogShow
      this.getMaterialsDetail({ id: row.id, callback: this.setEditInfo })
    },

    /* 编辑物资弹框赋值 */
    setEditInfo(row) {
      this.materialData = {
        name: row.name,
        describes: row.describes,
        price: row.price,
        realPrice: row.realPrice,
        unit: row.unit,
        status: row.status
      }
    },

    /* 搜索 */
    searchHandle(searchValue = {}) {
      const params = {
        name: this.formInline.name,
        status: this.formInline.status,
        ...searchValue
      }
      this.$refs.tableCommon.getList(params)
    },

    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0
      }
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
</style>
<style lang="scss">
.marketMgr_container {
  .materialName {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
