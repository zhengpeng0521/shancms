import Layout from '@/views/layout/Layout'
import ThirdMain from '@/views/layout/components/ThirdMain'

const crmRouter = {
  path: '/crm',
  component: Layout,
  redirect: '/crm',
  name: 'Crm',
  alwaysShow: true,
  meta: {
    title: '学员CRM',
    icon: 'icon_gb_crm',
    meunId: '4000000'
  },
  children: [
    // {
    //   path: 'dataMgr',
    //   component: () => import('@/views/table/dynamicTable/index'),
    //   name: 'DataMgr',
    //   meta: { title: '数据看板', meunId: '4010000' }
    // },
    {
      path: 'studentMgr',
      component: ThirdMain,
      name: 'StudentMgr',
      meta: {
        title: '学员信息',
        meunId: '4020000',
        cn: [
          {
            component: () =>
              import('@/views/crm/studentInfo/lantentStu/lantentStu.vue'),
            name: 'lantentStu',
            meta: { title: '潜在学员', meunId: '4020100' }
          },
          {
            component: () =>
              import('@/views/crm/studentInfo/readingStu/readingStu.vue'),
            name: 'readingStu',
            meta: { title: '在读学员', meunId: '4020200' }
          },
          {
            component: () =>
              import('@/views/crm/studentInfo/previousStu/previousStu.vue'),
            name: 'previousStu',
            meta: { title: '往期学员', meunId: '4020300' }
          },
          {
            component: () =>
              import('@/views/crm/studentInfo/highSeas/highSeas.vue'),
            name: 'highSeas',
            meta: { title: '公海池', meunId: '4020400' }
          },
          {
            component: () =>
              import('@/views/crm/studentInfo/recycleBin/recycleBin.vue'),
            name: 'recycleBin',
            meta: { title: '回收站', meunId: '4020500' }
          }
        ]
      }
    },
    {
      path: 'followMgr',
      component: () => import('@/views/crm/followRecord/followRecord.vue'),
      name: 'FollowMgr',
      meta: { title: '跟进记录', meunId: '4030000' }
    },
    {
      path: 'visitMgr',
      component: () => import('@/views/crm/visitMgr/visitRecord'),
      name: 'VisitMgr',
      meta: { title: '到访管理', meunId: '4040000' }
    },
    {
      path: 'auditionMgr',
      component: () => import('@/views/crm/auditionMgr/offlineAudition.vue'),
      name: 'AuditionMgr',
      meta: { title: '试听管理', meunId: '4050000' }
    },
    {
      path: 'contractMgr',
      component: ThirdMain,
      name: 'ContractMgr',
      meta: {
        title: '合同管理',
        meunId: '4060000',
        cn: [
          {
            component: () =>
              import('@/views/crm/contractMgr/contractOrder.vue'),
            name: 'contractOrder',
            meta: { title: '合同订单', meunId: '4060100' }
          },
          {
            component: () =>
              import('@/views/crm/contractMgr/contractSetmeal.vue'),
            name: 'contractSetmeal',
            meta: { title: '合同套餐', meunId: '4060200' }
          }
        ]
      }
    },
    {
      path: 'financeMgr',
      component: ThirdMain,
      name: 'FinanceMgr',
      meta: {
        title: '财务管理',
        meunId: '4070000',
        cn: [
          {
            component: () => import('@/views/crm/financeMgr/earnestMgr.vue'),
            name: 'earnestMgr',
            meta: { title: '订金管理', meunId: '4070100' }
          },
          {
            component: () => import('@/views/crm/financeMgr/gatheringMgr.vue'),
            name: 'gatheringMgr',
            meta: { title: '收款管理', meunId: '4070200' }
          },
          {
            component: () => import('@/views/crm/financeMgr/refundMgr.vue'),
            name: 'refundMgr',
            meta: { title: '退款管理', meunId: '4070300' }
          }
        ]
      }
    },
    {
      path: 'stuAccountMgr',
      component: ThirdMain,
      name: 'StuAccountMgr',
      meta: {
        title: '学员账户',
        meunId: '4080000',
        cn: [
          {
            component: () => import('@/views/crm/stuAccount/stuAccount.vue'),
            name: 'stuAccount',
            meta: { title: '学员账户', meunId: '4080100' }
          },
          {
            component: () => import('@/views/crm/stuAccount/giveClass.vue'),
            name: 'giveClass',
            meta: { title: '赠课记录', meunId: '4080200' }
          },
          {
            component: () => import('@/views/crm/stuAccount/turnClass.vue'),
            name: 'turnClass',
            meta: { title: '转课记录', meunId: '4080300' }
          },
          {
            component: () => import('@/views/crm/stuAccount/changeSchool.vue'),
            name: 'changeSchool',
            meta: { title: '转校记录', meunId: '4080400' }
          },
          {
            component: () => import('@/views/crm/stuAccount/cancelClass.vue'),
            name: 'cancelClass',
            meta: { title: '消课记录', meunId: '4080500' }
          }
        ]
      }
    },
    {
      path: 'integralMgr',
      component: ThirdMain,
      name: 'IntegralMgr',
      meta: {
        title: '积分管理',
        meunId: '4090000',
        cn: [
          {
            component: () => import('@/views/crm/integralMgr/accountMgr.vue'),
            name: 'integralChange',
            meta: { title: '积分账户', meunId: '4090100' }
          },
          {
            component: () => import('@/views/crm/integralMgr/productMgr.vue'),
            name: 'productMgr',
            meta: { title: '商品管理', meunId: '4090200' }
          },
          {
            component: () =>
              import('@/views/crm/integralMgr/integralChange.vue'),
            name: 'accountMgr',
            meta: { title: '积分变动', meunId: '4090300' }
          }
        ]
      }
    },
    {
      path: 'marketMgr',
      component: ThirdMain,
      name: 'marketMgr',
      meta: {
        title: '进销存管理',
        meunId: '4100000',
        cn: [
          {
            component: () => import('@/views/crm/marketMgr/materialsMgr.vue'),
            name: 'materialsMgr',
            meta: { title: '物资管理', meunId: '4100100' }
          },
          {
            component: () => import('@/views/crm/marketMgr/inventoryMgr.vue'),
            name: 'inventoryMgr',
            meta: { title: '库存管理', meunId: '4100200' }
          },
          {
            component: () =>
              import('@/views/crm/marketMgr/inventoryDetail.vue'),
            name: 'inventoryDetail',
            meta: { title: '库存明细', meunId: '4100300' }
          }
        ]
      },
      alwaysShow: false,
      noShowingChildren: true
    }
  ]
}

export default crmRouter
