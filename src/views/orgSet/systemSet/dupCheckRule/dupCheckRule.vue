<template>
  <div>

    <p style="margin-bottom:14px;">

      <span class="form_txt" />
      潜在学员

    </p>
    <div class="table_box">

      <table
        border="1"
        width="700"
      >
        <!-- <tr>
        <th>模块名称</th>
        <th>状态</th>
      </tr> -->
        <tr>
          <td width="300"> 查重范围</td>
          <td width="400">查重规则</td>
        </tr>
        <tr>
          <td width="300">
            <div>
              <span class="label_title">
                单条添加 :
              </span>
              <el-radio-group v-model="singRadio">
                <el-radio :label="0">校区</el-radio>
                <el-radio :label="1">商户</el-radio>
              </el-radio-group>

            </div>
          </td>
          <td
            width="400"
            rowspan="2"
          >
            <el-checkbox
              :checked="true"
              class="multipleSelect"
              disabled
            >手机号和姓名都不重复，则导入该学员信息（默认）</el-checkbox>
            <div style="text-align:left">
              <el-radio-group
                v-model="multipleRadio"
                class="dupCheckBox"
              >
                <el-radio
                  label="any"
                  class="first"
                >姓名、手机号任一不重复，则导入该学员信息（推荐）</el-radio>
                <el-radio
                  style="line-height:32px"
                  label="mobile"
                >手机号不重复，则导入该学员信息</el-radio>
                <el-radio label="name">姓名不重复，则导入该学员信息</el-radio>
              </el-radio-group>
            </div>
          </td>
        </tr>
        <tr>
          <td width="300">
            <div>
              <span class="label_title">
                手动导入 :
              </span>
              <el-radio-group v-model="manualRadio">
                <el-radio label="0">校区</el-radio>
                <el-radio label="1">商户</el-radio>
              </el-radio-group>

            </div>
          </td>
        </tr>

      </table>

    </div>
    <p style="margin: 20px 0 14px 0;">

      <span class="form_txt" />
      在读学员

      <el-popover
        placement="right"
        width="400"
        trigger="hover"
      >
        <div>
          <p>Q: 如何学员界定已存在？</p>
          <p>A: 姓名、电话号码都一致</p>
          <p> Q: 一个学员绑定多个电话号码的如何处理？</p>
          <p> A: 姓名一致、电话号码任一 一致即可定义为学员已存在"</p>
        </div>
        <i
          slot="reference"
          class="el-icon-question"
        />
      </el-popover>

    </p>
    <div class="SeatedStuBox">
      <p>1. 潜在学员不存在，在读学员不存在——创建在读学员，并导入合同信息</p>
      <p>2. 潜在学员不存在，在读学员已存在——只导入合同信息</p>
      <p>3. 潜在学员已存在，在读学员不存在——将潜在学员转为在读学员，并导入合同信息</p>
    </div>
    <div style="margin-top:20px">

      <el-button
        type="primary"
        @click="saveRules"
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { clueDupCheckInfo, saveDupCheckInfo } from '@/api/orgSet/systemSet'
export default {

  data() {
    return {
      singRadio: '',
      manualRadio: '',
      multipleRadio: ''
    }
  },
  mounted() {
    clueDupCheckInfo().then(res => {
      if (res.data.errorCode === 0) {
        this.manualRadio = res.data.batchScope
        this.singRadio = res.data.single.scope
        this.multipleRadio = res.data.single.checkedConfArray
      } else {
        this.$message.error(res.data.errorMessage)
      }
    })
  },
  methods: {
    saveRules() {
      const data = {
        batchScope: this.manualRadio,
        singleScope: String(this.singRadio),
        confArray: this.multipleRadio
      }
      saveDupCheckInfo(data).then(res => {
        if (res.data.errorCode === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
}

table,
td,
th {
  border: 1px solid #ccc;
}

.table_box {
  border-radius: 5px;
  overflow: hidden;
  border: 0.1px solid #ccc;
  /* width: 100%; */
  width: 700px;
}
.SeatedStuBox p {
  line-height: 14px;
  height: 14px;
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

th {
  height: 40px;
}
td {
  height: 50px;
  text-align: center;
}

.el-checkbox-group {
  display: inline-block;
}

.label_title {
  display: inline-block;
  margin-left: -45px;
}
</style>
<style lang="scss">
.dupCheckBox {
  margin-left: 5px;
  margin-top: 5px;
}
.first .el-radio__input {
  margin-left: 30px;
}
.multipleSelect {
  margin-left: -35px;
}
</style>

