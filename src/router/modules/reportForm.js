import Layout from '@/views/layout/Layout'

import ThirdMain from '@/views/layout/components/ThirdMain'

const reportForm = {
  path: '/report',
  component: Layout,
  redirect: 'noredirect',
  name: 'report',
  alwaysShow: true,
  meta: {
    title: '数据中心',
    icon: 'icon_gb_sjzx',
    meunId: '7000000'
  },
  children: [
    {
      path: 'crm_form',
      // component: () => import('@/views/orgSet/staffSet/staffSet'),
      name: 'crmForm',
      component: ThirdMain,
      meta: {
        title: '销售报表',
        noCache: true,
        meunId: '7010000',
        // icon: 'user',
        // mKey:00002,
        cn: [
          {
            component: () =>
              import('@/views/reportForm/crmForm/leadsSource/LeadsSource'),
            name: 'leadsSourse',
            meta: { title: '名单来源表', meunId: '7010100' }
          },
          {
            component: () =>
              import('@/views/reportForm/crmForm/saleWork/SaleWork'),
            name: 'saleWork',
            meta: { title: '销售工作表', meunId: '7010200' }
          },
          {
            component: () =>
              import('@/views/reportForm/crmForm/saleAchivement/SaleAchivement'),
            name: 'saleAchivement',
            meta: { title: '销售业绩表', meunId: '7010500' }
          },
          {
            component: () =>
              import('@/views/reportForm/crmForm/contractIncome/ContractIncome'),
            name: 'contractIncome',
            meta: { title: '合同收入表', meunId: '7010300' }
          },
          {
            component: () =>
              import('@/views/reportForm/crmForm/courseSale/CourseSale'),
            name: 'courseSale',
            meta: { title: '课程售卖表', meunId: '7010600' }
          },
          {
            component: () =>
              import('@/views/reportForm/crmForm/giveRecord/GiveRecord'),
            name: 'giveRecord',
            meta: { title: '赠课记录表', meunId: '7010400' }
          }
        ]
      }
    },
    {
      path: 'erp_form',
      // component: () => import('@/views/orgSet/campusSet/campusSet'),
      name: 'erpFrom',
      component: ThirdMain,
      meta: {
        title: '教学报表',
        noCache: true,
        meunId: '7020000',
        // icon: 'qq',
        cn: [
          {
            component: () =>
              import('@/views/reportForm/erpForm/useClass/UseClass'),
            name: 'useClass',
            meta: { title: '学员消课表', meunId: '7020100' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/silentStu/SilentStu'),
            name: 'silentStu',
            meta: { title: '沉默学员表', meunId: '7020200' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/stuAttence/StuAttence'),
            name: 'stuAttence',
            meta: { title: '学员考勤表', meunId: '7020300' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/teaching/Teaching'),
            name: 'teaching',
            meta: { title: '老师授课表', meunId: '7020400' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/classroomUse/ClassroomUse'),
            name: 'classroomUse',
            meta: { title: '教室利用表', meunId: '7020500' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/classTimeDetail/ClassTimeDetail'),
            name: 'classTimeDetail',
            meta: { title: '课时详情表', meunId: '7020600' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/teacherSalary/TeacherSalary'),
            name: 'teacherSalary',
            meta: { title: '老师工资表', meunId: '7020700' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/classMonth/ClassMonth'),
            name: 'classMonth',
            meta: { title: '课时月结表', meunId: '7020800' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/timeMonth/TimeMonth'),
            name: 'timeMonth',
            meta: { title: '时长月结表', meunId: '7020900' }
          }
        ]
      }
    }
  ]
}
export default reportForm
