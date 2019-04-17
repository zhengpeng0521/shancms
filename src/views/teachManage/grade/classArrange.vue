<template>
  <div>
    <div class="page_title_text">
      <span>班级排课</span>
      <div class="btns">
        <el-button
          class="cancel_btn"
          @click="close"
        >关闭</el-button>
        <el-button
          type="primary"
          @click="submit('ruleForm')"
        >生成</el-button>
      </div>
    </div>
    <div class="gradeArrange">
      <div class="create_arrange_course">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <div
            class="common_block"
            style="margin-top:0"
          >
            <div class="title_block" />
            <div class="title_content">班级信息</div>
          </div>
          <div class="form_item_course_message">
            <el-form-item
              label="选择班级："
              prop="clsId"
            >
              <el-select
                v-model="ruleForm.clsId"
                style="width:300px"
                placeholder="请选择班级"
                clearable
                @change="gradeChange"
              >
                <el-option
                  v-for="item of gradeList"
                  :key="item.clsId"
                  :label="item.name"
                  :value="item.clsId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="班主任："
              prop="topTeacherName"
            >
              <span>{{ ruleForm.topTeacherName || '--' }}</span>
            </el-form-item>
          </div>
          <div class="form_item_stu_message">
            <el-form-item
              label="班级学员："
              prop="gradeStu"
            >
              <span> {{ gradeStu || '--' }}</span>
            </el-form-item>
          </div>
          <div class="common_block">
            <div class="title_block" />
            <div class="title_content">课程信息</div>
          </div>
          <div class="form_item_course_message">
            <el-form-item
              label="所属校区："
              prop="defaultOrgId"
            >
              <el-select
                v-model="ruleForm.defaultOrgId"
                placeholder="请选择所属校区"
                disabled
                style="width:300px"
              >
                <el-option
                  :label="gradeInfo.name"
                  :value="gradeInfo.clsId"
                />
              </el-select>
            </el-form-item>
            <div style="min-width:600px;display:flex">
              <el-form-item
                label="课程名称："
                prop="courseId"
              >
                <el-select
                  v-model="ruleForm.courseId"
                  placeholder="请选择课程名称"
                  disabled
                  style="width:300px"
                >
                  <el-option
                    v-for="item of lessonDeptList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <p>
                <el-input
                  v-model="ruleForm.cost"
                  placeholder="课时"
                  disabled
                  style="width:90px"
                />
              </p>
              <p>
                <el-input
                  v-model="ruleForm.month"
                  placeholder="月"
                  disabled
                  style="width:90px"
                />
              </p>
            </div>
            <el-form-item
              label="主教："
              prop="mainTeacherIds"
            >
              <el-select
                v-model="ruleForm.mainTeacherIds"
                :class="mtidsStatus ? 'errorStyle' : ''"
                multiple
                placeholder="请选择主教"
                style="width:300px"
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
              prop="assistanTeacherIds"
            >
              <el-select
                v-model="ruleForm.assistanTeacherIds"
                :class="atidStatus ? 'errorStyle' : ''"
                multiple
                placeholder="请选择助教"
                style="width:300px"
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
              ref="roomIdForm"
              label="教室："
              prop="roomId"
            >
              <el-select
                v-model="ruleForm.roomId"
                :class="clsRoomStatus ? 'errorStyle' : ''"
                placeholder="请选择教室"
                style="width:300px"
                clearable
                @change="clsRoomStatusChange"
              >
                <el-option
                  v-for="(item, index) of roomList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="common_block">
            <div class="title_block" />
            <div class="title_content">标题颜色</div>
          </div>
          <div class="form_item_course_message">
            <el-form-item
              label="标题："
              prop="courseName"
            >
              <el-input
                v-model="ruleForm.courseName"
                placeholder="请输入标题"
                style="width:300px"
              />
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
          <div class="common_block">
            <div class="title_block" />
            <div class="title_content">人数上限设置</div>
          </div>
          <div class="form_item_course_message">
            <el-form-item
              :rules="[
                { required: true, message: '请输入最大人数', trigger: 'change'},
                { validator: checkNumMax }
              ]"
              label="最大人数："
              prop="maxNum"
            >
              <el-input
                v-model="ruleForm.maxNum"
                placeholder="请输入最大人数"
                style="width:300px"
              />
            </el-form-item>
            <el-form-item
              label="上课人数："
              prop="maxAttNum"
            >
              <el-input
                v-model="ruleForm.maxAttNum"
                placeholder="上课人数,不填写则不限人数"
                style="width:300px"
              />
            </el-form-item>
            <el-form-item
              label="补课人数："
              prop="maxMulNum"
            >
              <el-input
                v-model="ruleForm.maxMulNum"
                placeholder="补课人数,不填写则不限人数"
                style="width:300px"
              />
            </el-form-item>
            <el-form-item
              label="试听人数："
              prop="maxTryNum"
            >
              <el-input
                v-model="ruleForm.maxTryNum"
                placeholder="试听人数,不填写则不限人数"
                style="width:300px"
              />
            </el-form-item>
          </div>
          <div class="common_block">
            <div class="title_block" />
            <div class="title_content">时间设置</div>
          </div>
          <div class="form_item_course_message">
            <el-form-item
              style="margin-right:700px"
              label="排课方式："
              prop="repeatable"
            >
              <el-radio-group v-model="ruleForm.repeatable">
                <el-radio label="0">单次</el-radio>
                <el-radio label="1">循环</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.repeatable == '0'"
              label="上课日期："
              prop="singleDate"
            >
              <el-date-picker
                v-model="ruleForm.singleDate"
                :picker-options="pickerOptions"
                type="date"
                style="width:300px"
                placeholder="请选择上课日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <div v-if="ruleForm.repeatable == '1'">
              <el-form-item
                v-if="ruleForm.repeatable == '1'"
                label="上课日期："
                prop="repeatDate"
                style="margin-right:700px"
              >
                <el-date-picker
                  v-model="ruleForm.repeatDate"
                  :picker-options="pickerOptions"
                  style="width:300px"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  @change="repeatDateChange"
                />
              </el-form-item>
              <div
                v-if="ruleForm.repeatDate"
                class="class_time_list"
              >
                <el-form-item
                  label="上课时间："
                  style="margin-bottom:0"
                >
                  <ul class="class_time_thead">
                    <li>星期</li>
                    <li>开始时间</li>
                    <li>结束时间</li>
                  </ul>
                </el-form-item>
                <ul
                  v-for="(child, index) of ruleForm.classTimeList"
                  :key="index"
                  class="class_time_tbody"
                >
                  <li>
                    <el-form-item
                      :prop="'classTimeList.' + index + '.'+'week'"
                      :rules="{
                        required: true, message: '请选择星期', trigger: 'blur'
                      }"
                      style="margin-bottom:0"
                    >
                      <el-select
                        v-model="child.week"
                        placeholder="请选择星期"
                        @change="weekChange(index,child.week)"
                      >
                        <el-option
                          v-for="item in weekOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item
                      :prop="'classTimeList.' + index + '.' + 'startTime'"
                      :rules="{
                        required: true, message: '请选择上课时间', trigger: 'blur'
                      }"
                      style="margin-bottom:0"
                    >
                      <el-time-picker
                        v-model="child.startTime"
                        :picker-options="{
                          selectableRange: '00:00:00 - 23:59:00'
                        }"
                        format="HH:mm"
                        value-format="HH:mm"
                        style="width:127px"
                        placeholder="上课时间"
                      />
                    </el-form-item>
                  </li>
                  <li style="border-right:1px solid #ddd">
                    <el-form-item
                      :prop="'classTimeList.' + index + '.' + 'endTime'"
                      :rules="{
                        required: true, message: '请选择下课时间', trigger: 'blur'
                      }"
                      style="margin-bottom:0"
                    >
                      <el-time-picker
                        v-model="child.endTime"
                        :picker-options="{
                          selectableRange: '00:00:00 - 23:59:00'
                        }"
                        format="HH:mm"
                        value-format="HH:mm"
                        style="width:127px"
                        placeholder="下课时间"
                      />
                    </el-form-item>
                  </li>
                  <li
                    v-if="ruleForm.classTimeList.length>1"
                    style="border:none;width:60px"
                  >
                    <a @click="deleteClassTime(index)">删除</a>
                  </li>
                </ul>
                <a
                  class="class_time_add"
                  @click="addClassTime"
                >添加</a>
                <el-form-item
                  class="holiday"
                  style="margin-bottom:0"
                >
                  <el-checkbox
                    v-model="ruleForm.skipHoliday"
                    @change="holidayChange"
                  >跳过节假日</el-checkbox>
                </el-form-item>
              </div>
              <div
                v-if="ruleForm.repeatDate"
                class="course_num"
              >
                <el-form-item label="上课次数：">
                  <el-input
                    v-model="ruleForm.courseNum"
                    style="width:80px"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="studyTime">
              <el-form-item
                v-if="ruleForm.repeatable == '0'"
                style="margin:0 6px 0 0;display:inline-block;vertical-aign:top"
                label="上课时间："
                prop="classTimeStart"
              >
                <el-time-picker
                  v-model="ruleForm.classTimeStart"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:00'
                  }"
                  format="HH:mm"
                  value-format="HH:mm"
                  style="width:145px"
                  placeholder="上课时间"
                />
              </el-form-item>
              <el-form-item
                v-if="ruleForm.repeatable == '0'"
                prop="classTimeEnd"
                style="display:inline-block"
              >
                <el-time-picker
                  v-model="ruleForm.classTimeEnd"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:00'
                  }"
                  value-format="HH:mm"
                  format="HH:mm"
                  style="width:145px"
                  placeholder="下课时间"
                />
              </el-form-item>
            </div>
            <div class="form_item_course_message">
              <el-form-item
                style="margin-bottom:0 "
                label="课程进度："
                prop="processPre"
              >
                <el-input
                  v-model="ruleForm.processPre"
                  placeholder="进度前缀"
                  style="width:145px;vertical-align:top"
                />
                <el-form-item
                  prop="processSuf"
                  style="margin-left:7px;display:inline-block"
                >
                  <el-input
                    v-model="ruleForm.processSuf"
                    placeholder="当前进度"
                    style="width:145px;vertical-align:top"
                  />
                </el-form-item>
              </el-form-item>
              <el-form-item
                label="上课主题："
                prop="startCourseThemeId"
              >
                <el-select
                  v-model="ruleForm.startCourseThemeId"
                  placeholder="请选择上课主题"
                  style="width:300px"
                  clearable
                >
                  <el-option
                    v-for="(item, index) of schoolThemeList"
                    :key="index"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div style="margin-left:1.5%">
        <el-checkbox
          v-model="ruleForm.selfOrder"
          label="允许家长自主约课"
        />
        <el-checkbox
          v-model="ruleForm.checkConflict"
          label="检查上课冲突"
        />
      </div>
    </div>
    <!-- 是否是节假日 -->
    <CourseArrangeHolidayConflict
      ref="holidayConflict"
      @toCreateArrage="getCreateArrage"
    />
    <!-- 校验课时 -->
    <GradeStuPeriodConflict
      ref="gradeStuPeriod"
      @toCreateArrage="getCheckPeriodArrange"
    />
    <!-- 排课冲突 -->
    <ClassArrangeConflict ref="createConflict" />
  </div>
</template>
<script>
import { getClassGradeDetail, checkStuPeriod, listByTime, classCoursePlan, tenantUserSummaryQuery, queryClassroomList, courseSummaryQuery, queryClassStuList, courseThemeQuery, queryCourseById, queryClassGradeList } from '@/api/teachManage/grade'
import { excistHoliday } from '@/api/teachManage/arrangeCourse'
import { getWeekDays } from '../../../utils/dateFormat'
import ClassArrangeConflict from '../courseSchedule/dialog/classArrangeConflict'
import CourseArrangeHolidayConflict from '../courseSchedule/dialog/courseArrangeHolidayConflict'
import GradeStuPeriodConflict from '../courseSchedule/dialog/gradeStuPeriodConflict'
export default {
  components: {
    CourseArrangeHolidayConflict,
    GradeStuPeriodConflict,
    ClassArrangeConflict
  },
  props: {
    gradeInfo: {
      type: Object,
      default() {}
    }
  },
  data() {
    var checkNum = (rule, value, callback) => {
      if (value == '' || value == undefined || value == null) { //eslint-disable-line
        callback()
      } else if (!/^(0|[1-9]\d*)$/.test(value)) {
        callback(new Error('人数必须是非负整数'))
      } else {
        callback()
      }
    }
    var checkProcess = (rule, value, callback) => {
      if (value == '' || value == undefined || value == null) { //eslint-disable-line
        callback()
      } else if (!/^(0|[1-9]\d*)$/.test(value)) {
        callback(new Error('进度内容必须是非负整数'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        clsId: '', // 选择班级
        topTeacherName: '', // 班主任
        defaultOrgId: '', // 校区选择
        courseId: '', // 课程名称,
        cost: '课时', // 课时
        month: '月龄', // 月龄
        mainTeacherIds: '', // 主教
        assistanTeacherIds: '', // 助教
        roomId: '', // 教室
        courseName: '', // 标题
        colorName: '#1dafe4', // 颜色选择
        maxNum: '', // 最大人数
        maxAttNum: '', // 上课人数
        maxMulNum: '', // 补课人数
        maxTryNum: '', // 试听人数
        repeatable: '0', // 排课方式
        singleDate: '', // 上课日期
        classTimeStart: '00:00', // 上课开始时间
        classTimeEnd: '00:00', // 上课结束时间
        repeatDate: '', // 日期区间
        skipHoliday: true, // 是否跳过节假日
        processPre: '', // 进度前缀
        processSuf: '', // 当前进度
        startCourseThemeId: '', // 上课主题
        courseNum: '0', // 上课次数
        selfOrder: false, // 是否自主约课
        checkConflict: true, // 检查冲突
        classTimeList: [{
          week: '',
          startTime: '00:00',
          endTime: '00:00'
        }]
      },
      rules: {
        clsId: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ],
        defaultOrgId: [
          { required: true, message: '请选择所属校区', trigger: 'change' }
        ],
        courseId: [
          { required: true, message: '请选择课程名称', trigger: 'change' }
        ],
        mainTeacherIds: [
          { required: true, message: '请选择主教', trigger: 'change' }
        ],
        roomId: [
          { required: true, message: '请选择教室', trigger: 'change' }
        ],
        courseName: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        colorName: [
          { required: true, message: '请选择颜色', trigger: 'change' }
        ],
        maxAttNum: [
          { validator: checkNum, trigger: 'blur' }
        ],
        maxMulNum: [
          { validator: checkNum, trigger: 'blur' }
        ],
        maxTryNum: [
          { validator: checkNum, trigger: 'blur' }
        ],
        processSuf: [
          { validator: checkProcess, trigger: 'blur' }
        ],
        repeatable: [
          { required: true, message: '请选择排课方式', trigger: 'change' }
        ],
        singleDate: [
          { required: true, message: '请选择上课日期', trigger: 'change' }
        ],
        repeatDate: [
          { required: true, message: '请选择上课日期', trigger: 'change' }
        ],
        classTimeStart: [
          { required: true, message: '请选择上课时间', trigger: 'change' }
        ],
        classTimeEnd: [
          { required: true, message: '请选择下课时间', trigger: 'change' }
        ]
      },
      gradeStu: '', // 班级学员
      stuList: [], // 学员列表
      roomList: [], // 教室列表
      schoolThemeList: [], // 上课主题列表
      teachList: [], // 员工
      courseInfo: {}, // 课程信息
      gradeList: [], // 班级列表
      lessonDeptList: [], // 课程列表
      holidayTimeList: [], // 节假日列表
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
      pickerOptions: {
        disabledDate(time) {
          return time && ((time.valueOf() < Date.now() - 24 * 60 * 60 * 1000) || (time.valueOf() > Date.now() + 365 * 24 * 60 * 60 * 1000))
        }
      },
      stuNum: 0, // 班级学员数量
      flag: false, // 判断循环的时间
      mtidsStatus: false, // 主教的状态
      atidStatus: false, // 助教状态
      clsRoomStatus: false // 教室状态
    }
  },
  computed: {
    repeatable() {
      return this.ruleForm.repeatable
    }
  },
  watch: {
    repeatable(newValue, oldValue) {
      this.ruleForm.singleDate = ''
      this.ruleForm.repeatDate = ''
      this.ruleForm.courseNum = '0'
    }
  },
  mounted() {
    this.getClassroomList()
    this.getCourseList()
    this.getUserlist()
    this.queryClassStuList()
    this.getCourseThemeList()
    this.getCourseById()
    this.getGradeList()
    this.show()
  },
  methods: {
    show() {
      if (this.gradeInfo) {
        this.ruleForm.topTeacherName = this.gradeInfo.topTeacherName
        this.ruleForm.courseId = this.gradeInfo.courseId
        const mainTeacherIds = this.gradeInfo.mainTeacherIds && this.gradeInfo.mainTeacherIds.split(',')
        if (mainTeacherIds && mainTeacherIds.length > 0) {
          this.ruleForm.mainTeacherIds = mainTeacherIds
        }
        const assistanTeacherIds = this.gradeInfo.assistanTeacherIds && this.gradeInfo.assistanTeacherIds.split(',')
        if (assistanTeacherIds && assistanTeacherIds.length > 0) {
          this.ruleForm.assistanTeacherIds = assistanTeacherIds
        }
        this.ruleForm.roomId = this.gradeInfo.roomId
        this.ruleForm.colorName = this.gradeInfo.color || '#1dafe4'
        this.ruleForm.maxNum = this.gradeInfo.maxNum
        this.stuNum = this.gradeInfo.stuNum
        this.$nextTick(() => {
          this.$refs['roomIdForm'].clearValidate()
        })
      }
    },
    // 校验最大上课人数
    checkNumMax(rule, value, callback) {
      if (Number(value) < Number(this.stuNum)) {
        callback(new Error('最大人数不小于班级人数'))
      } else if (value == '' || value == undefined || value == null) { //eslint-disable-line
        callback()
      } else if (!/^(0|[1-9]\d*)$/.test(value)) {
        callback(new Error('人数必须是非负整数'))
      } else {
        callback()
      }
    },
    /* 关闭 */
    close() {
      this.$emit('toCloseClassArrange')
    },
    colorChange(val) {
      this.ruleForm.colorName = val
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
    /* 班级选择 */
    gradeChange(val) {
      getClassGradeDetail({ clsId: val }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.queryClassStuList(val)
          this.getCourseThemeList(data.courseId)
          this.gradeChangeInfo = data.data
          this.ruleForm.topTeacherName = this.gradeChangeInfo.topTeacherName
          this.ruleForm.courseId = this.gradeChangeInfo.courseId
          const mainTeacherIds = this.gradeChangeInfo.mainTeacherIds && this.gradeChangeInfo.mainTeacherIds.split(',')
          if (mainTeacherIds && mainTeacherIds.length > 0) {
            this.ruleForm.mainTeacherIds = mainTeacherIds
          }
          const assistanTeacherIds = this.gradeChangeInfo.assistanTeacherIds && this.gradeChangeInfo.assistanTeacherIds.split(',')
          if (assistanTeacherIds && assistanTeacherIds.length > 0) {
            this.ruleForm.assistanTeacherIds = assistanTeacherIds
          }
          this.ruleForm.roomId = this.gradeChangeInfo.roomId
          this.ruleForm.colorName = this.gradeChangeInfo.color || '#1dafe4'
          this.ruleForm.maxNum = this.gradeChangeInfo.maxNum
          this.stuNum = this.gradeChangeInfo.stuNum
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 根据日期查询节假日 */
    repeatDateChange(val) {
      const params = {
        beginTime: val[0],
        endTime: val[1]
      }
      listByTime(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.holidayTimeList = data.list
        } else {
          this.$message.error(data.errorMessage || '节假日获取失败')
        }
      })
    },
    /* 星期的值的获取 */
    weekChange(index, value) {
      const times = this.ruleForm.repeatDate
      const list = this.ruleForm.classTimeList
      let num = 0
      if (!!times && !!times[0] && !!times[1]) {
        list.forEach((item, key) => {
          if (index == key) { //eslint-disable-line
            num = this.ruleForm.skipHoliday || this.ruleForm.skipHoliday == '1' //eslint-disable-line
              ? num + getWeekDays(times[0], times[1], value, this.holidayTimeList)
              : num + getWeekDays(times[0], times[1], value)
          } else if (item.week) {
            num = this.ruleForm.skipHoliday || this.ruleForm.skipHoliday == '1' //eslint-disable-line
              ? num + getWeekDays(times[0], times[1], item.week, this.holidayTimeList)
              : num + getWeekDays(times[0], times[1], item.week)
          }
        })
        this.ruleForm.courseNum = num
      }
    },
    /* 是否勾选节假日 */
    holidayChange(val) {
      const times = this.ruleForm.repeatDate
      const list = this.ruleForm.classTimeList
      if (!!times && !!times[0] && !!times[1] && !!list) {
        let num = 0
        list.forEach((item, key) => {
          if (item.week) {
            if (val) {
              num = num + getWeekDays(times[0], times[1], item.week, this.holidayTimeList)
            } else {
              num = num + getWeekDays(times[0], times[1], item.week)
            }
          }
        })
        this.ruleForm.courseNum = num
      }
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
    /* 获取课程列表 */
    getCourseList() {
      courseSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.lessonDeptList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取课程列表失败')
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
    /* 学员列表 */
    queryClassStuList(val) {
      let params = {}
      if (val) {
        params = {
          clsId: val
        }
      } else {
        params = {
          clsId: this.gradeInfo.clsId
        }
      }
      queryClassStuList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.stuList = data.results
          const stuArr = []
          this.stuList.map((item, index) => {
            stuArr.push(item.name)
          })
          this.gradeStu = stuArr.join(',')
        } else {
          this.$message.error(data.errorMessage || '学员列表获取失败')
        }
      })
    },
    /* 班级主题列表 */
    getCourseThemeList(val) {
      let params = {}
      if (val) {
        params = {
          courseId: val
        }
      } else {
        params = {
          courseId: this.gradeInfo.courseId
        }
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
    /* 课程明细摘要 */
    getCourseById() {
      const params = {
        id: this.gradeInfo.courseId
      }
      queryCourseById(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.courseInfo = data
          this.ruleForm.cost = this.courseInfo.cost + '' + '课时'
          this.ruleForm.month = this.courseInfo.minMa + '~' + this.courseInfo.maxMa + '个月'
          this.ruleForm.courseName = this.courseInfo.title
          this.ruleForm.defaultOrgId = this.courseInfo.orgName
        } else {
          this.$message.error(data.errorMessage || '获取课程明细失败')
        }
      })
    },
    /* 班级列表 */
    getGradeList() {
      const params = {
        type: '1'
      }
      queryClassGradeList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          let gradeArr = []
          gradeArr = data.results
          gradeArr.map(item => {
            const obj = {
              name: item.name,
              clsId: item.clsId
            }
            this.gradeList.push(obj)
            this.ruleForm.clsId = this.gradeInfo.clsId
          })
        } else {
          this.$message.error(data.errorMessage || '获取班级列表失败')
        }
      })
    },
    /* 添加 */
    addClassTime() {
      const tempData = {
        week: '',
        startTime: '00:00',
        endTime: '00:00'
      }
      this.ruleForm.classTimeList.push(tempData)
    },
    /* 删除 */
    deleteClassTime(index) {
      const timeJson = this.ruleForm.classTimeList
      const times = this.ruleForm.repeatDate
      let num = 0
      timeJson.splice(index, 1)
      if (!!times && !!times[0] && !!times[1]) {
        timeJson.forEach((item) => {
          if (item.week) {
            num = this.ruleForm.skipHoliday || this.ruleForm.skipHoliday == '1' //eslint-disable-line
              ? num + getWeekDays(times[0], times[1], item.week, this.holidayTimeList)
              : num + getWeekDays(times[0], times[1], item.week)
          }
        })
        this.ruleForm.courseNum = num
      }
    },
    /* 课时校验不通过的提交 */
    getCheckPeriodArrange(mainTeacherIds, assistanTeacherIds, start, end, list, time) {
      const params = {
        hday: time
      }
      excistHoliday(params).then(res => {
        const data = res.data
        if (data.result) {
          this.$refs.holidayConflict.show(mainTeacherIds, assistanTeacherIds, start, end, list, time, 'arrange')
        } else {
          this.getArrangeCourse(mainTeacherIds, assistanTeacherIds, start, end, list)
        }
      })
    },
    /* 节假日冲突-生成排课 */
    getCreateArrage(mainTeacherIds, assistanTeacherIds, start, end, list, type) {
      this.getArrangeCourse(mainTeacherIds, assistanTeacherIds, start, end, list)
    },
    /* 生成排课接口 */
    getArrangeCourse(mainTeacherIds, assistanTeacherIds, start, end, list) {
      const params = {
        clsId: this.ruleForm.clsId,
        topTeacher: this.gradeInfo.topTeacher,
        orgId: this.gradeInfo.orgId,
        courseId: this.ruleForm.courseId,
        mtids: mainTeacherIds,
        atids: assistanTeacherIds,
        roomId: this.ruleForm.roomId,
        title: this.ruleForm.courseName,
        color: this.ruleForm.colorName,
        maxNum: this.ruleForm.maxNum,
        maxAttNum: this.ruleForm.maxAttNum || '-1',
        maxMulNum: this.ruleForm.maxMulNum || '-1',
        maxTryNum: this.ruleForm.maxTryNum || '-1',
        repeatable: this.ruleForm.repeatable,
        startDate: start,
        endDate: end,
        startTime: this.ruleForm.classTimeStart,
        endTime: this.ruleForm.classTimeEnd,
        processPre: this.ruleForm.processPre,
        processSuf: this.ruleForm.processSuf,
        startCourseThemeId: this.ruleForm.startCourseThemeId,
        skipHoliday: this.ruleForm.skipHoliday === true ? '1' : '0',
        checkConflict: this.ruleForm.checkConflict === true ? '1' : '0',
        bookCls: this.ruleForm.selfOrder === true ? '1' : '2',
        list: list,
        maxCreateNum: this.ruleForm.courseNum
      }
      classCoursePlan(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.ruleForm.repeatable = '0'
          this.$refs['ruleForm'].resetFields()
          this.gradeStu = ''
          this.ruleForm.mainTeacherIds = []
          this.ruleForm.assistanTeacherIds = []
          this.ruleForm.cost = ''
          this.ruleForm.month = ''
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
          this.$message.error(data.errorMessage || '班级排课失败')
        }
      })
    },
    /* 生成 */
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const allTotal = Number(this.ruleForm.maxAttNum) + Number(this.ruleForm.maxMulNum) + Number(this.ruleForm.maxTryNum)
          if (Number(this.ruleForm.maxNum) < allTotal) {
            this.$message.error('上课、补课、试听总人数不能超过最大人数')
            return
          }
          // 处理主教和助教
          for (const i in this.ruleForm.mainTeacherIds) {
            for (const j in this.ruleForm.assistanTeacherIds) {
              if (this.ruleForm.mainTeacherIds[i] === this.ruleForm.assistanTeacherIds[j]) {
                this.$message.warning('主教和助教不能包含同一人')
                return
              }
            }
          }
          let mainTeacherIds = ''
          if (this.ruleForm.mainTeacherIds !== '' && this.ruleForm.mainTeacherIds != null && this.ruleForm.mainTeacherIds !== undefined) {
            mainTeacherIds = this.ruleForm.mainTeacherIds.join(',')
          }
          let assistanTeacherIds = ''
          if (this.ruleForm.assistanTeacherIds !== '' && this.ruleForm.assistanTeacherIds != null && this.ruleForm.assistanTeacherIds !== undefined) {
            assistanTeacherIds = this.ruleForm.assistanTeacherIds.join(',')
          }
          let start
          let end
          let list = []
          if (this.ruleForm.classTimeList && this.ruleForm.classTimeList.length > 0) {
            if (this.ruleForm.repeatable == '0') { //eslint-disable-line
              list = []
            } else if (this.ruleForm.repeatable == '1') { //eslint-disable-line
              list = this.ruleForm.classTimeList
            }
          }
          if (this.ruleForm.repeatable == '0') { //eslint-disable-line
            start = this.ruleForm.singleDate
            end = this.ruleForm.singleDate
            /* 时间处理 */
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
            } else {
              const payload = {
                cost: this.courseInfo.cost,
                maxCreateNum: this.ruleForm.courseNum,
                repeatable: '0',
                clsId: this.ruleForm.clsId
              }
              checkStuPeriod(payload).then(res => {
                const data = res.data
                if (data.errorCode === 0) {
                  let stuArr = []
                  if (data.stuNames != '') { //eslint-disable-line
                    stuArr = data.stuNames.split(',')
                  }
                  if (stuArr && stuArr.length > 0) {
                    this.$refs.gradeStuPeriod.show(data.stuNames, mainTeacherIds, assistanTeacherIds, start, end, list, this.ruleForm.singleDate)
                  } else {
                    const params = {
                      hday: this.ruleForm.singleDate
                    }
                    excistHoliday(params).then(res => {
                      const data = res.data
                      if (data.result) {
                        this.$refs.holidayConflict.show(mainTeacherIds, assistanTeacherIds, start, end, list, this.ruleForm.singleDate, 'arrange')
                      } else {
                        this.getArrangeCourse(mainTeacherIds, assistanTeacherIds, start, end, list)
                      }
                    })
                  }
                } else {
                  this.$message.error(data.errorMessage)
                }
              })
            }
          } else if (this.ruleForm.repeatable == '1') { //eslint-disable-line
            if (this.ruleForm.repeatDate) {
              start = this.ruleForm.repeatDate[0]
              end = this.ruleForm.repeatDate[1]
              let startTime = ''
              let endTime = ''
              this.flag = false
              this.ruleForm.classTimeList && this.ruleForm.classTimeList.map((item, index) => {
                startTime = this.ruleForm.classTimeList[index].startTime.split(':')
                endTime = this.ruleForm.classTimeList[index].endTime.split(':')
                if (startTime[0] === endTime[0] && startTime[1] === endTime[1]) {
                  this.$message.warning('结束时间不能早于或等于开始时间')
                  this.flag = true
                  return
                } else if (startTime[0] === endTime[0] && startTime[1] > endTime[1]) {
                  this.$message.warning('结束时间不能早于或等于开始时间')
                  this.flag = true
                  return
                } else if (startTime[0] > endTime[0]) {
                  this.$message.warning('结束时间不能早于或等于开始时间')
                  this.flag = true
                  return
                }
              })
              if (this.flag) {
                return
              } else if (!this.flag) {
                let time = ''
                if (this.holidayTimeList && this.holidayTimeList.length > 0) {
                  time = this.holidayTimeList[0]
                } else {
                  time = this.ruleForm.repeatDate[0]
                }
                const payload = {
                  cost: this.courseInfo.cost,
                  maxCreateNum: this.ruleForm.courseNum,
                  repeatable: '1',
                  clsId: this.ruleForm.clsId
                }
                checkStuPeriod(payload).then(res => {
                  const data = res.data
                  if (data.errorCode === 0) {
                    let stuArr = []
                    stuArr = data.stuNames.split(',')
                    if (stuArr && stuArr.length > 0) {
                      this.$refs.gradeStuPeriod.show(data.stuNames, mainTeacherIds, assistanTeacherIds, start, end, list, this.ruleForm.singleDate)
                    } else {
                      const params = {
                        hday: time
                      }
                      excistHoliday(params).then(res => {
                        const data = res.data
                        if (data.result) {
                          if (this.holidayTimeList && this.holidayTimeList.length > 0) {
                            this.$refs.holidayConflict.show(mainTeacherIds, assistanTeacherIds, start, end, list, time, 'arrange')
                          }
                        } else {
                          this.getArrangeCourse(mainTeacherIds, assistanTeacherIds, start, end, list)
                        }
                      })
                    }
                  } else {
                    this.$message.error(data.errorMessage)
                  }
                })
              }
            }
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  color: #46b6ee;
}
.page_title_text {
  font-weight: 500;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(238, 238, 238, 1);
  margin-bottom: 20px;
  padding-left: 0;
  color: #333;
  height: 43px;
  line-height: 28px;
  .btns {
    float: right;
  }
}
.gradeArrange {
  width: 100%;
  height: calc(100vh - 170px);
  overflow: auto;
  .create_arrange_course {
    // width: 1000px;
    p /deep/ {
      .el-input__inner {
        padding: 0 10px;
      }
    }
    .common_block {
      margin-top: 15px;
      overflow: hidden;
      height: 25px;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -webkit-box-pack: start;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10px;
      .title_block {
        height: 14px;
        width: 8px;
        background: #46b6ee;
        margin-right: 10px;
        border-radius: 3px;
      }
      .title_content {
        line-height: 25px;
      }
    }
    .form_item_course_message {
      max-width: 1200px;
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      flex-wrap: wrap;
      flex-direction: row;
      > div {
        min-width: 400px;
        margin-right: 70px;
        line-height: 30px;
      }
      > div:nth-child(2) {
        // margin-right: 13px;
      }
      p {
        margin: 0 0 0 10px;
      }
    }
    .form_item_stu_message {
      width: 100%;
      height: auto;
      overflow: hidden;
    }
    .class_time_list {
      margin-bottom: 14px;
      .class_time_thead {
        list-style: none;
        display: flex;
        margin: 0;
        padding: 0;
        li {
          width: 140px;
          border: 1px solid #ddd;
          border-right: none;
          background: #f1f1f1;
          text-align: center;
          margin: 0;
          padding: 0;
        }
        :last-child {
          border-right: 1px solid #ddd;
        }
      }
      .class_time_tbody {
        list-style: none;
        display: flex;
        margin: 0 0 0 100px;
        padding: 0;
        li {
          width: 140px;
          border: 1px solid #ddd;
          border-top: none;
          border-right: none;
          text-align: center;
          padding: 6px;
          margin: 0;
        }
        li /deep/ .el-form-item__content {
          margin-left: 0 !important;
        }
      }
      .class_time_add {
        margin-left: 98px;
        line-height: 30px;
      }
      .holiday /deep/ .el-form-item__content {
        margin-left: 20px !important;
      }
    }
  }
  .course_num {
    height: 60px;
    width: 286px;
    background: #f1f1f1;
    padding-top: 14px;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    margin-bottom: 14px;
    border-radius: 5px;
    margin-left: 2%;
  }
}
.form_item_course_message /deep/ .el-input--suffix .el-input__inner {
  padding-left: 15px;
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
  width: 130px;
  height: 28px;
  border-radius: 5px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  line-height: 30px;
}
.studyTime /deep/ {
  :last-child .el-form-item__content {
    margin-left: 0px !important;
  }
}
.errorStyle /deep/ .el-input.el-input--mini.el-input--suffix input {
  border-color: #d0021b;
}
</style>
