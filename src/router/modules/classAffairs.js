import Layout from '@/views/layout/Layout'

const classAffairsRouter = {
  path: '/classAffairs',
  component: Layout,
  redirect: '/classAffairs',
  name: 'classAffairs',
  alwaysShow: true,
  meta: {
    title: '托班教务',
    icon: 'icon_gb_tbjw',
    meunId: '6000000'
  },
  children: [
    {
      path: 'gradeManage',
      component: () =>
        import('@/views/classAffairs/gradeManage/gradeManage.vue'),
      name: 'gradeManage',
      meta: { title: '班级管理', meunId: '6010000' }
    },
    {
      path: 'classArrangement',
      component: () =>
        import('@/views/classAffairs/classArrangement/classArrangeTable.vue'),
      name: 'classArrangement',
      meta: { title: '班级排课', meunId: '6020000' }
    },
    {
      path: 'attendanceRecord',
      component: () =>
        import('@/views/classAffairs/attendanceRecord/attendanceRecordTable.vue'),
      name: 'attendanceRecord',
      meta: { title: '考勤记录', meunId: '6030000' }
    }
  ]
}

export default classAffairsRouter
