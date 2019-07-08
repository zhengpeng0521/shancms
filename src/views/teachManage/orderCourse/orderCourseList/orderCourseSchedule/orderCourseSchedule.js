import $ from 'jquery'
/* 普通搜索 */
import CommonSearch from '@/components/CommonSearch/CommonSearch'
/* 高级搜索 */
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
/* 详情页 */
import OrderCourseDetail from '../../orderCourseList/orderCourseTable/side/orderCourseDetail'
/* 取消上课学员 */
import CancelOrderCourse from '../../orderCourseList/orderCourseTable/dialog/cancelOrderCourse'
/* 取消试听学员 */
import CancelTryStudent from '../../orderCourseList/orderCourseTable/dialog/cancelTryStudent'
/* 单次约课 */
import OnceOrderCourse from '../../orderCourseList/orderCourseTable/dialog/onceOrderCourse'
/* 批量约课 */
import BatchOrderCourse from '../../orderCourseList/orderCourseTable/dialog/batchOrderCourse'
/* 预约补课 */
import OrderMissLesson from '../../orderCourseList/orderCourseTable/dialog/orderMissLesson'
/* 预约试听 */
import OrderTryCourse from '../../orderCourseList/orderCourseTable/dialog/orderTryCourse'
// import SchedulePrintByDay from './schedulePrintByDay.vue'

import {
  queryArrageCourseList,
  courseSummaryQuery
} from '@/api/teachManage/orderCourse'
export default {
  components: {
    CommonSearch,
    AdvancedSearch,
    OrderCourseDetail,
    CancelOrderCourse,
    OnceOrderCourse,
    BatchOrderCourse,
    OrderMissLesson,
    OrderTryCourse,
    CancelTryStudent
  },
  data() {
    return {
      eventInfo: {},
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名/家长电话',
            modelValue: 'stuName',
            isClearable: true,
            itemStyle: 'width:150px'
          },
          {
            itemType: 'select',
            placeholder: '课程名称',
            modelValue: 'courseId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            labelKey: 'title',
            valueKey: 'id',
            apiService: courseSummaryQuery // 是否从接口中获取
          }
        ]
      },
      superSearch: {
        onClear: () => {
          this.onClear()
        },
        onSearch: superValue => {
          this.onSearch(superValue)
        },
        fields: [
          {
            type: 'input',
            key: 'title',
            label: '排课标题'
          },
          {
            type: 'select',
            key: 'isfull',
            label: '是否满班',
            options: [
              { value: '1', label: '满班' },
              { value: '0', label: '未满班' }
            ]
          },
          {
            key: 'roomId',
            type: 'select',
            label: '教室名称',
            placeholder: '教室名称',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SS_CRM}/sysBase/cerp/classroom/summaryQuery`
          },
          {
            type: 'select',
            key: 'mtid',
            label: '主教',
            placeholder: '主教',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'atid',
            label: '助教',
            placeholder: '助教',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'timePicker',
            key: 'studyTime',
            label: '上课时间',
            format: 'HH:mm',
            valueFormat: 'HH:mm',
            isRange: true
          }
        ]
      },
      superValue: {},
      formValue: {}
    }
  },
  created() {},
  methods: {
    getEvents(start, end, timezone, callback) {
      const params = {
        startDate: start.format('YYYY-MM-DD'),
        endDate: this.$moment(end)
          .add(-1, 'days')
          .format('YYYY-MM-DD'),
        stuName: this.formValue.stuName,
        courseId: this.formValue.courseId,
        pageIndex: 0,
        pageSize: 99999,
        title: this.superValue.title,
        isfull: this.superValue.isfull,
        roomId: this.superValue.roomId,
        mtid: this.superValue.mtid,
        atid: this.superValue.atid
      }
      if (this.superValue.studyTime && this.superValue.studyTime.length > 0) {
        params.startTime = this.superValue.studyTime[0]
        params.endTime = this.superValue.studyTime[1]
      }
      delete params.studyTime
      queryArrageCourseList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          const list = data.results
          list.map(item => {
            item.start = item.studyDate + ' ' + item.startTime
            item.end = item.studyDate + ' ' + item.endTime
          })
          callback(list)
        }
      })
    },
    toSchedule() {
      this.$emit('toUpdateSchedule', false)
    },
    schedulePrintByDay() {
      this.$emit('toUpdateSchdulePrint', true)
    },
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      $('#calendar').fullCalendar('refetchEvents')
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      this.formValue = {}
      $('#calendar').fullCalendar('refetchEvents')
      $('#calendar').fullCalendar('today')
    },
    /* 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      $('#calendar').fullCalendar('refetchEvents')
    },
    /* 清空高级搜索 */
    onClear() {
      this.superValue = {}
      $('#calendar').fullCalendar('refetchEvents')
    },
    // 查看事件
    getscheduleInfo(event) {
      this.toOrderCourseDetail(event)
    },
    getCalendar() {
      $('#calendar').fullCalendar({
        // 日历插件的配置
        defaultView: 'agendaDay', // 默认显示
        height: window.innerHeight - 200,
        windowResize: function(view) {
          $('#calendar').fullCalendar(
            'option',
            'height',
            window.innerHeight - 200
          )
        },
        header: {
          center: 'prev, title, next ',
          right: 'agendaDay,agendaWeek'
        },
        editable: false, // 是否可拖动
        allDaySlot: false, // allday 整天的日程是否显示
        slotLabelFormat: 'H:mm', // 确定将在议程视图的垂直轴上显示的时间文本。
        slotDuration: '00:30', // 在agenda的视图中, 两个时间之间的间隔(分钟)
        scrollTime: '09:00', // 当切换到agenda时，初始滚动条滚动到的时间位置，默认在6点钟的位置
        minTime: '00:00', // 设置显示的时间从几点开始
        maxTime: '24:00', // 设置显示的时间从几点结束
        buttonText: {
          // 设置日历头部各按钮的显示文本信息
          agendaDay: '按天',
          agendaWeek: '按周'
        },
        titleFormat: 'YYYY-MM-DD', // 标题时间显示
        events: this.getEvents,
        eventLimit: true,
        eventLimitText: '更多', // 当一块区域内容太多以"+2 more"格式显示时，这个more的名称自定义（应该与eventLimit: true一并用）
        dayPopoverFormat: 'YYYY年M月d日', // 点开"+2 more"弹出的小窗口标题，与eventLimitClick可以结合用
        eventLimitClick: 'popover',
        eventMouseover: function(calEvent, jsEvent, view) {
          // 鼠标在日程区块上时触发
          // $(this).attr('title', calEvent.title)
          // var content = '<div>+' + calEvent.endTime + '+</div>'
          // $('#popover').prepend(content)
          // var add = document.getElementById('popover')
          // add.style.display = 'block'
          this.eventInfo = calEvent
          // console.info('cal', calEvent)
        },
        eventMouseout: function(calEvent, jsEvent, view) {
          // 鼠标从日程区块离开时触发
          $('.hover-container').addClass('none')
          var add = document.getElementById('popover')
          add.style.display = 'none'
        },
        eventRender: function(event, element) {
          var start_date = $('#calendar').fullCalendar('getView').start
          var end_date = $('#calendar').fullCalendar('getView').end
          console.log(
            start_date.format('YYYY-MM-DD') +
              'sart----end date' +
              end_date.format('YYYY-MM-DD')
          )
        },
        dayClick: function(date, jsEvent, view) {
          console.info(date.format('YYYY-MM-DD'), 'dayClick')
        },
        eventClick: this.getscheduleInfo
      })
    },

    /* 上课学员取消 */
    getCancelData(row, detail) {
      this.$refs.cancel.show(row, detail)
    },
    /* 排队学员取消 */
    getLineCancelData(row, detail) {
      this.$refs.cancel.show(row, detail)
    },
    /* 试听学员取消 */
    getTryCancelData(row, detail) {
      this.$refs.cancelTry.show(row, detail)
    },
    /* 单次约课 */
    getOnceOrderCourse(val, detail) {
      this.$refs.onceOrderCourse.show(val, detail)
    },
    /* 批量约课 */
    getBatchOrderCourse(val, detail) {
      this.$refs.batchOrderCourse.show(val, detail)
    },
    /* 预约补课 */
    getOrderMissCourse(val, detail) {
      this.$refs.orderMissLesson.show(val, detail)
    },
    /* 预约试听 */
    getOrderTryCourse(val, detail) {
      this.$refs.orderTryCourse.show(val, detail)
    },
    /* 单次约课更新 */
    getUpdateOnceOrder(val) {
      this.$refs.orderDetail.show(val)
    },
    /* 转为上课学员 */
    getInlineUpdate(detail) {
      this.$refs.orderDetail.show(detail)
    },
    /* 约课详情 */
    toOrderCourseDetail(row) {
      this.$refs.orderDetail.show(row)
    }
  },
  mounted() {
    this.getCalendar()
  }
}
