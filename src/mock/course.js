// import Mock from 'mockjs'

const List = []
const groupList = []
const courseThemeList = []
const editInfo = {
  id: '1073404711891234816',
  orgId: 3625800001,
  orgName: '姬龙-校区',
  orgKind: '1',
  title: '专用课_音乐课',
  intro: '音乐课',
  cost: 1,
  snum: 0,
  ageType: 1,
  minMa: 0,
  maxMa: 120,
  status: '1',
  groupName: '音乐系',
  groupId: '1007471377143328768',
  cutType: '1',
  orgIds: '3625800001'
}
List.push(
  {
    id: '1100233085583454208',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '444',
    intro: '',
    cost: 54,
    snum: 0,
    minMa: 4,
    maxMa: 5,
    status: '1',
    createTime: '2019-02-26 11:16',
    groupId: '1007471431681863680',
    groupName: '经济管理系',
    ageType: '1'
  },
  {
    id: '1100230915756748800',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '444',
    intro: '',
    cost: 4,
    snum: 0,
    minMa: 4,
    maxMa: 6,
    status: '1',
    createTime: '2019-02-26 11:07',
    groupId: '1007499359891255296',
    groupName: '足球系',
    ageType: '1'
  },
  {
    id: '1073404711891234816',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '专用课_音乐课',
    intro: '音乐课',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 120,
    status: '1',
    createTime: '2018-12-14 10:30',
    groupId: '1007471377143328768',
    groupName: '音乐系111',
    ageType: '1'
  },
  {
    id: '1060786647833317376',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '消耗课时0课程',
    intro: '消耗课时0课程',
    cost: 0,
    snum: 0,
    minMa: 0,
    maxMa: 120,
    status: '1',
    createTime: '2018-11-09 14:50',
    groupId: '1007499359891255296',
    groupName: '足球系',
    ageType: '1'
  },
  {
    id: '1060464352940847104',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '11月8日手工课程',
    intro: '11月8日手工课程',
    cost: 2,
    snum: 0,
    minMa: 0,
    maxMa: 120,
    status: '1',
    createTime: '2018-11-08 17:29',
    groupId: '1012304095804211200',
    groupName: '通用课程系',
    ageType: '1'
  },
  {
    id: '1053183445747200000',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '校区-消耗专用',
    intro: '校区-消耗专用',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 48,
    status: '1',
    createTime: '2018-10-19 15:17',
    groupId: '1007471377143328768',
    groupName: '音乐系111',
    ageType: '1'
  },
  {
    id: '1051742587441197056',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '专-通通用课时',
    intro: '专-通通用课时',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 48,
    status: '1',
    createTime: '2018-10-15 15:52',
    groupId: '1012304095804211200',
    groupName: '通用课程系',
    ageType: '1'
  },
  {
    id: '1042710533659525120',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '魔法课',
    intro: '魔法课',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 120,
    status: '1',
    createTime: '2018-09-20 17:42',
    groupId: '1042710437903564800',
    groupName: '魔法系',
    ageType: '1'
  },
  {
    id: '1042350297550262272',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '太空课',
    intro: '太空课',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 100,
    status: '1',
    createTime: '2018-09-19 17:50',
    groupId: '1042350186163412992',
    groupName: '太空系',
    ageType: '1'
  },
  {
    id: '1040892194342338560',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '手工制作课-水饺',
    intro: '手工制作课-水饺',
    cost: 1,
    snum: 0,
    minMa: 72,
    maxMa: 120,
    status: '1',
    createTime: '2018-09-15 17:16',
    groupId: '1013590896263118848',
    groupName: '土木工程系',
    ageType: '2'
  },
  {
    id: '1027825595913883648',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '姬-校区专',
    intro: '姬-校区专',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 48,
    status: '1',
    createTime: '2018-08-10 15:54',
    groupId: '1007471377143328768',
    groupName: '音乐系111',
    ageType: '1'
  },
  {
    id: '1027488965085974528',
    orgId: 3625800000,
    orgName: '姬龙-总部',
    orgKind: '2',
    title: '姬1-专',
    intro: '姬1-专',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 48,
    status: '1',
    createTime: '2018-08-09 17:37',
    groupId: '1014822870982066176',
    groupName: '6',
    ageType: '1'
  },
  {
    id: '1027488836241149952',
    orgId: 3625800000,
    orgName: '姬龙-总部',
    orgKind: '2',
    title: '姬1-通',
    intro: '姬1-通',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 48,
    status: '1',
    createTime: '2018-08-09 17:36',
    groupId: '1014822803797704704',
    groupName: '1',
    ageType: '1'
  },
  {
    id: '1019897978310438912',
    orgId: 3625800000,
    orgName: '姬龙-总部',
    orgKind: '2',
    title: '体育课-总部',
    intro: '总部-体育课',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 48,
    status: '1',
    createTime: '2018-07-19 18:53',
    groupId: '1014822813457186816',
    groupName: '2',
    ageType: '1'
  },
  {
    id: '1019897840699518976',
    orgId: 3625800000,
    orgName: '姬龙-总部',
    orgKind: '2',
    title: '美术课-总部',
    intro: '美术课',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 48,
    status: '1',
    createTime: '2018-07-19 18:52',
    groupId: '1014822803797704704',
    groupName: '1',
    ageType: '1'
  },
  {
    id: '1012503047693266944',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '专用课程',
    intro: '专用课程',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 120,
    status: '1',
    createTime: '2018-06-29 09:08',
    groupId: '1012502825936220160',
    groupName: '专用课程系',
    ageType: '1'
  },
  {
    id: '1012304164372692992',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '通用课程',
    intro: '通用课程',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 48,
    status: '1',
    createTime: '2018-06-28 19:58',
    groupId: '1012304095804211200',
    groupName: '通用课程系',
    ageType: '1'
  },
  {
    id: '1007471576649592832',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '财务管理',
    intro: '财务管理课',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 72,
    status: '1',
    createTime: '2018-06-15 11:55',
    groupId: '1007471431681863680',
    groupName: '经济管理系',
    ageType: '2'
  },
  {
    id: '1007471491334647808',
    orgId: 3625800001,
    orgName: '姬龙-校区',
    orgKind: '1',
    title: '音乐课',
    intro: '音乐课',
    cost: 1,
    snum: 0,
    minMa: 0,
    maxMa: 48,
    status: '1',
    createTime: '2018-06-15 11:54',
    groupId: '1007471377143328768',
    groupName: '音乐系111',
    ageType: '1'
  }
)
groupList.push(
  {
    id: '1007471377143328768',
    name: '音乐系'
  },
  {
    id: '1007471431681863680',
    name: '经济管理系'
  },
  {
    id: '1007499359891255296',
    name: '足球系'
  },
  {
    id: '1010040904034377728',
    name: '羽毛球系'
  },
  {
    id: '1012304095804211200',
    name: '通用课程系'
  },
  {
    id: '1012502825936220160',
    name: '专用课程系'
  },
  {
    id: '1013590896263118848',
    name: '土木工程系'
  },
  {
    id: '1014824284504457216',
    name: '1'
  },
  {
    id: '1014824295858438144',
    name: '2'
  },
  {
    id: '1014824312744706048',
    name: '3'
  },
  {
    id: '1014824326351028224',
    name: '4'
  },
  {
    id: '1014824340401946624',
    name: '5'
  },
  {
    id: '1014824354759049216',
    name: '6'
  },
  {
    id: '1014824373998321664',
    name: '7'
  },
  {
    id: '1014824391673118720',
    name: '8'
  },
  {
    id: '1014824410253885440',
    name: '9'
  },
  {
    id: '1014824423788904448',
    name: '10'
  },
  {
    id: '1014824437277786112',
    name: '11'
  },
  {
    id: '1014824450837970944',
    name: '12'
  },
  {
    id: '1014824466226872320',
    name: '13'
  },
  {
    id: '1014824479648645120',
    name: '14'
  },
  {
    id: '1014824496463609856',
    name: '15'
  },
  {
    id: '1014824514029355008',
    name: '15'
  },
  {
    id: '1014824536296914944',
    name: '16'
  },
  {
    id: '1014824553095102464',
    name: '17'
  },
  {
    id: '1042350186163412992',
    name: '太空系'
  },
  {
    id: '1042710437903564800',
    name: '魔法系'
  }
)
courseThemeList.push(
  {
    id: '1100272298818039808',
    title: '22222',
    type: '1',
    tenantId: 36258,
    orgId: 3625800001,
    orgKind: '1'
  },
  {
    id: '1100279966060277760',
    title: 'eeeee',
    type: '1',
    tenantId: 36258,
    orgId: 3625800001,
    orgKind: '1'
  }
)
export default {
  getList: () => {
    return {
      errorCode: 9000,
      data: {
        resultCount: List.length
      },
      results: List
    }
  },
  getEditInfo: () => {
    return {
      results: editInfo
    }
  },
  getGroupList: () => {
    return {
      results: groupList
    }
  },
  getCourseThemeList: () => {
    return {
      errorCode: 9000,
      results: courseThemeList
    }
  }
}
