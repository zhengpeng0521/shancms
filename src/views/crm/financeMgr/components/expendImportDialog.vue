<template>
  <div>
    <el-dialog
      :visible.sync="importDialogShow"
      title="导入支出数据"
      width="700px"
      class="stuImport"
      @close="close"
    >
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
    ...mapState('expendInfo', [
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
    ...mapMutations('expendInfo', [
      'SHOW_LOADING',
      'HIDE_LOADING',
      'UPDATE_STATE'
    ]),
    ...mapActions('expendInfo', [
      'isModelFile',
      'previewData',
      'iscompleteData',
      'importexpendComplete'
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
          0: 'orgName', // 支出部门
          1: 'spendTime', // 支出时间
          2: 'spendProject', // 支出项目
          3: 'amount', // 支出金额
          4: 'payWay', // 支付方式
          5: 'agentName', // 收款人
          6: 'collectName', // 经办人
          7: 'isInvoice', // 有无发票
          8: 'remark' // 备注
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
        this.importexpendComplete({ regex: this.regex, id: this.uploadId, close: this.close, refresh: this.refresh })
        // this.iscompleteData({ logFileId: this.uploadId })
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
      this.$emit('toParentEarnest')
    },

    /** 下载错误日志 */
    downloadErr() {
      exportFile(`${window.SS_CRM}/crm/org/spend/download/downloadFile`, { id: this.completeInfo.logFileId })
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
