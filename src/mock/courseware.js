const coursewareList = []
const stuProductionList = []
const stuList = []
const elvationList = []
const detailList = {
  url:
    'https://img.ishanshan.com/gimg/n/20190308/8e62e4bfaa88c07216849f0f75279f51',
  fileid: '1'
}
coursewareList.push(
  {
    coursewareId: '1083294378431418368',
    name: 'python',
    authorId: '3625800004',
    author: '老板',
    size: '0.30MB',
    status: '1',
    cat: 1077139508908007424,
    type: '1',
    catName: 'Python2',
    typeName: '文档',
    publishTime: '2019-01-10 17:28',
    tenantId: '36258',
    expire: '1',
    expireTime: '永久有效'
  },
  {
    coursewareId: '1083294273217302528',
    name: 'jmeter',
    authorId: '3625800004',
    author: '老板',
    size: '0.30MB',
    status: '1',
    cat: 1007441732662489088,
    type: '1',
    catName: '生活课',
    typeName: '文档',
    publishTime: '2019-01-10 17:27',
    tenantId: '36258',
    expire: '0',
    expireTime: '永久有效'
  }
)
stuProductionList.push(
  {
    id: '1013971561290743808',
    title: '上课12.jpg',
    stuName: '李鹏腾',
    stuId: '1007437237450731520',
    tagName: '画画',
    tagId: '1013970847919325184',
    tenantId: 36258,
    imgurl:
      'https://img.ishanshan.com/gimg/img/4da0466527d1c94eab28687a31f1cc20',
    createTime: '2018-07-03 10:23:54',
    orgId: '3625800001',
    orgName: '姬龙-校区'
  },
  {
    id: '1013971561294938112',
    title: '上课4.jpg',
    stuName: '李鹏腾',
    stuId: '1007437237450731520',
    tagName: '画画',
    tagId: '1013970847919325184',
    tenantId: 36258,
    imgurl:
      'https://img.ishanshan.com/gimg/img/113b45fe766fd3e6bdd8f8390a9d4fc8',
    createTime: '2018-07-03 10:23:54',
    orgId: '3625800001',
    orgName: '姬龙-校区'
  },
  {
    id: '1013971561294938114',
    title: '上课3.jpg',
    stuName: '李鹏腾',
    stuId: '1007437237450731520',
    tagName: '画画',
    tagId: '1013970847919325184',
    tenantId: 36258,
    imgurl:
      'https://img.ishanshan.com/gimg/img/ad66f2378efd889b4246f74c8f5c2460',
    createTime: '2018-07-03 10:23:54',
    orgId: '3625800001',
    orgName: '姬龙-校区'
  }
)
stuList.push(
  {
    month: 8,
    seller: '3625800002',
    stuId: '1007436340470853632',
    stuName: '党彩妮'
  },
  {
    month: 8,
    seller: '3625800002',
    stuId: '1007437237450731520',
    stuName: '李鹏腾'
  }
)
elvationList.push(
  {
    cpmId: '1020231396158865408',
    cpdId: '1020231400462221312',
    orgId: '3625800001',
    orgName: '姬龙-校区',
    title: '通用课程',
    courseId: '1012304164372692992',
    courseName: '通用课程',
    studyDate: '2019-02-16',
    startTime: '03:03',
    endTime: '03:04',
    mtids: '3625800002',
    mtNames: '姬龙',
    stuNum: 1,
    tcrCommNum: '0',
    tcrCommNumRate: '0%',
    homeCommNum: 0,
    homework: '课后作业',
    content: '数学课',
    pictures:
      '["https://img.ishanshan.com/gimg/n/20190215/d12ed3840ae002b2740d0ba5194231a5"]',
    picList: [
      'https://img.ishanshan.com/gimg/n/20190215/d12ed3840ae002b2740d0ba5194231a5'
    ],
    roomId: '1007485619254882304',
    roomName: '教室2',
    atids: null,
    atnames: null,
    commNumWithPic: 0,
    commNumWithPicRate: '0%'
  },
  {
    cpmId: '1045569426792972288',
    cpdId: '1045569431331209216',
    orgId: '3625800001',
    orgName: '姬龙-校区',
    title: '通用课程',
    courseId: '1012304164372692992',
    courseName: '通用课程',
    studyDate: '2019-02-16',
    startTime: '03:03',
    endTime: '03:04',
    mtids: '3625800002',
    mtNames: '姬龙',
    stuNum: 0,
    tcrCommNum: '0',
    tcrCommNumRate: '0%',
    homeCommNum: 0,
    homework: '',
    content: '',
    pictures: '[]',
    picList: [],
    roomId: '1007485619254882304',
    roomName: '教室2',
    atids: null,
    atnames: null,
    commNumWithPic: 0,
    commNumWithPicRate: '0%'
  },
  {
    cpmId: '1045569264571166720',
    cpdId: '1045569270518689792',
    orgId: '3625800001',
    orgName: '姬龙-校区',
    title: '通用课程',
    courseId: '1012304164372692992',
    courseName: '通用课程',
    studyDate: '2019-02-16',
    startTime: '03:03',
    endTime: '03:04',
    mtids: '3625800002',
    mtNames: '姬龙',
    stuNum: 0,
    tcrCommNum: '0',
    tcrCommNumRate: '0%',
    homeCommNum: 0,
    homework: '',
    content: '',
    pictures: '[]',
    picList: [],
    roomId: '1007485619254882304',
    roomName: '教室2',
    atids: null,
    atnames: null,
    commNumWithPic: 0,
    commNumWithPicRate: '0%'
  },
  {
    cpmId: '1042976304107888640',
    cpdId: '1042976307010347008',
    orgId: '3625800001',
    orgName: '姬龙-校区',
    title: '通用课程',
    courseId: '1012304164372692992',
    courseName: '通用课程',
    studyDate: '2019-02-16',
    startTime: '10:00',
    endTime: '11:00',
    mtids: '3625800002',
    mtNames: '姬龙',
    stuNum: 0,
    tcrCommNum: '0',
    tcrCommNumRate: '0%',
    homeCommNum: 0,
    homework: '',
    content: '',
    pictures: '[]',
    picList: [],
    roomId: '1007485592702136320',
    roomName: '教室1',
    atids: '3625800001',
    atnames: '管理员',
    commNumWithPic: 0,
    commNumWithPicRate: '0%'
  },
  {
    cpmId: '1020233779942600704',
    cpdId: '1020233785449721856',
    orgId: '3625800001',
    orgName: '姬龙-校区',
    title: '通用课程',
    courseId: '1012304164372692992',
    courseName: '通用课程',
    studyDate: '2019-02-16',
    startTime: '12:00',
    endTime: '12:01',
    mtids: '3625800002',
    mtNames: '姬龙',
    stuNum: 1,
    tcrCommNum: '0',
    tcrCommNumRate: '0%',
    homeCommNum: 0,
    homework: '',
    content: '',
    pictures: '[]',
    picList: [],
    roomId: '1007485619254882304',
    roomName: '教室2',
    atids: null,
    atnames: null,
    commNumWithPic: 0,
    commNumWithPicRate: '0%'
  },
  {
    cpmId: '1015056784970244096',
    cpdId: '1015056786681520128',
    orgId: '3625800001',
    orgName: '姬龙-校区',
    title: '通用课程',
    courseId: '1012304164372692992',
    courseName: '通用课程',
    studyDate: '2019-02-15',
    startTime: '00:06',
    endTime: '00:10',
    mtids: '3625800002',
    mtNames: '姬龙',
    stuNum: 1,
    tcrCommNum: '0',
    tcrCommNumRate: '0%',
    homeCommNum: 0,
    homework: '',
    content: '',
    pictures: '[]',
    picList: [],
    roomId: '1007485592702136320',
    roomName: '教室1',
    atids: null,
    atnames: null,
    commNumWithPic: 0,
    commNumWithPicRate: '0%'
  }
)

export default {
  getCoursewareList: () => {
    return {
      errorCode: 0,
      data: {
        resultCount: coursewareList.length
      },
      results: coursewareList
    }
  },
  getCoursewareDetail: () => {
    return {
      errorCode: 0,
      data: detailList
    }
  },
  getStuProductionList: () => {
    return {
      total: stuProductionList.length,
      items: stuProductionList
    }
  },
  getStuList: () => {
    return {
      total: stuList.length,
      results: stuList
    }
  },
  getElvationList: () => {
    return {
      total: elvationList.length,
      items: elvationList
    }
  }
}
