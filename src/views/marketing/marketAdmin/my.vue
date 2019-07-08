<template>
  <div class="myLeaflet-container">
    <div class="search">
      <div class="search-left">
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
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      table-key="marketing_marketAdmin_my"
    />
    <!-- <dataAnalyse :visible.sync="picDetailShow" /> -->
    <detail
      v-if="detailShow"
      ref="detailShowDialog"
      :visible.sync="detailShow"
      :id="id"
      :time="time"
      :create-time="createTime"
    />
    <editMyLeaflet
      v-if="editLeafletShow"
      :visible.sync="editLeafletShow"
    />
  </div>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { orgInstList, markList, instUpdateStatus } from '@/api/marketing/offlineLeaflet.js'
import editMyLeaflet from './components/editMyLeaflet'
import detail from './components/detail'
export default {
  components: {
    CommonSearch,
    CommonTable,
    detail,
    editMyLeaflet
  },
  data() {
    return {
      id: '',
      time: {},
      createTime: '',
      editLeafletShow: false,
      obj: {},
      // 搜索参数
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '传单名称',
            modelValue: 'name',
            isClearable: true,
            itemStyle: 'width: 140px'
          },
          { itemType: 'select',
            placeholder: '关联活动',
            modelValue: 'id',
            isClearable: true,
            apiService: markList,
            labelKey: 'name',
            valueKey: 'id',
            params: { type: 1 }
          }
        ]
      },
      // 表格参数
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '传单名称',
          prop: 'name',
          isShowSet: true,
          isShowTooltip: true,
          width: 130,
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'marketName',
                on: {
                  click: () => {
                    this.editLeafletBtnShow(params.row)
                  }
                }
              }, params.row.name
            )
          }
        },

        {
          label: '关联活动',
          prop: 'actName',
          isShowSet: true,
          isShowTooltip: true,
          width: 170,
          formatter: (row) => {
            if (row.actName === '' || row.actName === null) {
              return `<span>活动未关联</span>`
            } else {
              return `<span>${row.actName}</span>`
            }
          }

        },
        {
          label: '数据分析',
          prop: 'content_short',
          isShowSet: true,
          isShowTooltip: true,
          render: (h, params) => {
            if(params.row.count == null || params.row.count == undefined || params.row.count == '') { //eslint-disable-line
              return h(
                'div',
                {
                  style: 'display:flex;flex-direction:column;'
                }, [
                  h('div', { style: 'line-height:12px;font-size:12px' }, '有效用户：0'),
                  h('a', { style: 'margin-top:10px;line-height:12px;font-size:12px',
                    on: {
                      click: () => {
                        this.picDetailBtn(params.row)
                      }
                    }}, '查看')
                ]
              )
            } else {
              return h(
                'div',
                {
                  style: 'display:flex;flex-direction:column;'
                }, [
                  h('div', { style: 'line-height:12px;font-size:12px' }, '有效用户：' + params.row.count || '0'),
                  h('a', { style: 'margin-top:10px;line-height:12px;font-size:12px',
                    on: {
                      click: () => {
                        this.picDetailBtn(params.row)
                      }
                    }}, '查看')
                ]
              )
            }
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowSet: true,
          isShowTooltip: true,
          width: 150
        }
      ],
      options: {
        isSettingShow: true, // 是否出现设置
        apiService: orgInstList // 表格的数据请求接口
      },
      tableHeight: 'calc(100vh - 231px)',
      operates: {
        fixed: 'right',
        width: 200,
        list: [
          {
            label: '编辑',
            type: 'normal',
            method: (row) => {
              this.editLeafletBtnShow(row)
            }
          },
          {
            label: '删除',
            type: 'normal',
            method: (row) => {
              const params = {
                ids: row.id,
                status: 0
              }
              instUpdateStatus(params).then((res) => {
                if (res.data.errorCode === 0) {
                  this.resetFieldHanle()
                } else {
                  this.$message.error(res.errorMessage)
                }
              })
            },
            popoverCon: [
              {
                contentText: '确认删除？'
              }
            ]
          },
          {
            label: '下载',
            type: 'normal',
            method: (row) => {
              this.openDownLeaflet(row)
            }
          }
        ]
      },
      // 数据分析参数
      detailShow: false
    }
  },
  methods: {
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      // 搜索的入参
      const params = {
        name: this.formValue.name,
        actId: this.formValue.id
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        name: '',
        actId: ''
      }
      this.$refs.tableCommon.getList(params)
    },
    // 数据分析弹框方法
    picDetailBtn(row) {
      if (row.actName === '' || row.actName === null) {
        this.$message.error('请先关联一个活动')
      } else {
        this.time = { startDate: row.startDate, endDate: row.endDate }
        this.createTime = row.createTime
        this.detailShow = true
        this.id = row && row.actId
      }
    },
    // 下载
    openDownLeaflet(row) {
      this.obj = {
        ...row,
        type: 'download'
      }
      this.editLeafletShow = true
    },
    // 编辑
    editLeafletBtnShow(val) {
      this.obj = {
        ...val
      }
      this.editLeafletShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
.myLeaflet-container .search {
  display: flex;
  justify-content: space-between;
}
</style>
<style lang="scss">
.myLeaflet-container .el-table__row {
  height: 60px;
}
</style>
<style lang="scss">
.myLeaflet-container {
  .marketName {
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100px;
    color: #1d9df2;
    font-size: 14px;
    margin-left: 10px;
    cursor: pointer;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
