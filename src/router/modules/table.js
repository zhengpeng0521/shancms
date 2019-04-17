/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'
import ThirdMain from '@/views/layout/components/ThirdMain'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  alwaysShow: true,
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamicTable/index'),
      name: 'DynamicTable',
      meta: { title: 'dynamicTable' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/table/dragTable'),
      name: 'DragTable',
      meta: { title: 'dragTable' },
      alwaysShow: true
    },
    {
      path: 'tableTest',
      component: () => import('@/views/table/tableTest'),
      name: 'tableTest',
      meta: { title: 'tableTest' },
      alwaysShow: true
    },
    {
      path: 'dynamic-table_1',
      component: () => import('@/views/table/dynamicTable/index'),
      name: 'dynamic-table_1',
      meta: { title: 'dynamic-table_1' }
    },
    {
      path: 'drag-table_1',
      component: () => import('@/views/table/dragTable'),
      name: 'drag-table_1',
      meta: { title: 'drag-table_1' },
      alwaysShow: true
    },
    {
      path: 'tableTest_1',
      component: () => import('@/views/table/tableTest'),
      name: 'tableTest_1',
      meta: { title: 'tableTest_1' },
      alwaysShow: true
    },
    {
      path: 'thirdLevel',
      component: ThirdMain,
      name: 'thirdLevel',
      meta: {
        title: 'thirdLevel',
        cn: [
          {
            path: 'tableTest_31',
            component: () => import('@/views/table/tableTest'),
            name: 'tableTest_31',
            meta: { title: '添加名单' },
            alwaysShow: true
          },
          {
            path: 'tableTest_32',
            component: () => import('@/views/table/dragTable'),
            name: 'tableTest_32',
            meta: { title: '我负责的试听' },
            alwaysShow: true
          }
        ]
      },
      alwaysShow: false,
      noShowingChildren: true
    }
  ]
}
export default tableRouter
