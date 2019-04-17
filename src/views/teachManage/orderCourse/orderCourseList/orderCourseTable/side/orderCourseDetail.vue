<template>
  <side-dialog :visible.sync="sideDialogShow">
    <div class="order_detail">
      <div class="info_head">
        <div class="head_top">
          <div class="top_left">
            <img src="https://img.ishanshan.com/gimg/n/20190330/bb97caeb8d0fa017b696bc7667c53fb4">
            <div class="name">
              <span>约课详情</span>
              <span>{{ detailList.studyDate }} {{ detailList.startTime }} ~ {{ detailList.endTime }}</span>
            </div>
          </div>
          <div class="top_right">
            <el-button
              :disabled="disabledIsShow()"
              type="primary"
              @click="onceOrderCourse"
            >单次约课</el-button>
            <el-button
              type="primary"
              @click="batchOrderCourse"
            >批量约课</el-button>
            <el-button
              type="primary"
              @click="orderMissCourse"
            >预约补课</el-button>
            <el-button
              type="primary"
              @click="orderTryCourse"
            >预约试听</el-button>
          </div>
        </div>
        <div class="info_content">
          <div class="info_content_item">
            <span>标题：</span>
            <span>{{ detailList.title }}</span>
          </div>
          <div class="info_content_item">
            <span>课程名称：</span>
            <span>{{ detailList.courseName }}</span>
          </div>
          <!-- <div class="info_content_item">
            <span>所属校区：</span>
            <span>{{ detailList.orgName }}</span>
          </div> -->
          <div class="info_content_item">
            <span>主教：</span>
            <span>{{ detailList.mtnames }}</span>
          </div>
          <div class="info_content_item">
            <span>教室：</span>
            <span>{{ detailList.roomName }}</span>
          </div>
          <div class="info_content_item">
            <span>消耗课时：</span>
            <span>{{ detailList.cost }}</span>
          </div>
          <div class="info_content_item">
            <span>最大人数：</span>
            <span>{{ detailList.maxNum || 0 }}</span>
          </div>
          <div class="info_content_item">
            <span>上课人数：</span>
            <span v-if="detailList.maxAttNum == -1">{{ detailList.num }} ({{ detailList.lineStuList && detailList.lineStuList.length || 0 }})</span>
            <span v-else>{{ detailList.num }}/{{ detailList.maxAttNum }} ({{ detailList.lineStuList && detailList.lineStuList.length || 0 }})</span>
          </div>
          <div class="info_content_item">
            <span>补课人数：</span>
            <span v-if="detailList.maxMulNum == -1">{{ detailList.mulNum }}</span>
            <span v-else>{{ detailList.mulNum }} / {{ detailList.maxMulNum }}</span>
          </div>
          <div class="info_content_item">
            <span>试听人数：</span>
            <span v-if="detailList.maxTryNum == -1">{{ detailList.tryNum }}</span>
            <span v-else>{{ detailList.tryNum }} / {{ detailList.maxTryNum }}</span>
          </div>
        </div>
      </div>
      <div class="info_detail">
        <el-tabs v-model="activeName">
          <el-tab-pane
            :label="'上课学员'+'('+classNum+')'"
            name="1"
          >
            <div class="tab_item">
              <ClassStudent
                ref="classStu"
                :class-table-data="classTableData"
                :detail-list="detailList"
                @toParent="getData"
                @toReturnUpdate="getReturnUpdate"
                @toleaveUpdate="getLeaveUpdate"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane
            :label="'排队学员'+'('+lineNum+')'"
            name="2"
          >
            <div class="tab_item">
              <LineStudent
                :line-table-data="lineTableData"
                :detail-list="detailList"
                @toParent="getLineCancel"
                @toInlineUpdate="getInlineUpdate"
              />
            </div>
          </el-tab-pane>

          <el-tab-pane
            :label="'补课学员'+'('+mulNum+')'"
            name="3"
          >
            <div class="tab_item">
              <MulStudent :mul-table-data="mulTableData" />
            </div>
          </el-tab-pane>
          <el-tab-pane
            :label="'试听学员'+'('+tryNum+')'"
            name="4"
          >
            <div class="tab_item">
              <TryStudent
                :try-table-data="tryTableData"
                :detail-list="detailList"
                @toParent="getTryCancel"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </side-dialog>
</template>
<script>
import SideDialog from '@/components/SideDialog'
import ClassStudent from './classStudent'
import LineStudent from './lineStudent'
import MulStudent from './mulStudent'
import TryStudent from './tryStudent'
// import { getList } from '@/api/course'
import { detailQuery } from '@/api/teachManage/orderCourse'
export default {
  components: {
    SideDialog,
    ClassStudent,
    LineStudent,
    MulStudent,
    TryStudent
  },
  data() {
    return {
      sideDialogShow: false,
      rowInfo: {}, // 一行所在信息
      activeName: '1',
      classTableData: [], // 上课学员
      classNum: 0,
      lineTableData: [], // 排队学员
      lineNum: 0,
      mulTableData: [], // 补课学员
      mulNum: 0,
      tryTableData: [], // 试听学员
      tryNum: 0,
      detailList: {} // 详情列表
    }
  },
  methods: {
    show(val) {
      this.rowInfo = val
      if (val) {
        this.getList()
      }
      this.sideDialogShow = true
    },
    /* 列表数据 */
    getList() {
      const params = {
        cpdId: this.rowInfo.cpdId,
        cpmId: this.rowInfo.cpmId
      }
      detailQuery(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.detailList = data
          this.classTableData = data.stuList
          this.classNum = data.stuList && data.stuList.length
          this.lineTableData = data.lineStuList
          this.lineNum = data.lineStuList && data.lineStuList.length
          this.mulTableData = data.mulStuList
          this.mulNum = data.mulStuList && data.mulStuList.length
          this.tryTableData = data.tryStuList
          this.tryNum = data.tryStuList && data.tryStuList.length
        } else {
          this.$message.error(data.errorMessage || '获取详情失败')
        }
      })
    },
    /* 是否禁止按钮使用 */
    disabledIsShow() {
      if (new Date(this.detailList.studyDate).getTime() < new Date(this.$moment().format('YYYY-MM-DD'))) {
        return true
      } else {
        return false
      }
    },
    /* 取消获取 */
    getData(row, detail) {
      this.$emit('toParent', row, detail)
    },
    /* 排队取消 */
    getLineCancel(row, detail) {
      this.$emit('toLineStu', row, detail)
    },
    /* 试听取消 */
    getTryCancel(row, detail) {
      this.$emit('toTryStu', row, detail)
    },
    /* 单次约课 */
    onceOrderCourse() {
      this.$emit('toOnceOrderCourse', this.rowInfo, this.detailList)
    },
    /* 批量约课 */
    batchOrderCourse() {
      this.$emit('toBatchOrderCourse', this.rowInfo, this.detailList)
    },
    /* 预约补课 */
    orderMissCourse() {
      this.$emit('toOrderMissCourse', this.rowInfo, this.detailList)
    },
    /* 预约试听 */
    orderTryCourse() {
      this.$emit('toOrderTryCourse', this.rowInfo, this.detailList)
    },
    /* 更新请假数据 */
    getLeaveUpdate() {
      this.$emit('toleaveUpdate', this.detailList)
    },
    /* 更新回访数据 */
    getReturnUpdate(detail) {
      this.$emit('toReturnUpdate', detail)
    },
    /* 转为上课学员更新 */
    getInlineUpdate(detail) {
      this.$emit('toInlineUpdate', detail)
    }
  }
}
</script>
<style lang="scss" scoped>
.order_detail {
  height: 100%;
  .info_head {
    display: flex;
    flex-wrap: wrap;
    -webkit-box-pack: start;
    justify-content: flex-start;
    overflow: hidden;
    .head_top {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      -webkit-box-align: center;
      width: 100%;
      padding: 20px 20px;
      -webkit-box-pack: justify;
      justify-content: space-between;
      .top_left {
        width: 50%;
        display: flex;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          margin-right: 20px;
        }
        .name {
          font-size: 16px;
          color: #333;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          :last-child {
            font-size: 14px;
            background: #ddd;
            border-radius: 5px;
            padding: 0 10px;
            margin-left: 10px;
          }
        }
      }
      .top_right {
        -webkit-box-pack: end;
        justify-content: flex-end;
        width: 50%;
        display: flex;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        align-items: center;
      }
    }
    .info_content {
      width: 100%;
      display: flex;
      margin-bottom: 13px;
      padding: 0 20px 0 80px;
      flex-wrap: wrap;
      :nth-child(5) {
        padding-left: 28px;
      }
      .info_content_item {
        width: calc((100% - 80px) / 3);
        margin-right: 20px;
        margin-bottom: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        :first-child {
          color: #999;
        }
        :last-child {
          color: #666;
        }
      }
    }
  }
  .tab_item {
    padding: 10px 0px 0 20px;
  }
}
</style>
