<template>
  <div class="editCourseArrange">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="编辑排课"
      width="1100px"
      @close="cancel('ruleForm')"
    >
      <div class="all">
        <div class="top">
          <div class="top_left">
            <div class="title">课程信息</div>
            <div class="top_left_content">
              <div class="top_left_item">
                <span>课程名称：</span>
                <span>{{ mainArrangeInfo.courseName || '--' }}</span>
              </div>
              <div class="top_left_item">
                <span>星期：</span>
                <span>{{ mainArrangeInfo.weekInfo || '--' }}</span>
              </div>
              <div class="top_left_item">
                <span>时间段：</span>
                <span>{{ mainArrangeInfo.startTime || '--' }}~{{ mainArrangeInfo.endTime || '--' }}</span>
              </div>
            </div>
            <div class="title">编辑周期</div>
            <div class="edit_course_time">
              <el-form :inline="true">
                <el-form-item
                  label="开始："
                  prop="startDate"
                  style="margin-bottom:10px"
                >
                  <el-date-picker
                    v-model="startDate"
                    type="date"
                    placeholder="开始日期"
                    value-format="yyyy-MM-dd"
                    style="width:140px"
                  />
                </el-form-item>
                <el-form-item
                  label="结束："
                  prop="endDate"
                  style="margin:0 0 10px 0"
                >
                  <el-date-picker
                    v-model="endDate"
                    type="date"
                    placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    style="width:140px"
                  />
                </el-form-item>
              </el-form>
              <div class="checkNum">
                <span style="margin-right:2px">已选</span>:
                <span style="margin-left:6px;"> {{ checkedNum }}条</span>
                <a
                  v-if="checkedNum == '1'"
                  style="margin-left:8px;"
                  @click="deleteArrange"
                >删除</a>
                <a
                  v-if="parseInt(checkedNum) > 1"
                  style="margin-left:8px;"
                  @click="deleteArrange"
                >批量删除</a>
              </div>
              <div v-if="checkedNum == '1' || parseInt(checkedNum) > 1">
                <span style="margin-right:2px">自主约课</span>:
                <el-radio-group v-model="arrangeCourse">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="2">关闭</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div class="top_right">
            <div class="title">请填写需要修改的信息栏，若不填写则不修改</div>
            <div class="edit_arrange_course_info">
              <el-form
                ref="ruleForm"
                :model="ruleForm"
                label-width="120px"
                class="rule_form"
              >
                <div class="top_right_edit_left">
                  <el-form-item
                    label="主教："
                    prop="mtids"
                  >
                    <el-select
                      v-model="ruleForm.mtids"
                      :class="mtidsStatus ? 'errorStyle' : ''"
                      multiple
                      filterable
                      placeholder="请选择主教"
                      style="width:150px"
                      @change="mtidsStatusChange"
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
                    label="助教："
                    prop="atids"
                  >
                    <el-select
                      v-model="ruleForm.atids"
                      :class="atidStatus ? 'errorStyle' : ''"
                      multiple
                      filterable
                      placeholder="请选择助教"
                      style="width:150px"
                      @change="atidStatusChange"
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
                    label="星期选择："
                    prop="week"
                  >
                    <el-select
                      v-model="ruleForm.week"
                      placeholder="请选择星期"
                      style="width:150px"
                      filterable
                    >
                      <el-option
                        v-for="item in weekOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="最大人数："
                    prop="maxNum"
                  >
                    <el-input
                      v-model="ruleForm.maxNum"
                      placeholder="最大人数(正整数)"
                      style="width:150px"
                    />
                  </el-form-item>
                  <el-form-item
                    label="最大上课人数："
                    prop="maxAttNum"
                  >
                    <el-input
                      v-model="ruleForm.maxAttNum"
                      placeholder="最大上课人数(正整数)"
                      style="width:150px"
                    />
                  </el-form-item>
                  <el-form-item
                    label="最大补课人数："
                    prop="maxMulNum"
                  >
                    <el-input
                      v-model="ruleForm.maxMulNum"
                      placeholder="最大补课人数(正整数)"
                      style="width:150px"
                    />
                  </el-form-item>
                  <el-form-item
                    label="最大试听人数："
                    prop="maxTryNum"
                  >
                    <el-input
                      v-model="ruleForm.maxTryNum"
                      placeholder="最大试听人数(正整数)"
                      style="width:150px"
                    />
                  </el-form-item>
                </div>
                <div class="top_right_edit_right">
                  <el-form-item label="教室：">
                    <el-select
                      v-model="ruleForm.roomId"
                      :class="clsRoomStatus ? 'errorStyle' : ''"
                      placeholder="请选择教室"
                      style="width:150px"
                      filterable
                      @change="clsRoomStatusChange"
                    >
                      <el-option
                        v-for="item in roomList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="上课时间：">
                    <el-time-picker
                      v-model="ruleForm.classTimeStart"
                      :picker-options="{
                        selectableRange: '00:00:00 - 23:59:00'
                      }"
                      format="HH:mm"
                      value-format="HH:mm"
                      style="width:150px"
                      placeholder="上课时间"
                    />
                  </el-form-item>
                  <el-form-item label="下课时间：">
                    <el-time-picker
                      v-model="ruleForm.classTimeEnd"
                      :picker-options="{
                        selectableRange: '00:00:00 - 23:59:00'
                      }"
                      value-format="HH:mm"
                      format="HH:mm"
                      style="width:150px"
                      placeholder="下课时间"
                    />
                  </el-form-item>
                  <el-form-item label="标题：">
                    <el-input
                      v-model="ruleForm.title"
                      placeholder="请输入标题"
                      style="width:150px"
                    />
                  </el-form-item>
                  <el-form-item
                    label="上课主题："
                    prop="startCourseThemeId"
                  >
                    <el-select
                      v-model="ruleForm.startCourseThemeId"
                      placeholder="请选择上课主题"
                      style="width:150px"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="(item, index) of schoolThemeList"
                        :key="index"
                        :label="item.title"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="颜色："
                    prop="color"
                  >
                    <el-popover
                      placement="top"
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
                </div>
                <div class="top_right_edit_bottom">
                  <el-form-item
                    style="margin-bottom:10px;width:68%"
                    label="课程进度："
                    prop="processPre"
                  >
                    <el-input
                      v-model="ruleForm.processPre"
                      placeholder="进度前缀"
                      style="width:70px"
                    />
                    <el-form-item
                      prop="processSuf"
                      style="margin-left:7px;display:inline-block"
                    >
                      <el-input
                        v-model="ruleForm.processSuf"
                        placeholder="当前进度"
                        style="width:70px"
                      />
                    </el-form-item>
                  </el-form-item>
                  <div style="line-height:30px">
                    <el-checkbox
                      v-model="ruleForm.checkConflict"
                      label="检查上课冲突"
                    />
                  </div>
                </div>
              </el-form>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div style="height:100%">
            <CommonTable
              ref="commonTable"
              :columns="columns"
              :table-height="tableHeight"
              :pagination="listQuery"
              :options="options"
              @handleSelectionChange="selectionChange"
            />
          </div>
        </div>
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
    <DeleteReason
      ref="delReason"
      @toUpdateTable="getUpdateTable"
    />
    <CreateArrangeCourseConflict ref="createConflict" />
  </div>
</template>
<script>
import CommonTable from '@/components/CommonTable/CommonTable'
// import { getScheduleList } from '@/api/course'
import {
  queryArrangeList,
  mainQueryBack,
  queryClassroomList,
  courseThemeQuery,
  tenantUserSummaryQuery,
  updateArrange
} from '@/api/teachManage/arrangeCourse'
import DeleteReason from './delCourseArrangeReason'
import CreateArrangeCourseConflict from '../../dialog/createArrangeCourseConflict'
export default {
  components: {
    CommonTable,
    DeleteReason,
    CreateArrangeCourseConflict
  },
  data() {
    return {
      arrangeCourse: '', // 自主约课
      dialogVisible: false,
      startDate: '', // 开始日期
      endDate: '', // 结束日期
      checkedNum: '0', // 已选条数
      rowInfo: {},
      ruleForm: {
        mtids: '', // 主教
        atids: '', // 助教
        week: '', // 星期
        maxNum: '', // 最大人数
        maxAttNum: '', // 最大上课人数
        maxMulNum: '', // 最大补课人数
        maxTryNum: '', // 最大试听人数
        roomId: '', // 教室
        classTimeStart: '', // 上课时间
        classTimeEnd: '', // 下课时间
        title: '', // 标题
        startCourseThemeId: '', // 上课主题
        colorName: '#1dafe4', // 颜色
        processPre: '', // 进度前缀
        processSuf: '', // 当前进度
        checkConflict: true // 检查上课冲突
      },
      mtidsStatus: false, // 主教的状态
      atidStatus: false, // 助教状态
      clsRoomStatus: false, // 教室状态
      columns: [
        {
          label: '日期',
          prop: 'studyDate',
          width: '150',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.studyDate}(${row.weekDay})</div>`
          }
        },
        {
          label: '时间段',
          prop: 'rangeTime',
          width: '150',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.startTime || '--'} ~ ${row.endTime || '--'}</div>`
          }
        },
        {
          label: '自主约课',
          prop: 'bookCls',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.bookCls === '1') {
              return `<div>开启</div>`
            } else if (row.bookCls === '2') {
              return `<div>关闭</div>`
            }
          }
        },
        {
          label: '主教',
          prop: 'mtNames',
          width: '120',
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
          width: '120',
          isShowTooltip: true
        },
        {
          label: '最大人数',
          prop: 'maxNum',
          width: '120',
          isShowTooltip: true
        },
        {
          label: '上课人数',
          prop: 'num',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.maxAttNum === -1) {
              return `<div>${row.num}</div>`
            } else {
              return `<div>${row.num}/${row.maxAttNum}</div>`
            }
          }
        },
        {
          label: '补课人数',
          prop: 'mulNum',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.maxMulNum === -1) {
              return `<div>${row.mulNum}</div>`
            } else {
              return `<div>${row.mulNum}/${row.maxMulNum}</div>`
            }
          }
        },
        {
          label: '试听人数',
          prop: 'tryNum',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.maxTryNum === -1) {
              return `<div>${row.tryNum}</div>`
            } else {
              return `<div>${row.tryNum}/${row.maxTryNum}</div>`
            }
          }
        },
        {
          label: '排队人数',
          prop: 'lineNum',
          width: '120',
          isShowTooltip: true
        }
      ],
      tableHeight: '300px',
      listQuery: {
        show: false
      },
      options: {
        mutiSelect: true,
        selectableFunc: this.getSelectAbleFunc
      },
      colorList: [
        '#523d87', '#8e4090', '#db3387', '#e776c8', '#7976e7',
        '#1dafe4', '#0b7a3b', '#169f4e', '#97c24a', '#fbbc3c',
        '#e76d39', '#d62436', '#d9c585', '#9e612f', '#772c1d'
      ], // 颜色列表
      weekOption: [
        { label: '周一', value: '1' },
        { label: '周二', value: '2' },
        { label: '周三', value: '3' },
        { label: '周四', value: '4' },
        { label: '周五', value: '5' },
        { label: '周六', value: '6' },
        { label: '周日', value: '7' }
      ], // 渲染周信息
      teachList: [],
      roomList: [],
      schoolThemeList: [],
      mainArrangeInfo: {}, // 主排课信息
      checkList: [] // 选中的列表
    }
  },
  methods: {
    show(row) {
      this.rowInfo = row
      this.dialogVisible = true
      this.ruleForm.checkConflict = true
      this.arrangeCourse = ''
      if (row) {
        this.getCourseThemeList()
        this.mainQueryBack()
      }
      this.getClassroomList()
      this.getUserlist()
    },
    /* 主教状态改变 */
    mtidsStatusChange() {
      this.mtidsStatus = false
    },
    /* 助教状态改变 */
    atidStatusChange() {
      this.atidStatus = false
    },
    /* 教室状态改变 */
    clsRoomStatusChange() {
      this.clsRoomStatus = false
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
    /* 班级主题列表 */
    getCourseThemeList() {
      const params = {
        courseId: this.rowInfo.courseId
      }
      courseThemeQuery(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.schoolThemeList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取班级主题列表失败')
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
    /* 排课信息获取 */
    mainQueryBack() {
      const params = {
        cpdId: this.rowInfo.cpdId
      }
      mainQueryBack(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.mainArrangeInfo = data
          this.startDate = this.mainArrangeInfo.startDate
          this.endDate = this.mainArrangeInfo.endDate
          this.options.apiService = queryArrangeList
          const payload = {
            startDate: data.startDate,
            endDate: data.endDate,
            cpmId: this.rowInfo.cpmId,
            pageSize: 99999,
            startTime: data.startTime,
            endTime: data.endTime
          }
          this.$refs.commonTable.getList(payload)
        }
      })
    },
    colorChange(val) {
      this.ruleForm.colorName = val
    },
    /* 选择条数 */
    selectionChange(val) {
      this.checkedNum = val.length
      this.checkList = val
    },
    /* 删除 批量删除 */
    deleteArrange() {
      this.$refs.delReason.show(this.checkList)
    },
    /* 多选是否可用 */
    getSelectAbleFunc(row) {
      const yesterday = this.$moment().subtract(1, 'days').format('YYYY-MM-DD')
      const day = row.studyDate
      if (this.$moment(yesterday).isBefore(day)) {
        return true
      } else {
        return false
      }
    },
    /* 确定 */
    submit(formName) {
      if (this.checkedNum > 0) {
        const cpdIdArr = []
        this.checkList.map(item => {
          cpdIdArr.push(item.cpdId)
        })
        const cpdIds = cpdIdArr && cpdIdArr.join(',')
        let mtids = ''
        let atids = ''
        if (this.ruleForm.mtids && this.ruleForm.mtids.length > 0) {
          mtids = this.ruleForm.mtids.join(',')
        }
        if (this.ruleForm.atids && this.ruleForm.atids.length > 0) {
          atids = this.ruleForm.atids.join(',')
        }
        for (const i in this.ruleForm.mtids) {
          for (const j in this.ruleForm.atids) {
            if (this.ruleForm.mtids[i] === this.ruleForm.atids[j]) {
              this.$message.error('主教和助教不能包含同一人')
              return
            }
          }
        }
        const allTotal = Number(this.ruleForm.maxAttNum) + Number(this.ruleForm.maxMulNum) + Number(this.ruleForm.maxTryNum)
        if (Number(this.ruleForm.maxNum) < allTotal) {
          this.$message.error('上课、补课、试听总人数不能超过最大人数')
          return
        }
        if (this.ruleForm.classTimeStart && this.ruleForm.classTimeEnd) {
          const classTimeStart = this.ruleForm.classTimeStart && this.ruleForm.classTimeStart.split(':')
          const classTimeStart1 = classTimeStart && classTimeStart[0]
          const classTimeStart2 = classTimeStart && classTimeStart[1]
          const classTimeEnd = this.ruleForm.classTimeEnd && this.ruleForm.classTimeEnd.split(':')
          const classTimeEnd1 = classTimeEnd && classTimeEnd[0]
          const classTimeEnd2 = classTimeEnd && classTimeEnd[1]
          if (classTimeStart1 === classTimeEnd1 && classTimeStart2 === classTimeEnd2) {
            this.$message.warning('结束时间不能早于或等于开始时间')
            return
          } else if (classTimeStart1 > classTimeEnd1) {
            this.$message.warning('结束时间不能早于或等于开始时间')
            return
          } else if (classTimeStart1 === classTimeEnd1 && classTimeStart2 > classTimeEnd2) {
            this.$message.warning('结束时间不能早于或等于开始时间')
            return
          }
        }
        const params = {
          bookCls: this.arrangeCourse,
          cpmId: this.rowInfo.cpmId,
          cpdIds: cpdIds,
          courseId: this.rowInfo.courseId,
          roomId: this.ruleForm.roomId,
          mtids: mtids,
          atids: atids,
          maxNum: this.ruleForm.maxNum,
          week: this.ruleForm.week || '0',
          startTime: this.ruleForm.classTimeStart,
          endTime: this.ruleForm.classTimeEnd,
          title: this.ruleForm.title,
          maxAttNum: this.ruleForm.maxAttNum,
          maxMulNum: this.ruleForm.maxMulNum,
          maxTryNum: this.ruleForm.maxTryNum,
          color: this.ruleForm.colorName,
          startCourseThemeId: this.ruleForm.startCourseThemeId,
          processPre: this.ruleForm.processPre,
          processSuf: this.ruleForm.processSuf,
          checkConflict: this.ruleForm.checkConflict === true ? '1' : '0'
        }
        updateArrange(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.dialogVisible = false
            this.close()
            this.$message.success(data.errorMessage)
            this.$emit('toUpdateTable')
          } else if (data.fields && data.fields.length > 0) {
            data.fields.map(item => {
            if (item == 'mtName') { //eslint-disable-line
                this.mtidsStatus = true
            } else if (item == 'atName') { //eslint-disable-line
                this.atidStatus = true
            } else if (item == 'clsRoom') { //eslint-disable-line
                this.clsRoomStatus = true
              }
            })
            this.$refs.createConflict.show(data)
          } else {
            this.$message.error(data.errorMessage || '排课修改失败')
          }
        })
      } else {
        this.$message.warning('请至少选中一项排课编辑')
      }
    },
    /* 关闭弹窗 */
    close() {
      this.$emit('toCloseEdit')
    },
    /* 取消 */
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
      this.$refs.commonTable.clearSelection()
      this.close()
    },
    /* 删除更新列表 */
    getUpdateTable() {
      const payload = {
        startDate: this.mainArrangeInfo.startDate,
        endDate: this.mainArrangeInfo.endDate,
        cpmId: this.rowInfo.cpmId,
        pageSize: 99999,
        startTime: this.mainArrangeInfo.startTime,
        endTime: this.mainArrangeInfo.endTime
      }
      this.$refs.commonTable.getList(payload)
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  color: #46b6ee;
}
.editCourseArrange /deep/ .el-dialog__body {
  max-height: 0;
  max-height: 625px;
}
.all {
  margin-bottom: 14px;
  .top {
    width: 100%;
    height: 244px;
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 20px;
    .top_left {
      height: 100%;
      width: 400px;
      border: 1px solid #ddd;
      margin-right: 20px;
      border-radius: 5px;
      .title {
        width: 100%;
        height: 32px;
        line-height: 31px;
        background: #f6f7f9;
        text-align: center;
        :first-child {
          border-radius: 5px 5px 0 0;
        }
      }
      .top_left_content {
        width: 100%;
        padding: 10px 10px 20px;
        .top_left_item {
          color: #666;
          line-height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .edit_course_time {
        width: 100%;
        overflow: hidden;
        padding: 10px 10px 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        -webkit-box-align: center;
      }
      .edit_course_time /deep/ .el-form-item__label {
        padding: 0;
      }
      .edit_course_time /deep/ .el-input--prefix .el-input__inner {
        padding-left: 15px;
      }
      .checkNum {
        width: 162px;
        margin-right: 10px;
      }
    }
    .top_right {
      width: calc(100% - 420px);
      height: 100%;
      border-radius: 5px;
      border: 1px solid #ddd;
      .rule_form {
        width: 100%;
        height: 210px;
        padding: 20px 5px 0;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        flex-direction: row;
        flex-wrap: wrap;
        overflow-y: auto;
      }
      .title {
        width: 100%;
        height: 32px;
        line-height: 31px;
        background: #f6f7f9;
        text-align: center;
        :first-child {
          border-radius: 5px 5px 0 0;
        }
      }
      .edit_arrange_course_info {
        .top_right_edit_left,
        .top_right_edit_right {
          width: 50%;
        }
        .top_right_edit_bottom {
          width: 100%;
          display: flex;
          flex-wrap: nowrap;
        }
        .top_right_edit_bottom /deep/ .el-input__inner {
          padding: 0 10px;
        }
      }
    }
  }
  .bottom {
    max-height: 300px;
    width: 100%;
    overflow: hidden;
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
.errorStyle /deep/ .el-input.el-input--mini.el-input--suffix input {
  border-color: #d0021b;
}
</style>
