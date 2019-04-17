<template>
  <div class="print">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="补办考勤小票"
      width="600px"
      @close="cancel"
    >
      <div style="margin-bottom:14px">
        <el-form label-width="100px">
          <div class="teacher_area">
            <el-form-item label="主教：">
              <el-select
                v-model="mtids"
                multiple
                disabled
              >
                <el-option
                  v-for="item in teacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="助教：">
              <el-select
                v-model="atids"
                multiple
                disabled
              >
                <el-option
                  v-for="item in teacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="上课时间：">
            <el-input
              v-model="studyTime"
              placeholder="请填写上课时间"
              disabled
            />
          </el-form-item>
          <div class="status_legend">
            <div class="common_status_legendundefined">
              <i class="el-icon-check" />
              <span>出勤，可补办</span>
            </div>
            <div class="common_status_legendundefined">
              <i class="el-icon-close" />
              <span>未考勤，无法补办</span>
            </div>
          </div>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            style="margin-bottom:20px"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <el-form-item class="check">
            <el-checkbox-group
              v-model="checkStu"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="(item, index) in unCheckList"
                :label="item"
                :key="index"
                :disabled="item.sign_type == '3'? false: true"
              >{{ item.stuName + '：' }}
                <div class="checkbox_item">
                  <div
                    v-if="item.stu_type == '1'"
                    class="status_flag"
                  >
                    <div class="stuClass" />
                    <div>上课</div>
                  </div>
                  <div
                    v-else-if="item.stu_type == '2'"
                    class="status_flag"
                  >
                    <div class="missClass" />
                    <div>补课</div>
                  </div>
                  <div
                    v-else
                    class="status_flag"
                  >
                    <div class="tryClass" />
                    <div>试听</div>
                  </div>
                </div>
                <div class="common_status_legendundefined">
                  <i
                    v-if="item.sign_type == '3'"
                    class="el-icon-check"
                  />
                  <i
                    v-else
                    class="el-icon-close"
                    style="color:#d0021b"
                  />
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-form
          style="display:inline-block;margin-right:10px"
          label-width="100px"
        >
          <el-form-item style="margin-bottom:0">
            <el-popover
              placement="right"
              width="350"
              trigger="hover"
            >
              <div style="font-size:12px">
                <div>1.学员只有处于出勤状态才可以补办考勤小票</div>
                <div>2.处于试听、未出勤、旷课、请假、取消状态都无法补办小票</div>
                <div>3.补办功能无时间限制，比如今天可以补办以前的小票</div>
                <div>4.可多选进行打印，点击打印，可以把考勤小票打印出来</div>
              </div>
              <i
                slot="reference"
                class="el-icon-question"
                style="color:#46b6ee;font-size:1.2rem"
              />
            </el-popover>
          </el-form-item>
        </el-form>
        <el-button
          class="cancel_btn"
          @click="cancel"
        >取消</el-button>
        <el-button
          type="primary"
          @click="print"
        >打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { printQuery } from '@/api/teachManage/attendance'
import { lodopPrintAttendance } from '@/utils/lodopPrintUtils' //eslint-disable-line
export default {
  props: {
    teacherList: {
      type: Array,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      mtids: [], // 主教
      atids: [], // 助教
      studyTime: '', // 上课时间
      checkAll: false, // 是否全选
      checkStu: [], // 选择某个学员
      unCheckList: [], // 尚未选中的全部数据
      ableCheckList: [], // 可考勤的
      checkList: [], // 可考勤的复制
      isIndeterminate: false,
      ticketList: {} // 小票数据
    }
  },
  methods: {
    show(row) {
      this.checkList = []
      const params = {
        cpdId: row.cpdId,
        cpmId: row.cpmId
      }
      printQuery(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.ticketList = data
          if (this.ticketList) {
            this.dialogVisible = true
            /* 主教处理 */
            this.mtids = []
            if (this.ticketList.mtids) {
              const mtids = this.ticketList.mtids && this.ticketList.mtids.split(',')
              this.mtids = mtids
            }
            /* 助教处理 */
            this.atids = []
            if (this.ticketList.atids) {
              const atids = this.ticketList.atids && this.ticketList.atids.split(',')
              this.atids = atids
            }
            if (this.ticketList.startTime && this.ticketList.endTime) {
              this.studyTime = this.ticketList.startTime + '~' + this.ticketList.endTime
            }
            this.unCheckList = []
            if (this.ticketList.stuArr && this.ticketList.stuArr.length > 0) {
              this.unCheckList = this.ticketList.stuArr
            }
            if (this.ticketList.mulStuArr && this.ticketList.mulStuArr.length > 0) {
              this.unCheckList = this.unCheckList.concat(this.ticketList.mulStuArr)
            }
            if (this.ticketList.tryStuArr && this.ticketList.tryStuArr.length > 0) {
              this.ticketList.tryStuArr.map((item, index) => {
                item.stuName = item.name
              })
              this.unCheckList = this.unCheckList.concat(this.ticketList.tryStuArr)
            }
            this.unCheckList.map((item, index) => {
              if (item.sign_type == '3') { //eslint-disable-line
                this.ableCheckList.push(item)
                this.checkList = Object.assign([], this.ableCheckList)
              }
            })
          }
        } else {
          this.$message.error(data.errorMessage || '获取小票信息失败')
        }
      })
    },
    /* 全选 */
    handleCheckAllChange(val) {
      this.checkStu = val ? this.checkList : []
      this.isIndeterminate = false
    },
    /* 选择任意一个 */
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.ableCheckList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.ableCheckList.length
    },
    /* 取消 */
    cancel() {
      this.dialogVisible = false
      this.checkStu = []
      this.checkAll = false
      this.isIndeterminate = false
    },
    /* 打印 */
    print() {
      if (this.checkList && this.checkList.length > 0) {
        if (this.checkStu && this.checkStu.length > 0) {
          const obj = { checkedConfArray: this.ticketList.checkedConfArray, content: [] }
          this.checkStu.map((item, index) => {
            obj.content.push(item)
          })
          lodopPrintAttendance(obj)
        } else {
          this.$message.error('无学员信息可打印')
        }
      } else {
        this.$message.error('无学员信息可打印')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.print /deep/ {
  .el-dialog__body {
    height: 500px;
  }
}
.teacher_area {
  display: flex;
  flex-wrap: nowrap;
}
.status_legend {
  border-top: 1px solid rgb(221, 221, 221);
  padding-top: 10px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  box-align: center;
  -webkit-box-pack: center;
  justify-content: center;
  margin-bottom: 5px;
  .common_status_legendundefined:last-child {
    margin-right: 0;
    i {
      color: #d0021b;
    }
  }
  .common_status_legendundefined {
    display: inline-flex;
    margin-right: 20px;
    flex-wrap: nowrap;
    -webkit-box-align: center;
    align-items: center;
    i {
      color: #87d068;
      margin-right: 5px;
      font-weight: 600;
    }
  }
}
.check /deep/ {
  .el-form-item__content {
    margin-left: 0 !important;
  }
  .el-checkbox__label {
    display: inline-block;
    width: 535px;
  }
  .el-checkbox {
    display: block;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }
}
.common_status_legendundefined {
  float: right;
  i {
    color: #87d068;
    margin-right: 5px;
    font-weight: 600;
  }
}
.checkbox_item {
  display: inline-flex;
  flex-wrap: nowrap;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  .status_flag {
    display: inline-flex;
    padding: 3px 5px;
    color: #666;
    flex-wrap: nowrap;
    -webkit-box-align: center;
    align-items: center;
  }
  .stuClass,
  .missClass,
  .tryClass {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #46b6ee;
    margin-right: 6px;
  }
  .missClass {
    background: #87d068;
  }
  .tryClass {
    background: #f5a623;
  }
}
</style>
