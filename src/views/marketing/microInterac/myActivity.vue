<template>
  <div class="myActivity-container">

    <div class="myActivity-top">
      <div class="search">
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
      </div>
    </div>
    <div class="myActivity-cont">
      <Table
        ref="tableCommon"
        :columns="columns"
        :tableHeight="tableHeight"
        :pagination="listQuery"
        :operation="operates"
        :options="options"
        table-key="marketing_microInterac_myActivity"
        class="myActivity-cont-table"
      />
      <!-- 编辑页面弹框 -->
      <PicDetail
        v-if="picDetailShow"
        :visible.sync="picDetailShow"
      />
      <!-- 查看数据弹框 -->
      <DataDetail
        ref="dataDetail"
        :data-detail-table="dataDetailTable"
      />
      <!-- 二维码弹框 -->
      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="erweimaBox"
        width="400px"
      >
        <qrcode
          :options="{ width: 360,height:360,padding:0,margin:0 }"
          :value="message"
          class="erweima"
        />
        <p>请使用微信扫一扫</p>
        <div class="erweima-footer">
          <div class="ipt">
            <el-input
              ref="url"
              v-model="message"
              :readonly="true"
            />
          </div>
          <el-button
            v-clipboard:copy="message"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            type="primary"
          >复制地址</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>

import CommonSearch from '@/components/CommonSearch/CommonSearch'
import Table from '@/components/CommonTable/CommonTable'
import { myMarketingActivity, updateStatus } from '@/api/marketing/microAct.js'
// 调用slideDetail
import PicDetail from '../components/editPicDetail'
import DataDetail from '../components/dataDetail'
// 二维码装换插件
import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
Vue.component(VueQrcode.name, VueQrcode)
// 复制插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
  components: {
    Table,
    PicDetail,
    DataDetail,
    CommonSearch
  },
  data() {
    return {
      // 二维码弹框数据
      dialogVisible: false,
      message: '',
      picDetailShow: false,
      bianhao: '',
      activityName: '',
      activityType: '',
      obj: {},
      formObj: {},
      formValue: { status: '1' },
      options: {
        apiService: myMarketingActivity, // 表格的数据请求接口
        isSettingShow: true,
        params: { status: 1, type: 1 }
      },
      operates: {
        width: '250',
        fixed: 'right',
        list: [
          {
            label: '编辑',
            type: 'normal',
            btnId: '203000004',
            method: (row) => {
              this.picDetailBtn(row)
            }
          },
          {
            label_1: '上架',
            label_2: '下架',
            type: 'unnormal',
            btnId: '203000005',
            method: (row) => {
              let statu = ''
              if (row.status === '1') {
                statu = '2'
              } else if (row.status === '2') {
                statu = '1'
              }
              const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                fullscreen: false,
                target: document.querySelector('.myActivity-container')
              })
              const params = {
                'id': row.id,
                'status': statu
              }
              updateStatus(params).then(res => {
                if (res.data.errorCode === 0) {
                  if (this.formValue !== {}) {
                    this.$refs.tableCommon.getList({ 'name': '',
                      'title': '',
                      'status': this.formValue.status,
                      'type': 1 })
                  } else {
                    this.resetFieldHanle()
                  }
                } else {
                  this.$message.error(res.errorMessage)
                }
                loading.close()
              })
            },
            popoverCon: [
              {
                contentText: '确认要上架吗？',
                status: '2'
              }, {
                contentText: '确认要下架吗？',
                status: '1'
              }
            ]
          }
        ]
      },
      listQuery: {
        show: true // 是否显示
      },
      tableHeight: 'calc(100vh - 231px)',
      isBorder: true,
      columns: [
        {
          label: '活动名称',
          prop: 'name',
          isShowSet: true,
          isShowTooltip: true,
          width: 180,
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'activityName',
                on: {
                  click: () => {
                    this.picDetailBtn(params.row)
                  }
                }
              }, params.row.name
            )
          }
        }, {
          label: '二维码',
          prop: 'activityUrl',
          isShowSet: true,
          formatter: (row) => {
            return `<i class="iconfont icon_ym_ewm"/>`
          },
          methods: (row) => {
            this.showDialog(row)
          }
        },
        {
          label: '状态',
          prop: 'statu',

          isShowSet: true,
          formatter: (row) => {
            if (row.status === '2') {
              return `<div style="display:flex">
                      <div style="margin-top:7px;margin-right:5px;width:8px;height:8px;border-radius:50px;background:rgba(208,2,27,1);"></div>
                      <span>已下架</span>
                    </div>`
            } else if (row.status === '1') {
              return `<div style="display:flex">
                      <div style="margin-top:7px;margin-right:5px;width:8px;height:8px;background:rgba(135,208,104,1);border-radius:50px"></div>
                      <span>已上架</span>
                    </div>`
            }
          }
        }, {
          label: '数据详情',
          prop: 'dataList',
          isShowSet: true,
          width: 150,
          height: 80,
          render: (h, params) => {
            if (this.hasBtn('203000002')) {
              return h(
                'div',
                {
                  style: 'display:flex;flex-direction:column;'
                }, [
                  h('div', { style: 'line-height:12px;font-size:10px' }, '有效用户：' + params.row.validnum),
                  h('div', { style: 'line-height:12px;margin-right: 5px;margin-top:5px;font-size:10px' }, '浏览数：' + params.row.validnum),
                  h('a', { style: 'line-height:12px;margin-top:5px;font-size:10px',
                    on: {
                      click: () => {
                        this.dataDetailBtn(params.row)
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
                  h('div', { style: 'line-height:12px;font-size:10px' }, '有效用户：' + params.row.validnum),
                  h('div', { style: 'line-height:12px;margin-right: 5px;margin-top:5px;font-size:10px' }, '浏览数：' + params.row.validnum)
                ]
              )
            }
          }
        }, {
          label: '创建时间',
          width: 200,
          prop: 'createTime',
          isShowSet: true
        }, {
          label: '活动类型',
          prop: 'title',
          isShowSet: true
        }
      ],
      // 搜索框设置
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '活动名称',
            modelValue: 'name',
            isClearable: true
          },
          {
            itemType: 'input',
            placeholder: '活动类型',
            modelValue: 'title',
            isClearable: true
          },
          {
            itemType: 'select',
            placeholder: '状态',
            modelValue: 'status',
            isFilterable: true,
            isClearable: true,
            defaultFirst: true,
            default: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '已上架',
                value: '1'

              }, {
                label: '已下架',
                value: '2'
              }, {
                label: '全部状态',
                value: ''
              }
            ]
          }
        ]
      },
      dataDetailTable: {
        id: ''
      }
    }
  },
  methods: {
    picDetailBtn(val) {
      this.obj = val
      this.picDetailShow = true
    },
    dataDetailBtn(row) {
      this.dataDetailTable.id = row.id
      this.$refs.dataDetail.dataDetailShow()
    },
    /* 搜索框搜索重置 */
    searchHandle(formValue) {
      // 重置的入参
      this.formValue = formValue
      this.formObj = formValue
      const params = {
        'id': '',
        type: 1,
        ...this.formValue
      }
      this.$refs.tableCommon.getList(params)
    },
    resetFieldHanle(formValue) {
      const params = {
        'name': '',
        'title': '',
        'status': 1,
        'type': 1
      }
      this.$refs.tableCommon.getList(params)
      this.formValue = { status: '1' }
    },
    //  二维码弹框方法
    showDialog(row) {
      this.dialogVisible = true
      let activityUrl = row.activityUrl
      if (!activityUrl) {
        activityUrl = ''
      } else if (activityUrl.startsWith('//')) {
        activityUrl = window.location.protocol + activityUrl
      } else if (!activityUrl.startsWith('http')) {
        activityUrl = 'http://' + activityUrl
      }
      this.message = activityUrl
    },
    onCopy: function(e) {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      this.$refs.url.style.background = 'rgba(51,141,233,1)'
      this.$refs.url.style.color = '#fff'
    },
    onError: function(e) {
      this.$message.error('复制失败')
    }

  }

}
</script>
<style lang="scss" scoped>
.myActivity-container {
  .myActivity-top {
    min-width: 920px;
    .select {
      margin: 20px 0;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

<style lang="scss">
.myActivity-container .myActivity-cont-table .el-table__row {
  height: 60px;
  line-height: 16px;
  .cell {
    height: 70px !important;
  }
}
.myActivity-cont {
  .erweimaBox {
    .el-dialog__header .el-dialog__title {
      height: 21px;
      display: block;
    }
    .el-dialog__body {
      padding: 20px !important;
      text-align: center;
      p {
        margin-top: 20px;
        margin-bottom: 10px;
        font-size: 16px;
        text-align: center;
      }
      .erweima-footer {
        display: flex;
        justify-content: space-around;
        .ipt {
          width: 262px;
          border-radius: 4px;
          transition: all 0.3s;
          line-height: 28px;
          overflow: hidden;
        }
        .el-input__inner {
          padding: 0 10px;
        }
        .el-button {
          margin-left: 2%;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.myActivity-container {
  .activityName {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    overflow: hidden;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    width: 152px;
    line-height: 20px;
    font-size: 14px;
    -webkit-box-orient: vertical;
    cursor: pointer;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
