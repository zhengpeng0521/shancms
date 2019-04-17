<template>
  <div class="myGame-container">
    <div class="myGame-top">
      <!-- 搜索框 -->
      <div class="search">
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
      </div>
    </div>
    <div class="myGame-cont">
      <!-- 表格 -->
      <Table
        ref="tableCommon"
        :columns="columns"
        :tableHeight="tableHeight"
        :pagination="listQuery"
        :operation="operates"
        :options="options"
        table-key="marketing_microGame_microGame"
      />
      <!-- 编辑页面弹框 -->
      <creatMyGame
        v-if="picDetailShow"
        :visible.sync="picDetailShow"
      />
      <!-- 查看数据弹框 -->
      <dataDetail
        v-if="dataDetailShow"
        :visible.sync="dataDetailShow"
      />
      <!-- 二维码弹框 -->
      <el-dialog
        v-if="message!==''"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        custom-class="erweimaBox"
        width="335px"
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
import { queryGameInsts, getOrgName, queryGameInfos, updateStatus } from '@/api/marketing/microGame.js'
// import { updateStatus } from '@/api/marketing/microAct.js'
// 调用slideDetail
import creatMyGame from '../components/creatMyGame'
import dataDetail from '../components/myGameDataDetail'
// 二维码装换插件
import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
Vue.component(VueQrcode.name, VueQrcode)
// 复制插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
  components: {
    CommonSearch,
    Table,
    creatMyGame,
    dataDetail
  },
  data() {
    return {
      obj: {},
      dataObj: {},
      formObj: {},
      // 搜索框参数
      // select: false,
      list: [],
      orgList: [],
      formInline: {
        // status: '1',
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '游戏名称',
            modelValue: 'dataTitle',
            isClearable: true
          },
          {
            itemType: 'select',
            placeholder: '游戏类型',
            modelValue: 'gameCode',
            isClearable: true,
            // selectOption: this.list
            apiService: queryGameInfos,
            labelKey: 'gameTitle',
            valueKey: 'gameCode',
            params: { status: 1 }
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
      // 表格参数
      columns: [
        {
          label: '游戏名称',
          prop: 'dataTitle',
          isShowSet: true,
          isShowTooltip: true,
          width: '230',
          render: (h, params) => {
            return h(
              'div',
              {
                style: 'display:flex'
              }, [
                h('img', { style: 'width:40px;height:40px;margin-right:10px', attrs: { src: params.row.icon }}),
                h('div', { class: 'gameName',
                  on: {
                    click: () => {
                      this.picDetailBtn(params.row)
                    }
                  }}, params.row.dataTitle)
              ]
            )
          }
          // formatter: (row, column, cellValue) => {
          //   return `<div style="display:flex">
          //   <img style="width:40px;height:40px;margin-right:10px" src=${row.icon} />
          //   <div style="overflow: hidden; text-overflow: ellipsis; color: rgba(24,145,237,1);
          //       white-space: normal; display: -webkit-box; -webkit-line-clamp: 3; width: 230px;
          //       line-height: 20px; font-size: 14px; -webkit-box-orient: vertical;">${row.dataTitle}</div>
          //   </div>`
          // },
          // methods: (row) => {
          //   this.picDetailBtn(row)
          // }
        }, {
          label: '二维码',
          prop: 'demoUrl',
          isShowSet: true,
          formatter: (row) => {
            return `<img src="https://img.ishanshan.com/gimg/n/20190326/bc5f6357fa2726cb764b85d533dadf46"/>`
          },
          methods: (row) => {
            this.showDialog(row)
          }
        },
        {
          label: '状态',
          prop: 'statu',
          isShowTooltip: true,
          isShowSet: true,
          formatter: (row) => {
            if (row.status === '2') {
              return `<div style="display:flex">
                      <div style="margin-right:5px;margin-top:8px;width:8px;height:8px;background:rgba(208,2,27,1);border-radius:50px"></div>
                      <span>已下架</span>
                    </div>`
            } else {
              return `<div style="display:flex">
                      <div style="margin-top:8px;margin-right:5px;width:8px;height:8px;background:rgba(135,208,104,1);border-radius:50px"></div>
                      <span>已上架</span>
                    </div>`
            }
          }
        }, {
          label: '数据详情',
          prop: 'dataList',
          isShowSet: false,
          isShowTooltip: true,
          width: 150,
          height: 80,
          render: (h, params) => {
            if (this.hasBtn('202000002')) {
              return h(
                'div',
                {
                  style: 'display:flex;flex-direction:column;'
                }, [
                  h('div', { style: 'line-height:12px;font-size:10px' }, '有效用户：' + params.row.amount || '0'),
                  h('div', { style: 'line-height:12px;margin-right: 5px;margin-top:5px;font-size:10px' }, '浏览数：' + params.row.views || '0'),
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
                  h('div', { style: 'line-height:12px;font-size:10px' }, '有效用户：' + params.row.amount || '0'),
                  h('div', { style: 'line-height:12px;margin-right: 5px;margin-top:5px;font-size:10px' }, '浏览数：' + params.row.views || '0')
                ]
              )
            }
          }
          // formatter: (row) => {
          //   if (this.hasBtn('202000002')) {
          //     return `<div style="display:flex;flex-direction:column;">
          //             <div style="line-height:12px;font-size:12px;margin-top:5px;">有效用户：${row.amount || 0}</div>
          //             <div style="line-height:12px;font-size:12px;margin-top:5px;">浏览数：${row.views || 0}</div>
          //             <div style="color:rgba(70,182,238,1);line-height:12px;font-size:12px;margin-top:5px;">查看</div>
          //           </div>`
          //   } else {
          //     return `<div style="display:flex;flex-direction:column;">
          //             <div style="line-height:12px;font-size:12px;margin-top:5px;">有效用户：${row.amount || 0}</div>
          //             <div style="line-height:12px;font-size:12px;margin-top:5px;">浏览数：${row.views || 0}</div>
          //           </div>`
          //   }
          // },
          // methods: (row) => {
          //   if (this.hasBtn('202000002')) {
          //     this.dataDetailBtn(row)
          //   }
          // }
        }, {
          label: '游戏时间',
          width: 200,
          isShowTooltip: true,
          prop: 'gameTime',
          isShowSet: true,
          formatter: (row) => {
            return `<div class="box" style="display:flex;flex-direction:column;-webkit-line-clamp: 2;">
                        <div class="startTime" style="width:150px;height:20px">${row.startTime}~</div>
                        <div class="endTime" style="width:150px;height:30px;">${row.endTime}</div>
            </div>`
          }
        }, {
          label: '创建时间',
          width: 200,
          prop: 'createTime',
          isShowTooltip: true,
          isShowSet: true,
          isColShow: false
        }, {
          label: '游戏类型',
          prop: 'gameTitle',
          isShowSet: true,
          isShowTooltip: true
        }
      ],
      tableHeight: 'calc(100vh - 244px)',
      listQuery: {
        show: true // 是否显示
      },
      operates: {
        width: '160',
        fixed: 'right',
        list: [
          {
            label: '编辑',
            type: 'normal',
            btnId: '202000004',
            method: (row) => {
              this.picDetailBtn(row)
            }
          },
          {
            label_1: '上架',
            label_2: '下架',
            type: 'unnormal',
            method: (row) => {
              // console.log(row, '2222222')
              // this.deleteHandle(row)
              var status = ''
              // if (row.status === '1') {
              //   status = '2'
              // } else if (row.status === '2') {
              //   status = '1'
              // }
              row.status === '1' ? status = '2' : status = '1'
              const params = {
                m: 'update_status',
                gameId: row.gameId,
                gameCode: row.gameCode,
                dataId: row.dataId,
                status: status
              }
              updateStatus(params).then(res => {
                if (res.data.errorCode === 9000) {
                  row.status === '1' ? row.status = '2' : row.status = '1'
                  console.log(this.formObj.status, 'this.formObj')
                  if (this.formObj.status) {
                    console.log('不是空')
                    this.$refs.tableCommon.getList({
                      'status': this.formObj.status
                      // 'type': 2
                    })
                  } else {
                    this.resetFieldHanle()
                  }
                } else {
                  this.$message.error(res.data.errorMsg)
                }
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
      options: {
        apiService: queryGameInsts, // 表格的数据请求接口
        isSettingShow: true,
        params: { status: 1 }
      },
      isBorder: true,
      // 二维码弹框数据
      dialogVisible: false,
      message: '',
      // 数据详情，编辑弹框参数
      picDetailShow: false,
      dataDetailShow: false,
      dataDetailTable: {

      },
      tableShow: false,
      searchShow: false
    }
  },
  mounted() {
    // this.tihuan()
    this.getOrgName()
  },
  methods: {
    /* 搜索框搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        // 'dataTitle': '',
        // 'gameCode': '',
        status: 1
      }
      this.$refs.tableCommon.getList(params)
    },
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      this.formObj = formValue
      const params = {
        ...this.formValue
        // 'orgId': this.GLOBAL.orgId,
        // 'tenantId': this.GLOBAL.tenantId,
        // dataTitle: this.formInline.gameName,
        // gameCode: this.formInline.activityStyle,
        // status: this.formInline.statu
      }
      console.log(params)
      this.$refs.tableCommon.getList(params)
    },
    // 表格方法

    // 数据详情弹框，编辑弹框方法
    picDetailBtn(val) {
      this.obj = val
      this.picDetailShow = true
    },
    dataDetailBtn(row) {
      this.dataObj = row
      // console.log(this.dataDetailShow, '111')
      this.dataDetailShow = true
    },
    //  二维码弹框方法
    showDialog(row) {
      // console.info("row value--->", row)
      this.dialogVisible = true
      const params = {
        m: 'h5',
        gameId: row.gameId,
        gameCode: row.gameCode,
        dataId: row.dataId,
        status: row.status
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中。。。',
        spinner: 'el-icon-loading',
        fullscreen: true,
        // background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.myGame-container')
      })
      updateStatus(params).then(res => {
        if (res.data.errorCode === 9000) {
          let qrurl = res.data.data.url
          if (!qrurl) {
            qrurl = ''
          } else if (qrurl.startsWith('//')) {
            qrurl = window.location.protocol + qrurl
          } else if (!qrurl.startsWith('http')) {
            qrurl = 'http://' + qrurl
          }
          this.message = qrurl
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })
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
    },
    getOrgName() {
      const params = {
        type: 1
        // 'tenantId': this.GLOBAL.tenantId,
        // 'orgId': this.GLOBAL.orgId
      }
      getOrgName(params).then(res => {
        // console.log('res', res)
        // this.list = rorgIdes.data.results
        if (res.data.errorCode === 0) {
          this.orgList = res.data.results
          // console.log(res.data.results, '111111111')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.myGame-container {
  .myGame-top {
    // width: calc(100% - 30px);
    min-width: 920px;
    // .search {
    //   border-radius: 10px;
    //   padding: 10px 20px 5px 10px;
    //   overflow: hidden;
    //   background: #f8f8f8;
    //   border: 1px solid #d9d9d9;
    // }
  }
}
</style>
<style lang="scss">
.myGame-container .el-table__row {
  height: 60px;
  line-height: 16px;
  .cell {
    height: 70px !important;
  }
  td {
    // border-bottom: 0.3px solid rgb(238, 238, 238);
  }
}
.myGame-container .el-table td {
  // border-bottom: 0.3px solid rgb(238, 238, 238) !important;
}
// .myGame-cont {
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
      margin-bottom: 10px;
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
// }
</style>
<style lang="scss">
.myGame-container {
  .gameName {
    overflow: hidden;
    text-overflow: ellipsis;
    color: #1d9df2;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    width: 230px;
    line-height: 20px;
    font-size: 14px;
    -webkit-box-orient: vertical;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
