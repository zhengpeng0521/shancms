<template>
  <div>
    <el-dialog
      :visible.sync="importDialogShow"
      title="积分批量导入"
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
      <!-- <div class="upload_files_box">
        <div class="upload_input">
          <el-input
            clearable
            placeholder="请上传文件"
          />
        </div>
        <el-button
          size="mini"
          type="primary"
        >选择文件</el-button>
      </div>
      <div class="upload_tip">
        您可以下载<span>数据模板</span>来准备数据后上传，也可以上传添加自己的文件
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button type="primary">下一步</el-button>
      </span> -->
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
    ...mapState('integral', [
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
        return '导入'
      } else {
        return '下一步'
      }
    }
  },

  mounted() {
    this.getCheck()
  },

  methods: {
    ...mapMutations('integral', [
      'SHOW_LOADING',
      'HIDE_LOADING',
      'UPDATE_STATE'
    ]),
    ...mapActions('integral', [
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
      this.active -= 1
    },

    /** 下一步 */
    next() {
      if (this.active === 0 && this.flag) {
        this.UPDATE_STATE({ btnDisabled: false })
        const allRegex = {
          0: 'name',
          1: 'mobile',
          2: 'integralNum',
          3: 'remarks'
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
        const allRegex = {
          0: 'name',
          1: 'mobile',
          2: 'integralNum',
          3: 'remarks'
        }
        this.importData({ regex: JSON.stringify(allRegex), id: this.uploadId, close: this.close, refresh: this.refresh })
      }
      // console.log('next步---->', this.active)
      // if (this.active === 0) {
      //   this.UPDATE_STATE({ btnDisabled: true })
      // } else if (this.active === 1) {
      //   const newRegex = {}
      //   for (const i in this.$refs.matchForm.regex) {
      //     newRegex[this.$refs.matchForm.regex[i]] = i
      //   }
      //   this.previewData({ regex: JSON.stringify(newRegex), id: this.uploadId })
      // } else if (this.active === 3) {
      //   console.log('active-----3', this.active)
      //   this.importData({ regex: this.regex, id: this.uploadId, close: this.close })
      // }

      // if (this.active === 0 && this.flag) {
      //   console.log('======active0', this.active)
      //   const allRegex = {}
      //   for (const i in this.dataSource) {
      //     allRegex[this.dataSource[i]] = i
      //   }
      //   this.previewData({ regex: JSON.stringify(allRegex), id: this.uploadId })
      //   this.active += 2
      // } else if (this.active !== 3) {
      //   this.active += 1
      // }
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
      exportFile(`${window.SS_CRM}/crm/integral/excel/downloadByFiles`, { id: this.completeInfo.logFileId })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload_files_box {
  display: flex;
  justify-content: center;
  margin: 30px 0;
  .upload_input {
    width: 35%;
    margin-right: 10px;
  }
}
.upload_tip {
  font-size: 10px;
  text-align: center;
  span {
    color: #46b6ee;
    cursor: pointer;
  }
}
</style>

