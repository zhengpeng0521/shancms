
<template>
  <div class="integral_rule">

    <div style="text-align:end;margin-bottom: 14px;margin-right: 7px;">

      <el-button
        type="primary"
        @click="openDialog"
      >新增规则</el-button>
    </div>

    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="optionsTab"
      :operation="operates"
      :table-key="'orgSet_systemSet_integralRule_integralRule'"
    />

    <el-dialog
      :visible.sync="isOpenDialog"
      :title="dialogTitle"
    >

      <el-form
        v-if="isCont"
        ref="contData"
        :model="contData"
        label-width="100px"
        label-suffix="："
        class="ruleForm"
      >
        <!-- 连续上课加分---start -->
        <el-form-item label="加分规则">
          <el-input v-model="contData.data[0].c">

            <template slot="prepend">每月连续正常上课</template>

            <template slot="append">次及以上</template>

          </el-input>
        </el-form-item>

        <el-form-item>

          <el-input v-model="contData.data[0].v">

            <template slot="prepend">额外加</template>

            <template slot="append">分</template>

          </el-input>
        </el-form-item>
      </el-form>
      <!-- 连续上课加分---end -->

      <!-- 学员获得评价加分---start -->
      <el-form
        v-if="isStar"
        ref="starData"
        :model="starData"
        label-width="100px"
        label-suffix="："
        class="ruleForm"
      >

        <el-form-item
          v-for="(v,index) in starData.data"
          :key="v.key"
          :prop="'data.'+index+'.v'"
          :rules="{
            required: true, message: '加分不能为空', trigger: 'blur'
          }"
          :label="index=='0' ? '加分规则' : ''"
        >

          <el-input v-model="v.v">

            <template slot="prepend">{{ v.c }}星加</template>

            <template slot="append">分</template>

          </el-input>
        </el-form-item>
        <div class="starTip">
          上完课老师对每个学员做出综合考评之后，系统会自动赠送相应积分，填写0则不赠送
        </div>

        <!-- </el-form-item> -->
      </el-form>
      <!-- 学员获得评价加分---end-->
      <!-- 学员上课加分--start -->
      <el-form
        v-if="isCost"
        ref="costData"
        :model="costData"
        label-width="100px"
        label-suffix="："
        class="ruleForm"
      >

        <el-form-item
          label="加分规则"
          prop="ctype"
        >
          <el-radio-group v-model="costData.ctype">
            <el-radio label="cost">按消耗课时加分</el-radio>
            <el-radio label="tnum">按上课次数加分</el-radio>

          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="costData.ctype==='cost'">

          <el-input v-model="costData.data[0].c">

            <template slot="prepend">单次消耗每满</template>

            <template slot="append">课时</template>

          </el-input>
        </el-form-item>
        <el-form-item v-if="costData.ctype==='cost'">

          <el-input v-model="costData.data[0].v">

            <template slot="prepend">加</template>

            <template slot="append">分</template>

          </el-input>
        </el-form-item>

        <el-form-item v-if="costData.ctype==='tnum'">

          <el-input v-model="costData.data[0].v">

            <template slot="prepend">每上一次课，加</template>

            <template slot="append">分</template>

          </el-input>
        </el-form-item>

        <el-form-item>
          <span style="font-size:12px;color:#666666">
            学员正常出勤，且有课时消耗才会加分；<span v-if="costData.ctype==='cost'">不足部分，不折算，不积分 </span> </span>

        </el-form-item>
      </el-form>
      <!-- 学员上课加分--end-->

      <!-- 自定义类型-start -->
      <el-form
        v-if="isSelf"
        ref="selfData"
        :model="selfData"
        label-width="100px"
        label-suffix="："
        class="ruleForm"
      >

        <el-form-item
          label="类型"
          prop="incType"
        >
          <el-radio-group v-model="selfData.incType">
            <el-radio label="1">自定义加分规则</el-radio>
            <el-radio label="2">自定义减分规则</el-radio>

          </el-radio-group>
        </el-form-item>

        <el-form-item
          :rules="{
            required: true, message: '规则名称不能为空', trigger: 'blur'
          }"
          label="规则名称"
          prop="name"
        >
          <el-input
            v-model="selfData.name"
            placeholder="请输入规则名称"
          />
        </el-form-item>

        <el-form-item
          v-if="selfData.incType=='1'"
          :rules="{
            required: true, message: '加分规则不能为空', trigger: 'blur'
          }"
          prop="data[0].v"
          label="加分"
        >
          <el-input
            v-model="selfData.data[0].v"
            placeholder="请输入加分"
          />
        </el-form-item>

        <el-form-item
          v-if="selfData.incType=='2'"
          :rules="{
            required: true, message: '减分规则不能为空', trigger: 'blur'
          }"
          prop="data[0].v"
          label="减分"
        >
          <el-input
            v-model="selfData.data[0].v"
            placeholder="请输入减分"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="selfData.remark"
            type="textarea"
            placeholder="请输入备注内容"
          />
        </el-form-item>
      </el-form>
      <!-- 自定义类型-end-->

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelForm()"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm()"
        >保存并启用</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { queryRules, updateRules, addRules, deleteRules } from '@/api/orgSet/systemSet'
import CommonTable from '@/components/CommonTable/CommonTable'
export default {
  components: {
    CommonTable
  },
  data() {
    return {
      tempStatus: '2',
      rulesData: {
        name: '',
        direction: ''
      },

      starData: { data: [{ c: '', v: '' }] },

      contData: { data: [{ c: '', v: '' }] },
      selfData: { data: [{ c: '', v: '' }], incType: '1', name: '', remark: '' },
      costData: { data: [{ c: '', v: '' }] },
      switchFromItem: '',
      formDataName: '',
      switchDialog: false,
      isOpenDialog: false,
      dialogTitle: '',
      rules: {
        name: [
          { required: true, message: '请输入教室名称', trigger: 'blur' }
        ]
      },

      listQuery: {
        show: true // 是否显示
      },
      columns: [

        {
          label: '规则名称',
          prop: 'name',
          width: '150px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;word-break:break-all;">${row.name}</div>`
          },
          methods: (row) => {
            this.switchRules(row, row.status, 'edit')
          }
        },
        {
          label: '规则',
          prop: 'rule',
          width: '300px',
          align: 'center',
          // isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'hover', content: params.row.rule }
              }, [
                h('a', { slot: 'reference', style: 'color:#1D9DF2;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;word-break:break-all;' }, params.row.rule)
              ])
            ])
          }
        },
        {
          label: '备注',
          prop: 'remark',
          isShowTooltip: true
        },
        {
          label: '类型',
          prop: 'type',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.type === '1' ? '系统规则' : '自定义规则'}</div>`
          }
        },

        { label: '是否开启',
          prop: 'status',
          render: (h, params) => {
            return (
              <el-switch
                v-model={params.row.status}
                active-color='#46b6ee'
                active-value='1'
                inactive-value='2'
                inactive-color='#dcdfe6'
                nativeOnClick={this.switchRules.bind(this, params.row, params.row.status, 'switch')}>
              </el-switch>
            )
          }

        }

      ],
      optionsTab: {
        apiService: queryRules, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },

      operates: {
        width: '150',
        fixed: 'right',
        list: [

          {
            label: '删除',
            type: 'normal',
            method: (row) => {
              this.deleteItem(row)
            },
            popoverCon: [
              {
                contentText: '确定要删除吗？'
              }
            ]
          }
        ]
      },

      tableHeight: 'calc(100vh - 232px)'

    }
  },
  computed: {
    isStar: function() {
      return this.switchFromItem === 'star'
    },

    isCont: function() {
      return this.switchFromItem === 'cont'
    },

    isCost: function() {
      return this.switchFromItem === 'cost' || this.switchFromItem === 'tnum'
    },

    isSelf: function() {
      return this.switchFromItem === ''
    }

  },
  methods: {
    /** 打开新增 */
    openDialog() {
      this.isOpenDialog = true
      this.dialogTitle = '自定义规则'
      this.formDataName = 'selfData'
      this.switchFromItem = ''
      this.selfData = { data: [{ c: '', v: '' }], incType: '1', name: '', remark: '' }
    },
    openBussinessDialog() {
      this.switchDialog = true
    },

    /** 开关控制 */
    switchRules(val, value, type) {
      // 开关值
      if (type === 'edit') {
        this.tempStatus = '1'
      } else {
        this.tempStatus = value
      }

      if (value === '1' || type === 'edit') {
        if (type === 'switch') {
          // 暂未保存 还原开关状态
          val.status = '2'
        }
        this.isOpenDialog = true
        this.switchFromItem = val.ctype
        switch (val.ctype) {
          case 'star':
            this.dialogTitle = '学员获得平价加分'
            this.starData = val
            this.starData.data = JSON.parse(val.formatRule)
            this.formDataName = 'starData'
            break
          case 'cont':
            this.dialogTitle = '连续上课加分'
            this.contData = val
            this.contData.data = JSON.parse(val.formatRule)
            this.formDataName = 'contData'
            break
          case 'cost':
            this.dialogTitle = '学员上课加分'
            this.costData = val
            this.costData.data = JSON.parse(val.formatRule)
            this.formDataName = 'costData'
            break
          case 'tnum':
            this.dialogTitle = '学员上课加分'
            this.costData = val
            this.costData.data = JSON.parse(val.formatRule)
            this.costData.data[0].c = '1'
            this.formDataName = 'costData'
            break
          case '':
            this.dialogTitle = '修改规则'
            this.selfData = val
            this.selfData.data = JSON.parse(val.formatRule)
            this.formDataName = 'selfData'
            break
        }
      } else {
        const data = {
          ruleId: val.ruleId,
          status: value
        }
        updateRules(data).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success('保存成功')
            this.$refs.tableCommon.getList()
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      }
    },
    // 取消提交
    cancelForm() {
      this.isOpenDialog = false
      this.$refs[this.formDataName].resetFields()
    },

    // 确认提交
    submitForm() {
      this.$refs[this.formDataName].validate((valid) => {
        if (valid) {
          const data = {
            ruleId: this[this.formDataName].ruleId,
            rule: JSON.stringify(this[this.formDataName].data),
            status: this.tempStatus,
            ctype: this[this.formDataName].ctype,
            ruleName: this[this.formDataName].name,
            remark: this[this.formDataName].remark,
            incType: this[this.formDataName].incType

          }

          if (this.dialogTitle === '自定义规则') {
            addRules(data).then(res => {
              if (res.data.errorCode === 0) {
                this.$message.success('保存成功')
                this.cancelForm()
                this.$refs.tableCommon.getList()
              } else {
                this.$message.error(res.data.errorMessage)
              }
            })
          } else {
            updateRules(data).then(res => {
              if (res.data.errorCode === 0) {
                this.$message.success('保存成功')
                this.cancelForm()
                this.$refs.tableCommon.getList()
              } else {
                this.$message.error(res.data.errorMessage)
              }
            })
          }
        } else {
          return false
        }
      })
    },

    deleteItem(val) {
      const data = {
        ruleId: val.ruleId,
        status: '0'
      }
      deleteRules(data).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('删除成功')
          this.$refs.tableCommon.getList()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.integral_rule /deep/ {
  .el-dialog {
    width: 500px !important;
  }
  .el-dialog__body {
    margin-bottom: 14px;
  }
}
.starTip {
  font-size: 12px;
  color: #666666;
  padding-left: 80px;
  line-height: 24px;
}
.ruleForm /deep/ {
  .el-input--mini {
    width: 330px;
  }
}
</style>
