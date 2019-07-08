<template>
  <!-- refundType 1 退款，2 退课时，3 退时长 样式使用内部样式表，生成打印页面 -->
  <div class="refundPrintDialog_container">
    <el-dialog
      :visible.sync="refundPrintDialogShow"
      :title="title"
      width="700px"
      @close="close"
    >
      <div
        v-loading="loading"
        id="refoundPrint"
        class="formStyle"
        element-loading-text="拼命加载中"
      >
        <!-- 账号名 -->
        <div style="width: 100%;height: 30px;line-height: 30px;text-align: center;font-size: 20px;">{{ printInfo.orgName || '--' }}</div>

        <!-- 退款单 -->
        <div style="width: 100%;height: 25px;line-height: 25px;text-align: center;font-size: 16px;">
          退款单
          <span>{{ `（${statusText}）` || '' }}</span>
        </div>

        <!-- 学员姓名 -->
        <div style="width:100%;height:20px;position:relative;">
          <div style="position: absolute;left: 0px;top: 0px;width: 35%;height: 20px;line-height: 20px;font-size: 14px;">
            <span>学员姓名 ： </span>
            <span>{{ printInfo.stuName || '--' }}</span>
          </div>
          <div
            v-if="refundType !== '3'"
            style="position: absolute;right: 0px;top: 0px;width: 37%;height: 20px;line-height: 20px;font-size: 14px;"
          >
            <span>退款单号 ： </span>
            <span>{{ printInfo.id || '--' }}</span>
          </div>
        </div>

        <!-- 周期和数量 -->
        <div style="width:100%;height:40px;margin-top:10px;position:relative;">
          <div :style="{position:'absolute',left:'0',top:'0',width: refundType == '3' ? '60%' : '80%',height:'40px',lineHeight:'40px',textAlign:'center',border:'1px solid #dddddd'}">
            交易内容
          </div>
          <div :style="{position:'absolute',left:refundType == '3' ? '60%' : '80%',top:'0',width:refundType == '3' ? '40%' : '20%',height:'40px',lineHeight:'40px',textAlign:'center',border:'1px solid #ddd',borderLeft:'0'}">
            {{ refundType === '3' ? '退款周期' : '数量' }}
          </div>
        </div>

        <!-- 退费 -->
        <div
          v-if="refundType === '1'"
          :style="{width:'100%',height:'40px',position:'relative'}"
        >
          <div :style="{position:'absolute',left:'0',top:'0',width:'80%',height:'40px',lineHeight:'40px',textAlign:'center',border:'1px solid #ddd',borderTop:'0'}">
            退费
          </div>
          <div :style="{position:'absolute',left:'80%',top:'0',width:'20%',height:'40px',float:'right',lineHeight:'40px',textAlign:'center',border:'1px solid #ddd',borderTop:'0',borderLeft:'0'}">
            {{ printInfo.money }}元
          </div>
        </div>

        <!-- 退课时 -->
        <div
          v-else-if="refundType === '2' && printInfo.peridInfo && printInfo.peridInfo.length > 0"
          :style="{width:'100%',height:'40px',position:'relative'}"
        >
          <div
            v-for="(item, index) in printInfo.peridInfo"
            :key="'print'+index"
            :style="{width:'100%',height:'40px',position:'relative'}"
          >
            <div :style="{position:'absolute',left:'0',top:'0',width:'80%',height:'40px',lineHeight:'40px',textAlign:'center',border:'1px solid #dddddd',borderTop:'0',whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden'}">
              <el-popover
                :content="'课程：' + (!!item.courseName ? item.courseName : '--')"
                placement="top"
                trigger="hover"
              >
                <span slot="reference">课程：{{ !!item.courseName ? item.courseName : '--' }}</span>
              </el-popover>
            </div>
            <div :style="{position:'absolute',left:'80%',top:'0',width:'20%',height:'40px',float:'right',lineHeight:'40px',textAlign:'center',border:'1px solid #dddddd',borderTop:'0',borderLeft:'0'}">
              {{ item.periodNum }}
            </div>
          </div>
        </div>

        <!-- 退时长 -->
        <div
          v-else-if="refundType === '3'"
          :style="{width:'100%',height:'40px',position:'relative'}"
        >
          <div :style="{position:'absolute',left:'0',top:'0',width:'60%',height:'40px',lineHeight:'40px',textAlign:'center',border:'1px solid #dddddd',borderTop:'0'}">
            托班：{{ !!printInfo.nurseryTypeName ? printInfo.nurseryTypeName : '--' }}
          </div>
          <div :style="{position:'absolute',left:'60%',top:'0',width:'40%',height:'40px',float:'right',lineHeight:'40px',textAlign:'center',border:'1px solid #dddddd',borderTop:'0',borderLeft:'0'}">
            {{ printInfo.startTime }} ~ {{ printInfo.endTime }}
          </div>
        </div>

        <!-- 下半部分 -->
        <div
          v-if="refundType !== '3'"
          style="width:100%;height:40px;margin-top:20px;position:relative;"
        >
          <div style="position: absolute;left: 0px;top: 0px;width: 50%;float: left;line-height: 40px;text-align: left;padding-left: 10%;">
            <!-- 账户变动 : {{ refundType === '1' ? '-' : '+' }}{{ printInfo.money || '0' }}元 -->
            退款金额 ： {{ printInfo.money }}
          </div>
          <div style="position: absolute;left: 50%;top: 0px;width: 50%;height: 40px;float: left;line-height: 40px;text-align: left;">
            <!-- 当前余额 : {{ printInfo.balance || '0' }}元 -->
            退款方式 ： {{ refund_way === 'bank' ? '银行卡' : refund_way === 'ali' ? '支付宝' : refund_way === 'wx' ? '微信' : refund_way === 'cash' ? '现金' : '--' }}
          </div>
        </div>
        <!-- 退款天数 -->
        <div
          v-else
          style="width: 100%;height: 40px;margin-top: 20px;position: relative;"
        >
          <div style="position: absolute;left: 0px;top: 0px;width: 50%;float: left;line-height: 40px;text-align: left;padding-left: 10%;">
            退款天数 ： {{ renderDays }}
          </div>
          <div style="position: absolute;left: 50%;top: 0px;width: 50%;height: 40px;float: left;line-height: 40px;text-align: left;">
            当前有效期至 ： {{ printInfo.currentEndTime }}
          </div>
        </div>

        <div
          v-if="refundType !== '3'"
          style="width: 100%;height: 40px;position: relative;"
        >
          <div style="position: absolute;left: 0px;top: 0px;width: 50%;height: 40px;float: left;line-height: 40px;text-align: left;padding-left: 10%;">
            <!-- 课时变动 : {{ refundType === '2' ? '-' : '' }}{{ printInfo.perid || '0' }} -->
            手续费用 ： {{ printInfo.fee }}元
          </div>
          <div v-if="refund_way === 'bank'" style="position: absolute;left: 50%;top: 0px;width: 50%;height: 40px;float: left;line-height: 40px;text-align: left;">
            <!-- 当前课时 : {{ printInfo.periodLeft || '0' }}/{{ printInfo.periodAll || '0' }} -->
            退款户名 ： {{ account_name }}
          </div>
          <div v-if="refund_way === 'ali'" style="position: absolute;left: 50%;top: 0px;width: 50%;height: 40px;float: left;line-height: 40px;text-align: left;">
            <!-- 当前课时 : {{ printInfo.periodLeft || '0' }}/{{ printInfo.periodAll || '0' }} -->
            支付宝账号 ： {{ account_name }}
          </div>
        </div>

        <div style="width: 100%;height: 40px;position: relative;">
          <div style="position: absolute;left: 0px;top: 0px;width: 50%;height: 40px;float: left;line-height: 40px;text-align: left;padding-left: 10%;">
            <!-- 经办人 : {{ printInfo.uname }} -->
            经办日期 ： {{ printInfo.createTime }}
          </div>
          <div v-if="refundType !== '3' && refund_way === 'bank'" style="position: absolute;left: 50%;top: 0px;width: 50%;height: 40px;float: left;line-height: 40px;text-align: left;">
            <!-- 经办日期 : {{ printInfo.createTime }} -->
            退款卡号 ： {{ account }}
          </div>
        </div>

        <div style="width: 100%;height: 40px;position: relative;">
          <div style="position: absolute;left: 0px;top: 0px;width: 50%;height: 40px;float: left;line-height: 40px;text-align: left;padding-left: 10%;">
            处理说明 ： {{ printInfo.refundWay }}
          </div>
          <div v-if="refundType !== '3' && refund_way === 'bank'" style="position: absolute;left: 50%;top: 0px;width: 50%;height: 40px;float: left;line-height: 40px;text-align: left;">
            退款银行 ： {{ bank_name }}
          </div>
        </div>

        <div style="width: 100%;height: 40px;position: relative;">
          <div style="position: absolute;left: 0px;top: 0px;width: 80%;height: 40px;float: left;line-height: 40px;text-align: left;padding-left: 10%;">
            经办人 ： {{ printInfo.uname }}
          </div>
        </div>

        <div style="width: 100%;height: 40px;position: relative;">
          <div style="position: absolute;left: 0px;top: 0px;width: 80%;height: 40px;float: left;line-height: 40px;text-align: left;padding-left: 10%;">
            电话 ： {{ printInfo.tel }}
          </div>
        </div>

        <div style="width: 100%;height: 40px;position: relative;">
          <div style="position: absolute;left: 0px;top: 0px;width: 80%;height: 40px;float: left;line-height: 40px;text-align: left;padding-left: 10%;">
            地址 ： {{ printInfo.addr }}
          </div>
        </div>

        <div style="margin-top: 30px;width: 100%;height: 40px;position: relative;">
          <div style="position: absolute;left: 0px;top: 0px;width: 50%;height: 40px;float: left;line-height: 40px;text-align: left;padding-left: 10%;">经办人签字 ： </div>
          <div style="position: absolute;left: 50%;top: 0px;width: 50%;height: 40px;float: left;line-height: 40px;text-align: left;">客户签字 ： </div>
        </div>

        <div style="width: 100%;height: 40px;position: relative;">
          <div style="position: absolute;left: 0px;top: 0px;width: 50%;height: 40px;float: left;line-height: 40px;text-align: left;padding-left: 10%;">城市经理人签字 ： </div>
        </div>
      </div>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :loading="loading"
          type="primary"
          @click="printForm()"
        >打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPrintInfo } from '@/api/crm/financeMgr/financeMgr'
import { do_print } from '@/utils/printUtils'

export default {
  data() {
    return {
      refundPrintDialogShow: false,
      printInfo: {},
      refund_way: '', // 支付方式
      account: '', // 账号
      account_name: '', // 账户名称
      bank_name: '', // 银行名称
      loading: false
    }
  },

  computed: {
    // 退款状态
    statusText() {
      const status = this.printInfo.status + ''
      return status === '1' ? '待退款' : status === '2' ? '已退款' : status === '3' ? '已驳回' : '--'
    },
    // 弹窗title
    title() {
      const refundType = this.printInfo.refundType + ''
      return refundType === '1' ? '退费打印' : refundType === '2' ? '退课时打印' : '退时长打印'
    },
    refundType() {
      return this.printInfo.refundType + ''
    },
    // 退款天数
    renderDays() {
      let month = ''
      let day = ''
      // eslint-disable-next-line eqeqeq
      if (!!this.printInfo.months && this.printInfo.months + '' != '0') {
        month = `${this.printInfo.months}个月`
      }
      // eslint-disable-next-line eqeqeq
      if (!!this.printInfo.days && this.printInfo.days + '' != '0') {
        day = `${this.printInfo.days}天`
      }

      return (month + day)
    }
  },

  methods: {
    /* 显示弹框 */
    showDialog(row) {
      this.refundPrintDialogShow = !this.refundPrintDialogShow
      // 获取打印信息
      this.loading = true
      getPrintInfo({ id: row.id }).then(res => {
        const { data } = res

        if (data && data.errorCode === 0) {
          this.loading = false
          this.printInfo = data.data || {}
          const refundInfo = data.data.refundInfo
          const refundInfoData = JSON.parse(refundInfo)

          this.refund_way = refundInfoData.refund_way
          this.account = refundInfoData.account
          this.account_name = refundInfoData.account_name
          this.bank_name = refundInfoData.bank_name
        } else {
          this.$message.error(data && data.errorMessage || '打印信息获取失败！')
        }
      })
    },
    /* 关闭弹框 */
    close() {
      this.refundPrintDialogShow = false
    },

    /** 打印 */
    printForm() {
      do_print('refoundPrint')
    }
  }
}
</script>

