import Mock from 'mockjs'

const List = []
const teacherList = []
const roomList = []
const printList = []
const createConflict = {
  cpdIdList: null,
  cpmId: null,
  studyTime: '2019-02-28(星期四) 00:00~00:05',
  mtName: '管理员',
  atName: null,
  topTeacher: null,
  clsRoom: '教室3',
  fields: ['mtName'],
  flag: true,
  courseAgeType: null,
  courseName: null,
  audittionTime: null,
  auditionEndTime: null
}
List.push(
  Mock.mock(
    {
      cpmId: '1049540072129777664',
      cpdId: '1049540076647043072',
      orgId: 3625800001,
      orgName: '姬龙-校区',
      studyDate: '2019-01-29',
      startTime: '18:00',
      endTime: '19:00',
      courseId: '1012304164372692992',
      courseName: '通用课程',
      courseAgeType: '1',
      mtids: '3625800002',
      mtnames: '姬龙',
      cost: 1,
      roomId: '1007485646871572480',
      roomName: '教室3',
      num: 2,
      maxNum: 12,
      tryNum: 2,
      maxTryNum: -1,
      mulNum: 3,
      maxMulNum: -1,
      title: '通用课程',
      color: '#1dafe4',
      weekDay: '周二',
      process: '',
      stuList: [
        {
          id: '1090129305714143232',
          stu_id: '1009781050069831680',
          name: '高江江',
          birthday: '2018-04-21',
          counselor_id: null,
          fix: null,
          status: '1',
          is_check: '1',
          sign_type: '1',
          stu_type: '1',
          nickname: '',
          seller: '3625800002',
          sellerName: '姬龙',
          monthAge: 9,
          yearAge: 0,
          mobile: '13675121012',
          periodLeft: 1017
        },
        {
          id: '1090130254587342848',
          stu_id: '1017356129741877248',
          name: '阿狸',
          birthday: '2018-07-12',
          counselor_id: null,
          fix: '1',
          status: '1',
          is_check: '0',
          sign_type: '1',
          stu_type: '1',
          nickname: null,
          seller: '3625800002',
          sellerName: '姬龙',
          monthAge: 6,
          yearAge: 0,
          mobile: '13702171205',
          periodLeft: 9
        }
      ],
      lineStuList: [
        {
          id: '1090130254587342848',
          stu_id: '1017356129741877248',
          name: '阿狸',
          birthday: '2018-07-12',
          counselor_id: null,
          fix: '1',
          status: '1',
          is_check: '0',
          sign_type: '1',
          stu_type: '1',
          nickname: null,
          seller: '3625800002',
          sellerName: '姬龙',
          monthAge: 6,
          yearAge: 0,
          mobile: '13702171205',
          periodLeft: 9
        }
      ],
      tryStuList: [
        {
          id: '1090129648510414848',
          stu_id: '1010093357605949440',
          name: '钟波',
          birthday: '2018-06-22',
          seller_id: '3625800002',
          sex: '1',
          status: '1',
          counselor_id: null,
          sign_type: '1',
          source_id: '1010093357605949440',
          audition_id: '1090129648229396480',
          nickname: null,
          sellerName: '姬龙',
          monthAge: 7,
          yearAge: 0,
          mobile: '13710046544',
          periodLeft: 108,
          remark: ''
        },
        {
          id: '1090130219166445568',
          stu_id: 484815814428590080,
          name: '丁丁',
          birthday: '2018-08-30',
          seller_id: '',
          sex: '1',
          status: '1',
          sign_type: '1',
          source_id: 484815814428590080,
          audition_id: '1090130219002867712',
          nickname: '',
          monthAge: 4,
          yearAge: 0,
          mobile: '17712345654',
          periodLeft: null,
          remark: ''
        }
      ],
      mulStuList: [
        {
          id: '1090129552058200064',
          stu_id: '1007436340470853632',
          name: '党彩妮',
          birthday: '2018-06-14',
          counselor_id: '3625800002',
          fix: '0',
          status: '1',
          is_check: '0',
          sign_type: '1',
          stu_type: '2',
          nickname: '',
          seller: '3625800002',
          counselorName: '姬龙',
          sellerName: '姬龙',
          monthAge: 7,
          yearAge: 0,
          mobile: '15678945612',
          periodLeft: 1012
        },
        {
          id: '1090130187997270016',
          stu_id: '1010079087399636992',
          name: '曹芳芳',
          birthday: '2018-04-23',
          counselor_id: null,
          fix: '0',
          status: '1',
          is_check: '0',
          sign_type: '1',
          stu_type: '2',
          nickname: null,
          seller: '3625800002',
          sellerName: '姬龙',
          monthAge: 9,
          yearAge: 0,
          mobile: '17705150344',
          periodLeft: 946
        },
        {
          id: '1090152938645860352',
          stu_id: '1010345834116878336',
          name: '李霞',
          birthday: '2018-06-23',
          counselor_id: null,
          fix: '0',
          status: '1',
          is_check: '0',
          sign_type: '1',
          stu_type: '2',
          nickname: null,
          seller: '3625800002',
          sellerName: '姬龙',
          monthAge: 7,
          yearAge: 0,
          mobile: '15678945612',
          periodLeft: 203
        }
      ],
      maxAttNum: -1,
      courseThemeId: '',
      courseTheme: ''
    })
)
teacherList.push(
  {
    userId: 3625800001,
    userName: '管理员',
    mobile: ''
  },
  {
    userId: 3625800002,
    userName: '姬龙',
    mobile: '17376504323'
  }
)
roomList.push(
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
printList.push(
  {
    cpdId: '1049540077603344384',
    cpmId: '1049540072129777664',
    courseId: '1012304164372692992',
    courseName: '通用课程',
    cutType: '0',
    clsId: '',
    clsName: '',
    studyDate: '2019-02-19',
    weekDay: '周二',
    startTime: '18:00',
    endTime: '19:00',
    mtNames: '姬龙',
    mtids: '3625800002',
    atids: '3625800001',
    atNames: '管理员',
    cost: 1,
    maxAttNum: -1,
    num: 0,
    maxNum: 12,
    lineNum: 0,
    tryNum: 0,
    maxTryNum: -1,
    mulNum: 0,
    maxMulNum: -1,
    status: '1',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    roomId: '1007485646871572480',
    roomName: '教室3',
    title: '通用课程',
    color: '#1dafe4',
    process: '',
    courseThemeId: '-1',
    courseTheme: '',
    stuArr: [],
    tryStuArr: [],
    mulStuArr: [],
    bookCls: '1',
    channel: null
  },

  {
    cpdId: '1049540077313937408',
    cpmId: '1049540072129777664',
    courseId: '1012304164372692992',
    courseName: '通用课程',
    cutType: '0',
    clsId: '',
    clsName: '',
    studyDate: '2019-02-12',
    weekDay: '周二',
    startTime: '18:00',
    endTime: '19:00',
    mtNames: '姬龙',
    mtids: '3625800002',
    atids: '',
    atNames: '',
    cost: 1.0,
    maxAttNum: -1,
    num: 2,
    maxNum: 12,
    lineNum: 0,
    tryNum: 0,
    maxTryNum: -1,
    mulNum: 0,
    maxMulNum: -1,
    status: '1',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    roomId: '1007485646871572480',
    roomName: '教室3',
    title: '通用课程',
    color: '#1dafe4',
    process: '',
    courseThemeId: '-1',
    courseTheme: '',
    stuArr: [
      {
        cpd_id: 1049540077313937408,
        name: '高江江',
        stu_type: '1',
        nickname: '',
        sex: '男',
        id: '1009781050069831680',
        birthday: 1524240000000,
        sign_type: '3',
        mobile: '13675121012',
        seller: '姬龙',
        signType: '3',
        age: '0',
        month: '10',
        channel: '',
        secondChannel: ''
      },
      {
        cpd_id: 1049540077313937408,
        name: '曹芳芳',
        stu_type: '1',
        nickname: null,
        sex: '女',
        id: '1010079087399636992',
        birthday: 1524412800000,
        sign_type: '3',
        mobile: '17705150344',
        seller: '姬龙',
        signType: '3',
        age: '0',
        month: '10',
        channel: '',
        secondChannel: ''
      }
    ],
    tryStuArr: [],
    mulStuArr: [],
    bookCls: '1',
    channel: null
  }
)
export default {
  getList: () => {
    return {
      results: List
    }
  },
  getTeacherList: () => {
    return {
      results: teacherList
    }
  },
  getRoomList: () => {
    return {
      results: roomList
    }
  },
  getPrintList: () => {
    return {
      results: printList
    }
  },
  getCreateConflictList: () => {
    return {
      results: createConflict
    }
  }
}
