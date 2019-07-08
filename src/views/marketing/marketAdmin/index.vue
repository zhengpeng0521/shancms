<template>
  <div class="marketAdmin-container">
    <div class="search">
      <div class="search-left">
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <!-- <AdvancedSearch
          v-bind="superSearch"
          style="margin-bottom: 14px"
        /> -->
      </div>
      <div class="search-right">
        <el-button
          v-if="hasBtn('204000001')"
          type="primary"
          @click="marketActivityDialogShow()"
        >新增市场活动</el-button>
      </div>
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      table-key="marketing_marketAdmin_index"
    />
    <detail
      v-if="detailShow"
      ref="detailShowDialog"
      :visible.sync="detailShow"
      :id="id"
      :time="time"
      :create-time="createTime"
    />
    <creatMarketActivity ref="marketActivityDialog" />
    <div class="erweimaCont">
      <erweimaDialog ref="erweimaDialog" />
    </div>
  </div>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import detail from './components/detail'
import creatMarketActivity from './components/creatMarketActivity'
import { queryList, queryDetail, updateStatus } from '@/api/marketing/marketAdmin.js'
import { dictGetByKey, summaryQuery } from '@/api/marketing/marketAdmin.js'

import erweimaDialog from './components/erweimaDialog'
export default {

  components: {
    CommonSearch,
    CommonTable,
    detail,
    creatMarketActivity,
    erweimaDialog
  },
  data() {
    return {
      id: '',
      time: {},
      createTime: '',
      formValue: {},
      superValue: {},
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '活动名称',
            modelValue: 'name',
            isClearable: true,
            itemStyle: 'width: 140px'
          },
          {
            itemType: 'select',
            placeholder: '请选择采单人员',
            modelValue: 'userId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            apiService: summaryQuery,
            labelKey: 'userName',
            valueKey: 'userId'
          },
          {
            itemType: 'select',
            placeholder: '请选择采单地点',
            modelValue: 'key',
            labelKey: 'value',
            valueKey: 'key',
            isFilterable: true,
            isClearable: true,
            apiService: dictGetByKey,
            params: { dictkey: 'secondChannel' },
            itemStyle: 'width:140px'
          }
        ]
      },
      // 表格参数
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '活动名称',
          prop: 'name',
          isShowSet: true,
          width: 150,
          render: (h, params) => {
            return h('span', {}, [
              h('div', { style: { overflow: 'hidden', 'text-overflow': 'ellipsis', color: 'rgba(24,145,237,1)',
                'white-space': 'normal', display: '-webkit-box', '-webkit-line-clamp': '2', width: '120px',
                'line-height': '15px', 'font-size': '14px', '-webkit-box-orient': 'vertical'
              }, on: { click: () => {
                this.editActivityDialogShow(params.row.id)
              } }
              }, [h('el-tooltip', {
                props: { placement: 'top', width: '200', content: params.row.name, effect: 'dark' }
              }, [
                h('a',
                  { },
                  params.row.name)
              ])])
            ])
          }
        },
        {
          label: '活动时间',
          prop: 'activityTime',
          isShowSet: true,
          isShowTooltip: true,
          width: 170,
          formatter: (row) => {
            return `<div class="box" style="display:flex;flex-direction:column;-webkit-line-clamp: 2;">
                        <div class="startTime" style="width:150px;height:20px;margin-top:10px">${row.startDate}~</div>
                        <div class="endTime" style="width:150px;height:30px;">${row.endDate}</div>
            </div>`
          }
        },
        {
          label: '采集地点',
          prop: 'placeStr',
          isShowSet: true,
          isShowTooltip: true,
          width: 170
        },
        {
          label: '采集员二维码',
          prop: 'place',
          isShowSet: true,
          isShowTooltip: true,
          width: 170,
          formatter: (row) => {
            return `<span style="color: #108ee9">${row.memberCount}</span>`
          },
          methods: (row) => {
            this.open(row.id, row.orgId)
          }
        },
        {
          label: '数据分析',
          prop: 'content_short',
          isShowSet: true,
          isShowTooltip: true,
          width: 150,
          formatter: (row) => {
            if (this.hasBtn('204000002')) {
              if (row.count === null) {
                return `<div style="display:flex;flex-direction:column;">
                      <div style="line-height:12px;font-size:12px">有效用户：0</div>
                      <div style="margin-top:10px;color:rgba(70,182,238,1);font-size:12px;line-height:12px;">查看</div>
                    </div>`
              } else {
                return `<div style="display:flex;flex-direction:column;">
                      <div style="line-height:12px;font-size:12px">有效用户：${row.count}</div>
                      <div style="margin-top:10px;color:rgba(70,182,238,1);font-size:12px;line-height:12px;">查看</div>
                    </div>`
              }
            } else {
              if (row.count === null) {
                return `<div style="display:flex;flex-direction:column;">
                      <div style="line-height:12px;font-size:12px">有效用户：0</div>
                    </div>`
              } else {
                return `<div style="display:flex;flex-direction:column;">
                      <div style="line-height:12px;font-size:12px">有效用户：${row.count}</div>
                    </div>`
              }
            }
          },
          methods: (row) => {
            if (this.hasBtn('204000002')) {
              this.id = row.id
              this.time = { startDate: row.startDate, endDate: row.endDate }
              this.createTime = row.createTime
              this.detailDialogShow(row)
            }
          }

        },
        {
          label: '活动成本（元）',
          prop: 'price',
          isShowTooltip: true,
          isShowSet: true,
          align: 'right',
          width: 160
        },
        {
          label: '备注',
          prop: 'remark',
          isShowSet: true,
          isShowTooltip: true,
          width: 130,
          render: (h, params) => {
            if (params.row.remark !== '') {
              return h('div', { style: { overflow: 'hidden', 'text-overflow': 'ellipsis',
                'white-space': 'normal', display: '-webkit-box', '-webkit-line-clamp': '2', width: '127px',
                'line-height': '15px', 'font-size': '14px', '-webkit-box-orient': 'vertical'
              }}, params.row.remark)
            } else {
              return h('span', {}, '-')
            }
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          width: 170,
          isColShow: false,
          isShowSet: true
        }

      ],
      options: {
        isSettingShow: true, // 是否出现设置
        apiService: queryList // 表格的数据请求接口
      },
      tableHeight: 'calc(100vh - 231px)',
      isBorder: true,
      operates: {
        fixed: 'right',
        width: 150,
        list: [
          {
            label: '编辑',
            type: 'normal',
            btnId: '204000004',
            method: (row) => {
              this.editActivityDialogShow(row.id)
            }
          },
          {
            label: '删除',
            type: 'normal',
            btnId: '204000006',
            method: (row) => {
              const params = {
                activityId: row.id,
                status: 0
              }
              updateStatus(params).then(res => {
                if (res.data.errorCode === 0) {
                  const params = {
                    startDate: '',
                    endDate: '',
                    name: '',
                    place: '',
                    sourceType: 1,
                    sourceId: ''
                  }
                  this.$refs.tableCommon.getList(params)
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
          }
        ]
      },
      // detail参数
      detailData: {
        dialogVisible: false,
        title: '数据分析'
      },
      detailShow: false,
      // 新增市场活动参数
      creatMarketActivity: {
        dialogVisible: true,
        title: '新增市场活动'
      }

    }
  },
  methods: {
    getData(data) {
      if (data) {
        const params = {
          startDate: '',
          endDate: '',
          name: '',
          place: '',
          sourceType: '',
          sourceId: ''
        }
        this.$refs.tableCommon.getList(params)
      }
    },
    open(id, orgId) {
      this.$refs.erweimaDialog.queryMembers(id, orgId)
    },
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      if (this.formValue.date2 && this.formValue.date2.length > 0) {
        const obj = {
          pageSize: 10,
          pageIndex: 0,
          firstCreateTime: this.formValue.date2[0],
          endCreateTime: this.formValue.date2[1],
          place: this.formValue.key,
          sourceType: 1,
          name: this.formValue.name,
          sourceId: this.formValue.userId,
          activityId: this.$parent.id
        }
        const params = {}
        for (var i in obj) {
          if (obj[i] !== undefined) {
            params[i] = obj[i]
          }
        }
        this.$refs.tableCommon.getList(params)
      } else {
        const obj = {
          pageSize: 10,
          pageIndex: 0,
          firstCreateTime: '',
          endCreateTime: '',
          place: this.formValue.key,
          sourceType: 1,
          name: this.formValue.name,
          sourceId: this.formValue.userId,
          activityId: this.$parent.id
        }
        var params = {}
        for (var j in obj) {
          if (obj[j] !== undefined) {
            params[j] = obj[j]
          }
        }
        this.$refs.tableCommon.getList(params)
      }
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        startDate: '',
        endDate: '',
        name: '',
        place: '',
        sourceType: 1,
        sourceId: ''
      }
      this.$refs.tableCommon.getList(params)
      this.formValue = {}
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.formValue,
        place: superValue.pickingPlace,
        sourceType: 1,
        sourceId: superValue.pickingClerk
      }
      if (this.formValue.date2) {
        params.startDate = this.formValue.date2[0]
        params.endDate = this.formValue.date2[1]
      }
      this.$refs.tableCommon.getList(params)
    },
    onClear(superValue) {
      const params = {
        startDate: '',
        endDate: '',
        name: '',
        place: '',
        sourceType: 1,
        sourceId: ''
      }
      this.$refs.tableCommon.getList(params)
      this.superValue = {}
    },
    // detail是否显示
    detailDialogShow() {
      this.detailShow = true
    },
    /* 新增市场活动弹框显示 */
    marketActivityDialogShow() {
      this.$refs.marketActivityDialog.showDialog('add')
    },
    editActivityDialogShow(val) {
      const params = {
        activityId: val
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.el-dialog')
      })
      queryDetail(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$refs.marketActivityDialog.showDialog(res.data)
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.marketAdmin-container .search {
  display: flex;
  justify-content: space-between;
}
</style>
<style lang="scss">
.marketAdmin-container .el-table__row {
  height: 60px;
}
</style>

