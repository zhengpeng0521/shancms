<template>
  <side-dialog :visible.sync="sideDialogShow">
    <div class="order_detail">
      <div class="info_head">
        <div class="head_top">
          <div class="top_left">
            <img src="https://img.ishanshan.com/gimg/n/20190330/8bd2178f00cb57321a4d975843f5e19d">
            <div class="name">
              <span>家校互评</span>
            </div>
          </div>
          <div class="top_right">
            <el-button
              type="primary"
              @click="commentFunc"
            >点评</el-button>
          </div>
        </div>
        <div class="info_content">
          <div class="info_content_item">
            <span>课程名称：</span>
            <span>{{ rowInfo.courseName }}</span>
          </div>
          <div class="info_content_item">
            <span>排课标题：</span>
            <span>{{ rowInfo.title }}</span>
          </div>
          <div class="info_content_item">
            <span>上课时间：</span>
            <span>{{ rowInfo.studyDate }} {{ rowInfo.startTime }}~{{ rowInfo.endTime }}</span>
          </div>
          <div class="info_content_item">
            <span>主教：</span>
            <span>{{ rowInfo.mtNames }}</span>
          </div>
          <!-- <div class="info_content_item">
            <span>所属校区：</span>
            <span>{{ rowInfo.orgName }}</span>
          </div> -->
        </div>
      </div>
      <div class="info_detail">
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="老师评价"
            name="1"
          >
            <div class="tab_item">
              <TeacherEvaluation
                :teacher-eva-list="teacherEvaList"
                @toParent="getTeacherData"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="家长评价"
            name="2"
          >
            <div class="tab_item">
              <ParentComment :parent-eva-lit="parentEvaLit" />
            </div>
          </el-tab-pane>

          <el-tab-pane
            label="上课内容"
            name="3"
          >
            <div class="tab_item">
              <ClassContent
                ref="classContent"
                :row-info="rowInfo"
                @toClassContentEdit="getClassContentData"
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
import TeacherEvaluation from './teacherEvaluation'
import ParentComment from './parentComment'
import ClassContent from './classContent'
import { commAllQuery } from '@/api/teachManage/homeSchoolConnect'
export default {
  components: {
    SideDialog,
    TeacherEvaluation,
    ParentComment,
    ClassContent
  },
  data() {
    return {
      sideDialogShow: false,
      rowInfo: {}, // 该行数据
      activeName: '1',
      detailList: {},
      teacherEvaList: [], // 老师评价
      parentEvaLit: [] // 家长评价
    }
  },
  methods: {
    show(val) {
      this.rowInfo = val
      console.info('this.rowInfo', this.rowInfo, val)
      if (this.rowInfo) {
        this.getList()
      }
      this.$refs.classContent.getList(this.rowInfo)
      this.sideDialogShow = true
    },
    /* 列表数据 */
    getList() {
      const params = {
        cpmId: this.rowInfo.cpmId,
        cpdId: this.rowInfo.cpdId
      }
      commAllQuery(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.teacherEvaList = data.tcrCommList
          this.parentEvaLit = data.homeCommList
        } else {
          this.$messag.error(data.errorMessage || '获取列表数据失败')
        }
      })
    },
    /* 获取教师评价编辑 */
    getTeacherData(row) {
      this.$emit('toTeachCommentEdit', row)
    },
    /* 获取上课内容编辑 */
    getClassContentData(val) {
      this.$emit('toClassContentEdits', val)
    },
    /* 点评 */
    commentFunc() {
      this.$emit('toComment', this.rowInfo)
    }
  }
}
</script>
<style lang="scss" scoped>
.order_detail {
  height: 100%;
  .el-tabs__content {
    padding-right: 0;
  }
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
      padding: 20px;
      -webkit-box-pack: justify;
      justify-content: space-between;
      .top_right {
        -webkit-box-pack: end;
        justify-content: flex-end;
        width: 50%;
        display: flex;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        align-items: center;
      }
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
      margin-bottom: 10px;
      padding: 0 20px 0 80px;
      flex-wrap: wrap;
      :nth-child(4) {
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
