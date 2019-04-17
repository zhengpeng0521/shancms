import Mock from 'mockjs'

const leadsList = []
const count = 4

for (let i = 0; i < count; i++) {
  leadsList.push(
    Mock.mock({
      createTime: '2018-03-06 17:14:51',
      headimgurl:
        'https://img.ishanshan.com/gimg/img/233988b74e3bf9fa50c83b49ca8e0d29',
      uname: '管理员',
      uid: '11',
      content: 'eeeeeee',
      parentId: '12',
      parentName: '托尼',
      type: '微信'
    })
  )
}

const visiteList = []
for (let i = 0; i < 6; i++) {
  visiteList.push(
    Mock.mock({
      content: 'wwww',
      id: '1097785945354260480',
      orgId: '3558000001',
      orgName: '王氏教育',
      sellerId: '3558000001',
      sellerName: '王丁丁',
      sex: null,
      status: '2',
      stuId: '1036531043143794688',
      stuName: 'eee',
      visitTime: '2019-02-19 17:12:00'
    })
  )
}

const listenList = []
for (let i = 0; i < 2; i++) {
  listenList.push(
    Mock.mock({
      auditionEndTime: '2019-03-01 12:00:00',
      auditionTime: '2019-03-01 11:03:00',
      courseName: '数学课',
      createTime: '2019-02-20 11:44:40',
      id: '1098065872771207168',
      orgId: '3558000001',
      orgName: '王氏教育',
      pcId: '1009995583776288768',
      reason: '',
      remark: '大道',
      sellerId: '3558000001',
      sellerName: '王丁丁',
      status: '1',
      stuId: '1036531043143794688',
      stuName: 'eee'
    })
  )
}

const parentList = []
for (let i = 0; i < 2; i++) {
  parentList.push(
    Mock.mock({
      email: '',
      openId: false,
      parentId: '1036531043093463040',
      parentMobile: '13333789765',
      parentName: 'ee',
      qqNumber: '',
      relaId: null,
      relation: '',
      target: '1',
      tel: '',
      trade: '',
      wxOpenId: ''
    })
  )
}

const contract = []
for (let i = 0; i < 2; i++) {
  contract.push(
    Mock.mock({
      checkUserId: 3558000001,
      checkUserName: '王丁丁',
      endTime: '2018-12-18',
      expireInvalid: 0,
      extPeriod: 0,
      extPeriodMoney: 0,
      extPeriodReason: '',
      imgUrl: '',
      mobile: '13222222222',
      operatorId: '3558000001',
      operatorName: '王丁丁',
      orderCreatePerson: '王丁丁',
      orderCreateTime: '2018-12-18 17:29',
      orderDiscount: '优惠0元',
      orderMoney: '100.0',
      orderNewOldstu: '0',
      orderNewOldstuName: '新学员',
      orderNum: 'ZF-2018121800000420',
      orderNumber: '1074959854503845888',
      orderPeriod: 1,
      orderRemark: '',
      orderState: '5',
      orderStateName: '',
      orderStuId: '1074959485337985024',
      orderStuName: [{ stuId: '1074959485337985024', stuName: '1234' }],
      orderStuNames: '1234',
      orderSubordinateCampus: '王氏教育',
      orderTotal: '100.0',
      orderType: '2',
      organId: '3558000001',
      parentId: '1074959485342179328',
      parentName: '1234家长',
      receiptStatus: '0',
      receiptStatusName: '待收款',
      signTime: '2018-12-18 00:00',
      signType: '0',
      signTypeName: '新签约',
      source: '1',
      sourceName: '校区新增',
      startEndTime: '2018-12-18 17:29~2018-12-18 17:48',
      startTime: '2018-12-18',
      stuCardId: '1074959901400358912'
    })
  )
}

const vipCard = {
  cardInfo: {
    balance: 0,
    cardId: '1055032646867906560',
    createTime: '2018-10-24 17:45',
    extBalance: 0,
    orgId: 3558000001,
    tenantId: 35580
  },
  results: []
}
for (let i = 0; i < 2; i++) {
  vipCard.results.push(
    Mock.mock({
      courseId: '1001770932570857472',
      courseName: '美术课',
      periodAll: 1,
      periodExt: 0,
      periodFreeze: 0,
      periodLeft: 0,
      periodPackage: 0,
      periodRefund: 0
    })
  )
}

const nursery = []
for (let i = 0; i < 2; i++) {
  nursery.push(
    Mock.mock({
      endTime: '2018-11-30',
      leftDays: 0,
      nurseryType: '1541474622168',
      nursryTypeName: '全托',
      orderNum: '2018112000000330',
      purchaseId: '1064725039867260928',
      startTime: '2018-11-20'
    })
  )
}

const usedPeriods = []
for (let i = 0; i < 18; i++) {
  usedPeriods.push(
    Mock.mock({
      classRoom: '数学课教室',
      classTime: '14:00',
      courseDates: '2019-02-19 00:00',
      courseId: '991617003908419584',
      courseName: '数学课',
      credit: 0,
      creditExt: 1,
      debit: 0,
      debitExt: 0,
      id: '1097881000630935552',
      itemTime: '2019-02-19 14:00~15:00',
      orgId: null,
      periodChange: '-1.00',
      quittingTime: '15:00',
      tenantId: null,
      tradeType: '课程-出勤'
    })
  )
}

const orderClass = []
for (let i = 0; i < 3; i++) {
  orderClass.push(
    Mock.mock({
      bookCls: null,
      cardId: '',
      checked: true,
      clsId: '',
      clsName: '--',
      cost: 2,
      courseId: '1060046490927820800',
      courseIntro: '',
      courseName: '啦啦啦',
      courseThemeId: '-1',
      cpStuId: '1084636703150755840',
      cpdId: '1070516033605214208',
      cpmId: '1070516033164812288',
      endTime: '00:01',
      fix: '',
      isBirthday: '0',
      maxNum: 50,
      mtNames: '管理员',
      mtids: '3605300001',
      num: 0,
      orgId: '3605300001',
      orgName: '52-测试账号（校区）',
      roomId: '1011449303575719936',
      roomName: '教室2',
      signType: '2',
      startTime: '00:00',
      status: '1',
      stuId: '1084636782670565376',
      stuName: '立花雷藏',
      stuType: '3',
      studyDate: '2019-01-14',
      title: '--'
    })
  )
}

export default {
  getLeadsRecord: () => {
    return {
      data: { resultCount: count, pageIndex: 0, pageSize: 5, pageCount: 1 },
      results: leadsList
    }
  },
  createLeadsRecord: () => ({ code: 9000 }),

  getVisiteList: () => ({
    data: { resultCount: 6, pageIndex: 0, pageSize: 5, pageCount: 2 },
    results: visiteList
  }),

  getListenList: () => ({
    data: { resultCount: 2, pageIndex: 0, pageSize: 5, pageCount: 1 },
    results: listenList
  }),

  getParentList: () => ({ items: parentList, total: 2 }),

  getContract: () => ({ items: contract, total: 2 }),

  getVipCard: () => vipCard,

  getNursery: () => ({ items: nursery, total: 2 }),

  getUsedPeriods: () => ({ items: usedPeriods, total: 18 }),

  getOrderClass: () => ({ items: orderClass, total: 3 })
}
