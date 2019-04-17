import Mock from 'mockjs'

const List = []
const count = 20
const num = 30
const stuList = []
const courseList = []
const stuChooseList = []
const scheduleList = []
const listChooseList = []
const roomList = []

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      name: '@name()',
      courseName: '@name()',
      courseGroupName: '@name()',
      classStuNum: '@integer(0, 3)',
      maxNum: '@integer(1, 10)',
      createTime: +Mock.Random.date('T'),
      overdueCpdNum: '@integer(0, 2)',
      totalCpdNum: '@integer(1, 2)',
      type: '1'
    })
  )
}

for (let i = 0; i < num; i++) {
  stuList.push(
    Mock.mock({
      name: '段露1111',
      nickname: '闪闪',
      sex: '1',
      birthday: '2018-02-23',
      sellerName: '问问',
      counselorName: '222'
    })
  )
}

for (let i = 0; i < num; i++) {
  courseList.push(
    Mock.mock({
      cpTitle: '段露1111',
      studyDate: '2018-06-08',
      startTime: '18:51',
      endTime: '21:58',
      mtNames: '主教啊1111',
      atNames: '助教二二二二二',
      roomName: '音乐教室',
      status: '已结束',
      stuNum: 1,
      checkRate: '100%',
      color: '#1dafe4',
      maxNum: 15,
      roomId: '345571725792120832'
    })
  )
}

for (let i = 0; i < num; i++) {
  stuChooseList.push(
    Mock.mock({
      id: i + '',
      name: '小叶',
      nickName: 'ssssss',
      sex: '1',
      birthday: '2018-02-15',
      seller: '@name()',
      month: i,
      parentList: [
        {
          id: '997057385951727616',
          mobile: '17629008246',
          parentName: '叶博文家长',
          stu_id: '1001285782599208960'
        },
        {
          stu_id: '1001405337449095168',
          id: '1001406382363467776',
          parentName: 'wyp',
          mobile: '18500478947'
        }
      ]
    })
  )
}

for (let i = 0; i < num; i++) {
  listChooseList.push(
    Mock.mock({
      orgId: 3531600002,
      id: '526732384150880256',
      name: '岑岑',
      nickName: null,
      sex: '2',
      birthday: '2018-10-24',
      target: null,
      month: 0,
      seller: '',
      list: [
        {
          parentId: '981446762608271360',
          parentMobile: '18033110080',
          parentName: 'Don'
        }
      ]
    })
  )
}

for (let i = 0; i < num; i++) {
  scheduleList.push(
    Mock.mock({
      cpdId: '423900418205155328',
      cpmId: '423900417806696448',
      courseId: '345571457084035072',
      courseName: '10课时课程',
      cutType: '0',
      clsId: '',
      clsName: '',
      studyDate: '2019-01-17',
      weekDay: '周四',
      startTime: '01:00',
      endTime: '02:00',
      mtNames: '东琴',
      mtids: '3531600005',
      atids: null,
      atNames: null,
      cost: 10,
      maxAttNum: 3,
      num: 0,
      maxNum: 9,
      lineNum: 0,
      tryNum: 0,
      maxTryNum: 3,
      mulNum: 0,
      maxMulNum: 3,
      status: '1',
      orgId: 3531600002,
      orgName: '闪宝科技外呼测试专用',
      roomId: '342834948534833152',
      roomName: '1010',
      title: '10课时课程',
      color: '#1dafe4',
      process: '一年',
      courseThemeId: '-1',
      courseTheme: '',
      stuArr: [],
      tryStuArr: [],
      mulStuArr: [],
      bookCls: '2',
      channel: null,
      signType: '6',
      reason: '2'
    })
  )
}

roomList.push(
  Mock.mock({
    id: '1007485592702136320',
    name: '教室1'
  })
)

export default {
  getList: () => {
    return {
      total: List.length,
      items: List
    }
  },
  getStuList: () => {
    return {
      total: stuList.length,
      items: stuList
    }
  },
  getCourseList: () => {
    return {
      total: courseList.length,
      items: courseList
    }
  },
  getStuChooseList: () => {
    return {
      total: stuChooseList.length,
      items: stuChooseList
    }
  },
  getScheduleList: () => {
    return {
      total: scheduleList.length,
      items: scheduleList
    }
  },
  getListChooseList: () => {
    return {
      total: listChooseList.length,
      items: listChooseList
    }
  },
  getRoomList: () => {
    return {
      total: roomList.length,
      items: roomList
    }
  }
}
