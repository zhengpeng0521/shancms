<template>
  <side-dialog :visible.sync="sideDialogShow">
    <div class="courseInfo">
      <div class="info_head">
        <div class="head_top">
          <div class="top_left">
            <img src="https://img.ishanshan.com/gimg/n/20190330/b0731bc61fa2566983c233ff3e838b7a">
            <div class="name">班级</div>
          </div>
          <div class="top_right">
            <el-button
              type="primary"
              @click="edit"
            >编辑</el-button>
            <el-button
              class="cancel_btn"
              @click="deleteFunc"
            >删除</el-button>
          </div>
        </div>
        <div class="info_content">
          <div class="info_content_item">
            <span>班级名称：</span>
            <span>{{ sideInfo.name }}</span>
          </div>
          <div class="info_content_item">
            <span>所属课程：</span>
            <span>{{ sideInfo.courseName }}</span>
          </div>
          <div class="info_content_item">
            <span>主教：</span>
            <span>{{ sideInfo.mainTeacherNames || '--' }}</span>
          </div>
          <div class="info_content_item">
            <span>助教：</span>
            <span>{{ sideInfo.assistanTeacherNames || '--' }}</span>
          </div>
          <div class="info_content_item">
            <span>人数：</span>
            <span>{{ sideInfo.classStuNum }}/{{ sideInfo.maxNum }}</span>
          </div>
        </div>
      </div>
      <div class="info_detail">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="班级学员"
            name="1"
          >
            <div class="detail_inner">
              <el-button
                type="primary"
                style="margin:5px 0 20px 0"
                @click="addNewStu"
              >添加学员</el-button>
              <CommonTable
                ref="stuTable"
                :columns="stuTable.columns"
                :table-height="stuTable.tableHeight"
                :pagination="stuTable.listQuery"
                :options="stuTable.options"
                :operation="stuTable.operates"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="排课记录"
            name="2"
          >
            <div style="margin-top:5px">
              <CommonTable
                ref="commonTable"
                :columns="courseTable.columns"
                :table-height="courseTable.tableHeight"
                :pagination="courseTable.listQuery"
                :options="courseTable.options"
                :operation="courseTable.operates"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </side-dialog>
</template>
<script>
import CommonTable from '@/components/CommonTable/CommonTable'
import SideDialog from '@/components/SideDialog'
import { getClassGradeDetail, removeClassStu, queryClassStuList, queryArrageCourseList } from '@/api/teachManage/grade'
export default {
  components: {
    CommonTable,
    SideDialog
  },
  data() {
    return {
      activeName: '1',
      sideDialogShow: false,
      sideInfo: {},
      stuTable: {
        columns: [
          {
            label: '学生姓名',
            prop: 'name'
          },
          {
            label: '昵称',
            prop: 'nickname'
          },
          {
            label: '性别',
            prop: 'sex',
            formatter: (row, column, cellValue) => {
            if (row.sex == '1') { //eslint-disable-line
                return `<div>男</div>`
              } else {
                return `<div>女</div>`
              }
            }
          },
          {
            label: '生日',
            prop: 'birthday'
          },
          {
            label: '负责销售',
            prop: 'sellerName'
          },
          {
            label: '负责老师',
            prop: 'counselorName'
          }
        ],
        tableHeight: 'calc(100vh - 354px)',
        listQuery: {
          show: true
        },
        options: {},
        operates: {
          width: '150',
          fixed: 'right',
          list: [
            {
              label: '移除',
              type: 'normal',
              method: (row) => {
                this.deleteHandle(row)
              },
              popoverCon: [
                {
                  contentText: '确认移除学员？'
                }
              ]
            }
          ]
        }
      },
      courseTable: {
        columns: [
          {
            label: '标题',
            prop: 'cpTitle',
            isShowTooltip: true
          },
          {
            label: '上课时间',
            prop: 'studyTime',
            isShowTooltip: true,
            formatter: (row, column, cellValue) => {
              return `<div style="text-overflow:ellipsis;overflow:hidden">${row.studyDate} ${row.startTime}~${row.endTime}</div>`
            }
          },
          {
            label: '主教',
            prop: 'mtNames',
            isShowTooltip: true
          },
          {
            label: '助教',
            prop: 'atNames',
            isShowTooltip: true
          },
          {
            label: '教室',
            prop: 'roomName',
            isShowTooltip: true
          },
          {
            label: '状态',
            prop: 'status'
          },
          {
            label: '已预约班级成员',
            width: '150',
            prop: 'stuNum',
            formatter: (row, column, cellValue) => {
              return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.stuNum}</div>`
            },
            methods: (row) => {
              this.stuOrderCourse(row)
            }
          },
          {
            label: '出勤率',
            prop: 'checkRate'
          }
        ],
        tableHeight: 'calc(100vh - 306px)',
        listQuery: {
          show: true,
          sizeChange: this.sizeChange,
          indexChange: this.indexChange
        },
        options: {
          index: true
        },
        operates: {
          width: '250',
          fixed: 'right',
          list: [
            {
              label: '修改信息',
              method: (row) => {
                this.updateInfo(row)
              }
            },
            {
              label: '删除日程',
              method: (row) => {
                this.deleteSchedule(row)
              }
            }
          ]
        }
      },
      clsId: '', // 班级编号
      rowInfo: {} // 信息
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.paneName == '1') { //eslint-disable-line

      } else if (tab.paneName == '2') { //eslint-disable-line
        this.courseTable.options.apiService = queryArrageCourseList
        this.$refs.commonTable.getList({ clsId: this.clsId })
      }
    },
    /** 页数改变 */
    indexChange(pageIndex) {
      const payload = {
        clsId: this.clsId,
        pageIndex: pageIndex - 1
      }
      this.$refs.commonTable.getList(payload)
    },
    /** 每页条数改变 */
    sizeChange(pageSize) {
      const payload = {
        clsId: this.clsId,
        pageSize
      }
      this.$refs.commonTable.getList(payload)
    },
    show(row) {
      this.sideDialogShow = true
      this.rowInfo = row
      this.activeName = '1'
      this.clsId = row.clsId
      if (row.clsId) {
        const params = {
          clsId: row.clsId
        }
        getClassGradeDetail(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.stuTable.options.apiService = queryClassStuList
            this.$refs.stuTable.getList({ clsId: row.clsId })
            this.sideInfo = data.data
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      }
    },
    /* 更新排课记录 */
    updateArrange(id) {
      this.$refs.commonTable.getList({ clsId: id })
    },
    /* 更新学员列表 */
    updateStuList(id) {
      this.$refs.stuTable.getList({ clsId: id })
    },
    /* 关闭 */
    cancel() {
      this.sideDialogShow = false
    },
    /* 编辑 */
    edit() {
      this.$emit('toParent', this.sideInfo, this.rowInfo)
    },
    /* 删除 */
    deleteFunc() {
      this.$emit('toDelete', this.sideInfo)
    },
    /* 新增学员 */
    addNewStu() {
      const stuTableData = this.$refs.stuTable.tableData
      this.$emit('toAddNewStu', this.rowInfo, stuTableData)
    },
    /* 移除学员 */
    deleteHandle(row) {
      const params = {
        stuId: row.stuId,
        clsId: this.clsId
      }
      removeClassStu(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.$refs.stuTable.getList({ clsId: this.clsId })
        } else {
          this.$message.error(data.errorMessage || '移除学员失败')
        }
      })
    },
    /* 修改信息 */
    updateInfo(row) {
      this.$emit('toUpdateInfo', row)
    },
    /* 删除日程 */
    deleteSchedule(row) {
      this.$emit('toDeleteSchedule', row, this.clsId)
    },
    /* 学员约课情况 */
    stuOrderCourse(row) {
      this.$emit('toShowOrderDetail', row, this.clsId)
    }
  }
}
</script>
<style lang="scss" scoped>
.courseInfo /deep/ {
  .el-tabs__content {
    padding: 0 20px;
  }
  .el-tabs__nav-scroll {
    padding-left: 20px;
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
      margin-bottom: 7px;
      padding: 0 20px 0 80px;
      flex-wrap: wrap;
      :nth-child(3) {
        padding-left: 28px;
      }
      :nth-child(4) {
        padding-left: 28px;
      }
      :nth-child(5) {
        padding-left: 28px;
      }
      :last-child {
        margin-bottom: 0 !important;
      }
      .info_content_item {
        width: calc((100% - 80px) / 2);
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
  .info_detail /deep/ .el-tabs__nav-wrap::after {
    background: transparent;
  }
  .detail_inner {
  }
}
</style>
