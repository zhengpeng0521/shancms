// import Marketing from '@/views/marketing/microInterac/microActivity'
import Layout from '@/views/layout/Layout'
import ThirdMain from '@/views/layout/components/ThirdMain'
const marketingRouter = {
  path: '/marketing',
  component: Layout,
  redirect: 'noredirect',
  name: 'marketing',
  alwaysShow: true,
  meta: {
    title: '招生宝',
    icon: 'icon_gb_zsyx',
    meunId: '2000000'
  },
  children: [
    {
      path: 'microGame',
      name: 'microGame',
      component: ThirdMain,
      meta: {
        title: '微游戏',
        noCache: true,
        meunId: '2020000',
        // icon: 'user',
        // mKey:00002,
        cn: [
          {
            component: () => import('@/views/marketing/microGame/index'),
            name: 'microGameIndex',
            meta: {
              title: '微游戏',
              meunId: '2020100'
            }
          },
          {
            component: () => import('@/views/marketing/microGame/myGame'),
            name: 'myGame',
            meta: {
              title: '我的',
              meunId: '2020200'
            }
          }
        ]
      }
    }, {
      path: 'microActivity',
      name: 'microActivity',
      component: ThirdMain,
      meta: {
        title: '微活动',
        noCache: true,
        meunId: '2030000',
        // icon: 'user',
        // mKey:00002,
        cn: [
          {
            component: () =>
              import('@/views/marketing/microInterac/microActivity'),
            name: 'microActivityIndex',
            meta: {
              title: '微活动',
              meunId: '2030100'
            }
          },
          {
            component: () =>
              import('@/views/marketing/microInterac/myActivity'),
            name: 'myActivity',
            meta: {
              title: '我的',
              meunId: '2030200'
            }
          }
        ]
      }
    },
    {
      path: 'marketAdmin',
      name: 'marketAdmin',
      component: ThirdMain,
      meta: {
        title: '市场活动',
        noCache: true,
        meunId: '2040000',
        // icon: 'user',
        // mKey:00002,
        cn: [
          {
            component: () => import('@/views/marketing/marketAdmin/index'),
            name: 'marketActivity',
            meta: {
              title: '市场活动',
              meunId: '2040100'
            }
          },
          {
            component: () =>
              import('@/views/marketing/marketAdmin/offlineLeaflet'),
            name: 'offlineLeaflet',
            meta: {
              title: '传单海报',
              meunId: '2040200'
            }
          },
          {
            component: () => import('@/views/marketing/marketAdmin/my'),
            name: 'myLeaflet',
            meta: {
              title: '我的传单海报',
              meunId: '2040300'
            }
          }
        ]
      }
    }
  ]
}
export default marketingRouter
