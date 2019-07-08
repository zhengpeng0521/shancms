<template>
  <div>
    <el-dialog
      :visible.sync="importDialogShow"
      title="在读学员批量导入"
      width="700px"
      class="stuImport"
      @close="close"
    >
      <div class="tip">
        <p>学员导入规则如下:</p>
        <p>1.潜在学员不存在，在读学员不存在————创建在读学员，并导入合同信息</p>
        <p>2.潜在学员不存在，在读学员已存在————只导入合同信息</p>
        <p style="margin-bottom:0">3.潜在学员已存在，在读学员不存在————将潜在学员转为在读学员，并导入合同信息</p>
      </div>
      <!-- <el-alert
        :closable="false"
        title=""
        class="tip"
      >
        <div slot="title">
          <p>学员导入规则如下:</p>
          <p>1.潜在学员不存在，在读学员不存在————创建在读学员，并导入合同信息</p>
          <p>2.潜在学员不存在，在读学员已存在————只导入合同信息</p>
          <p>3.潜在学员已存在，在读学员不存在————将潜在学员转为在读学员，并导入合同信息</p>
        </div>
      </el-alert> -->
      <el-steps
        :active="active"
        align-center
        finish-status="success"
      >
        <el-step title="上传文件" />
        <!-- <el-step title="信息配对" /> -->
        <el-step title="预览表格" />
        <el-step title="导入数据" />
      </el-steps>
      <!-- 第一步 -->
      <FirstStep
        v-if="active === 0"
        :loading="loading"
        @start="SHOW_LOADING"
        @isModle="isModelFile"
        @faild="faild"
      />
      <!-- 第二步 -->
      <!-- <SecondStep
        v-if="active === 1"
        ref="matchForm"
        :loading="loading"
        :field-list="fieldList"
        :data-source="dataSource"
        @didMount="() => {getSourceData({id: uploadId})}"
        @changeMatch="changeMatch"
      /> -->
      <!-- 第三步 -->
      <ThirdStep
        v-if="active === 2"
        :loading="loading"
        :cols="cols"
        :data-source="tableData"
      />
      <!-- 第四步 -->
      <FourthStep
        v-if="active === 3"
        :loading="loading"
      />

      <span slot="footer">
        <el-button
          v-if="active > 0"
          :loading="loading"
          @click="previous"
        >上一步</el-button>
        <el-button
          :loading="loading"
          :disabled="btnDisabled"
          type="primary"
          @click="next"
        >{{ nextText }}</el-button>
      </span>
    </el-dialog>
    <!-- 导入成功 -->
    <CompleteDialog
      :visible="completeVisible"
      :has-fail="hasFail"
      :complete-info="completeInfo"
      append-to-body
      @closeComplete="closeComplete"
      @downloadErr="downloadErr"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import FirstStep from './importStep/FirstStep'
import SecondStep from './importStep/SecondStep'
import ThirdStep from './importStep/ThirdStep'
import FourthStep from './importStep/FourthStep'
import CompleteDialog from './importStep/CompleteDialog'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    FirstStep,
    SecondStep,
    ThirdStep,
    FourthStep,
    CompleteDialog
  },

  props: {
    refresh: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      importDialogShow: false, // 是否导入弹框显隐
      active: 0 // 积分导入步骤条
    }
  },
  computed: {
    ...mapState('readStu', [
      'btnDisabled',
      'loading',
      'flag',
      'rule',
      'uploadId',

      'fieldList',
      'dataSource',

      'cols',
      'tableData',
      'regex',

      'completeVisible',
      'hasFail',
      'completeInfo'
    ]),

    nextText() {
      if (this.active === 3) {
        return '确定'
      } else {
        return '下一步'
      }
    }
  },

  methods: {
    ...mapMutations('readStu', [
      'SHOW_LOADING',
      'HIDE_LOADING',
      'UPDATE_STATE'
    ]),
    ...mapActions('readStu', [
      'isModelFile',
      'getSourceData',
      'previewData',
      'importData',
      'importThreadStuData'
    ]),

    /* 显示弹框 */
    showDialog() {
      this.importDialogShow = !this.importDialogShow
    },

    /** 关闭 */
    close() {
      this.importDialogShow = false
      this.active = 0
      this.UPDATE_STATE({ flag: false, btnDisabled: true, uploadId: '' })
    },

    /** 上传失败 */
    faild() {
      this.HIDE_LOADING()
      this.$message.error('上传失败！')
    },

    /** 上一步 */
    previous() {
      this.active -= 1
    },

    /** 下一步 */
    next() {
      if (this.active === 0 && this.flag) {
        this.UPDATE_STATE({ btnDisabled: false })
        const allRegex = {
          0: 'signType', // 签约类型
          1: 'name', // 学员姓名
          2: 'sex', // 性别
          3: 'birthday', // 生日
          4: 'nickname', // 昵称
          5: 'seller', // 负责销售
          6: 'teacher', // 负责老师
          7: 'conaddress', // 联系地址
          8: 'schaddress', // 学校地址
          9: 'pAName', // A家长姓名
          10: 'pAMobile', // A家长电话
          11: 'pARela', // A家长关系
          12: 'pBName', // B家长姓名
          13: 'pBMobile', // B家长电话
          14: 'pBRela', // B家长关系
          15: 'classPackName', // 套餐名称
          16: 'classPackNum', // 套餐数量
          17: 'payMoney', // 剩余课时对应金额
          18: 'leftPeriod', // 当前剩余课时数量
          19: 'aidName', // 物资名称
          20: 'aidNum', // 物资数量
          21: 'aidMoney', // 物资实收金额
          22: 'startTime', // 合同期限开始时间
          23: 'endTime', // 合同期限结束时间
          24: 'expireInvalid', // 到期是否作废
          25: 'extCourse', // 赠送课程
          26: 'extPeriod', // 赠送课时
          27: 'sellerName', // 所属销售
          28: 'orderNum', // 合同编号
          29: 'extPeriodReason', // 赠送原因
          30: 'signTime' // 签订日期
        }
        this.previewData({ regex: JSON.stringify(allRegex), id: this.uploadId })
        this.active += 2
      } else if (this.active === 0 && !this.flag) {
        this.UPDATE_STATE({ btnDisabled: true })
      } else if (this.active === 1) {
        console.log('1111111')
      } else if (this.active === 2) {
        this.active += 1
      } else if (this.active === 3) {
        this.importThreadStuData({ regex: this.regex, id: this.uploadId, close: this.close, refresh: this.refresh })
      }

      // if (this.active === 0 && this.flag) {
      //   const allRegex = {}
      //   for (const i in this.dataSource) {
      //     allRegex[this.dataSource[i]] = i
      //   }
      //   this.previewData({ regex: JSON.stringify(allRegex), id: this.uploadId })
      //   this.UPDATE_STATE({ btnDisabled: false })
      //   this.active += 2
      // } else if (this.active !== 3) {
      //   this.active += 1
      // }
      // if (this.active !== 2) {
      //   this.active += 1
      // }
    },

    /** 第二步配对表单change */
    changeMatch(regex) {
      if ((regex.name || regex.name === 0) &&
          regex.firstParentName &&
          regex.firstParentMobile) {
        this.UPDATE_STATE({ btnDisabled: false })
      }
    },

    /** 关闭完成弹窗 */
    closeComplete() {
      this.UPDATE_STATE({ completeVisible: false })
    },

    /** 下载错误日志 */
    downloadErr() {
      exportFile(`${window.SS_CRM}/crm/stuInfo/stuInfoImport/download/downloadByFileSys`, { id: this.completeInfo.logFileId })
    }
  }
}
</script>
<style lang="scss" scoped>
.stuImport {
  .tip {
    // background: rgba(240, 242, 245, 0.6);
    background-color: #ecf6fd;
    margin-bottom: 20px;
    padding: 10px;
    p {
      margin-bottom: 10px;
    }
  }
  .tip:last-child {
    margin-bottom: 0;
  }
}
</style>
