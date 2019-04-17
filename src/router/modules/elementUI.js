import Layout from '@/views/layout/Layout'

const sampleStyle = {
  path: '/sampleStyle',
  component: Layout,
  redirect: 'noredirect',
  name: 'allSampleStyle',
  alwaysShow: false,
  meta: {
    title: '默认eleUI样式',
    icon: 'bug'
  },
  children: [
    {
      path: 'allstyle',
      component: () => import('@/views/elementStyle/sampleStyle'),
      name: 'sampleStyle',
      meta: { title: 'sampleStyle', noCache: true }
    }
  ]
}
export default sampleStyle
