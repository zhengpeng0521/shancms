<template>
  <div class="attend">
    <div class="attend_main">

      <div class="attend_left">

        <div style="margin-bottom:20px"><span class="form_txt" />
          小票预览（示例）</div>

        <div class="attend_box">
          <transition name="slide-fade">
            <div
              v-if="isOrgName"
              class="attend_title"
            >
              闪闪早教中心

            </div>
          </transition>
          <div class="attend_content">

            <div class="attend_content_right">
              <div
                v-for="(item, index) in demoList"
                :key="'list'+index"
              >
                <transition name="slide-fade">
                  <div v-if="item.show">{{ item.content }}</div>
                </transition>
              </div>

              <transition name="slide-fade">
                <div
                  v-show="isrecBottom"
                  style="border-top: 1px solid #ddd;"
                >
                  <p
                    v-for="(dec, index) in decsArr"
                    :key="'dec'+index"
                  >{{ dec }}</p>
                </div>
              </transition>
            </div>
          </div>

        </div>
      </div>
      <div class="attend_right">
        <div style="margin-bottom:20px"><span class="form_txt" />
          请勾选需要打印的信息</div>

        <el-checkbox-group v-model="checkedItem">
          <el-checkbox
            v-for="item in attendanceData"
            :label="item.value"
            :key="item.index"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
        <el-input
          v-model="decs"
          :rows="5"
          style="padding-bottom: 25px;"
          type="textarea"
        />

        <div class="btn_group">
          <Confirm
            :is-button="true"
            :confirm="resetAttend"
            text="还原默认设置并保存"
            content="确定还原默认？"
            btn-class="btn_reset"
          />
          <el-button
            type="primary"
            @click="subAttend()"
          >
            保存
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { attendInfo, saveAttendInfo } from '@/api/orgSet/baseSet'
import Confirm from '@/components/MiniCommon/Confirm'

export default {
  components: {
    Confirm
  },
  data() {
    return {
      attendanceData: [],
      checkedItem: [],
      decs: '',
      defaultContent: '感谢选择了我们\r\n我们会和您一起为孩子创造一个美好的成长环境\r\n服务热线：0571-88888888'

    }
  },
  computed: {
    isStudentsName: function() {
      if (this.checkedItem.indexOf('stuName') !== -1) {
        return true
      } else {
        return false
      }
    },

    isOrgName: function() {
      if (this.checkedItem.indexOf('orgName') !== -1) {
        return true
      } else {
        return false
      }
    },
    isCourseName: function() {
      if (this.checkedItem.indexOf('courseName') !== -1) {
        return true
      } else {
        return false
      }
    },
    isAttendTime: function() {
      if (this.checkedItem.indexOf('attendTime') !== -1) {
        return true
      } else {
        return false
      }
    },
    isExpendPeriod: function() {
      if (this.checkedItem.indexOf('expendPeriod') !== -1) {
        return true
      } else {
        return false
      }
    },
    isPeriodLeft: function() {
      if (this.checkedItem.indexOf('periodLeft') !== -1) {
        return true
      } else {
        return false
      }
    },
    isMainTeacher: function() {
      if (this.checkedItem.indexOf('mainTeacher') !== -1) {
        return true
      } else {
        return false
      }
    },
    isAssTeacher: function() {
      if (this.checkedItem.indexOf('assTeacher') !== -1) {
        return true
      } else {
        return false
      }
    },
    isClassRoom: function() {
      if (this.checkedItem.indexOf('classRoom') !== -1) {
        return true
      } else {
        return false
      }
    },
    isSellerName: function() {
      if (this.checkedItem.indexOf('sellerName') !== -1) {
        return true
      } else {
        return false
      }
    },
    isrecBottom: function() {
      if (this.checkedItem.indexOf('recBottom') !== -1) {
        return true
      } else {
        return false
      }
    },
    // 实例
    demoList() {
      return [
        { show: this.isStudentsName, content: '学员姓名：张小宝' },
        { show: this.isCourseName, content: '课程名称：游泳课' },
        { show: this.isAttendTime, content: '上课时间：2017-12-12 16:00-17:00' },
        { show: this.isExpendPeriod, content: '消耗课时：1' },
        { show: this.isPeriodLeft, content: '剩余课时：10' },
        { show: this.isMainTeacher, content: '主教：李老师' },
        { show: this.isAssTeacher, content: '助教：高老师' },
        { show: this.isClassRoom, content: '教室：蓝房子' },
        { show: this.isSellerName, content: '所属销售：张三丰' }
      ]
    },

    decsArr() {
      // 处理换行符
      const newContent = this.decs.replace(/[\n\r]/g, '<br>')
      const arr = newContent.split('<br>')
      return arr
    }

  },
  mounted() {
    this.getAttendInInfo()
  },
  methods: {
    getAttendInInfo() {
      const data = {
        type: '0'
      }
      attendInfo(data).then(res => {
        if (res.data.errorCode === 0) {
          this.attendanceData = res.data.confArray
          this.defaultContent = res.data.defaultContent
          res.data.checkedConfArray.forEach(v => {
            this.checkedItem.push(v.value)
            if (v.value === 'recBottom') {
              this.decs = v.content
            }
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    // 还原初始化
    resetAttend() {
      const checks = []
      this.attendanceData.forEach((item) => {
        if (item.value === 'recBottom') {
          checks.push({ value: item.value, content: this.defaultContent })
        } else {
          checks.push({ value: item.value })
        }
      })

      const data = {
        type: '0',
        configArray: JSON.stringify(checks)
      }
      saveAttendInfo(data).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('保存成功！')
          this.getAttendInInfo()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 确认提交
    subAttend() {
      const arr = []
      for (const i in this.checkedItem) {
        const data = {
          value: this.checkedItem[i]
        }

        arr.push(data)
      }

      arr.forEach((v, i) => {
        if (v.value === 'recBottom') {
          arr[i].content = this.decs
        }
      })
      const data = {
        type: '0',
        configArray: JSON.stringify(arr)
      }
      saveAttendInfo(data).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('保存成功！')
          this.getAttendInInfo()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }
}
</script>
<style lang="scss" >
.attend {
  padding-bottom: 20px;
  max-height: calc(100vh - 148px);
  overflow: auto;

  .btn_group {
    display: flex;

    .btn_reset {
      margin-right: 10px;
    }
  }
  .attend_main {
    display: flex;
  }

  .attend_left {
    margin-right: 90px;
  }

  .attend_title {
    height: 40px;

    color: #666666;
    text-align: center;

    line-height: 30px;
    margin: 20px 20px 0px 20px;
    font-size: 24px;
    border-bottom: 1px solid #ddd;
  }

  .attend_box {
    border: 1px solid #dddddd;
    border-radius: 5px;
    overflow: hidden;
    width: 300px;
  }

  .attend_content {
    display: flex;
    font-size: 16px;
    line-height: 35px;
    color: #666666;
  }

  .attend_content_right {
    display: flex;
    flex-direction: column;
    margin: 20px;
  }

  .el-textarea {
    width: 355px !important;
    font-size: 16px;
  }
  .el-checkbox-group {
    font-size: 0;
    display: flex;
    flex-direction: column;
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }

  .el-checkbox {
    color: #666666;
    padding: 8px 12px;
  }
}
</style>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
