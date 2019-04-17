<template>
  <div>
    <p class="title_box">

      <span class="form_txt" />
      考勤扣课规则

    </p>

    <div class="text">
      <p><span>提示：</span></p>
      <p><span>1、扣除课时数量由课程设置决定</span></p>
      <p><span>2、若请假扣除课时，则补课不扣课时；相反，若请假不扣除课时，则补课扣课时。</span></p>

    </div>
    <table border="1">
      <tr>
        <th>考勤类型</th>
        <th>是否扣课时</th>
      </tr>
      <tr>
        <td>出勤</td>
        <td>
          <el-radio-group v-model="attendData[0].value">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>

        </td>
      </tr>
      <tr>
        <td>请假</td>
        <td>
          <el-radio-group v-model="attendData[1].value">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>

        </td>
      </tr>
      <tr>
        <td>旷课</td>
        <td>
          <el-radio-group v-model="attendData[2].value">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>

        </td>
      </tr>

    </table>

    <p
      style="margin-top:20px"
      class="title_box"
    >

      <span class="form_txt" />
      托班请假设置
    </p>

    <el-radio-group
      v-model="attendData[attendData.length - 1].value"
      class="radioBlock"
    >
      <el-radio label="1">一律不延期</el-radio>
      <el-radio label="0"> 假期天数大于等于
        <el-input
          v-model="attendData[attendData.length - 1].postpone"
          style="width:100px"
      />天,则将合同结束日期延长所请假天数</el-radio>
    </el-radio-group>

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
import { saveConf, queryByKey } from '@/api/orgSet/systemSet'
export default {

  data() {
    return {
      radio: 1,
      attendData: [
        { value: '1', text: '出勤' },
        { value: '1', text: '请假' },
        { value: '1', text: '旷课' },
        { value: '1', text: '托班请假设置' }
      ]
    }
  },

  mounted() {
    this.getRules()
  },
  methods: {
    getRules() {
      const data = {

        confKey: 'DEDUCTCOST'
      }
      queryByKey(data).then(res => {
        if (res.data.errorCode === 0) {
          this.attendData = res.data.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    saveRules() {
      const data = {
        value: JSON.stringify(this.attendData),
        confKey: 'DEDUCTCOST'
      }

      saveConf(data).then(res => {
        if (res.data.errorCode === 0) {
          this.getRules()
          this.$message.success(res.data.errorMessage)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.title_box {
  margin-bottom: 14px;
  color: #333333;
}
table {
  border-collapse: collapse;
}

table,
td,
th {
  border: 1px solid #ccc;
}

table {
  width: 600px;
}
th {
  height: 40px;
}
td {
  height: 40px;
  text-align: center;
}

p {
  line-height: 22px;
  color: #666666;
}

.text {
  margin-bottom: 10px;
}
.radioBlock {
  .el-radio,
  .el-radio__inner,
  .el-radio__input {
    display: block;
    line-height: 28px;
  }
  .el-radio + .el-radio {
    margin-left: 0;
  }
}
</style>
