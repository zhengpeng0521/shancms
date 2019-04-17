<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="批量约课"
      width="1025px"
      @close="cancel"
    >
      <div>
        <div class="batch_order_tips">
          <p>第一步 : 请选择【开始】与【结束】时间</p>
          <p>第二步 : 列表数据中选择具体课程</p>
          <p>第三步 : 最后点击【提交】</p>
        </div>
        <div class="batch_course_info">
          <div class="batch_course_info_head">课程信息</div>
          <div class="classInfo">
            <p>课程名称：<span>{{ detailList.courseName }}</span></p>
            <p>星期：<span>{{ detailList.weekDay }}</span></p>
          </div>
          <div class="batch_course_info_head">预约周期</div>
          <el-form
            :inline="true"
            class="batch_course_time"
          >
            <el-form-item
              label="开始："
              prop="startDate"
              class="batch_course_time_item"
              style="margin-bottom: 0;"
            >
              <el-date-picker
                v-model="startDate"
                :picker-options="pickerOptions"
                type="date"
                placeholder="开始日期"
                value-format="yyyy-MM-dd"
                style="width:140px"
                @change="startDateChange"
              />
            </el-form-item>
            <el-form-item
              label="结束："
              prop="endDate"
              class="batch_course_time_item"
              style="margin-bottom: 0;"
            >
              <el-date-picker
                v-model="endDate"
                :picker-options="pickerOptions"
                type="date"
                placeholder="结束日期"
                value-format="yyyy-MM-dd"
                style="width:140px"
                @change="endDateChange"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="batch_order_vip_info">
          <div class="batch_course_info_head">会员信息</div>
          <div style="padding:10px 10px">
            <el-radio-group
              v-model="orderType"
              style="margin-bottom:10px"
            >
              <el-radio label="1">预约学员</el-radio>
              <el-radio label="2">预约班级</el-radio>
            </el-radio-group>
            <div v-show="orderType == '1'">
              <el-form>
                <el-form-item label="会员名：">
                  <el-select
                    v-model="memberName"
                    filterable
                    placeholder="请选择会员名"
                    style="width:140px"
                    @change="stuIdChange"
                  >
                    <el-option
                      v-for="item in newStuList"
                      :key="item.stuId"
                      :label="item.stuName"
                      :value="item.stuId"
                    />
                  </el-select>
                  <span
                    class="search"
                    @click="actSearch"
                  >精确查找</span>
                </el-form-item>
              </el-form>
              <p>会员卡号：<span>{{ cardInfo.cardId }}</span></p>
              <p>可用课时：
                <span style="margin-left:4px">通用：{{ (cardInfo.periodTime) || 0.00 }}</span>
                <span style="margin-left:8px">专用：{{ (cardInfo.periodCourseTime) || 0.00 }}</span>
              </p>
              <p>使用课时：<span>{{ (cardInfo.periodExpend) || 0.00 }}</span></p>
              <p>预计剩余：
                <span style="margin-left:4px">通用：{{ common || 0.00 }}</span>
                <span style="margin-left:8px">专用：{{ special || 0.00 }}</span>
              </p>
            </div>
            <div v-show="orderType == '2'">
              <el-form
                ref="ruleForm"
                :rules="rules"
                :model="ruleForm"
                label-width="80px"
              >
                <el-form-item
                  label="班级名称："
                  prop="grade"
                >
                  <el-select
                    v-model="ruleForm.grade"
                    placeholder="请选择班级名称"
                    style="width:160px"
                    @change="gradeChange"
                  >
                    <el-option
                      v-for="item in gradeList"
                      :key="item.clsId"
                      :label="item.clsName"
                      :value="item.clsId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="班级成员：">
                  <div
                    v-if="ruleForm.grade"
                    class="class_order_stu_list"
                  >
                    <div
                      v-for="item of gradeStuList"
                      :key="item.stuId"
                      class="class_order_stu_list_item"
                    >{{ item.name }}（可用课时：{{ item.periodAvailable }}）</div>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div style="margin-bottom:14px">
          <CommonTable
            ref="tableCommon"
            :columns="columns"
            :table-height="tableHeight"
            :pagination="listQuery"
            :options="options"
            @handleSelectionChange="selectionChange"
          />
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-form
          style="display:inline-block;margin-right:150px"
          label-width="100px"
        >
          <el-form-item
            label="是否固定位："
            style="margin-bottom:0"
          >
            <el-radio-group v-model="fix">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-button
          class="cancel_btn"
          @click="cancel"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submit"
        >确定</el-button>
      </div>
    </el-dialog>
    <SingleSelectStu
      v-if="isShow"
      ref="singleSelect"
      :options="optionSelect"
      @toParent="getCheckData"
      @toClose="close"
    />
    <!-- 预约异常 -->
    <OrderError ref="orderError" />
    <!-- 是否继续约课 -->
    <OrderCourseContinue
      ref="orderCourseContinue"
      @toContinueOrder="getContinueOrder"
    />
  </div>
</template>
<script>
import CommonTable from '@/components/CommonTable/CommonTable'
import SingleSelectStu from './singleSelectStu'
import OrderError from './orderError'
import {
  queryArrageCourseList,
  stuSummaryQuery,
  classGradeSummary,
  queryClassStuList,
  cardSummaryPeriodByStuId,
  stuCreate,
  stuCheckBirthday,
  gradeBatchCreate
} from '@/api/teachManage/orderCourse'
import { queryCRMStuList } from '@/api/teachManage/grade'
import OrderCourseContinue from './orderCourseContinue'
export default {
  components: {
    CommonTable,
    SingleSelectStu,
    OrderError,
    OrderCourseContinue
  },
  data() {
    return {
      dialogVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      isShow: false, // 精确查找显示
      startDate: this.$moment().format('YYYY-MM-DD'), // 开始日期
      endDate: this.$moment().format('YYYY-MM-DD'), // 结束日期
      orderType: '1', // 预约类型
      memberName: '', // 会员名
      ruleForm: {
        grade: ''
      },
      rules: {
        grade: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ]
      },
      fix: '0',
      columns: [
        {
          label: '日期',
          prop: 'studyDate',
          isShowTooltip: true,
          width: '130',
          formatter: (row, column, cellValue) => {
            return `<div>${row.studyDate} ${
              row.weekDay
            }</div>`
          },
          methods: row => {
            this.toOrderCourseDetail(row)
          }
        },
        {
          label: '时间段',
          prop: 'rangeTime',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.startTime} ~ ${row.endTime}</div>`
          }
        },
        {
          label: '课程名称',
          prop: 'courseName',
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '主教',
          prop: 'mtNames',
          width: '100',
          isShowTooltip: true
        },
        {
          label: '助教',
          prop: 'atNames',
          width: '100',
          isShowTooltip: true
        },
        {
          label: '教室',
          prop: 'roomName',
          isShowTooltip: true
        },
        {
          label: '消耗课时',
          prop: 'cost',
          width: '90',
          isShowTooltip: true
        },
        {
          label: '上课人数',
          prop: 'num',
          width: '90',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.maxAttNum == '-1') { //eslint-disable-line
              return `<div>${row.num}</div>`
            } else {
              return `<div>${row.num}/${row.maxAttNum}</div>`
            }
          }
        },
        {
          label: '试听人数',
          prop: 'tryNum',
          width: '90',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.maxTryNum == '-1') { //eslint-disable-line
              return `<div>${row.tryNum}</div>`
            } else {
              return `<div>${row.tryNum}/${row.maxTryNum}</div>`
            }
          }
        }
      ],
      tableHeight: 'calc(100vh - 715px)',
      listQuery: {
        show: false
      },
      optionSelect: {
        // apiService: getStuChooseList
      },
      options: {
        mutiSelect: true
      },
      newStuList: [], // 学员列表
      gradeList: [], // 班级列表
      detailList: {}, // 详细信息
      cardInfo: {}, // 会员卡的课时信息
      special: 0, // 专用
      common: 0, // 通用
      gradeStuList: [], // 班级学员列表
      checkList: [] // 勾选的项
    }
  },
  watch: {
    orderType(val) {
      this.ruleForm.grade = ''
      if (val == '2') { //eslint-disable-line
        this.$refs['ruleForm'].clearValidate()
      }
    }
  },
  methods: {
    show(val, detailList) {
      this.cardInfo = {}
      this.common = 0
      this.special = 0
      this.detailList = detailList
      this.startDate = this.detailList.studyDate
      this.endDate = this.detailList.studyDate
      if (detailList) {
        this.options.apiService = queryArrageCourseList
        this.options.params = {
          courseId: detailList.courseId,
          cpmId: detailList.cpmId,
          startDate: detailList.studyDate,
          endDate: detailList.studyDate,
          pageSize: 99999,
          pageIndex: 0
        }
        this.getGradeList()
        this.getStuList()
      }
      this.dialogVisible = true
      this.orderType = '1'
      if(this.orderType == '2') { //eslint-disable-line
        this.$refs['ruleForm'].resetFields()
      } else {
        this.memberName = ''
      }
    },
    /* 精确查找 */
    actSearch() {
      this.isShow = true
      let list = []
      if (this.memberName) {
        const params = {
          type: '2'
        }
        queryCRMStuList(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            list = data.results
            list.map(item => {
            if (item.id == this.memberName) { //eslint-disable-line
                this.$nextTick(() => {
                  this.$refs.singleSelect.show(item.name)
                })
              }
            })
          }
        })
      } else {
        this.$nextTick(() => {
          this.$refs.singleSelect.show()
        })
      }
    },
    close(val) {
      this.isShow = val
    },
    /* 表格勾选 */
    selectionChange(val) {
      this.checkList = val
    },
    /* 获取选中的会员 */
    getCheckData(val) {
      this.memberName = val
      const params = {
        stuId: val,
        courseId: this.detailList.courseId
      }
      cardSummaryPeriodByStuId(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.cardInfo = data.data
          const table = this.$refs.tableCommon.tableData
          const cutType = table && table[0].cutType
          this.common = this.cardInfo && this.cardInfo.periodTime && this.cardInfo.periodTime || 0
          this.special = this.cardInfo && this.cardInfo.periodCourseTime && this.cardInfo.periodCourseTime || 0
          if (cutType == '1') { //eslint-disable-line
            this.special = this.cardInfo && this.cardInfo.periodCourseTime && (this.cardInfo.periodCourseTime - this.cardInfo.periodExpend) || 0
          } else {
            if (this.special > 0) {
              this.special = this.cardInfo && this.cardInfo.periodCourseTime && (this.cardInfo.periodCourseTime - this.cardInfo.periodExpend) || 0
              if (this.special < 0) {
                this.common = this.cardInfo && this.cardInfo.periodTime && (this.cardInfo.periodTime + this.special) || 0
                this.special = 0
              }
            } else if (this.special <= 0) {
              this.common = this.cardInfo && this.cardInfo.periodTime && (this.cardInfo.periodTime - this.cardInfo.periodExpend) || 0
            }
          }
        } else {
          this.$message.error(data.errorMessage || '课时信息失败')
        }
      })
    },
    /* 取消 */
    cancel() {
      this.dialogVisible = false
      this.$refs.tableCommon.clearSelection()
    },
    /* 开始日期改变 */
    startDateChange(val) {
      const params = {
        courseId: this.detailList.courseId,
        cpmId: this.detailList.cpmId,
        startDate: val,
        endDate: this.endDate,
        pageSize: 99999,
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 结束日期改变 */
    endDateChange(val) {
      const params = {
        courseId: this.detailList.courseId,
        cpmId: this.detailList.cpmId,
        startDate: this.startDate,
        endDate: val,
        pageSize: 99999,
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 学员查询 */
    stuIdChange(val) {
      const params = {
        stuId: val,
        courseId: this.detailList.courseId
      }
      cardSummaryPeriodByStuId(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.cardInfo = data.data
          const table = this.$refs.tableCommon.tableData
          const cutType = table && table[0].cutType
          this.common = this.cardInfo && this.cardInfo.periodTime && this.cardInfo.periodTime || 0
          this.special = this.cardInfo && this.cardInfo.periodCourseTime && this.cardInfo.periodCourseTime || 0
          if (cutType == '1') { //eslint-disable-line
            this.special = this.cardInfo && this.cardInfo.periodCourseTime && (this.cardInfo.periodCourseTime - this.cardInfo.periodExpend) || 0
          } else {
            if (this.special > 0) {
              this.special = this.cardInfo && this.cardInfo.periodCourseTime && (this.cardInfo.periodCourseTime - this.cardInfo.periodExpend) || 0
              if (this.special < 0) {
                this.common = this.cardInfo && this.cardInfo.periodTime && (this.cardInfo.periodTime + this.special) || 0
                this.special = 0
              }
            } else if (this.special <= 0) {
              this.common = this.cardInfo && this.cardInfo.periodTime && (this.cardInfo.periodTime - this.cardInfo.periodExpend) || 0
            }
          }
        } else {
          this.$message.error(data.errorMessage || '课时信息失败')
        }
      })
    },
    /* 班级改变 */
    gradeChange(val) {
      const params = {
        clsId: val,
        pageIndex: 0,
        pageSize: 99999
      }
      queryClassStuList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.gradeStuList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取班级学员失败')
        }
      })
    },
    /* 学员列表 */
    getStuList() {
      this.newStuList = []
      stuSummaryQuery({ type: '2' }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          const stuList = data.results
          stuList.map((item, index) => {
            const stuObj = {}
            let name = ''
            if (this.detailList.courseAgeType == '1') { //eslint-disable-line
              name = item.stuName + '(' + item.month + '月)'
            } else {
              name = item.stuName + '(' + Math.floor(item.month / 12) + '岁)'
            }
            stuObj.stuName = name
            stuObj.stuId = item.stuId
            this.newStuList.push(stuObj)
          })
        } else {
          this.$message.error(data.errorMessage || '获取学员摘要列表失败')
        }
      })
    },
    /* 班级列表 */
    getGradeList() {
      const params = {
        courseId: this.detailList.courseId
      }
      classGradeSummary(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.gradeList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取班级摘要列表失败')
        }
      })
    },
    /* 学员批量约课 */
    getStuCreate() {
      let cpdIds = ''
      this.checkList.map(item => {
        const checkArr = []
        checkArr.push(item.cpdId)
        cpdIds = checkArr && checkArr.join(',')
      })
      const params = {
        cpmId: this.detailList.cpmId,
        cpdIds: cpdIds,
        stuId: this.memberName,
        fix: this.fix
      }
      stuCreate(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          this.$emit('toUpdateOnceOrder', this.detailList)
          this.$refs.tableCommon.clearSelection()
          if (data.message && Object.keys(data.message).length > 0) {
            this.$refs.orderError.show(data.message, data.cutType, this.detailList)
          } else {
            this.$message.success(data.errorMessage)
          }
        } else {
          this.$message.error(data.errorMessage || '批量约课失败')
        }
      })
    },
    /* 继续约课 */
    getContinueOrder() {
      this.getStuCreate()
      this.dialogVisible = false
    },
    /* 确定 */
    submit() {
      if (this.orderType == '1') { //eslint-disable-line
        if (this.memberName) {
          if (this.checkList && this.checkList.length > 0) {
            const payload = {
              cpmId: this.detailList.cpmId,
              stuId: this.memberName
            }
            stuCheckBirthday(payload).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.getStuCreate()
              } else if (data.errorCode > 0) {
                this.$refs.orderCourseContinue.show(data.errorMessage)
              } else {
                this.$message.error(data.errorMessage || '学员年龄校验失败')
              }
            })
          } else {
            this.$message.error('未选中课程')
          }
        } else {
          this.$message.error('请选择学员')
        }
      } else {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (this.checkList && this.checkList.length > 0) {
              let cpdIds = ''
              this.checkList.map(item => {
                const checkArr = []
                checkArr.push(item.cpdId)
                cpdIds = checkArr && checkArr.join(',')
              })
              const params = {
                cpmId: this.detailList.cpmId,
                cpdIds: cpdIds,
                fix: this.fix,
                clsId: this.ruleForm.grade
              }
              gradeBatchCreate(params).then(res => {
                const data = res.data
                if (data.errorCode === 0) {
                  this.dialogVisible = false
                  this.$emit('toUpdateOnceOrder', this.detailList)
                  this.$refs.tableCommon.clearSelection()
                  if (data.message && Object.keys(data.message).length > 0) {
                    this.$refs.orderError.show(data.message, data.cutType, this.detailList)
                  } else {
                    this.$message.success(data.errorMessage)
                  }
                } else {
                  this.$message.error(data.errorMessage || '班级批量约课失败')
                }
              })
            } else {
              this.$message.error('未选中课程')
            }
          } else {
            return false
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.batch_order_tips {
  display: inline-block;
  width: 250px;
  vertical-align: top;
  p {
    margin-bottom: 10px;
  }
}
.batch_course_info {
  display: inline-block;
  width: 400px;
  // height: 180px;
  vertical-align: top;
  border-radius: 5px;
  box-sizing: border-box;
  margin-left: 15px;
  border: 1px solid #ddd;
  .batch_course_info_head {
    height: 32px;
    line-height: 32px;
    background: #dfebfa;
    text-align: center;
  }
  .classInfo {
    padding: 0px 0 20px 10px;
    p {
      height: 14px;
      line-height: 14px;
      margin-top: 10px;
    }
  }
  .batch_course_time /deep/ {
    padding: 10px 0px 10px 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    -webkit-box-align: center;
    width: 100%;
    overflow: hidden;
    .el-form-item {
      margin-right: 10px;
    }
    .el-input--prefix .el-input__inner {
      padding-left: 15px;
    }
    .batch_course_time_item /deep/ {
      width: 50%;
      .el-form-item__label {
        padding: 0;
      }
    }
  }
}
.batch_order_vip_info /deep/ {
  display: inline-block;
  vertical-align: top;
  width: 285px;
  height: 210px;
  margin-left: 15px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  .batch_course_info_head {
    height: 32px;
    line-height: 32px;
    background: #dfebfa;
    text-align: center;
  }
  .search {
    margin-left: 5px;
    color: #46b6ee;
    cursor: pointer;
  }
  p {
    height: 14px;
    line-height: 14px;
    margin: 10px 0 0 0;
  }
  .class_order_stu_list {
    height: 70px;
    max-height: 70px;
    overflow-y: auto;
    overflow-x: hidden;
    .class_order_stu_list_item {
      width: 190px;
      vertical-align: middle;
      color: #999;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .el-form-item__label {
    padding: 0;
  }
}
</style>
