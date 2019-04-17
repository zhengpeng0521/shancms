import Mock from 'mockjs'

const Random = Mock.Random

// 学员消课
const useClassAll = {
  '2019-01-01': [],
  '2019-01-02': [],
  '2019-01-03': [],
  '2019-01-04': [],
  '2019-01-05': [],
  '2019-01-06': [],
  '2019-01-07': []
}
const idAarr = []
for (let i = 0; i < 15; i++) {
  const obj = Mock.mock({
    courseId: /\d{11}/
  })
  idAarr.push(obj.courseId)
}
for (const j in useClassAll) {
  for (let i = 0; i < 15; i++) {
    useClassAll[j].push(
      Mock.mock({
        courseId: idAarr[i],
        courseName: Random.cname(),
        cost: Random.integer(0, 40)
      })
    )
  }
}
const useClassCourse = []
const uids = []
for (let i = 0; i < 15; i++) {
  const obj = Mock.mock({
    uid: /\d{11}/,
    uname: Random.cname()
  })
  uids.push(obj)
}
for (let i = 0; i < 5; i++) {
  useClassCourse.push(
    Mock.mock({
      cost: Random.integer(0, 40),
      courseId: /\d{11}/,
      courseName: Random.ctitle(3, 5),
      list: []
    })
  )
  for (let j = 0; j < 15; j++) {
    useClassCourse[i].list.push(
      Mock.mock({
        uid: uids[j].uid,
        uname: uids[j].uname,
        costNum: Random.integer(0, 40),
        costMoney: Random.integer(100, 500)
      })
    )
  }
}
const useClassOrg = []
useClassOrg.push(
  Mock.mock({
    orgId: /\d{11}/,
    orgName: Random.cname(),
    cost: Random.integer(50, 200),
    money: Random.integer(4000, 9000)
  })
)
const useClassTeacher = []
const corses = []
for (let i = 0; i < 15; i++) {
  const obj = Mock.mock({
    courseId: /\d{11}/,
    courseName: Random.ctitle(3, 5)
  })
  corses.push(obj)
}
for (let i = 0; i < 5; i++) {
  useClassTeacher.push(
    Mock.mock({
      cost: Random.integer(0, 40),
      userId: /\d{11}/,
      userName: Random.cname(),
      list: []
    })
  )
  for (let j = 0; j < 15; j++) {
    useClassTeacher[i].list.push(
      Mock.mock({
        courseId: corses[j].courseId,
        courseName: corses[j].courseName,
        cost: Random.integer(0, 40),
        money: Random.integer(100, 500)
      })
    )
  }
}
const useClassSale = []
for (let i = 0; i < 15; i++) {
  useClassSale.push(
    Mock.mock({
      cost: Random.integer(0, 40),
      money: Random.integer(100, 500),
      userId: /\d{11}/,
      userName: Random.cname()
    })
  )
}
const useClassCharge = []
for (let i = 0; i < 7; i++) {
  useClassCharge.push(
    Mock.mock({
      cost: Random.integer(0, 40),
      money: Random.integer(100, 500),
      userId: /\d{11}/,
      userName: Random.cname()
    })
  )
}

// 沉默学员表
const silence = Mock.mock({
  newPurStuNum: Random.integer(0, 40),
  newStuNum: Random.integer(0, 40),
  oldStuNum: Random.integer(0, 40),
  renewPurStuNum: Random.integer(0, 40),
  uncostStuNum: Random.integer(60, 200)
})

// 学员考勤表
const attenceByCourse = []
for (let i = 0; i < 45; i++) {
  attenceByCourse.push(
    Mock.mock({
      courseId: /\d{11}/,
      courseName: Random.cname(),
      orgId: 3605300001,
      orgName: '52-测试账号（校区）',
      rate: '100%',
      studyAbsent: Random.integer(0, 40),
      studyAttend: Random.integer(0, 40),
      studyLeave: Random.integer(0, 40),
      studyMaa: Random.integer(0, 40),
      tenantId: 36053
    })
  )
}
const attenceByMteacher = []
for (let i = 0; i < 25; i++) {
  attenceByMteacher.push(
    Mock.mock({
      mstudyAbsent: Random.integer(0, 40),
      mstudyAttend: Random.integer(0, 40),
      mstudyLeave: Random.integer(0, 40),
      mstudyMaa: Random.integer(0, 40),
      orgId: 3605300001,
      orgName: '52-测试账号（校区）',
      rate: '100%',
      tenantId: 36053,
      userId: /\d{11}/,
      userName: Random.cname()
    })
  )
}
const attenceByAteacher = []
for (let i = 0; i < 6; i++) {
  attenceByAteacher.push(
    Mock.mock({
      astudyAbsent: Random.integer(0, 40),
      astudyAttend: Random.integer(0, 40),
      astudyLeave: Random.integer(0, 40),
      astudyMaa: Random.integer(0, 40),
      orgId: 3605300001,
      orgName: '52-测试账号（校区）',
      rate: '100%',
      tenantId: 36053,
      userId: /\d{11}/,
      userName: Random.cname()
    })
  )
}
const attenceByStu = []
for (let i = 0; i < 110; i++) {
  attenceByStu.push(
    Mock.mock({
      orgId: '3605300001',
      orgName: '52-测试账号（校区）',
      rate: '73.68%',
      stuId: /\d{11}/,
      stuName: Random.cname(),
      studyAbsent: Random.integer(0, 40),
      studyAttend: Random.integer(0, 40),
      studyLeave: Random.integer(0, 40),
      studyMaa: Random.integer(0, 40),
      tenantId: '36053'
    })
  )
}
const attenceByPlan = []
for (let i = 0; i < 90; i++) {
  attenceByPlan.push(
    Mock.mock({
      atName: Random.cname(),
      attend: Random.integer(0, 40),
      audition: Random.integer(0, 40),
      classes: null,
      cost: Random.float(0, 40, 2, 2),
      courseId: /\d{11}/,
      courseName: Random.cname(),
      courseTheme: '',
      courseThemeId: '-1',
      endTime: Random.time('HH:mm'),
      id: /\d{11}/,
      makeUp: null,
      mtName: Random.cname(),
      realAttend: null,
      realAudition: Random.integer(0, 40),
      realMakeUp: null,
      room: Random.cname(),
      roomId: /\d{11}/,
      startTime: Random.time('HH:mm'),
      studyDate: Random.date(),
      studyTime: Random.time('HH:mm') + '~' + Random.time('HH:mm'),
      title: Random.cname(),
      truant: null,
      vacate: null
    })
  )
}

// 老师授课表
const courseTimes = []
for (let i = 0; i < 6; i++) {
  courseTimes.push(
    Mock.mock({
      courseId: /\d{11}/,
      sAttend: Random.integer(0, 40),
      sAudition: Random.integer(0, 40),
      sMakeup: Random.integer(0, 40),
      tAttend: Random.integer(0, 40),
      tAudition: Random.integer(0, 40),
      tMakeup: Random.integer(0, 40),
      teacherHours: Random.integer(0, 40),
      title: Random.cname()
    })
  )
}
const teachTable = Mock.mock({
  sAttend: Random.integer(0, 40),
  sAudition: Random.integer(0, 40),
  sMakeup: Random.integer(0, 40),
  sTotal: Random.integer(0, 40),
  tAttend: Random.integer(0, 40),
  tAudition: Random.integer(0, 40),
  tMakeup: Random.integer(0, 40),
  tTotal: Random.integer(0, 40),
  teacherHours: '3.00',
  results: [],
  data: { resultCount: 6 }
})
for (let i = 0; i < 6; i++) {
  teachTable.results.push(
    Mock.mock({
      attendHours: null,
      auditionHours: null,
      makeUpHours: null,
      name: Random.cname(),
      orgId: '3605300001',
      sAttend: Random.integer(0, 40),
      sAudition: Random.integer(0, 40),
      sMakeup: Random.integer(0, 40),
      sTotal: Random.integer(0, 40),
      tAttend: Random.integer(0, 40),
      tAudition: Random.integer(0, 40),
      tMakeup: Random.integer(0, 40),
      tTotal: Random.integer(0, 40),
      teachHours: '1.00',
      tenantId: '36053',
      uid: /\d{11}/
    })
  )
}
const teachingDetail = []
for (let i = 0; i < 6; i++) {
  teachingDetail.push(
    Mock.mock({
      courseId: /\d{11}/,
      name: Random.cname(),
      sAttend: Random.integer(0, 40),
      sAudition: Random.integer(0, 40),
      sMakeup: Random.integer(0, 40),
      tAttend: Random.integer(0, 40),
      tAudition: Random.integer(0, 40),
      tMakeup: Random.integer(0, 40),
      teacherHours: '0.0',
      title: Random.cname(),
      uid: '3605300002'
    })
  )
}

// 教室利用率
const classroom = []
for (let i = 0; i < 6; i++) {
  classroom.push(
    Mock.mock({
      count: Random.integer(0, 40),
      orgId: '3605300001',
      orgName: '52-测试账号（校区）',
      roomId: /\d{11}/,
      roomName: Random.ctitle(3, 5)
    })
  )
}

// 课时详情表
const classTimeDetail = []
for (let i = 0; i < 30; i++) {
  classTimeDetail.push(
    Mock.mock({
      cardId: /\d{11}/,
      inPeriodCost: Random.integer(0, 40),
      inPeriodMoney: Random.integer(0, 40),
      orgId: '3605300001',
      orgName: '52-测试账号（校区）',
      periodAll: Random.integer(0, 40),
      periodAvg: Random.integer(100, 500),
      periodExpend: Random.integer(0, 40),
      periodExt: Random.integer(0, 40),
      periodLeft: Random.integer(0, 40),
      periodLeftMoney: Random.integer(500, 1000),
      periodMoney: Random.integer(2000, 5000),
      periodRefund: Random.integer(0, 40),
      stuNames: Random.cname()
    })
  )
}

// 老师工资表
const salary = []
for (let i = 0; i < 5; i++) {
  salary.push(
    Mock.mock({
      baseSalary: Random.integer(0, 40),
      costMoney: Random.integer(0, 40),
      courseList: [],
      orgId: '3605300001',
      orgName: '52-测试账号（校区）',
      royalty: Random.integer(0, 40),
      salary: Random.integer(0, 40),
      subsidy: Random.integer(0, 40),
      teachNum: Random.integer(0, 40),
      teachTime: Random.integer(0, 40),
      tenantId: '36053',
      uid: /\d{11}/,
      uname: Random.cname()
    })
  )
  if (i === 1) {
    salary[1].courseList = [
      { courseName: '总部专-通用课程', desc: '人次', money: 90, time: 0 }
    ]
  }
}

// 课时月结表
const classMonthTotal = Mock.mock({
  oriMoneyTotal: Random.integer(4000, 6000),
  payMoneyTotal: Random.integer(4000, 6000),
  periodAddNumTotal: Random.integer(4000, 6000),
  periodCostMoneyTotal: Random.integer(4000, 6000),
  periodCostNumTotal: Random.integer(4000, 6000),
  periodEndLeftMoneyTotal: Random.integer(10000, 30000),
  periodEndLeftNumTotal: Random.integer(4000, 6000),
  periodExpireMoneyTotal: Random.integer(4000, 6000),
  periodExpireNumTotal: Random.integer(0, 40),
  periodLeftMoneyTotal: Random.integer(40000, 60000),
  periodLeftNumTotal: Random.integer(4, 60),
  periodRefundFeeTotal: Random.integer(4000, 6000),
  periodRefundMoneyTotal: Random.integer(4000, 6000),
  periodRefundNumTotal: Random.integer(0, 60),
  periodTranInMoneyTotal: Random.integer(4000, 6000),
  periodTranInNumTotal: Random.integer(0, 60),
  periodTranOutMoneyTotal: Random.integer(4000, 6000),
  periodTranOutNumTotal: Random.integer(0, 60),
  periodTranSchFeeTotal: Random.integer(4000, 6000),
  periodTranSchInMoneyTotal: Random.integer(4000, 6000),
  periodTranSchInNumTotal: Random.integer(0, 60),
  periodTranSchOutMoneyTotal: Random.integer(4000, 6000),
  periodTranSchOutNumTotal: Random.integer(0, 60),
  totalPeriodLeftMoneyTotal: Random.integer(40000, 60000),
  totalPeriodLeftNumTotal: Random.integer(4000, 6000)
})
const classMonthList = []
for (let i = 0; i < 10; i++) {
  classMonthList.push(
    Mock.mock({
      cardId: /\d{11}/,
      orgId: 3605300001,
      orgName: '52-测试账号（校区）',
      oriMoney: Random.integer(0, 60),
      parentNames: Random.cname() + ':13245645645',
      payMoney: Random.integer(100, 600),
      periodAddNum: Random.integer(0, 60),
      periodAveragePrice: Random.integer(1000, 6000),
      periodCostMoney: Random.integer(0, 60),
      periodCostNum: Random.integer(0, 60),
      periodEndLeftMoney: Random.integer(1000, 6000),
      periodEndLeftNum: Random.integer(0, 60),
      periodExpireMoney: Random.integer(0, 60),
      periodExpireNum: Random.integer(0, 60),
      periodLeftMoney: Random.integer(1000, 6000),
      periodLeftNum: Random.integer(0, 60),
      periodRefundFee: Random.integer(0, 60),
      periodRefundMoney: Random.integer(0, 60),
      periodRefundNum: Random.integer(0, 60),
      periodTranInMoney: Random.integer(0, 60),
      periodTranInNum: Random.integer(0, 60),
      periodTranOutMoney: Random.integer(0, 60),
      periodTranOutNum: Random.integer(0, 60),
      periodTranSchFee: Random.integer(0, 60),
      periodTranSchInMoney: Random.integer(0, 60),
      periodTranSchInNum: Random.integer(0, 60),
      periodTranSchOutMoney: Random.integer(0, 60),
      periodTranSchOutNum: Random.integer(0, 60),
      stuNames: Random.cname(),
      totalPeriodLeftMoney: Random.integer(1000, 6000),
      totalPeriodLeftNum: Random.integer(10, 60),
      parents: []
    })
  )
  classMonthList[i].parents.push(
    Mock.mock({
      email: null,
      mobile: /[1-9]{11}/,
      name: Random.cname(),
      open_id: '',
      parentId: /\d{11}/,
      relation: 'father',
      sex: '',
      stu_id: /\d{11}/
    })
  )
}

// 时长月结表
const timeMonth = []
for (let i = 0; i < 15; i++) {
  timeMonth.push(
    Mock.mock({
      balanceMoney: Random.integer(100, 600),
      dicMoney: Random.integer(100, 600),
      endTime: Random.date('yyyy-MM-dd'),
      id: /\d{11}/,
      month: Random.integer(100, 600),
      monthMoney: Random.float(0, 20, 2, 2),
      orderNum: /\d{11}/,
      oriMoney: Random.float(100, 600, 2, 2),
      pkgName: Random.cname(),
      signTime: Random.date('yyyy-MM-dd'),
      startTime: Random.date('yyyy-MM-dd'),
      stuCardId: /\d{11}/,
      stuId: /\d{11}/,
      stuName: Random.cname(),
      type: '2',
      packageName: []
    })
  )
  if (i === 1) {
    timeMonth[1].packageName = ['总部专-通用课程']
  }
}

export default {
  // 学员消课
  getUseClassAll: () => useClassAll,
  getUseClassCourse: () => useClassCourse,
  getUseClassOrg: () => useClassOrg,
  getUseClassTeacher: () => useClassTeacher,
  getUseClassSale: () => useClassSale,
  getUseClassCharge: () => useClassCharge,

  // 沉默学员表
  getSlience: () => silence,

  // 学员考勤表
  getAttenceByCourse: () => ({
    items: attenceByCourse,
    total: 45
  }),
  getAttenceByMteacher: () => ({
    items: attenceByMteacher,
    total: 25
  }),
  getAttenceByAteacher: () => ({
    items: attenceByAteacher,
    total: 6
  }),
  getAttenceByStu: () => ({
    items: attenceByStu,
    total: 110
  }),
  getAttenceByPlan: () => ({
    items: attenceByPlan,
    total: 90
  }),

  // 老师授课表
  getCourseTimes: () => ({ results: courseTimes }),
  getTeachTable: () => teachTable,
  getTachingDetail: () => ({ results: teachingDetail }),

  // 教室利用率
  getClassroom: () => ({ items: classroom, total: 6 }),

  // 课时详情表
  getClassTimeDetail: () => ({ items: classTimeDetail, total: 30 }),

  // 老师工资表
  getSalary: () => ({ items: salary, total: 5 }),

  // 课时月结表
  getClassMonthTotal: () => classMonthTotal,
  getClassMonthList: () => ({ items: classMonthList, total: 10 }),

  // 时长月结表
  getTimeMonth: () => ({ items: timeMonth, total: 15 })
}
