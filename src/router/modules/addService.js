import Layout from '@/views/layout/Layout'
import ThirdMain from '@/views/layout/components/ThirdMain'

const addServiceRouter = {
  path: '/addService',
  component: Layout,
  redirect: '/addService',
  name: 'AddService',
  alwaysShow: true,
  meta: {
    title: '增值服务',
    icon: 'icon_gb_zzfw',
    meunId: '8000000'
  },
  children: [
    {
      path: 'cashierMgr',
      component: () => import('@/views/table/dynamicTable/index'),
      name: 'cashierMgr',
      meta: {
        title: '收银宝',
        url: process.env.SYB_URL
      }
    },
    {
      path: 'callSystem',
      component: ThirdMain,
      name: 'CallSystem',
      meta: {
        title: '呼叫系统',
        meunId: '8020000',
        cn: [
          {
            component: () =>
              import('@/views/addServices/callSystem/seatsMgr.vue'),
            name: 'seatsMgr',
            meta: { title: '坐席管理', meunId: '8020100' }
          },
          {
            component: () =>
              import('@/views/addServices/callSystem/callRecords.vue'),
            name: 'callRecords',
            meta: { title: '通话记录', meunId: '8020200' }
          }
        ]
      }
    },
    {
      path: 'publicPraise',
      component: () => import('@/views/table/dynamicTable/index'),
      name: 'PublicPraise',
      meta: { title: '口碑',
        url: process.env.KB_URL
      }
    }
  ]
}

export default addServiceRouter
