import Mock from 'mockjs'

const List = []
// const dataAnalyse = []
const count = 20

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      // activityName: '清明踏青',
      // statu: '@guid()',
      // dataList: '@float(1000, 15000, 0, 2)',
      activityId: 191,
      statu: '0',
      activityUrl: 'http://wx.ishanshan.com/thinknode/appMicroActivity/passInActivityPage/7582201712151723/191/36053/3605300001/7605',
      categoryId: 1,
      createTime: '2019-01-17 18:47:33',
      id: 7605,
      isHq: 0,
      name: '复活节复活节复活节复活节复活节复活节复活节复活节复活节复活节复活节复活节',
      orgId: 3605300001,
      orgName: '52-测试账号（校区）',
      status: '2',
      tenantId: 36053,
      title: '复活节',
      type: 'activity',
      validnum: 0,
      icon: 'https://img.ishanshan.com/gimg/n/20190116/e8a4dcec601a9f23ef2c97826cee671a',
      startTime: '2019-01-22 09:15:08',
      endTime: '2019-01-23 09:05:50',
      year: '2019-01-23',
      date: '09:05:50',
      method: '外链',
      stage: '6~12周岁',
      gender: '男',
      tel: '1757869810167',
      lesson: '舞蹈课',
      gift: '雨伞',
      info: '修改备注信息修改备注信息修改备注信息修改备注信息修改备注信息',
      address: '浙江省杭州市',
      relation: '父子',
      parentName: '张三',
      pay: '5元'
    })
  )
}
// dataAnalyse.push(

// )
export default {
  getList: () => {
    return {
      total: List.length,
      items: List
    }
  }
}
