// import Marketing from '@/views/marketing/microInterac/microActivity'
import Layout from '@/views/layout/Layout'
// import ThirdMain from '@/views/layout/components/ThirdMain'
const microWebRouter = {
  path: '/microWeb',
  component: Layout,
  redirect: 'noredirect',
  name: 'microWeb',
  alwaysShow: true,
  meta: {
    title: '微官网',
    icon: 'icon_gb_wgw',
    meunId: '3000000'
  },
  children: [
    {
      path: 'webPreview',
      component: () => import('@/views/microWeb/webPreview/campusHomepage'),
      name: 'webPreview',
      meta: {
        title: '微官网设置',
        meunId: '3020000'
        // icon: 'user'
      }
    },
    {
      path: 'wechatReservation',
      component: () => import('@/views/microWeb/wechatReservation/index'),
      name: 'wechatReservation',
      meta: {
        title: '预约管理',
        meunId: '3010000'
        // icon: 'user'
      }
    },
    {
      path: 'rotation',
      component: () => import('@/views/microWeb/rotation/rotationShow'),
      name: 'rotation',
      meta: {
        title: '轮播图管理',
        meunId: '3030000'
        // icon: 'user'
      }
    },
    {
      path: 'lessonShow',
      component: () => import('@/views/microWeb/lessonShow/index'),
      name: 'lessonShow',
      meta: {
        title: '课程管理',
        meunId: '3040000'
        // icon: 'user'
      }
    },
    {
      path: 'activityShow',
      component: () => import('@/views/microWeb/activityShow/index'),
      name: 'activityShow',
      meta: {
        title: '活动管理',
        meunId: '3050000'
        // icon: 'user'
      }
    }
  ]
}
export default microWebRouter
