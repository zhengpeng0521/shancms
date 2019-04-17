<template>
  <div class="grade">
    <div v-if="!isArrangeCourse">
      <div class="page_title_text">
        班级管理
      </div>
      <common-search
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <advanced-search v-bind="superSearch" />
      <div class="add">
        <el-button
          type="primary"
          size="mini"
          @click="addNewGrade"
        >新增班级</el-button>
      </div>
      <common-table
        ref="tableCommon"
        :columns="columns"
        :table-height="tableHeight"
        :pagination="pagination"
        :options="options"
        :operation="operates"
        :table-key="'teachManage_grade_gradeTable'"
        @toChildData="getCheckCol"
      />
      <!-- 新增班级 -->
      <NewGrade
        ref="newGrade"
        @toAddGrade="getAddGrade"
      />
      <!-- 编辑班级 -->
      <EditNewGrade
        ref="editGrade"
        @toAddGrade="getEditGrade"
      />
    </div>
    <!-- 班级排课 -->
    <ClassArrange
      v-if="isArrangeCourse"
      :grade-info="gradeInfo"
      @toCloseClassArrange="getCloseClassArrange"
    />
    <GradeInfo
      ref="side"
      :side-info="sideInfo"
      @toParent="getEditData"
      @toDelete="getDeleteData"
      @toShowOrderDetail="getOrderDetail"
      @toUpdateInfo="getUpdateInfo"
      @toDeleteSchedule="getDeleteSchedule"
      @toAddNewStu="getAddNewStu"
    />
    <DeleteGrade
      ref="delGrade"
      @toDeleteGrade="getDeleteGradeData"
    />
    <StuOrder ref="stuOrderDetail" />
    <UpdateInfo ref="update" />
    <DeleteSchedule
      ref="deleteSchedule"
      @toDeleteSchedule="getDeleteScheduleData"
    />
    <AddStudent
      ref="addStu"
      @toUpdateStuList="getUpdateStuList"
    />
  </div>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import StuOrder from './dialog/stuOrderCourseDetail'
import NewGrade from './dialog/addNewGrade'
import EditNewGrade from './dialog/editNewGrade'
import DeleteGrade from './dialog/deleteGradeSure'
import UpdateInfo from './dialog/updateInfo'
import DeleteSchedule from './dialog/deleteSchedule'
import AddStudent from './dialog/addStudent'

import ClassArrange from './classArrange'
import { queryClassGradeList, deleteClassGrade, closeGrade } from '@/api/teachManage/grade'
import GradeInfo from './side/gradeInfoSide'
export default {
  components: {
    CommonSearch,
    CommonTable,
    AdvancedSearch,
    NewGrade,
    EditNewGrade,
    ClassArrange,
    GradeInfo,
    DeleteGrade,
    StuOrder,
    UpdateInfo,
    DeleteSchedule,
    AddStudent
  },
  data() {
    return {
      formInline: {
        type: '1',
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '班级名称',
            modelValue: 'name',
            isClearable: true,
            itemStyle: 'width:140px'
          }, {
            itemType: 'input',
            placeholder: '课程名称',
            modelValue: 'courseName',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'select',
            placeholder: '班级状态',
            modelValue: 'type',
            isClearable: true,
            itemStyle: 'width:140px',
            defaultFirst: true,
            default: true,
            selectOption: [
              {
                label: '正常',
                value: '1'
              }, {
                label: '结业',
                value: '0'
              }
            ]
          }
        ]
      },
      columns: [
        {
          label: '班级名称',
          prop: 'name',
          formatter: (row, column, cellValue) => {
            return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.name}</div>`
          },
          isShowTooltip: true,
          methods: (row) => {
            this.openSideDialog(row)
          }
        },
        {
          label: '所属课程',
          prop: 'courseName',
          isShowTooltip: true
        },
        {
          label: '所属课系',
          prop: 'courseGroupName',
          isShowTooltip: true
        },
        {
          label: '班级人数',
          prop: 'num',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.classStuNum}/${row.maxNum}</div>`
          }
        },
        {
          label: '班级进度',
          prop: 'cpd',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.overdueCpdNum}/${row.totalCpdNum}</div>`
          }
        },
        {
          label: '开班日期',
          prop: 'beginTime',
          isShowTooltip: true
        },
        {
          label: '结课日期',
          prop: 'endTime',
          isShowTooltip: true
        },
        {
          label: '主教',
          prop: 'mainTeacherNames',
          isShowTooltip: true
        },
        {
          label: '助教',
          prop: 'assistanTeacherNames',
          isShowTooltip: true
        },
        {
          label: '班主任',
          prop: 'topTeacherName',
          isShowTooltip: true
        },
        {
          label: '班级状态',
          prop: 'type',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.type == '1') { //eslint-disable-line
              return `<div>正常</div>`
            } else {
              return `<div>结课</div>`
            }
          }
        }
      ],
      tableHeight: 'calc(100vh - 233px)', // 表格高度
      pagination: {
        show: true,
        sizes: true
      },
      visible: false,
      operates: {
        width: '250',
        fixed: 'right',
        list: [
          {
            label: '删除',
            type: 'normal',
            popoverName: 'selfPop',
            method: (row) => {
              this.deleteHandle(row)
              return true
            },
            popoverCon: [
              {
                contentText: '确定要删除吗？'
              }
            ]
          },
          {
            label: '结业',
            type: 'normal1',
            method: (row) => {
              this.finishHandle(row)
            },
            popoverCon: [
              {
                contentText: '确定要结业吗？'
              }
            ]
          }, {
            label: '班级排课',
            method: (row) => {
              this.gradeSchedule(row)
            }
          }
        ]
      },
      options: {
        apiService: queryClassGradeList,
        params: {
          type: '1'
        },
        isSettingShow: true
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'select',
            key: 'fullClass',
            label: '是否满班',
            options: [
              { value: '1', label: '满班' },
              { value: '2', label: '未满班' }
            ]
          },
          {
            type: 'select',
            key: 'courseGroupId',
            label: '课系',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SS_CRM}/cerp/coursegroup/query`
          },
          {
            type: 'input',
            key: 'mainTeacherName',
            label: '主教'
          },
          {
            type: 'input',
            key: 'assistantTeacherName',
            label: '助教'
          }
        ]
      },
      isArrangeCourse: false, // 是否显示班级排课
      gradeInfo: {}, // 班级信息
      sideDialogShow: false, // 是否打开侧边栏
      sideInfo: {}, // 点击某行信息
      superValue: {}, // 高级搜索数据
      formValue: {
        type: '1'
      } // 搜索栏的数据
    }
  },
  methods: {
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      // 搜索的入参
      const params = {
        ...formValue,
        ...this.superValue
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      const params = {
        pageIndex: 0,
        type: this.formInline.type,
        ...this.superValue
      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /* 新增班级 */
    addNewGrade() {
      this.$refs.newGrade.show()
    },
    /* 新增班级刷新 */
    getAddGrade() {
      this.$refs.tableCommon.getList()
    },
    /* 编辑班级刷新 */
    getEditGrade(row) {
      this.$refs.tableCommon.getList()
      this.$refs.side.show(row)
    },
    /* 获取表头的选择 */
    getCheckCol(val) {
      console.info(val, '111')
    },
    /* 删除*/
    deleteHandle(row) {
      const params = {
        clsId: row.clsId
      }
      deleteClassGrade(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.$refs.tableCommon.getList()
        } else {
          this.$message.error(data.errorMessage || '删除班级失败')
        }
      })
    },
    /* 结业 */
    finishHandle(row) {
      const params = {
        classId: row.clsId,
        type: '0'
      }
      closeGrade(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.$refs.tableCommon.getList()
        } else {
          this.$message.error(data.errorMessage || '结业班级失败')
        }
      })
    },
    /* 班级排课*/
    gradeSchedule(row) {
      this.isArrangeCourse = true
      this.gradeInfo = row
    },
    /* 关闭班级排课 */
    getCloseClassArrange() {
      this.isArrangeCourse = false
    },
    /* 打开侧边栏 */
    openSideDialog(row) {
      this.$refs.side.show(row)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      const params = {
        ...superValue,
        ...this.formValue
      }
      this.superValue = superValue
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      const params = {
        pageIndex: 0,
        ...this.formValue
      }
      this.superValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /* 获取编辑信息 */
    getEditData(val, row) {
      this.$refs.editGrade.show(val, row)
    },
    /* 获取删除信息 */
    getDeleteData(val) {
      this.$refs.delGrade.show(val)
    },
    /* 获取新增学员 */
    getAddNewStu(row, list) {
      this.$refs.addStu.show(row, list)
    },
    /* 获取学员约课详情 */
    getOrderDetail(row, id) {
      this.$refs.stuOrderDetail.show(row, id)
    },
    /* 获取学员修改信息 */
    getUpdateInfo(row) {
      this.$refs.update.show(row)
    },
    /* 获取学员删除日程 */
    getDeleteSchedule(row, id) {
      this.$refs.deleteSchedule.show(row, id)
    },
    /* 侧边栏删除班级 */
    getDeleteGradeData() {
      this.$refs.tableCommon.getList()
      this.$refs.side.cancel()
    },
    getDeleteScheduleData(id) {
      this.$refs.side.updateArrange(id)
    },
    /* 更新学员列表 */
    getUpdateStuList(row) {
      this.$refs.side.updateStuList(row.clsId)
      this.$refs.tableCommon.getList()
      this.$refs.side.show(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.grade /deep/ {
  padding: 20px 20px 0;
  .page_title_text {
    font-weight: 500;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    margin-bottom: 20px;
    padding-left: 0;
    color: #333;
  }
  .side-dialog {
    height: calc(100vh - 68px);
  }
  .add {
    float: right;
  }
}
</style>
