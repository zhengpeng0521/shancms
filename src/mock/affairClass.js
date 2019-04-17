const attendanceList = []
const gradeList = []
const classType = []
const mainTeacher = []
const classroomList = []
const stuAttendanceList = []
const stuInfoList = []
const searchStuList = []
const searchList = []
const classNameList = []
const scheduleList = []
const stuEditInfo = {
  id: '1078145615298334720',
  clsName: '日托班12个月-36个月',
  mTeacherNames: '姬龙',
  aTeacherNames: '管理员',
  clsNumber: null,
  nurseryNames: '管理员',
  clsType: 'dayCare',
  stuInfo: null,
  month: '1',
  min: 12,
  max: 36,
  aTeachers: '3625800001',
  mTeachers: '3625800002',
  nurserys: '3625800001',
  number: '15',
  clsRoomId: '1007485619254882304'
}
attendanceList.push(
  {
    id: '1097421101745922048',
    stuId: '1075994239394914304',
    stuName: '麦片',
    clsId: '1067978841434443776',
    clsName: '日托班1个月-120个月',
    createTime: '2019-02-18 17:02',
    signType: '2',
    operator: '姬龙',
    operatorId: '3625800002'
  },
  {
    id: '1097421089934761984',
    stuId: '1075994239394914304',
    stuName: '麦片',
    clsId: '1067978841434443776',
    clsName: '日托班1个月-120个月',
    createTime: '2019-02-18 17:02',
    signType: '1',
    operator: '姬龙',
    operatorId: '3625800002'
  },
  {
    id: '1097421066810281985',
    stuId: '1007437237450731520',
    stuName: '李鹏腾',
    clsId: '1067978841434443776',
    clsName: '日托班1个月-120个月',
    createTime: '2019-02-18 17:02',
    signType: '3',
    operator: '姬龙',
    operatorId: '3625800002'
  },
  {
    id: '1097421018999410688',
    stuId: '1007436340470853632',
    stuName: '党彩妮',
    clsId: '1067978841434443776',
    clsName: '日托班1个月-120个月',
    createTime: '2019-02-18 17:02',
    signType: '1',
    operator: '姬龙',
    operatorId: '3625800002'
  }
)
gradeList.push(
  {
    id: '1078145615298334720',
    clsName: '日托班12个月-36个月',
    nurseryType: '日托',
    clsNumber: '2/15',
    aTeachers: '管理员',
    mTeachers: '姬龙',
    nurserys: '管理员',
    maxNum: 15,
    stuNum: 13,
    signInNum: 0,
    signOutNum: 0,
    signLeaveNum: 0,
    clsRoomId: '1007485619254882304',
    clsRoom: '教室2'
  },
  {
    id: '1067978841434443776',
    clsName: '日托班1个月-120个月',
    nurseryType: '日托',
    clsNumber: '9/1',
    aTeachers: '',
    mTeachers: '管理员',
    nurserys: '',
    maxNum: 1,
    stuNum: -8,
    signInNum: 2,
    signOutNum: 1,
    signLeaveNum: 1,
    clsRoomId: '1007485592702136320',
    clsRoom: '教室1'
  }
)
classType.push(
  {
    key: 'dayCare',
    value: '日托'
  },
  {
    key: 'nightCare',
    value: '晚托'
  },
  {
    key: '1543456859952',
    value: '周托'
  },
  {
    key: '1543456886409',
    value: '月托'
  },
  {
    key: '1543456895161',
    value: '季度托-01'
  }
)
mainTeacher.push(
  {
    id: 3625800001,
    name: '管理员'
  },
  {
    id: 3625800002,
    name: '姬龙'
  }
)
classroomList.push(
  {
    id: '1007485592702136320',
    name: '教室1'
  },
  {
    id: '1007485619254882304',
    name: '教室2'
  },
  {
    id: '1007485646871572480',
    name: '教室3'
  }
)
stuAttendanceList.push(
  {
    stuId: '1075994239394914304',
    signIn: false,
    signOut: false,
    signLeave: false,
    signStatus: 0,
    name: '麦片',
    nickName: '',
    parentInfo: [
      {
        name: '马丽',
        mobile: '18668051159'
      }
    ],
    sex: '女',
    age: '0(0)',
    remark: '1',
    disable: false
  },
  {
    stuId: '1082465132855169024',
    signIn: true,
    signOut: true,
    signLeave: true,
    signStatus: 0,
    name: '太学主',
    nickName: '',
    parentInfo: [
      {
        name: '太学主家长',
        mobile: '15555588885'
      }
    ],
    sex: '',
    age: '0(1)',
    remark: '',
    disable: true
  }
)
stuInfoList.push(
  {
    id: '1082465132855169024',
    name: '太学主',
    nickname: null,
    birthday: '2019-01-08',
    seller: null,
    counselorId: null,
    counselor: null,
    sex: null
  },
  {
    id: '1075994239394914304',
    name: '麦片',
    nickname: '',
    birthday: '',
    seller: null,
    counselorId: null,
    counselor: null,
    sex: '2'
  },
  {
    id: '1010345834116878336',
    name: '李霞',
    nickname: null,
    birthday: '2018-06-23',
    seller: '姬龙',
    counselorId: null,
    counselor: null,
    sex: '2'
  },
  {
    id: '1009781050069831680',
    name: '高江江',
    nickname: '',
    birthday: '2018-04-21',
    seller: '姬龙',
    counselorId: null,
    counselor: null,
    sex: '1'
  }
)
searchStuList.push(
  {
    stuId: '1007436340470853632',
    stuName: '党彩妮',
    seller: '3625800002',
    month: 8
  },
  {
    stuId: '1007437237450731520',
    stuName: '李鹏腾',
    seller: '3625800002',
    month: 8
  },
  {
    stuId: '1009781050069831680',
    stuName: '高江江',
    seller: '3625800002',
    month: 9
  },
  {
    stuId: '1010345834116878336',
    stuName: '李霞',
    seller: '3625800002',
    month: 7
  },
  {
    stuId: '1037887446064328704',
    stuName: '李文博',
    seller: '3625800002',
    month: 5
  },
  {
    stuId: '1057961959507722240',
    stuName: '徐伟',
    seller: '',
    month: 3
  },
  {
    stuId: '1060084451813384192',
    stuName: '姬改那',
    seller: '3625800002',
    month: 0
  },
  {
    stuId: '1060084471871909888',
    stuName: '姬美娜',
    seller: '3625800002',
    month: 0
  },
  {
    stuId: '1067982558502146048',
    stuName: '学员999',
    seller: '',
    month: 2
  },
  {
    stuId: '1075934834311143424',
    stuName: '小雨',
    seller: '3625800001',
    month: 1
  },
  {
    stuId: '1075994239394914304',
    stuName: '麦片',
    seller: null,
    month: 0
  },
  {
    stuId: '1082465132855169024',
    stuName: '太学主',
    seller: '',
    month: 1
  }
)
searchList.push(
  {
    id: '1007436340470853632',
    name: '党彩妮',
    nickName: '',
    sex: '2',
    birthday: '2018-06-14',
    stuCardId: '1007439948602699776',
    integral: 93,
    parentList: [
      {
        stu_id: '1007436340470853632',
        id: '1007436340922445824',
        parentName: '党彩妮家长',
        mobile: '18682911817'
      },
      {
        stu_id: '1007436340470853632',
        id: '1037889418528059392',
        parentName: '爸爸',
        mobile: '13710046097'
      },
      {
        stu_id: '1007436340470853632',
        id: '1010345834125266944',
        parentName: '李霞家长',
        mobile: '15678945612'
      }
    ],
    sellerId: '3625800002',
    month: 8,
    seller: '姬龙'
  },
  {
    id: '1007437237450731520',
    name: '李鹏腾',
    nickName: '',
    sex: '1',
    birthday: '2018-06-14',
    stuCardId: '1007439984023597056',
    integral: 38,
    parentList: [
      {
        stu_id: '1007437237450731520',
        id: '1007437237791862784',
        parentName: '李鹏腾家长',
        mobile: '18291299184'
      }
    ],
    sellerId: '3625800002',
    month: 8,
    seller: '姬龙'
  },
  {
    id: '1009781050069831680',
    name: '高江江',
    nickName: '',
    sex: '1',
    birthday: '2018-04-21',
    stuCardId: '1009781175118811136',
    integral: 64,
    parentList: [
      {
        stu_id: '1009781050069831680',
        id: '1009781050782863360',
        parentName: '高江江家长',
        mobile: '13675121012'
      }
    ],
    sellerId: '3625800002',
    month: 9,
    seller: '姬龙'
  },
  {
    id: '1010345834116878336',
    name: '李霞',
    nickName: null,
    sex: '2',
    birthday: '2018-06-23',
    stuCardId: '1010346037070860288',
    integral: 29,
    parentList: [
      {
        stu_id: '1010345834116878336',
        id: '1010345834125266944',
        parentName: '李霞家长',
        mobile: '15678945612'
      }
    ],
    sellerId: '3625800002',
    month: 7,
    seller: '姬龙'
  },
  {
    id: '1037887446064328704',
    name: '李文博',
    nickName: '',
    sex: '1',
    birthday: '2018-09-05',
    stuCardId: '',
    integral: 0,
    parentList: [
      {
        stu_id: '1037887446064328704',
        id: '1037887446110466048',
        parentName: '爸爸',
        mobile: '13710041109'
      }
    ],
    sellerId: '3625800002',
    month: 5,
    seller: '姬龙'
  },
  {
    id: '1057961959507722240',
    name: '徐伟',
    nickName: null,
    sex: null,
    birthday: '2018-11-01',
    stuCardId: '1057962047747489792',
    integral: 3,
    parentList: [
      {
        stu_id: '1057961959507722240',
        id: '1057961959516110848',
        parentName: '徐伟家长',
        mobile: '17712332123'
      }
    ],
    sellerId: '',
    month: 3,
    seller: ''
  },
  {
    id: '1060084451813384192',
    name: '姬改那',
    nickName: '',
    sex: '2',
    birthday: null,
    stuCardId: '1060084755515912192',
    integral: 2,
    parentList: [
      {
        stu_id: '1060084451813384192',
        id: '1060084452259344384',
        parentName: '姬改娜爸爸',
        mobile: '13702171208'
      }
    ],
    sellerId: '3625800002',
    month: 0,
    seller: '姬龙'
  },
  {
    id: '1060084471871909888',
    name: '姬美娜',
    nickName: '',
    sex: '2',
    birthday: null,
    stuCardId: '1060084774783180800',
    integral: 17,
    parentList: [
      {
        stu_id: '1060084471871909888',
        id: '1060084472337477632',
        parentName: '姬美娜妈妈',
        mobile: '13702171205'
      }
    ],
    sellerId: '3625800002',
    month: 0,
    seller: '姬龙'
  },
  {
    id: '1067982558502146048',
    name: '学员999',
    nickName: null,
    sex: null,
    birthday: '2018-11-29',
    stuCardId: '',
    integral: 0,
    parentList: [
      {
        stu_id: '1067982558502146048',
        id: '1067982558506340353',
        parentName: '学员999家长',
        mobile: '13200000000'
      }
    ],
    sellerId: '',
    month: 2,
    seller: ''
  },
  {
    id: '1075934834311143424',
    name: '小雨',
    nickName: null,
    sex: '2',
    birthday: '2018-12-21',
    stuCardId: '',
    integral: 0,
    parentList: [
      {
        stu_id: '1075934834311143424',
        id: '1075934834319532032',
        parentName: '小雨家长',
        mobile: '13245453223'
      }
    ],
    sellerId: '3625800001',
    month: 1,
    seller: '管理员'
  },
  {
    id: '1075994239394914304',
    name: '麦片',
    nickName: '',
    sex: '2',
    birthday: null,
    stuCardId: '',
    integral: 0,
    parentList: [
      {
        stu_id: '1075994239394914304',
        id: '1075994239866085376',
        parentName: '马丽',
        mobile: '18668051159'
      }
    ],
    sellerId: null,
    month: 0,
    seller: ''
  },
  {
    id: '1082465132855169024',
    name: '太学主',
    nickName: null,
    sex: null,
    birthday: '2019-01-08',
    stuCardId: '',
    integral: 0,
    parentList: [
      {
        stu_id: '1082465132855169024',
        id: '1082465132859363329',
        parentName: '太学主家长',
        mobile: '15555588885'
      }
    ],
    sellerId: '',
    month: 1,
    seller: ''
  }
)
classNameList.push(
  {
    id: '1078145615298334720',
    name: '日托班12个月-36个月'
  },
  {
    id: '1098148506457120768',
    name: '晚托班4个月-7个月'
  }
)
scheduleList.push(
  {
    id: '1098559431987187712',
    clsId: '1078145615298334720',
    themeName: '探索大脑一',
    title: '555',
    startTime: '08:16',
    endTime: '21:18',
    studyDate: '2019-02-13'
  },
  {
    id: '1098424314429984768',
    clsId: '1078145615298334720',
    themeName: '探索大脑二',
    title: '222',
    startTime: '08:41',
    endTime: '21:10',
    studyDate: '2019-02-13'
  },
  {
    id: '1098559338701672448',
    clsId: '1078145615298334720',
    themeName: '探索大脑一',
    title: '333',
    startTime: '20:17',
    endTime: '20:17',
    studyDate: '2019-02-13'
  },
  {
    id: '1098398283744694272',
    clsId: '1078145615298334720',
    themeName: '探索大脑一',
    title: '22222',
    startTime: '10:39',
    endTime: '09:38',
    studyDate: '2019-02-21'
  }
)
export default {
  getAttendanceList: () => {
    return {
      total: attendanceList.length,
      items: attendanceList
    }
  },
  getGradeList: () => {
    return {
      errorCode: 9000,
      data: {
        resultCount: gradeList.length
      },
      results: gradeList
    }
  },
  getClassType: () => {
    return {
      total: classType.length,
      results: classType
    }
  },
  getMainTeacher: () => {
    return {
      total: mainTeacher.length,
      results: mainTeacher
    }
  },
  getClassroomList: () => {
    return {
      total: classroomList.length,
      results: classroomList
    }
  },
  getStuAttendanceList: () => {
    return {
      total: stuAttendanceList.length,
      results: stuAttendanceList
    }
  },
  getStuInfoList: () => {
    return {
      total: stuInfoList.length,
      items: stuInfoList
    }
  },
  getSearchStuList: () => {
    return {
      total: searchStuList.length,
      results: searchStuList
    }
  },
  getSearchList: () => {
    return {
      total: searchList.length,
      items: searchList
    }
  },
  getStuEditInfo: () => {
    return {
      stuEditInfo
    }
  },
  getClassNameList: () => {
    return {
      list: classNameList
    }
  },
  getScheduleList: () => {
    return {
      list: scheduleList
    }
  }
}
