<template>
  <div>
    <div
      v-if="!isShowBooking"
      class="gradeArrange"
    >
      <div class="goBack">
        <div class="page_title_text">
          <span>复制排课</span>
          <div class="btns">
            <el-button
              type="cancel_btn"
              @click="close"
            >关闭</el-button>
            <el-button
              type="primary"
              @click="submit('ruleForm')"
            >生成排课</el-button>
            <el-button
              type="primary"
              @click="arrangeCourseAndOrder('ruleForm')"
            >排课并约课</el-button>
          </div>
        </div>
      </div>
      <div style="height:calc(100% - 63px);overflow:auto">
        <div class="create_arrange_course">
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
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
                  filterable
                  style="width:300px"
                >
                  <el-option
                    :label="weekOption.label"
                    :value="weekOption.value"
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
                    style="width:300px"
                    filterable
                    @change="courseNameChange"
                  >
                    <el-option
                      v-for="item of lessonDeptList"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <p class="costTime">
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
                  filterable
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
                  filterable
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
                label="教室："
                prop="roomId"
                class="is-error"
              >
                <el-select
                  v-model="ruleForm.roomId"
                  :class="clsRoomStatus ? 'errorStyle' : ''"
                  placeholder="请选择教室"
                  style="width:300px"
                  clearable
                  filterable
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
                  placeholder="请选择上课日期"
                  value-format="yyyy-MM-dd"
                  style="width:300px"
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
                    :picker-options="pickerOptions"
                    v-model="ruleForm.repeatDate"
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
                          filterable
                          @change="weekChange"
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
                  style="margin:0 6px 0 0;display:inline-block;vertical-align:top"
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
    </div>
    <!-- 预约 -->
    <BookingClass
      v-if="isShowBooking"
      ref="bookingClass"
      :row-info="rowInfo"
      :create-list="createList"
      @toUpdateForm="getUpdateForm"
      @toUpdateTable="getCopyBookingClassLook"
    />
    <ArrangeSuccess
      ref="arrangeSucc"
      @toUpdateTable="getUpdateTable"
      @toUpdateOrgName="getUpdateOrgName"
    />
    <CreateArrangeCourseConflict ref="createConflict" />
    <!-- 是否是节假日 -->
    <CourseArrangeHolidayConflict
      ref="holidayConflict"
      @toCreateArrage="getCreateArrage"
    />
  </div>
</template>
<script>
import BookingClass from './bookingClass'
import ArrangeSuccess from './dialog/arrangeSuccess'
import { getWeekDays } from '../../../../utils/dateFormat'
import CreateArrangeCourseConflict from '../dialog/createArrangeCourseConflict'
import CourseArrangeHolidayConflict from '../dialog/courseArrangeHolidayConflict'
import { excistHoliday, createArrange, mainQueryBack, queryCourseById, courseThemeQuery, courseSummaryQuery, tenantUserSummaryQuery, queryClassroomList, listByTime } from '@/api/teachManage/arrangeCourse'
export default {
  components: {
    BookingClass,
    CreateArrangeCourseConflict,
    ArrangeSuccess,
    CourseArrangeHolidayConflict
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
        defaultOrgId: '', // 校区选择
        courseId: '', // 课程名称
        cost: '', // 课时
        month: '', // 月
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
        selfOrder: false, // 是否允许自主约课
        checkConflict: true, // 是否检查冲突
        processPre: '', // 进度前缀
        processSuf: '', // 当前进度
        startCourseThemeId: '', // 上课主题
        courseNum: '0', // 上课次数
        classTimeList: [{ // 循环新增
          week: '',
          startTime: '00:00',
          endTime: '00:00'
        }]
      },
      flag: true,
      rules: {
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
        maxNum: [
          { required: true, message: '请输入最大人数', trigger: 'change' },
          { validator: checkNum, trigger: 'blur' }
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
      isShowBooking: false, // 是否打开约课界面
      roomList: [], // 教室列表
      schoolThemeList: [], // 上课主题列表
      teachList: [], // 老师列表
      lessonDeptList: [], // 课程列表
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
      mainArrangeInfo: {}, // 排课信息
      rowInfo: {},
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
      // this.ruleForm.singleDate = ''
      // this.ruleForm.repeatDate = ''
    }
  },
  mounted() {
    if (this.$route.params.rowInfo) {
      this.rowInfo = this.$route.params.rowInfo
      this.mainQueryBack()
      this.getCourseById()
      this.getCourseThemeList()
    }
    this.getClassroomList()
    this.getUserlist()
    this.getCourseList()
  },
  methods: {
    /* 关闭 */
    close() {
      this.$router.push({ name: 'courseSchedule' })
    },
    /* 生成排课值传递 */
    getUpdateTable(start, end) {
      this.$router.push({ name: 'courseSchedule', params: { start, end }})
    },
    /* 排课 继续排课 */
    getUpdateOrgName() {
      this.$router.push({ name: 'newArrangeCourse' })
    },
    /* 排课并约课的继续排课刷新 */
    getUpdateForm(val) {
      this.$router.push({ name: 'newArrangeCourse' })
    },
    /* 排课并约课 查看 */
    getCopyBookingClassLook(start, end) {
      this.$router.push({ name: 'courseSchedule', params: { start, end }})
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
    /* 课程名称改变 */
    courseNameChange(val) {
      const params = {
        id: val
      }
      queryCourseById(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.courseInfo = data
          this.ruleForm.cost = this.courseInfo.cost + '' + '课时'
          this.ruleForm.month = this.courseInfo.minMa + '~' + this.courseInfo.maxMa + '个月'
          this.ruleForm.courseName = this.courseInfo.title
          const params = {
            courseId: val
          }
          courseThemeQuery(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.schoolThemeList = data.results
            } else {
              this.$message.error(data.errorMessage || '获取班级主题列表失败')
            }
          })
        } else {
          this.$message.error(data.errorMessage || '获取课程明细失败')
        }
      })
    },
    colorChange(val) {
      this.ruleForm.colorName = val
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
    /* 课程明细摘要 */
    getCourseById() {
      const params = {
        id: this.rowInfo.courseId
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
          this.ruleForm.courseId = data.courseId
          const mainTeacherIds = data.mtids && data.mtids.split(',')
          if (mainTeacherIds && mainTeacherIds.length > 0) {
            this.ruleForm.mainTeacherIds = mainTeacherIds
          }
          const assistanTeacherIds = data.atids && data.atids.split(',')
          if (assistanTeacherIds && assistanTeacherIds.length > 0) {
            this.ruleForm.assistanTeacherIds = assistanTeacherIds
          }
          this.ruleForm.roomId = data.roomId
          this.ruleForm.colorName = data.color
          this.ruleForm.maxNum = data.maxNum
          this.ruleForm.maxAttNum = data.maxAttNum === -1 ? '' : data.maxAttNum
          this.ruleForm.maxMulNum = data.maxMulNum === -1 ? '' : data.maxMulNum
          this.ruleForm.maxTryNum = data.maxTryNum === -1 ? '' : data.maxTryNum
          this.ruleForm.repeatable = data.repeatable
          if (this.ruleForm.repeatable === '0') {
            this.ruleForm.singleDate = data.startDate
            this.ruleForm.classTimeStart = data.startTime
            this.ruleForm.classTimeEnd = data.endTime
          } else if (this.ruleForm.repeatable === '1') {
            const start = data.startDate
            const end = data.endDate
            this.ruleForm.repeatDate = [start, end]
            this.ruleForm.classTimeList = data.list
            this.ruleForm.courseNum = data.num
          }
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
    /* 生成排课接口 */
    getArrangeCourse(mainTeacherIds, assistanTeacherIds, start, end, list) {
      const params = {
        orgId: this.courseInfo.orgId,
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
      createArrange(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.orgName = this.ruleForm.defaultOrgId
          this.$refs.arrangeSucc.show(start, end)
          this.$refs['ruleForm'].resetFields()
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
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 节假日冲突-生成排课 */
    getCreateArrage(mainTeacherIds, assistanTeacherIds, start, end, list, type) {
       if (type == 'arrange') { //eslint-disable-line
        this.getArrangeCourse(mainTeacherIds, assistanTeacherIds, start, end, list)
      } else if (type == 'arrangeAndOrder') { //eslint-disable-line
        this.getArrangeAndOrder(mainTeacherIds, assistanTeacherIds, start, end, list)
      }
    },
    /* 生成排课 */
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
          let list = ''
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
                const params = {
                  hday: time
                }
                excistHoliday(params).then(res => {
                  const data = res.data
                  if (data.result) {
                    if (this.holidayTimeList && this.holidayTimeList.length > 0) {
                      this.$refs.holidayConflict.show(mainTeacherIds, assistanTeacherIds, start, end, list, this.holidayTimeList[0], 'arrange')
                    }
                  } else {
                    this.getArrangeCourse(mainTeacherIds, assistanTeacherIds, start, end, list)
                  }
                })
              }
            }
          }
        } else {
          return false
        }
      })
    },
    /* 排课并约课接口 */
    getArrangeAndOrder(mainTeacherIds, assistanTeacherIds, start, end, list) {
      const params = {
        orgId: this.courseInfo.orgId,
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
      createArrange(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.createList = data
          this.isShowBooking = true
          const newReatable = this.ruleForm.repeatable
          this.$nextTick(() => {
            this.$refs.bookingClass.show(newReatable, start, end, this.rowInfo.courseId)
          })
          this.$refs['ruleForm'].resetFields()
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
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 排课并约课 */
    arrangeCourseAndOrder(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
          let list = ''
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
              const params = {
                hday: this.ruleForm.singleDate
              }
              excistHoliday(params).then(res => {
                const data = res.data
                if (data.result) {
                  this.$refs.holidayConflict.show(mainTeacherIds, assistanTeacherIds, start, end, list, this.ruleForm.singleDate, 'arrangeAndOrder')
                } else {
                  this.getArrangeAndOrder(mainTeacherIds, assistanTeacherIds, start, end, list)
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
                const params = {
                  hday: time
                }
                excistHoliday(params).then(res => {
                  const data = res.data
                  if (data.result) {
                    if (this.holidayTimeList && this.holidayTimeList.length > 0) {
                      this.$refs.holidayConflict.show(mainTeacherIds, assistanTeacherIds, start, end, list, this.holidayTimeList[0], 'arrangeAndOrder')
                    }
                  } else {
                    this.getArrangeAndOrder(mainTeacherIds, assistanTeacherIds, start, end, list)
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
    /* 返回 */
    // goBack() {
    //   this.$emit('toParent', true)
    //   this.$refs['ruleForm'].resetFields()
    //   this.$refs['ruleForm'].clearValidate()
    // }
  }
}
</script>
<style lang="scss" scoped>
a {
  color: #46b6ee;
}
.gradeArrange {
  width: 100%;
  height: calc(100vh - 68px);
  overflow: auto;
  padding: 20px;
  .goBack {
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
  }
  .create_arrange_course {
    // width: 1000px;
    .common_block {
      margin-top: 12px;
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
      .costTime {
        margin: 0 10px;
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
  width: 150px;
  height: 30px;
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
