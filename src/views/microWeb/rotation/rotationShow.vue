<template>
  <div class="rotation-container">
    <div class="rotation-top">轮播图管理</div>
    <div class="search">
      <div class="search-left">
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
      </div>
      <div class="search-right">
        <el-button
          v-if="hasBtn('303000001')"
          type="primary"
          @click="addRotationDialogShow()"
        >新建轮播图</el-button>
      </div>
    </div>
    <div class="warn"><i
      class="iconfont icon_ym_ts"
      style="color:#46b6ee;margin-right:8px"
    />最多可添加5张轮播图</div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      table-key="microWeb_rotation_rotationShow"
      class="borderTable"
    />
    <AddRotation ref="addRotationDialog" />
  </div>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
// import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
// import { fetchList } from '@/api/marketing'

import AddRotation from './components/addRotation'
import { queryOrgBanner, changeBanner } from '@/api/microWeb/rotation.js'
export default {
  components: {
    CommonSearch,
    CommonTable,
    AddRotation
    // detail,
    // creatMarketActivity,
    // erweimaDialog
  },
  data() {
    return {
      length: 0,
      addRotationVisible: false,
      // 搜索参数
      formValue: {},
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '轮播图名称',
            modelValue: 'title',
            isClearable: true,
            itemStyle: 'width: 140px'
          },
          {
            itemType: 'select',
            placeholder: '状态',
            modelValue: 'status',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '全部',
                value: ''
              }, {
                label: '已显示',
                value: '1'
              }, {
                label: '已隐藏',
                value: '2'
              }
            ]
          }
        ]
      },
      // 表格参数
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '轮播图名称',
          prop: 'title',
          isShowSet: true,
          isShowTooltip: true
          // width: 130,
          // formatter: (row) => {
          //   return `
          //             <div class="tableCell"
          //             style="width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
          //             >${row.title}</div>`
          // }
        },

        {
          label: '图片',
          prop: 'picUrl',
          isShowSet: true,
          formatter: (row) => {
            return `<img style="width:150px;height:80px" src="${row.picUrl}"/>`
          }
        },
        {
          label: '状态',
          prop: 'status',
          isShowSet: true,
          formatter: (row) => {
            if (row.status === 2) {
              return `<div style="display:flex">
                      <div style="margin-right:5px;margin-top:8px;width:8px;height:8px;background:rgba(208,2,27,1);border-radius:50px"></div>
                      <span>已隐藏</span>
                    </div>`
            } else if (row.status === 1) {
              return `<div style="display:flex">
                      <div style="margin-top:8px;margin-right:5px;width:8px;height:8px;background:rgba(135,208,104,1);border-radius:50px"></div>
                      <span>已显示</span>
                    </div>`
            }
          }
        },
        {
          label: '排序值',
          prop: 'sort',
          isShowSet: true,
          renderHeader: (h, { column, $index }) => {
            return h('div', {}, [
              h('span', '排序值'),
              h('el-tooltip', { class: 'item', props: { effect: 'dark', content: '排序值越大排在越前面', placement: 'top' }}, [
                h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', color: '#666' }})
              ])
            ])
          },
          align: 'right',
          formatter: (row) => {
            return `<span>${row.sort}</span>`
          }
        },
        {
          label: '外链方式',
          prop: 'method',
          isShowSet: true,
          width: '120',
          formatter: (row) => {
            const obj = JSON.parse(row.uri)
            if (obj.type === '0') {
              return `<div>无</div>`
            } else if (obj.type === '3') {
              return `<div>自定义</div>`
            } else if (obj.type === '2') {
              return `<div>活动</div>`
            } else if (obj.type === '1') {
              return `<div>课程</div>`
            }
          }
        },
        {
          label: '外链地址',
          prop: 'uri',
          isShowSet: true,
          render: (h, params) => {
            const obj = JSON.parse(params.row.uri)
            // if ((JSON.parse(params.row.uri)).type === '2') {
            //   console.log((JSON.parse(params.row.uri)))
            // }

            const address = (JSON.parse(params.row.uri)).type === '0' ? '无外链'
              : (JSON.parse(params.row.uri)).type === '2' ? `http://www.ishanshan.com/wx/h5/weixin/webSite?router=microActivityDetail&tenantId=${params.row.tenantId}&orgId=${params.row.orgId}&actId=${params.row.id}`
                : (JSON.parse(params.row.uri)).type === '1' ? `http://www.ishanshan.com/wx/h5/weixin/webSite?router=microCourseDetail&tenantId=${params.row.tenantId}&orgId=${params.row.orgId}&actId=${params.row.id}`
                  : (JSON.parse(params.row.uri)).type === '3' ? (JSON.parse(params.row.uri)).uri : (JSON.parse(params.row.uri)).uri
            if (obj.type !== '0') {
              return h('div', {}, [
              // h('img', { style: { width: '40px', height: '40px', 'margin-right': '10px' }, attrs: { src: params.row.icon }}, ''),
                h('div', { style: { overflow: 'hidden', 'text-overflow': 'ellipsis', color: 'rgba(24,145,237,1)',
                  'white-space': 'normal', display: '-webkit-box', '-webkit-line-clamp': '4', width: '120px',
                  'line-height': '15px', 'font-size': '14px', '-webkit-box-orient': 'vertical'
                }, on: { click: () => {
                  window.open(address)
                } }
                }, [h('el-tooltip', {
                  props: { placement: 'top', width: '200', content: address, effect: 'dark' }
                }, [
                  h('a',
                    { },
                    address)
                ])])
              ])
            } else {
              return h('div', { style: { overflow: 'hidden', 'text-overflow': 'ellipsis',
                'white-space': 'normal', display: '-webkit-box', '-webkit-line-clamp': '4', width: '120px',
                'line-height': '15px', 'font-size': '14px', '-webkit-box-orient': 'vertical' }}, '无外链')
            }
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isColShow: false,
          isShowSet: true,
          isShowTooltip: true
        }

      ],
      options: {
        isSettingShow: true, // 是否出现设置
        apiService: queryOrgBanner // 表格的数据请求接口
      },
      tableHeight: 'calc(100vh - 278px)',
      isBorder: true,
      operates: {
        fixed: 'right',
        width: 200,
        list: [
          {
            label_1: '隐藏',
            label_2: '显示',
            type: 'unnormal',
            btnId: '303000004',
            method: (row) => {
              const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                // spinner: 'el-icon-loading',
                fullscreen: false,
                // background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.rotation-container')
              })
              if (row.status === 1) {
                row.status = 2
              } else if (row.status === 2) {
                row.status = 1
              }
              changeBanner({ status: row.status, ids: row.id }).then(res => {
                if (res.data.errorCode === 0) {
                  this.resetFieldHanle()
                } else {
                  this.$message.error(res.errorMessage)
                }
                loading.close()
              })
            },
            popoverCon: [
              {
                contentText: '确认要隐藏吗？',
                status: '1'
              }, {
                contentText: '确认要显示吗？',
                status: '2'
              }
            ]
          },
          {
            label: '编辑',
            type: 'normal',
            btnId: '303000003',
            method: (row) => {
              this.editRotationDialogShow(row)
            }
          },
          {
            label: '删除',
            type: 'normal',
            btnId: '303000002',
            method: (row) => {
              const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                // spinner: 'el-icon-loading',
                fullscreen: false,
                // background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.rotation-container')
              })
              changeBanner({ status: 0, ids: row.id }).then(res => {
                if (res.data.errorCode === 0) {
                  this.resetFieldHanle()
                } else {
                  this.$message.error(res.errorMessage)
                }
                loading.close()
              })
            },
            popoverCon: [
              {
                contentText: '确认删除？',
                status: '0'
              }
            ]
          }
        ]
      }
    }
  },

  methods: {
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      // 搜索的入参
      const params = {
        ...this.formValue
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        title: '',
        status: '',
        type: ''
      }
      this.$refs.tableCommon.getList(params)
      this.formValue = {}
    },

    // 新增轮播图对话框
    addRotationDialogShow() {
      queryOrgBanner().then(res => {
        if (res.data.errorCode === 0) {
          this.length = res.data.results.length
          if (this.length > 4) {
            this.$message({
              message: '最多可添加5张轮播图',
              type: 'warning'
            })
          } else {
            this.$refs.addRotationDialog.showDialog('add')
          }
        } else {
          this.$message.error(res.errorMessage)
        }
      })

      // console.log(this.$refs.addRotationDialog)
      // this.addRotationVisible = true
      // this.$refs.addRotationDialog.marketActivityDialogtitle = '新增轮播图'
      // this.$refs.addRotationDialog.marketActivityDialogShow = true
    },
    editRotationDialogShow(val) {
      this.$refs.addRotationDialog.showDialog(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.rotation-container {
  width: calc(100%);
  padding: 0 20px;
  .rotation-top {
    width: 100%;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    // background: pink;
  }
  .search {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    height: 48px;
  }
  .warn {
    height: 28px;
    line-height: 28px;
    background: rgba(70, 182, 238, 0.1);
    margin-bottom: 10px;
    font-size: 14px;
    color: #666;
    padding-left: 10px;
    border-radius: 4px;
  }
}
</style>
<style lang="scss">
.rotation-container {
  .borderTable {
    .el-table--fit {
      border-left: none;
    }
  }
  .el-table__row {
    height: 100px;
  }
  .el-table td .cell {
    height: 70px !important;
  }
}
</style>

