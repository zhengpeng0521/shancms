<template>
  <div>
    <el-dialog
      :visible.sync="importDialogShow"
      title="合同批量导入"
    >
      <el-steps
        :active="active"
        align-center
        finish-status="success"
      >
        <el-step title="上传文件" />
        <el-step title="预览表格" />
        <el-step title="导入数据" />
      </el-steps>
      <div class="upload_files_box">
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
        您可以下载<span @click="download">数据模板</span>来准备数据后上传，也可以上传添加自己的文件
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button type="primary">下一步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { exportFile } from '@/utils/exportFile'
export default {
  components: {

  },
  data() {
    return {
      importDialogShow: false, // 是否导入弹框显隐
      active: 1 // 积分导入步骤条
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog() {
      this.importDialogShow = !this.importDialogShow
    },
    download() {
      exportFile(`${window.SS_CRM}/crm/stuInfo/clue/excel/downloadStuInfoModel`, { type: '30' })
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
  margin-bottom: 14px;
  span {
    color: #46b6ee;
    cursor: pointer;
  }
}
</style>

