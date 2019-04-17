<template>
  <div class="campusHomepage-container">
    <div class="campusHomepage-top">微官网设置</div>
    <div class="campusHomepage-body">
      <div class="campusHomepage-contBox">
        <div class="campusHomepage-cont">
          <div class="head">
            <img
              src="https://img.ishanshan.com/gimg/n/20190320/7520a62ea0b5b3eb8af55fefc2a8779c"
              alt=""
            >
          </div>
          <div class="cont">
            <div style="width:100%;height:150px" />
            <div class="nav">
              <ul ref="navList">
                <li
                  v-if="nav.homeTabShow === 1"
                  class="firstNav"
                >{{ nav.homeTab }}</li>
                <li v-show="nav.courseTabShow === 1">{{ nav.courseTab }}</li>
                <li v-show="nav.activityTabShow === 1">{{ nav.activityTab }}</li>
                <li v-show="nav.gameTabShow === 1">{{ nav.gameTab }}</li>
                <li v-show="nav.otherTabShow === 1">{{ nav.otherTab }}</li>
              </ul>
            </div>
            <div class="orgInfo">
              <div class="orgAddress">
                <i class="el-icon-location" />浙江省
              </div>
              <div class="orgTime">
                <div> <i class="el-icon-time" /><span>营业时间：{{ campusData.serverTime }}</span></div>
                <i class="el-icon-phone" />
              </div>
            </div>
            <div class="orgItem">
              <div class="tit"><i />业务范围</div>
              <span class="workType">
                启蒙类
              </span>
            </div>
            <div class="orgItem">
              <div class="tit"><i />适合年龄</div>
              <span class="age">
                {{ campusData.ageTag }}
              </span>
            </div>
            <div class="orgItem">
              <div class="tit"><i />环境相册</div>
              <div
                v-for="(item,index) in campusData.images"
                :key="index"
                class="album"
              >
                <!-- <div
                v-for="(item,index) in campusData.images"
                :key="index"
                class="album"
              > -->
                <img :src="item">
                <!-- </div> -->
              </div>
            </div>
            <div class="orgItem">
              <div class="tit"><i />机构简介</div>
              <p class="intro">
                {{ campusData.intro }}
              </p>
            </div>
            <div class="orgItem">
              <div class="tit"><i />师资力量</div>
              <div
                v-for="(data,index) in campusData.teachers"
                :key="index"
                class="teachItem"
              >
                <div class="teachImg">
                  <img
                    :src="data.teacherImg"
                    alt=""
                  >
                </div>
                <p class="teachName">{{ data.teacherName }}</p>
                <p class="rank">{{ data.teacherIntro }}</p>
              </div>
            </div>
            <div class="orgItem">
              <div class="tit"><i />机构设施
              </div>
              <div class="facility">
                <div class="facilityBacground"><img src="https://img.ishanshan.com/gimg/n/20190320/66c0c7c21760e3b9c5f64dd550f03385"></div>
                <div class="facilityName">TV</div>
              </div>
              <div class="facility">
                <div class="facilityBacground"><img src="https://img.ishanshan.com/gimg/n/20190320/ffafddccb7f855da5292f6a826bb5805"></div>
                <div class="facilityName">母婴间</div>
              </div>
              <div class="facility">
                <div class="facilityBacground"><img src="https://img.ishanshan.com/gimg/n/20190320/37af3077e6cc28917c4941bcb78deb9f"></div>
                <div class="facilityName">茶水间</div>
              </div>
            </div>
            <div style="width:200px;height:50px" />
          </div>
        </div>
      </div>
      <div class="campusHomepage-right">
        <div style="display:flex">
          <el-button
            v-if="hasBtn('302000001')"
            type="primary"
            @click="addLessonShow()"
          >设置首页</el-button>
          <!-- <el-button plain>访问微官网</el-button> -->
          <hoverBtn style="margin-left:20px" />
        </div>
        <div class="table">
          <div class="table-top"><i />菜单设置</div>
          <CommonTable
            ref="tableCommon"
            :columns="columns"
            :options="options"
            :operation="operates"
            :is-border="isBorder"
            :data-source="dataSource"
            :loading="loading"
          />
        </div>
      </div>

    </div>
    <menuSet ref="menuSetDialog" />
    <homePageSetting
      v-if="homePageSettingShow"
      ref="homePageSettingDialog"
      :visible.sync="homePageSettingShow"
    />
  </div>
</template>
<script>
import CommonTable from '@/components/CommonTable/CommonTable'
import { queryConfig, changeConfig, getOrgan } from '@/api/microWeb/webPreview'
import menuSet from './components/menuSet'
import hoverBtn from './components/hoverBtn'
import homePageSetting from './components/homePageSetting'
export default {
  components: {
    CommonTable,
    menuSet,
    hoverBtn,
    homePageSetting
  },
  data() {
    return {
      id: '',
      setObj: {},
      // 手机初始参数
      campusData: {
        name: '',
        serverTime: '周一至周日 09：00~21：00',
        ageTag: '0~8岁',
        addrColumn: [],
        address: '',
        province: '',
        city: '',
        area: '',
        categoryTag: [],
        images: ['https://img.ishanshan.com/gimg/n/20190320/e6ac78d3554f3d45833f6e6db62861f7',
          'https://img.ishanshan.com/gimg/n/20190320/407a2913b00b8682ef56dfd7e9f6edfd',
          'https://img.ishanshan.com/gimg/n/20190320/8a861bf1883567a46c6c556cbc09a278'],
        teachers: [{
          teacherName: 'Susan老师',
          teacherIntro: '欢动课、艺术课授课老师',
          teacherImg: 'https://img.ishanshan.com/gimg/n/20190320/104625eeeed854f0fad1516abe42129f'
        }, {
          teacherName: 'Sasa老师',
          teacherIntro: '音乐课老师',
          teacherImg: 'https://img.ishanshan.com/gimg/n/20190320/f6adbb17eff29a87478b2d02585bef3d'
        }, {
          teacherName: 'Tina老师',
          teacherIntro: '舞蹈老师',
          teacherImg: 'https://img.ishanshan.com/gimg/n/20190320/c2504bf62b74e6d5051c6db8eabe2cb7'
        }],

        intro: '闪闪早教，专业致力于给机构一套完整、系统、操作便捷的早教专业SAAS系统，全力打造“互联网+教育”平台，为教育机构提供专属智能化解决方案！我们相信，行业的深度决定自身的高度，期待您来进一步了解！'

      },
      // 首页设置
      homePageSettingShow: false,
      nav: { homeTab: '',
        courseTab: '',
        activityTab: '',
        gameTab: '',
        otherTab: '' },
      // 表格参数

      dataSource: [],
      loading: false,
      operates: {
        width: '250',
        fixed: 'right',
        list: [
          {
            label_1: '隐藏',
            label_2: '显示',
            type: 'unnormal',
            method: (row) => {
              if (row.show === 1) {
                row.show = 0
              } else {
                row.show = 1
              }
              const loading = this.$loading({
                lock: true,
                text: '拼命加载中。。。',
                spinner: 'el-icon-loading',
                fullscreen: true,
                target: document.querySelector('.campusHomepage-container')
              })
              changeConfig({ tabsAndStatus: JSON.stringify({ [row.name]: row.show }), id: this.id }).then(res => {
                if (res.data.errorCode === 0) {
                  this.openStopHandle(row)
                } else {
                  this.$message.error(res.errorMessage)
                }
                loading.close()
              })
            },
            prop: 'show',
            popoverCon: [
              {
                contentText: '确认要隐藏吗？',
                status: '1'
              }, {
                contentText: '确认要显示吗？',
                status: '0'
              }
            ]
          },
          {
            label: '编辑',
            method: (row) => {
              this.setObj = row
              if (row.type !== 1) {
                console.log(row, 'row')
                this.menuSetDialogShow(row)
                this.$refs.menuSetDialog.addressVisible = false
                this.$refs.menuSetDialog.menuSetForm.menuTitle = row.title
              } else {
                // console.log(typeof (row.title))
                console.log(row, 'row1')
                this.menuSetDialogShow(row)
                this.$refs.menuSetDialog.addressVisible = true
                this.$refs.menuSetDialog.menuSetForm.menuTitle = row.title
              }
            }
          }
        ]
      },
      columns: [
        {
          label: '菜单名称',
          prop: 'title',
          isShowSet: true,
          width: '150',
          isShowTooltip: true
          // formatter: (row) => {
          //   console.log(row.title)
          //   if (row.type !== 2) {
          //     return `<div>${row.title}</div>`
          //   }
          // }
        },
        {
          label: '状态',
          prop: 'show',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.show === 0) {//eslint-disable-line
              return `<div >隐藏</div>`
            } else {
              return `<div >显示</div>`
            }
          }
          // methods: (row) => {
          //   // this.openSideDialog(row)
          //   // console.log(this.$refs.tableCommon)
          //   console.log(row.show)
          //   if (row.show === 1) {
          //     row.show = 0
          //   } else {
          //     row.show = 1
          //   }
          // }
        }
      ],
      options: {
        isSettingShow: true // 是否出现设置
        // apiService: queryConfig
        // 表格的数据请求接口
      },
      tableHeight: 'calc(100vh - 233px)',
      isBorder: true
    }
  },
  mounted() {
    this.queryConfig()
    this.getOrganList()
  },
  methods: {
    // 初始信息（左侧手机）
    getOrganList() {
      getOrgan().then(res => {
        if (res.data.errorCode === 0) {
          this.campusData = res.data
          this.campusData.teachers = Object.assign([], JSON.parse(res.data.teachers))
          this.campusData.addrColumn = Object.assign([], JSON.parse(res.data.addrColumn))
          if (res.data.categoryTag) {
            this.campusData.categoryTag = res.data.categoryTag.split(',')
          }

          if (!res.data.images) {
            this.campusData.images = []
          } else {
            // this.imageFileList = []
            this.campusData.images = Object.assign([], res.data.images.split(','))
          }
          // this.choiceLocation = res.data.addrColumn.join(',') + res.data.addr
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    menuSetDialogShow(row) {
      this.$refs.menuSetDialog.menuSetShow = true
    },
    // 首页设置
    addLessonShow() {
      this.homePageSettingShow = true
      // this.$refs.addLessonDialog.addLessonDialogTitlt = '新建课程'
    },
    openStopHandle(row) {
      const name = row.name + 'Show'
      if (row.show === 1) {
        this.nav[name] = 1
      } else {
        this.nav[name] = 0
      }
      this.$forceUpdate()
    },
    // 初始化数据
    queryConfig() {
      queryConfig().then(res => {
        if (res.data.errorCode === 0) {
          const arr = []
          res.data.results.menuConfig.map((val) => {
            if (val.type !== 2) {
              arr.push(val)
            }
          })
          this.dataSource = arr
          this.id = res.data.results.id
          console.log(arr, 'arr')
          arr.map(val => {
            const name = val.name
            this.nav[name] = val.title
            this.nav[name + 'Show'] = val.show
          })
          console.log(this.nav, '111')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.campusHomepage-container /deep/ {
  .el-table--border {
    border-bottom: 1px solid #ebeef5;
  }
}

.campusHomepage-container {
  width: calc(100%);
  height: calc(100vh - -25px);
  padding: 0 20px;
  overflow-x: hidden;
  overflow-y: auto;
  // border: 1px solid #f00;
  .campusHomepage-top {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    // background: pink;
  }
  .campusHomepage-body {
    display: flex;
    margin-top: 20px;
    margin-bottom: 50px;
    height: calc(100vh - 142px);
    overflow: auto;
    .campusHomepage-contBox {
      width: 435px;
      height: 727px;
      padding: 30px;
      background: rgba(240, 242, 245, 0.8);
    }
    .campusHomepage-cont {
      width: 100%;
      height: 667px;
      box-shadow: 0 2px 7px rgba(0, 0, 0, 0.2);
    }
    .head {
      width: 100%;
      height: 64px;
      display: flex;
      flex-direction: column;
      img {
        width: 100%;
      }
    }
    .cont {
      width: 100%;
      background: rgba(240, 242, 245, 0.6);
      overflow-x: hidden;
      overflow-y: auto;
      height: calc(100% - 64px);

      .topImg {
        width: 100%;
        height: 150px;
      }
      .nav {
        width: 100%;
        height: 35px;

        ul {
          background: #3b71b7;
          white-space: nowrap;
          text-align: center;
          overflow: auto;
          // overflow-y: hidden;
          display: flex;
          flex-wrap: nowrap;
        }
        li {
          // color: #fdee03;
          // float: left;
          // width: 70px;
          padding: 0 30px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          color: #fff;
          font-size: 14px;
          background: #3b71b7;
        }
        .firstNav {
          border-bottom: 3px solid #fdee03;
          color: #fdee03;
        }
      }
      .orgInfo {
        background: #fff;
        margin: 10px 0 0 0;
        padding: 0 20px;
        .orgAddress {
          border-bottom: 1px solid #ddd;
          height: 35px;
          line-height: 35px;
          .el-icon-location {
            margin-right: 2px;
            font-size: 16px;
            color: rgb(229, 70, 111);
          }
        }
        .orgTime {
          height: 35px;
          line-height: 35px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          div span {
            border-right: 1px solid #ccc;
            padding-right: 10px;
            padding-left: 2px;
          }
          .el-icon-time {
            font-size: 16px;
            color: #3f479b;
          }
          .el-icon-phone {
            font-size: 16px;
            color: #3b72b7;
            margin-left: 10px;
          }
        }
      }
      .orgItem {
        background: #fff;
        margin: 10px 0 0 0;
        padding: 10px 20px;
        .tit {
          height: 25px;
          i {
            display: inline-block;
            vertical-align: top;
            width: 10px;
            height: 18px;
            margin-right: 10px;
            background: #3b72b7;
            margin-left: -20px;
          }
        }
        .workType {
          display: inline-block;
          padding: 2px 15px;
          background: #c4d4e9;
          color: #fff;
          margin-right: 10px;
          border-radius: 4px;
        }
        .age {
          color: #3b72b7;
          margin-right: 10px;
        }
        .album {
          height: 80px;
          width: 120px;
          margin-right: 10px;
          display: inline-block;
          img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }
        }
        .teachItem {
          display: inline-block;
          // height: 140px;
          width: 80px;
          margin-right: 10px;
          p {
            width: 78px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .teachImg {
            width: 80px;
            height: 80px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 5px;
            }
          }
          .teachName {
            text-align: center;
            font-size: 14px;
          }
          .rank {
            text-align: center;
            color: rgb(153, 153, 153);
          }
        }
        .facility {
          display: inline-block;
          text-align: center;
          margin-right: 12px;
          .facilityBacground {
            border-radius: 50%;
            background: #c4d4e9;
            overflow: hidden;
            width: 36px;
            height: 36px;
            margin-bottom: 4px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
    .campusHomepage-right {
      margin-left: 20px;
      .table {
        margin-top: 50px;
        .table-top {
          margin-bottom: 15px;
          i {
            display: inline-block;
            vertical-align: top;
            margin-right: 10px;
            width: 6px;
            height: 14px;
            background: rgba(70, 182, 238, 1);
            border-radius: 2px;
            // margin-left: -20px;
          }
        }
      }
    }
  }
}
</style>
