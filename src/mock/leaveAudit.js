// import Mock from 'mockjs'

const List = []
// const count = 20
const signList = []

// for (let i = 0; i < count; i++) {
List.push(
  {
    id: '1057959366344323072',
    stuName: '阿宝',
    parentName: '阿狸家长',
    mobile: '17629008246',
    courseName: '通用课程',
    studyDate: '2018-11-01',
    studyTimeZone: '22:00-22:05',
    reason: '哈哈4',
    auditStatus: '1',
    remark: null,
    createTime: '2018-11-01 19:35',
    orgName: '姬龙-校区'
  },
  {
    id: '1022394341552156672',
    stuName: '张甜甜',
    parentName: '张甜甜家长',
    mobile: '18072751345',
    courseName: '通用课程',
    studyDate: '2018-07-26',
    studyTimeZone: '07:00-08:00',
    reason: '凉快凉快',
    auditStatus: '2',
    remark: '不批准',
    createTime: '2018-07-26 16:13',
    orgName: '姬龙-校区'
  },
  {
    id: '1022394375186280448',
    stuName: '张甜甜',
    parentName: '张甜甜家长',
    mobile: '18072751345',
    courseName: '通用课程',
    studyDate: '2018-07-26',
    studyTimeZone: '12:29-12:41',
    reason: '凉快凉快',
    auditStatus: '3',
    remark: '通过',
    createTime: '2018-07-26 16:13',
    orgName: '姬龙-校区'
  }
)
// }
signList.push(
  {
    tenantId: 36258,
    orgId: 3625800001,
    orgName: '姬龙-校区',
    id: '1075318711517544448',
    stuId: '1075318399397048320',
    stuName: '西红柿',
    parentId: '1017355575561072640',
    parentName: '阿狸家长',
    remark: '',
    status: '0',
    type: '1',
    sourceId: '',
    createTime: 1545210934000,
    createTimeStr: '2018-12-19 17:15:34',
    mobile: '17629008246',
    signTime: 1545210936000,
    signTimeStr: '2018-12-19 17:15:36'
  },
  {
    tenantId: 36258,
    orgId: 3625800001,
    orgName: '姬龙-校区',
    id: '1075318023769128960',
    stuId: '1017356129741877248',
    stuName: '阿狸',
    parentId: '1017355575561072640',
    parentName: '阿狸家长',
    remark: '',
    status: '2',
    type: '1',
    sourceId: '',
    createTime: 1545210770000,
    createTimeStr: '2018-12-19 17:12:50',
    mobile: '17629008246',
    signTime: 1545210772000,
    signTimeStr: '2018-12-19 17:12:52'
  },
  {
    tenantId: 36258,
    orgId: 3625800001,
    orgName: '姬龙-校区',
    id: '1075239119547920384',
    stuId: '1017355575175196672',
    stuName: '阿宝',
    parentId: '1017355575561072640',
    parentName: '阿狸家长',
    remark: '',
    status: '2',
    type: '1',
    sourceId: '',
    createTime: 1545191958000,
    createTimeStr: '2019-02-15 11:59:18',
    mobile: '17629008246',
    signTime: 1545191961000,
    signTimeStr: '2019-02-15 11:59:21'
  }
)

export default {
  getList: () => {
    return {
      total: List.length,
      items: List
    }
  },
  getSignList: () => {
    return {
      total: signList.length,
      items: signList
    }
  }
}
