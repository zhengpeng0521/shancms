import Layout from '@/views/layout/Layout'
import ThirdMain from '@/views/layout/components/ThirdMain'

const teachRouter = {
  path: '/teach',
  component: Layout,
  redirect: '/teach',
  name: 'teach',
  alwaysShow: true,
  meta: {
    title: '教务管理',
    icon: 'icon_gb_jwgl',
    meunId: '5000000'
  },
  children: [
    {
      path: 'course',
      component: () => import('@/views/teachManage/course/courseTable.vue'),
      name: 'course',
      meta: { title: '课程管理', meunId: '5020000' }
    },
    {
      path: 'grade',
      component: () => import('@/views/teachManage/grade/gradeTable.vue'),
      name: 'grade',
      meta: { title: '班级管理', meunId: '5030000' }
    },
    {
      path: 'courseSchedule',
      component: ThirdMain,
      name: 'courseSchedule',
      meta: {
        title: '排课管理',
        meunId: '5040000',
        cn: [
          {
            path: 'classRecords',
            component: () =>
              import('@/views/teachManage/courseSchedule/classRecords/classRecordsTable.vue'),
            name: 'classRecords',
            meta: { title: '排课记录', meunId: '5040100' },
            alwaysShow: true
          },
          {
            path: 'classCopy',
            component: () =>
              import('@/views/teachManage/courseSchedule/classCopy/classCopyTable.vue'),
            name: 'classCopy',
            meta: { title: '排课复制', meunId: '5040200' },
            alwaysShow: true
          }
        ]
      }
    },
    {
      path: '/newArrangeCourse',
      name: 'newArrangeCourse',
      component: () =>
        import('@/views/teachManage/courseSchedule/classRecords/newArrangeCourse.vue'),
      hidden: true
    },
    {
      path: '/copyCourseArrange',
      name: 'copyCourseArrange',
      component: () =>
        import('@/views/teachManage/courseSchedule/classRecords/copyCourseArrange.vue'),
      hidden: true
    },
    {
      path: 'orderCourse',
      component: ThirdMain,
      name: 'orderCourse',
      meta: {
        title: '约课管理',
        meunId: '5050000',
        cn: [
          {
            path: 'orderCourse',
            component: () =>
              import('@/views/teachManage/orderCourse/orderCourseList/orderCourseTable/orderCourseTable.vue'),
            name: 'orderCourseTable',
            meta: { title: '约课列表', meunId: '5050100' },
            alwaysShow: true
          },
          {
            path: 'stuOrderCourse',
            component: () =>
              import('@/views/teachManage/orderCourse/stuOrderCourseRecord/stuOrderCourseTable.vue'),
            name: 'stuOrderCourse',
            meta: { title: '约课记录', meunId: '5050200' },
            alwaysShow: true
          }
        ]
      }
    },
    {
      path: 'attendance',
      component: ThirdMain,
      name: 'attendance',
      meta: {
        title: '学员考勤',
        meunId: '5060000',
        cn: [
          {
            path: 'stuAttendance',
            component: () =>
              import('@/views/teachManage/attendance/stuAttendance/stuAttendance.vue'),
            name: 'stuAttendance',
            meta: { title: '学员考勤', meunId: '5060100' },
            alwaysShow: true
          },
          {
            path: 'leaveAudit',
            component: () =>
              import('@/views/teachManage/attendance/leaveAudit/leaveAudit.vue'),
            name: 'leaveAudit',
            meta: { title: '请假审核', meunId: '5060200' },
            alwaysShow: true
          },
          {
            path: 'printSignInTable',
            component: () =>
              import('@/views/teachManage/attendance/printSignInTable/printSignInTable.vue'),
            name: 'printSignInTable',
            meta: { title: '签到表打印', meunId: '5060300' },
            alwaysShow: true
          },
          {
            path: 'signInRecord',
            component: () =>
              import('@/views/teachManage/attendance/signInRecord/signInRecord.vue'),
            name: 'signInRecord',
            meta: { title: '签到记录', meunId: '5060400' },
            alwaysShow: true
          }
        ]
      }
    },
    {
      path: 'courseware',
      component: () => import('@/views/teachManage/courseware/courseware.vue'),
      name: 'courseware',
      meta: { title: '教学课件', meunId: '5070000' }
    },
    {
      path: 'homeSchoolConnection',
      component: ThirdMain,
      name: 'homeSchoolConnection',
      meta: {
        title: '家校通',
        meunId: '5080000',
        cn: [
          {
            path: 'stuProduction',
            component: () =>
              import('@/views/teachManage/homeSchoolConnection/stuProduction/stuProductTable.vue'),
            name: 'stuProduction',
            meta: { title: '学员作品', meunId: '5080100' },
            alwaysShow: true
          },
          {
            path: 'homeSchoolReview',
            component: () =>
              import('@/views/teachManage/homeSchoolConnection/homeSchoolReview/homeSchoolReviewTable.vue'),
            name: 'homeSchoolReview',
            meta: { title: '家校互评', meunId: '5080200' },
            alwaysShow: true
          }
        ]
      }
    }
  ]
}

export default teachRouter
