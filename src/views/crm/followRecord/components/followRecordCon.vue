<template>
  <div class="followRecordCon_container">
    <div class="followCon_left">
      <div class="followCon_left_wrap">
        <div v-if="followDataList && followDataList.length > 0">
          <div
            v-for="(child, index) of followDataList"
            :key="index + 'followList'"
            :class="[{active:checkdIndex === index},'content_left_item']"
            @click="followMainInfo(child,index)"
          >
            <div class="con_left_item_img">
              <div v-if="child.sex === '1'">
                <img
                  v-if="child.headimgurl"
                  :src="child.headimgurl"
                >
                <img
                  v-else
                  src="https://img.ishanshan.com/gimg/img/d75fdb312bbaca043a97d24c5453a337"
                  alt
                >
              </div>
              <div v-else-if="child.sex === '2'">
                <img
                  v-if="child.headimgurl"
                  :src="child.headimgurl"
                >
                <img
                  v-else
                  src="https://img.ishanshan.com/gimg/img/ad8cc625441146bdf8e373dec1cd600f"
                  alt
                >
              </div>
              <img
                v-else
                src="https://img.ishanshan.com/gimg/n/20190413/4f27b672aa2dde5186327f00a1f4a37b"
                alt
              >
            </div>
            <div class="con_left_item_text">
              <p>
                <span :class="child.stuName ? 'item_name_text':'item_name_none'">{{ child.stuName }}</span>
                <span
                  class="item_right_text"
                  style="display: flex;"
                >
                  <span>跟进人:</span>
                  <i style="display: inline-block;width: 50px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">{{ child.uname }}</i>
                </span>
              </p>
              <p>
                <i>{{ child.createTime }}</i>
                <span
                  class="item_right_parent"
                  style="display: flex;"
                >
                  <span> 跟进家长: </span>
                  <i style="display: inline-block;width: 80px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">{{ child.parentName }}</i>
                </span>
              </p>
              <p>
                <span style="display: flex;">
                  <span>跟进内容: </span>
                  <i style="display: inline-block;width: 200px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">{{ child.content }}</i>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div
          v-else
          class="null_data"
        >
          <img src="https://img.ishanshan.com/gimg/img/0f4b3e548fb0edce54c578866babc7af">
          <div>暂时没有数据</div>
        </div>
      </div>
      <div
        v-if="followDataList && followDataList.length > 0"
        class="content_left_pageSize"
      >
        <el-pagination
          :total="resultCount"
          :page-size="pageSize"
          :current-page="pageIndex"
          layout="prev, pager, next"
          @current-change="pageChange"
        />
      </div>
    </div>
    <div
      v-if="checkedItem && checkedItem.id"
      class="followCon_right"
      style="display: flex;"
    >
      <div class="con_right_img">
        <img
          v-if="checkedItem.sex === '1'"
          src="https://img.ishanshan.com/gimg/img/d75fdb312bbaca043a97d24c5453a337"
          alt
        >
        <img
          v-else-if="checkedItem.sex === '2'"
          src="https://img.ishanshan.com/gimg/img/ad8cc625441146bdf8e373dec1cd600f"
          alt
        >
        <img
          v-else
          src="https://img.ishanshan.com/gimg/n/20190413/4f27b672aa2dde5186327f00a1f4a37b"
          alt
        >
      </div>
      <div class="con_right_main">
        <div class="con_right_text">
          <span
            class="con_right_name"
            @click="openSideDetail(checkedItem)"
          >
            {{ checkedItem.stuName }}
          </span>
          <div class="item_right_item_info">
            <span class="item_right_text">跟进时间:
              <i>{{ checkedItem.createTime }}</i>
            </span>
            <span class="item_right_text">跟进家长:
              <i>{{ checkedItem.parentName }}</i>
            </span>
            <span class="item_right_text">跟进方式:
              <i>{{ checkedItem.typeValue }}</i>
            </span>
            <!-- <span class="item_right_text">所属校区:
              <i>{{ checkedItem.orgName }}</i>
            </span> -->
          </div>
        </div>
        <div class="con_right_con">
          <p class="con_con_text">{{ checkedItem.content }}</p>
          <div>
            <el-button
              type="primary"
              style="margin-right:10px"
              @click="editFollowDialog(checkedItem)"
            >编辑</el-button>
            <Confirm
              :text="'删除'"
              :placement="'top'"
              :content="'确认删除么?'"
              :confirm="()=>{deleteFollowRecord(checkedItem)}"
              :is-button="true"
              :btn-class="'cancel_btn'"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑跟进记录弹框 -->
    <AddFollowDialog
      ref="addFollowDialog"
      :source="source"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 侧边详情 -->
    <CrmDetailModal
      ref="crmDetailModal"
      v-bind="detailProps"
      :name="studentName"
      :header-data="headerData"
      :base-data="baseData"
      :params="idObj"
      class="side_follow_dialog"
      @toUpdateLeadsTable="getUpdateTable"
    />
  </div>
</template>

<script>
import CrmDetailModal from '@/components/CrmDetailModal'
import { recordQuery, Delete, getSingleClueStu, getStuMsg } from '@/api/crm/followRecord/followRecord'
import Confirm from '@/components/MiniCommon/Confirm'
import AddFollowDialog from './addFollowDialog.vue'

export default {
  components: {
    CrmDetailModal,
    Confirm,
    AddFollowDialog
  },
  props: {
    source: {
      type: String,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      checkdIndex: 0,
      checkedItem: {},
      resultCount: 0,
      pageSize: 10,
      pageIndex: 1,
      followDataList: [],
      // 详情
      detailProps: {
        btns: [],
        headerInfo: [],
        baseInfo: [],
        defaultTab: 'leadsRecord',
        tabs: ['leadsRecord', 'parent']
      },
      // 头部数据
      headerData: {
        last: '2018-01-01',
        next: null
      },
      // 基础信息数据
      baseData: {
        stuId: '111',
        name: '令狐冲',
        ageMonth: '10(1)'
      },
      studentName: '',
      idObj: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(val) {
      let params
      if (val) {
        params = {
          pageSize: this.pageSize,
          pageIndex: 0,
          source: this.source
        }
        Object.assign(params, val)
        this.pageIndex = 1
      } else {
        params = {
          ...this.searchValue,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex - 1,
          source: this.source
        }
      }
      recordQuery(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.followDataList = data.results
          this.resultCount = data.data && data.data.resultCount
          this.followMainInfo(this.followDataList[0], 0)
          this.searchValue = params
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    pageChange(index) {
      this.pageIndex = index
      this.getList()
    },
    /* 选中某个 */
    followMainInfo(item, index) {
      this.checkdIndex = index
      this.checkedItem = item
    },
    /* 编辑跟进记录 */
    editFollowDialog(checkedItem) {
      this.$refs.addFollowDialog.showDialog('edit', checkedItem)
    },
    /* 删除跟进记录 */
    deleteFollowRecord(checkedItem) {
      Delete({ ids: checkedItem.id }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.getList()
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 侧边详情弹框 */
    openSideDetail(checkedItem) {
      this.studentName = ''
      const params = {
        stuId: checkedItem.stuId
      }
      let ageMonth = ''
      if (this.source == '2') { //eslint-disable-line
        getSingleClueStu(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.idObj = {
              id: checkedItem.id,
              source: this.source,
              parentId: data.parentId,
              parentName: data.parentName,
              stuId: checkedItem.stuId
            }
            this.studentName = data.name
            this.detailProps.headerInfo = [
              { label: '最后跟进时间', key: 'last' },
              { label: '下次跟进时间', key: 'next' },
              { label: '负责销售', key: 'saler' },
              { label: '跟进状态', key: 'status' }
            ]
            this.detailProps.baseInfo = [
              { label: '姓名', key: 'name' },
              { label: '昵称', key: 'nickName' },
              { label: '性别', key: 'sex' },
              { label: '生日', key: 'birthday' },
              { label: '年龄(月龄)', key: 'month' },
              { label: '民族', key: 'nation' },
              { label: '爱好', key: 'hobby' },
              { label: '年级', key: 'grade' },
              { label: '特长', key: 'speciality' },
              { label: '血型', key: 'bloodType' },
              { label: '社保号码', key: 'socialSecurityNum' },
              { label: '备注', key: 'remark' },
              { label: '联系地址', key: 'conaddress' },
              { label: '家长姓名', key: 'parentName' },
              { label: '家长手机号', key: 'parentMobile' },
              { label: '家长关系', key: 'relationName' },
              { label: '家长QQ', key: 'qqNumber' },
              { label: '家长行业', key: 'trade' },
              { label: '家长邮箱', key: 'email' },
              { label: '固定电话', key: 'tel' },
              { label: '一级来源', key: 'first' },
              { label: '二级来源', key: 'second' },
              { label: '校区名称', key: 'orgName' }
            ]
            this.headerData = {
              last: data.followRecordTime,
              next: data.nextFollowTime,
              saler: data.sellerName,
              status: data.studentFollowStateName
            }
            if (data.age != null || data.month != null) {
              ageMonth = data.age + '(' + data.month + ')'
            }
            this.baseData = {
              name: data.name,
              nickName: data.nickName,
              sex: data.sex == '1' ? '男' : data.sex == '2' ? '女' : '--', //eslint-disable-line
              birthday: data.birthday,
              month: ageMonth,
              nation: data.nation,
              hobby: data.hobby,
              grade: data.grade,
              speciality: data.speciality,
              bloodType: data.bloodType,
              socialSecurityNum: data.socialSecurityNum,
              remark: data.remark,
              conaddress: data.conaddress,
              parentName: data.parentName,
              parentMobile: data.parentMobile,
              relationName: data.relationName,
              qqNumber: data.qqNumber,
              trade: data.trade,
              email: data.email,
              tel: data.tel,
              first: data.channelName,
              second: data.secondChannelName,
              orgName: data.orgName
            }
            this.$refs.crmDetailModal.visible = true
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      } else {
        this.detailProps.headerInfo = [
          { label: '负责销售', key: 'saler' },
          { label: '负责老师', key: 'counselorName' }
        ]
        this.detailProps.baseInfo = [
          { label: '姓名', key: 'name' },
          { label: '性别', key: 'sex' },
          { label: '生日', key: 'birthday' },
          { label: '年龄(月龄)', key: 'month' },
          { label: '年级', key: 'grade' },
          { label: '星座', key: 'constellation' },
          { label: '民族', key: 'nation' },
          { label: '爱好', key: 'hobby' },
          { label: '特长', key: 'speciality' },
          { label: '血型', key: 'bloodType' },
          { label: '社保号码', key: 'socialSecurityNum' },
          { label: '手机号', key: 'mobile', popover: 'true' },
          { label: '学员类型', key: 'intentionName' },
          { label: '地址', key: 'conaddress' },
          { label: '一级来源', key: 'first' },
          { label: '二级来源', key: 'second' },
          { label: '备注', key: 'remark' }
        ]
        getStuMsg(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            const result = data.data
            this.idObj = {
              id: checkedItem.id,
              source: this.source,
              stuId: checkedItem.stuId
            }
            this.headerData = {
              saler: result.sellerName,
              counselorName: result.counselorName
            }
            if (result.age != null || result.month != null) {
              ageMonth = result.age + '(' + result.month + ')'
            }
            this.baseData = {
              name: result.name,
              sex: result.sex == '1' ? '男' : result.sex == '2' ? '女' : '--', //eslint-disable-line
              birthday: result.birthday,
              month: ageMonth,
              grade: result.grade,
              constellation: result.constellation,
              nation: result.nation,
              hobby: result.hobby,
              speciality: result.speciality,
              bloodType: result.bloodType,
              socialSecurityNum: result.socialSecurityNum,
              mobile: result.mobile,
              intentionName: result.intentionName,
              conaddress: result.conaddress,
              first: result.channelName,
              second: result.secondChannelName,
              remark: result.remark
            }
            this.$refs.crmDetailModal.visible = true
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      }
    },
    getUpdateTable() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.followRecordCon_container /deep/ {
  .side_follow_dialog {
    .el-tabs__content {
      height: calc(100vh - 437px);
      overflow-y: auto;
    }
    .leads-content {
      height: 100%;
    }
  }
  .active {
    background: #46b6ee !important;
    .con_left_item_text {
      i {
        font-style: normal;
        color: #fff !important;
      }
      span {
        color: #fff !important;
      }
      .item_name_text {
        background: #fff !important;
        color: #46b6ee !important;
      }
    }
  }
  position: relative;
  width: 100%;
  height: 100%;
  .followCon_left {
    position: relative;
    width: 440px;
    height: 100%;
    overflow: hidden;
    overflow-x: hidden;
    .null_data {
      width: 100%;
      height: inherit;
      display: flex;
      -moz-box-orient: vertical;
      -webkit-box-direction: normal;
      flex-direction: column;
      -webkit-box-pack: center;
      justify-content: center;
      -webkit-box-align: center;
      align-items: center;
      min-height: 100px;
      img {
        transform: scale(0.6);
        margin-bottom: -10px;
      }
      div {
        color: #999;
        cursor: default;
      }
    }
    .followCon_left_wrap {
      padding: 20px;
      overflow: hidden auto;
      height: calc(100% - 50px);
      max-height: calc(100% - 50px);
      background: rgba(240, 242, 245, 0.6);
      .content_left_item:last-child {
        margin-bottom: 0;
      }
      .content_left_item {
        position: relative;
        width: 400px;
        height: 112px;
        background: #fff;
        border-radius: 5px;
        margin-bottom: 20px;
        cursor: pointer;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        background: #fff;
        &:hover {
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 0px 4px 0px rgba(70, 182, 238, 1);
          border: 1px solid rgba(70, 182, 238, 1);
        }
        .con_left_item_img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          position: absolute;
          top: 10px;
          left: 10px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .con_left_item_text {
          position: absolute;
          left: 80px;
          top: 15px;
          width: calc(100% - 80px);
          p {
            width: 100%;
            height: 28px;
            line-height: 28px;
            position: relative;
            display: flex;
            align-items: center;
          }
          i {
            font-style: normal;
            color: rgba(51, 51, 51, 1);
          }
          span {
            color: rgba(153, 153, 153, 1);
          }
          .item_name_text {
            background: rgba(70, 182, 238, 0.1);
            color: rgba(70, 182, 238, 1);
            padding: 3px 8px;
            box-sizing: border-box;
            border: 1px solid rgba(70, 182, 238, 1);
            border-radius: 4px;
            line-height: 14px;
            max-width: 140px;
            overflow: hidden;
            height: 20px;
          }
          .item_name_none {
            display: none;
          }
          .item_right_text {
            position: absolute;
            right: 50px;
          }
          .item_right_parent {
            position: absolute;
            right: 6px;
          }
        }
      }
    }
    .content_left_pageSize {
      width: 100%;
      height: 50px;
    }
  }
  .followCon_right {
    position: absolute;
    right: 0;
    top: 0;
    width: calc(100% - 440px);
    height: 100%;
    padding: 20px 0 20px 20px;
    box-sizing: border-box;
    .con_right_img {
      width: 80px;
      height: 80px;
      margin-right: 20px;
      flex: none;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .con_right_main {
      flex: 1;
      padding-top: 20px;
      box-sizing: border-box;
      // min-width: calc(100% - 10px);
      .con_right_text {
        border-bottom: 1px solid #eee;
        padding-bottom: 20px;
        box-sizing: border-box;
        .item_right_item_info {
          margin-top: 18px;
          .item_right_text {
            color: #999999;
            margin-right: 70px;
            line-height: 20px;
            display: inline-block;
            i {
              color: #333333;
              font-style: normal;
            }
          }
        }
        p {
          span {
            color: #999;
            margin-right: 5px;
            line-height: 20px;
            display: inline-block;
            i {
              color: #666;
              font-style: normal;
              margin-right: 30px;
            }
          }
        }
        .con_right_name {
          font-size: 16px;
          font-weight: 500;
          color: #1d9df2;
          margin-bottom: 10px;
          line-height: 16px;
          cursor: pointer;
          &:hover {
            color: #56c0f5;
          }
        }
      }
      .con_right_con {
        margin-top: 25px;
        .con_con_text {
          color: #666;
          margin-bottom: 30px;
        }
      }
    }
  }
}
</style>

