<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="修改信息"
    width="600"
    @close="cancel('ruleForm')"
  >
    <div class="updateInfo">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
      >
        <div class="form_left">
          <el-form-item
            label="标题："
            prop="cpTitle"
          >
            <el-input
              v-model="ruleForm.cpTitle"
              placeholder="请输入标题"
              style="width:150px"
            />
          </el-form-item>
          <el-form-item
            label="主教："
            prop="mtids"
          >
            <el-select
              v-model="ruleForm.mtids"
              multiple
              filterable
              placeholder="请选择主教"
              style="width:150px"
            >
              <el-option
                v-for="item in teachList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="教室："
            prop="roomId"
          >
            <el-select
              v-model="ruleForm.roomId"
              placeholder="请选择教室"
              style="width:150px"
              filterable
            >
              <el-option
                v-for="item in roomList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="上课时间："
            prop="startTime"
          >
            <el-time-picker
              v-model="ruleForm.startTime"
              format="HH:mm"
              value-format="HH:mm"
              style="width:150px"
              placeholder="上课时间"
            />
          </el-form-item>
        </div>
        <div class="form_right">
          <el-form-item
            label="颜色："
            prop="colorName"
          >
            <el-popover
              placement="bottom"
              width="202"
              trigger="click"
              popper-class="poperStyle"
            >
              <div class="colorChoose">
                <div
                  :style="{background:ruleForm.colorName}"
                  class="showColor"
                >
                  <div style="font-size: 18px; color: rgb(255, 255, 255); position: relative;"> {{ ruleForm.colorName }}</div>
                </div>
                <div style="padding:10px">
                  <div style="margin-right:-10px">
                    <div
                      v-for="(item, index) of colorList"
                      :key="index"
                      :style="{background:item}"
                      class="color_item"
                      @click="colorChange(item)"
                    />
                  </div>
                </div>
              </div>
              <div
                slot="reference"
                :style="{background:ruleForm.colorName}"
                :model="ruleForm.colorName"
                class="colorBtn"
              >可点击更改</div>
            </el-popover>
          </el-form-item>
          <el-form-item
            label="助教："
            prop="atids"
          >
            <el-select
              v-model="ruleForm.atids"
              multiple
              filterable
              placeholder="请选择助教"
              style="width:150px"
            >
              <el-option
                v-for="item in teachList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="最大人数："
            prop="maxNum"
          >
            <el-input
              v-model="ruleForm.maxNum"
              placeholder="请输入最大人数"
              style="width:150px"
            />
          </el-form-item>
          <el-form-item
            label="下课时间："
            prop="endTime"
          >
            <el-time-picker
              v-model="ruleForm.endTime"
              format="HH:mm"
              value-format="HH:mm"
              style="width:150px"
              placeholder="下课时间"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="cancel_btn"
        @click="cancel('ruleForm')"
      >取消</el-button>
      <el-button
        type="primary"
        @click="submit('ruleForm')"
      >确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { tenantUserSummaryQuery, updateArrangeInfo, queryClassroomList } from '@/api/teachManage/grade'
export default {
  data() {
    /* 校验最大人数*/
    var checkMaxNum = (rule, value, callback) => {
      if (!(/^[1-9][0-9]*$/.test(value))) {
        callback('只能输入正整数')
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false, // 弹窗显示
      ruleForm: {
        cpTitle: '', // 标题
        mtids: '', // 主教
        roomId: '', // 教室
        startTime: '', // 上课时间
        colorName: '#1dafe4', // 颜色
        atids: '', // 助教
        maxNum: '', // 最大人数
        endTime: '' // 下课时间
      },
      rules: {
        cpTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        mtids: [
          { required: true, message: '请选择主教', trigger: 'blur' }
        ],
        roomId: [
          { required: true, message: '请选择教室', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择上课时间', trigger: 'blur' }
        ],
        colorName: [
          { required: true, message: '请选择颜色', trigger: 'blur' }
        ],
        maxNum: [
          { required: true, message: '请输入最大人数', trigger: 'blur' },
          { validator: checkMaxNum }
        ],
        endTime: [
          { required: true, message: '请选择下课时间', trigger: 'blur' }
        ]
      },
      colorList: [
        '#523d87', '#8e4090', '#db3387', '#e776c8', '#7976e7',
        '#1dafe4', '#0b7a3b', '#169f4e', '#97c24a', '#fbbc3c',
        '#e76d39', '#d62436', '#d9c585', '#9e612f', '#772c1d'
      ], // 颜色列表
      teachList: [], // 教师列表
      roomList: [], // 教室列表
      rowInfo: {} // 该条信息
    }
  },
  methods: {
    show(val) {
      this.rowInfo = val
      this.dialogVisible = true
      this.getUserlist()
      this.getClassroomList()
      this.ruleForm.cpTitle = val.cpTitle
      this.ruleForm.colorName = val.color
      const mtids = val.mtids && val.mtids.split(',')
      if (mtids && mtids.length > 0) {
        this.ruleForm.mtids = mtids
      }

      const assistantTeacherIds = val.atids && val.atids.split(',')
      if (assistantTeacherIds && assistantTeacherIds.length > 0) {
        this.ruleForm.atids = assistantTeacherIds
      }

      this.ruleForm.roomId = val.roomId
      this.ruleForm.maxNum = val.maxNum
      this.ruleForm.startTime = val.startTime
      this.ruleForm.endTime = val.endTime
    },
    /* 颜色选择 */
    colorChange(val) {
      this.ruleForm.colorName = val
    },
    /* 获取教室列表 */
    getClassroomList() {
      const params = {
        status: '1'
      }
      queryClassroomList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.roomList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取教室列表失败')
        }
      })
    },
    /* 获取员工列表 */
    getUserlist() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.teachList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取员工列表失败')
        }
      })
    },
    cancel(formName) {
      this.dialogVisible = false
      this.$refs[formName].clearValidate() // 清除校验
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const mtids = this.ruleForm.mtids ? this.ruleForm.mtids.join(',') : ''
          const atids = this.ruleForm.atids ? this.ruleForm.atids.join(',') : ''
          for (const i in this.ruleForm.mtids) {
            for (const j in this.ruleForm.atids) {
              if (this.ruleForm.mtids[i] === this.ruleForm.atids[j]) {
                this.$message.error('主教和助教不能包含同一人')
                return
              }
            }
          }
          const params = {
            cpmId: this.rowInfo.cpmId,
            cpdIds: this.rowInfo.cpdId,
            title: this.ruleForm.cpTitle,
            mtids: mtids,
            atids: atids,
            color: this.ruleForm.colorName,
            roomId: this.ruleForm.roomId,
            maxNum: this.ruleForm.maxNum,
            startTime: this.ruleForm.startTime,
            endTime: this.ruleForm.endTime
          }
          updateArrangeInfo(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.dialogVisible = false
              this.$message.success(data.errorMessage)
            } else {
              this.$message.error(data.errorMessage || '修改排课信息失败')
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.updateInfo {
  .form_left,
  .form_right {
    width: 49%;
    vertical-align: top;
    display: inline-block;
  }
}
.colorChoose {
  width: 180px;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px;
  border-radius: 6px;
  position: relative;
  padding: 0 4px;
  .showColor {
    height: 110px;
    border-radius: 6px 6px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .color_item {
    width: 22px;
    height: 22px;
    cursor: pointer;
    position: relative;
    margin: 0 10px 10px 0;
    border-radius: 4px;
    display: inline-block;
  }
}
.colorBtn {
  width: 150px;
  height: 30px;
  border-radius: 5px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  line-height: 30px;
}
</style>
