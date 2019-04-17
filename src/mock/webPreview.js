import Mock from 'mockjs'
const List = []
const ListData = []
const ActivityList = []
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
    status: '1',
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
    pay: '5元',
    data: [{
      dataname: '课程',
      datastatus: '0'
    }]
  })
)
ActivityList.push({
  'id': '1088710436301352960',
  'name': 'fffff',
  'tenantId': '27',
  'applystartTime': '2019-01-25 16:07:00',
  'applyendTime': '2019-02-02 16:07:00',
  'waitNum': '1',
  'sucNum': '1',
  'status': '2',
  'address': '//wx.ishanshan.com/thinknode/weixin/webSite?router=microActivityDetail&cmpAppid=wxe5bd129decc89caf&appid=wx99b166ead9de02f1&tenantId=27&orgId=242&actId=991919908524679168',
  'sort': 9999,
  'createTime': '2019-01-25 16:09:30',
  'orgIds': ['3536'],
  'isHq': 0
}, {
  'id': '991919908524679168',
  'name': '都是防守打法',
  'tenantId': '27',
  'applystartTime': '2018-05-02 13:58:00',
  'applyendTime': '2018-05-27 13:58:00',
  'waitNum': '0',
  'sucNum': '0',
  'status': '1',
  'sort': 9999,
  'createTime': '2018-05-03 13:58:30',
  'orgIds': ['242', '3535', '3536', '59167', '2700001'],
  'isHq': 1
}, {
  'id': '433704181589737472',
  'name': '撒地方',
  'tenantId': '27',
  'applystartTime': '2018-04-04 19:05:00',
  'applyendTime': '2018-05-31 19:05:00',
  'waitNum': '0',
  'sucNum': '0',
  'status': '1',
  'sort': 9999,
  'createTime': '2018-04-11 19:05:35',
  'orgIds': ['242', '3535', '3536', '59167', '2700001'],
  'isHq': 1
}, {
  'id': '424270414936670208',
  'name': '发生的',
  'tenantId': '27',
  'applystartTime': '2018-03-02 18:16:00',
  'applyendTime': '2018-04-25 18:16:00',
  'waitNum': '0',
  'sucNum': '0',
  'status': '1',
  'sort': 9999,
  'createTime': '2018-03-16 18:19:09',
  'orgIds': ['242', '3535', '3536', '59167', '2700001'],
  'isHq': 1
}, {
  'id': '424269882058735616',
  'name': '撒地方',
  'tenantId': '27',
  'applystartTime': '2018-02-01 05:35:00',
  'applyendTime': '2018-03-31 05:35:00',
  'waitNum': '0',
  'sucNum': '0',
  'status': '1',
  'sort': 9999,
  'createTime': '2018-03-16 18:17:02',
  'orgIds': ['3536'],
  'isHq': 0
}, {
  'id': '421365324861014016',
  'name': '校区活动',
  'tenantId': '27',
  'applystartTime': '2018-03-08 20:54:42',
  'applyendTime': '2018-04-17 19:54:42',
  'waitNum': '0',
  'sucNum': '1',
  'status': '1',
  'sort': 9999,
  'createTime': '2018-03-08 17:55:22',
  'orgIds': ['3536'],
  'isHq': 0
}, {
  'id': '420219872421740544',
  'name': '测试修改取消时间',
  'tenantId': '27',
  'applystartTime': '2018-03-01 14:02:45',
  'applyendTime': '2018-03-05 14:10:48',
  'waitNum': '0',
  'sucNum': '0',
  'status': '1',
  'sort': 9999,
  'createTime': '2018-03-05 14:03:45',
  'orgIds': ['242', '3535', '3536', '59167', '2700001'],
  'isHq': 1
}, {
  'id': '418829073872191488',
  'name': '测试排序值书写',
  'tenantId': '27',
  'applystartTime': '2018-03-02 17:56:18',
  'applyendTime': '2018-03-17 17:56:20',
  'waitNum': '0',
  'sucNum': '0',
  'status': '2',
  'sort': 9999,
  'createTime': '2018-03-01 17:57:13',
  'orgIds': ['3536'],
  'isHq': 1
}, {
  'id': '417616081893588992',
  'name': '撒地方',
  'tenantId': '27',
  'applystartTime': '2018-01-04 09:36:00',
  'applyendTime': '2018-03-03 09:36:00',
  'waitNum': '0',
  'sucNum': '0',
  'status': '2',
  'sort': 9999,
  'createTime': '2018-02-26 09:37:13',
  'orgIds': ['242', '3535', '3536', '59167', '2700001'],
  'isHq': 1
}, {
  'id': '408495755079319552',
  'name': 'AAAA',
  'tenantId': '27',
  'applystartTime': '2018-02-06 05:35:00',
  'applyendTime': '2018-03-07 05:35:00',
  'waitNum': '0',
  'sucNum': '0',
  'status': '1',
  'sort': 9999,
  'createTime': '2018-02-01 05:36:17',
  'orgIds': ['3536'],
  'isHq': 0
})
ListData.push({
  'name': 'homeTab',
  'show': 1,
  'title': '首页',
  'type': 0,
  'url': ''
}, {
  'name': 'courseTab',
  'show': 1,
  'title': '课程',
  'type': 0,
  'url': ''
}, {
  'name': 'activityTab',
  'show': 1,
  'title': '活动',
  'type': 0,
  'url': ''
}, {
  'name': 'gameTab',
  'show': 1,
  'title': '游戏',
  'type': 0,
  'url': ''
}, {
  'name': 'shanshan',
  'show': 1,
  'title': '闪闪（外链）',
  'type': 0,
  'url': ''
})
export default {
  getList: () => {
    return {
      total: ListData.length,
      items: ListData
    }
  },
  ActivityList: () => {
    return {
      total: ActivityList.length,
      items: ActivityList
    }
  }
}
