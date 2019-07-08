<template>
  <div>
    <el-dialog
      :visible.sync="importDialogShow"
      title="潜在学员批量导入"
      width="700px"
      @close="close"
    >
      <el-alert
        :closable="false"
        :title="'提示：当前导入规则为'+rule"
        type="info"
      />
      <el-steps
        :active="active"
        align-center
        finish-status="success"
      >
        <el-step title="上传文件" />
        <el-step title="信息配对" />
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
      <SecondStep
        v-if="active === 1"
        ref="matchForm"
        :loading="loading"
        :field-list="fieldList"
        :data-source="dataSource"
        @didMount="() => {getSourceData({id: uploadId})}"
        @changeMatch="changeMatch"
      />
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
    ...mapState('lantentStu', [
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

  mounted() {
    this.getCheck()
  },

  methods: {
    ...mapMutations('lantentStu', [
      'SHOW_LOADING',
      'HIDE_LOADING',
      'UPDATE_STATE'
    ]),
    ...mapActions('lantentStu', [
      'isModelFile',
      'getSourceData',
      'previewData',
      'importData',
      'getCheck'
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
      if (this.active === 3 && this.flag) {
        this.active -= 2
      } else {
        this.active -= 1
      }
    },

    /** 下一步 */
    next() {
      if (this.active === 0) {
        this.UPDATE_STATE({ btnDisabled: true })
      } else if (this.active === 1) {
        const newRegex = {}
        for (const i in this.$refs.matchForm.regex) {
          newRegex[this.$refs.matchForm.regex[i]] = i
        }
        this.previewData({ regex: JSON.stringify(newRegex), id: this.uploadId })
      } else if (this.active === 3) {
        this.importData({ regex: this.regex, id: this.uploadId, close: this.close, refresh: this.refresh })
      }

      if (this.active === 0 && this.flag) {
        this.getSourceData({ id: this.uploadId })
        this.UPDATE_STATE({ btnDisabled: false })
        this.active += 2
      } else if (this.active !== 3) {
        this.active += 1
      }
    },

    /** 第二步配对表单change */
    changeMatch(regex) {
      if ((regex.name || regex.name === 0) && regex.firstParentName && regex.firstParentMobile) {
        this.UPDATE_STATE({ btnDisabled: false })
      }
    },

    /** 关闭完成弹窗 */
    closeComplete() {
      this.UPDATE_STATE({ completeVisible: false })
    },

    /** 下载错误日志 */
    downloadErr() {
      exportFile(`${window.SS_CRM}/crm/stuInfo/clue/leads/download/downloadByFileSys`, { id: this.completeInfo.logFileId })
    }
  }
}
</script>
