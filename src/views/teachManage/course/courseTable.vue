<template>
  <div class="course">
    <div class="page_title_text">
      课程管理
    </div>
    <common-search
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <div class="add">
      <el-button
        type="primary"
        size="mini"
        @click="lessonManangeFunc"
      >课系管理</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="newCourse"
      >新增课程</el-button>
    </div>
    <common-table
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="pagination"
      :options="options"
      :operation="operates"
      :table-key="'teachManage_course_courseTable'"
    />
    <!-- 新增课程 -->
    <AddNewCourse
      ref="addNewCourse"
      @toAddNewCourse="getNewCourse"
    />
    <ThemeManage ref="theme" />
    <LessonManage ref="lesson" />
    <DeleteCourse
      ref="deleteCourse"
      @toDeleteSure="getDeleteSure"
    />
    <CourseName
      ref="side"
      @toParent="getData"
      @toDelete="deleteData"
    />
    <!-- 编辑 -->
    <EditNewCourse ref="editCourse" />
  </div>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import AddNewCourse from './dialog/addNewCourse'
import { queryCourseList, statusUpdateCourse, queryCoursegroup } from '@/api/teachManage/course'
// import { fetchList } from '@/api/course' // mock
import ThemeManage from './dialog/classThemeManage'
import LessonManage from './dialog/lessonManage'
import CourseName from './side/courseNameSide'
import DeleteCourse from './dialog/deleteCourseSure'
import EditNewCourse from './dialog/editNewCourse'
export default {
  components: {
    CommonSearch,
    CommonTable,
    AddNewCourse,
    ThemeManage,
    LessonManage,
    CourseName,
    DeleteCourse,
    EditNewCourse
  },
  data() {
    return {
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '课程名称',
            modelValue: 'courseName',
            isClearable: true
          },
          {
            itemType: 'select',
            placeholder: '课系',
            modelValue: 'courseGroupId',
            isClearable: true,
            apiService: queryCoursegroup,
            labelKey: 'name',
            valueKey: 'id',
            isVisibleList: true
          }
        ]
      },
      columns: [
        {
          label: '课程名称',
          prop: 'title',
          formatter: (row, column, cellValue) => {
            return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.title}</div>`
          },
          methods: (row) => {
            this.openSideDialog(row)
          },
          isShowTooltip: true
        },
        {
          label: '课系',
          prop: 'groupName',
          isShowTooltip: true
        },
        {
          label: '每节消耗',
          prop: 'cost',
          isShowTooltip: true
        },
        {
          label: '上课月龄/年龄',
          prop: 'age',
          width: '150',
          formatter: (row, column, cellValue) => {
            if (row.ageType == '1') { //eslint-disable-line
              return `<div>${row.minMa} ~ ${row.maxMa}月</div>`
            } else {
              return `<div>${Math.floor(row.minMa / 12)} ~ ${Math.ceil(row.maxMa / 12)}岁</div>`
            }
          },
          isShowTooltip: true
        },
        {
          label: '课程介绍',
          prop: 'intro',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true
        },
        {
          label: '所属校区',
          prop: 'orgName',
          isShowTooltip: true,
          width: 120
        }
      ], // 表格列
      tableHeight: 'calc(100vh - 235px)', // 表格高度
      pagination: {
        show: true,
        sizes: true
      },
      operates: {
        width: '250',
        fixed: 'right',
        list: [
          {
            label: '删除',
            type: 'normal',
            method: (row) => {
              this.deleteHandle(row)
            },
            popoverCon: [
              {
                contentText: '确定要删除吗？'
              }
            ]
          }, {
            label: '主题管理',
            method: (row) => {
              this.themeManageDialog(row)
            }
          }
        ]
      },
      options: {
        apiService: queryCourseList,
        isSettingShow: true
      },
      courseGroupList: []
    }
  },
  methods: {
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      const params = {
        title: formValue.courseName,
        courseGroupId: formValue.courseGroupId
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 新增课程 */
    newCourse() {
      this.$refs.addNewCourse.show()
    },
    /* 打开侧边 */
    openSideDialog(row) {
      this.$refs.side.show(row)
    },
    /* 删除课程 */
    deleteHandle(row) {
      const params = {
        ids: row.id,
        status: '0'
      }
      statusUpdateCourse(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.$refs.tableCommon.getList()
        } else {
          this.$message.error(data.errorMessage || '删除课程失败')
        }
      })
    },
    /* 主题管理 */
    themeManageDialog(row) {
      this.$refs.theme.show(row)
    },
    /* 管理课系 */
    lessonManangeFunc() {
      this.$refs.lesson.show()
    },
    /* 编辑课程 */
    getData(val) {
      this.$refs.editCourse.show(val)
    },
    /* 删除课程 */
    deleteData(val) {
      this.$refs.deleteCourse.show(val)
    },
    /* 删除更新 */
    getDeleteSure() {
      this.$refs.tableCommon.getList()
      this.$refs.side.cancel()
    },
    /* 新增课程 */
    getNewCourse() {
      this.$refs.tableCommon.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.course {
  padding: 20px 20px 0;
  .page_title_text {
    font-weight: 500;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    margin-bottom: 20px;
    padding-left: 0;
    color: #333;
  }
  .add {
    float: right;
  }
}
</style>
