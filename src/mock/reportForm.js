import Mock from 'mockjs'

const Random = Mock.Random
const leadsSource = [
  {
    channel: 'firstChannel',
    channelName: '一级来源',
    items: []
  },
  {
    channel: 'secondChannel',
    channelName: '二级来源',
    items: []
  },
  {
    channel: 'total',
    channelName: '总数',
    items: []
  }
]
const count = 6

for (let i = 0; i < count; i++) {
  leadsSource[0].items.push(
    Mock.mock({
      source: Random.last(),
      sourceName: Random.cname(),
      sourceNum: Random.integer(2, 30),
      sourceRate: '0%',
      turnStu: 0,
      turnStuRate: '0%'
    })
  )
  leadsSource[1].items.push(
    Mock.mock({
      source: Random.last(),
      sourceName: Random.cname(),
      sourceNum: Random.integer(2, 30),
      sourceRate: '0%',
      turnStu: 0,
      turnStuRate: '0%'
    })
  )
  if (i === 0) {
    leadsSource[2].items.push(
      Mock.mock({
        source: Random.last(),
        sourceName: '--',
        sourceNum: Random.integer(2, 30),
        sourceRate: '--',
        turnStu: 0,
        turnStuRate: '0%'
      })
    )
  }
}

// 业绩表图表
const achivementChart = []
for (let i = 0; i < 7; i++) {
  achivementChart.push(
    Mock.mock({
      signTime: Random.date('yyyy-MM-dd'),
      continuePurchaseMoney: Random.integer(0, 30),
      newPurchaseMoney: Random.integer(0, 30),
      newStuNum: Random.integer(0, 30),
      oldStuNum: Random.integer(0, 30)
    })
  )
}

// 业绩表表格
const achivementData = {
  newPurMoney: 0,
  newPurNum: 0,
  newStuNum: 0,
  oldStuNum: 0,
  renewPurMoney: 0,
  renewPurNum: 0,
  totalPurMoney: 0,
  totalPurNum: 0,
  tranSchInMoney: 0,
  tranSchInNum: 0,
  tranSchOutMoney: 0,
  tranSchOutNum: 0,
  items: [],
  data: {
    pageCount: 100,
    pageIndex: 0,
    pageSize: 20
  }
}
for (let i = 0; i < 7; i++) {
  achivementData.items.push(
    Mock.mock({
      newProportionMoney: Random.integer(0, 30),
      newPurchaseMoney: Random.integer(0, 30),
      newPurchaseNum: Random.integer(0, 30),
      renewProportionMoney: Random.integer(0, 30),
      renewPurchaseMoney: Random.integer(0, 30),
      renewPurchaseNum: Random.integer(0, 30),
      totalMoney: Random.integer(0, 30),
      totalNum: Random.integer(0, 30),
      totalProportionMoney: Random.integer(0, 30),
      userId: '3605300001',
      userName: Random.cname()
    })
  )
}

// 合同收入
const signTypeData = Mock.mock({
  newSignMoney: Random.integer(10000, 50000),
  newStuMoney: Random.integer(10000, 50000),
  oldStuMoney: Random.integer(10000, 50000),
  renewalMoney: Random.integer(1000, 5000)
})
const packList = []
for (let i = 0; i < 7; i++) {
  packList.push(
    Mock.mock({
      money: Random.integer(10000, 50000),
      num: Random.integer(1, 40),
      proType: '1',
      productId: /\d{6,11}/,
      productName: Random.cname(),
      purNum: Random.integer(1, 40)
    })
  )
}
const teachList = []
for (let i = 0; i < 10; i++) {
  teachList.push(
    Mock.mock({
      money: Random.integer(0, 1000),
      num: Random.integer(1, 40),
      proType: '1',
      aidId: /\d{6,11}/,
      aidName: Random.cname(),
      purNum: Random.integer(1, 40)
    })
  )
}

// 课程售卖
const stuBycourse = []
for (let i = 0; i < 15; i++) {
  stuBycourse.push(
    Mock.mock({
      courseId: /\d{11}/,
      courseName: Random.cname(),
      num: Random.integer(0, 40)
    })
  )
}
const stuByDate = {
  '2019-01-01': [],
  '2019-01-02': [],
  '2019-01-03': [],
  '2019-01-04': [],
  '2019-01-05': [],
  '2019-01-06': [],
  '2019-01-07': []
}
const ids = []
for (let i = 0; i < 10; i++) {
  const obj = Mock.mock({
    courseId: /\d{11}/
  })
  ids.push(obj.courseId)
}
for (const j in stuByDate) {
  for (let i = 0; i < 10; i++) {
    stuByDate[j].push(
      Mock.mock({
        courseId: ids[i],
        courseName: Random.cname(),
        num: Random.integer(0, 40)
      })
    )
  }
}

const timesBycourse = []
for (let i = 0; i < 15; i++) {
  timesBycourse.push(
    Mock.mock({
      courseId: /\d{11}/,
      courseName: Random.cname(),
      num: Random.integer(0, 40)
    })
  )
}
const timesByDate = {
  '2019-01-01': [],
  '2019-01-02': [],
  '2019-01-03': [],
  '2019-01-04': [],
  '2019-01-05': [],
  '2019-01-06': [],
  '2019-01-07': []
}
const idAarr = []
for (let i = 0; i < 10; i++) {
  const obj = Mock.mock({
    courseId: /\d{11}/
  })
  idAarr.push(obj.courseId)
}
for (const j in timesByDate) {
  for (let i = 0; i < 10; i++) {
    timesByDate[j].push(
      Mock.mock({
        courseId: idAarr[i],
        courseName: Random.cname(),
        num: Random.integer(0, 40)
      })
    )
  }
}

// 赠课记录
const giveNum = Mock.mock({
  commCourseMoney: Random.integer(1000, 2000),
  commCourseNum: Random.integer(0, 40),
  costCommCourseMoney: Random.integer(0, 40),
  costCommCourseNum: Random.integer(0, 40),
  costExcCourseMoney: Random.integer(0, 40),
  costExcCourseNum: Random.integer(0, 40),
  costPeriodExtMoney: Random.integer(10, 200),
  costPeriodExtNum: Random.integer(10, 200),
  excCourseMoney: Random.integer(0, 40),
  excCourseNum: Random.integer(0, 40),
  newPeriodExtMoney: Random.integer(100, 2000),
  newPeriodExtNum: Random.integer(0, 40)
})
const giveTime = Mock.mock({
  newPurPeriodExtMoney: Random.integer(1000, 2000),
  newPurPeriodExtNum: Random.integer(0, 40),
  newSerPeriodExtMoney: Random.integer(1000, 2000),
  newSerPeriodExtNum: Random.integer(0, 40)
})

export default {
  // 名单来源
  getLeadsSource: () => {
    return {
      list: leadsSource
    }
  },

  // 业绩表
  getAchivement: () => ({ data: achivementChart }),
  getAchivementData: () => achivementData,

  // 合同收入
  getSignType: () => signTypeData,
  getPackList: () => ({ results: packList }),
  getTeachList: () => ({ results: teachList }),

  // 课程售卖
  getStuBycourse: () => stuBycourse,
  getStuByDate: () => stuByDate,
  getTimesBycourse: () => timesBycourse,
  getTimesByDate: () => timesByDate,

  // 赠课记录
  getGiveNum: () => giveNum,
  getGiveTime: () => giveTime
}
