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
        center
      >
        <qrcode
          :options="{ width: 300,height:300,padding:0,margin:0 }"
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
// import { fetchList } from '@/api/marketing'
import { myMarketingActivity, findDetail, updateStatus } from '@/api/marketing/microAct.js'
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
      // dataDetailShow: false,
      bianhao: '',
      activityName: '',
      activityType: '',
      obj: {},
      formObj: {},
      formValue: { status: '1' },
      // select: false,
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
                // spinner: 'el-icon-loading',
                fullscreen: false,
                // background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.myActivity-container')
              })
              const params = {
                'id': row.id,
                'status': statu
                // 'tenantId': 27
              }
              updateStatus(params).then(res => {
                // console.log('updateStatus', res)
                // this.list = res.data.results
                if (res.data.errorCode === 0) {
                  // console.log('111111111111')
                  console.log(this.formValue, '111', row.status)
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
      tableHeight: 'calc(100vh - 244px)',
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
          // formatter: (row, column, cellValue) => {
          //   return `
          //   <div style="overflow: hidden; text-overflow: ellipsis; color: rgba(24,145,237,1);
          //       white-space: normal; display: -webkit-box; -webkit-line-clamp: 3; width: 152px;
          //       line-height: 20px; font-size: 14px; -webkit-box-orient: vertical;">${row.name}</div>
          //   `
          // },
          // methods: (row) => {
          //   this.picDetailBtn(row)
          // }
        }, {
          label: '二维码',
          prop: 'activityUrl',
          isShowSet: true,
          formatter: (row) => {
            return `<img src="https://img.ishanshan.com/gimg/n/20190326/bc5f6357fa2726cb764b85d533dadf46"/>`
          },
          methods: (row) => {
            console.log(row)
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
        // status: '1',
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

    findDetail() {
      const params = {
        'id': '',
        'orgId': 3536
      }
      findDetail(params).then(res => {
        // console.log('findDetail', res)
        // this.list = res.data.results
        if (res.data.errorCode === 0) {
          console.log('findDetail', res)
          // this.list = res.data.results
        } else {
          this.$message.error(res.errorMessage)
        }
        // loading.close()
      })
    },
    picDetailBtn(val) {
      // console.log(val, 'val')
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
        // 'name': this.formInline.activityName,
        // 'title': this.formInline.activityStyle,
        // 'status': this.formInline.statu
        // 'tenantId': 27,
        // 'orgId': 3636
      }
      this.$refs.tableCommon.getList(params)
    },
    resetFieldHanle(formValue) {
      const params = {
        'name': '',
        'title': '',
        'status': 1,
        'type': 1
        // 'tenantId': 27,
        // 'orgId': 3636
      }
      this.$refs.tableCommon.getList(params)
      this.formValue = { status: '1' }
    },
    //  二维码弹框方法
    showDialog(row) {
      // console.info("row value--->", row)
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
      // console.log(this.$refs.url)
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
    // width: calc(100% - 30px);
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
  td {
    // border-bottom: 0.3px solid rgb(238, 238, 238);
  }
}
.myActivity-container .el-table td {
  // border-bottom: 0.3px solid rgb(238, 238, 238) !important;
}
.myActivity-cont {
  .erweimaBox {
    width: 335px;
    height: 435px;
    .el-dialog__header {
      border-bottom: 0;
    }
    .el-dialog__body {
      padding: 10px 0 0 17px !important;
      p {
        margin-top: 20px;
        font-size: 15px;
        text-align: center;
      }
      .erweima-footer {
        display: flex;
        justify-content: space-around;
        .ipt {
          width: 220px;
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
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
