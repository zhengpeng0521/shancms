<template>
  <div class="lessonShow-container">
    <div class="lessonShow-top">课程管理</div>
    <div class="search">
      <div class="search-left">
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
      </div>
      <div class="search-right">
        <el-button
          v-if="hasBtn('304000001')"
          type="primary"
          @click="addLessonShow()"
        >新建课程</el-button>
      </div>
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      table-key="microWeb_lessonShow_index"
      class="borderTable"
    />
    <!-- 二维码弹框 -->
    <erweima ref="eriweimaDialog" />
    <addLesson
      ref="addLessonDialog"
      :id="id"
      :visible.sync="lessonShow"
    />
  </div>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import { queryCourseList, changeCourse, queryCourseDetail } from '@/api/microWeb/lessonShow.js'
import addLesson from './components/addLesson'
import erweima from './components/erweima'
export default {
  components: {
    CommonSearch,
    CommonTable,
    AdvancedSearch,
    addLesson,
    erweima
  },
  data() {
    return {
      id: '',
      dialogVisible: false,
      // 搜索参数
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '课程名称',
            modelValue: 'courseName',
            isClearable: true,
            itemStyle: 'width: 140px'
          },
          {
            itemType: 'select',
            placeholder: '状态',
            modelValue: 'status',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '已上架',
                value: '1'
              }, {
                label: '已下架',
                value: '2'
              }, {
                label: '全部状态',
                value: ''
              }
            ]
          }
        ]
      },
      // 表格参数
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '课程名称',
          prop: 'name',
          isShowSet: true,
          // isShowTooltip: true,
          width: 130,
          render: (h, params) => {
            return h('div', {}, [
              h('div', { style: { overflow: 'hidden', 'text-overflow': 'ellipsis',
                'white-space': 'normal', display: '-webkit-box', '-webkit-line-clamp': '1', width: '120px',
                'line-height': '15px', 'font-size': '14px', '-webkit-box-orient': 'vertical'
              }, on: { click: () => {
                // window.open(params.row.activityUrl)
              } }
              }, [h('el-tooltip', {
                props: { placement: 'top', width: '200', content: params.row.name, effect: 'dark' }
              }, [
                h('span',
                  { },
                  params.row.name)
              ])])
            ])
          }
        },
        {
          label: '二维码',
          prop: 'activityUrl',
          isShowSet: true,
          formatter: (row) => {
            return `<img src="https://img.ishanshan.com/gimg/n/20190326/bc5f6357fa2726cb764b85d533dadf46"/>`
          },
          methods: (row) => {
            // console.log(row)
            this.showDialog(row)
          }
        },
        {
          label: '状态',
          prop: 'statu',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            if (row.status === '2') {
              return `<div style="display:flex">
                      <div style="margin-right:5px;margin-top:8px;width:8px;height:8px;background:rgba(208,2,27,1);border-radius:50px"></div>
                      <span>已下架</span>
                    </div>`
            } else if (row.status === '1') {
              return `<div style="display:flex">
                      <div style="margin-top:8px;margin-right:5px;width:8px;height:8px;background:rgba(135,208,104,1);border-radius:50px"></div>
                      <span>已上架</span>
                    </div>`
            }
          }
        },
        {
          label: '适合年龄',
          prop: 'adAge',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '排序值',
          prop: 'sort',
          isShowSet: true,
          isShowTooltip: true,
          renderHeader: (h, { column, $index }) => {
            return h('div', {}, [
              h('span', '排序值'),
              h('el-tooltip', { props: { effect: 'dark', content: '排序值越大排在越前面', placement: 'top' }}, [
                h('i', { 'class': 'el-icon-warning', style: { marginLeft: '5px' }})
              ])
            ])
          },
          align: 'right',
          formatter: (row) => {
            return `<span>${row.sort}</span>`
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isColShow: false,
          isShowSet: true,
          width: 170,
          isShowTooltip: true
        }

      ],
      options: {
        isSettingShow: true, // 是否出现设置
        apiService: queryCourseList // 表格的数据请求接口
      },
      tableHeight: 'calc(100vh - 240px)',
      isBorder: true,
      operates: {
        fixed: 'right',
        width: 200,
        list: [
          {
            label_1: '下架',
            label_2: '上架',
            btnId: '304000004',
            type: 'unnormal',
            method: (row) => {
              console.log(row, 'row')
              const loading = this.$loading({
                lock: true,
                text: '拼命加载中。。。',
                spinner: 'el-icon-loading',
                fullscreen: true,
                // background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector('.lessonShow-container')
              })
              if (row.status === '1') {
                row.status = '2'
              } else if (row.status === '2') {
                row.status = '1'
              }
              changeCourse({ status: row.status, ids: row.id }).then(res => {
                if (res.data.errorCode === 0) {
                  loading.close()
                  this.resetFieldHanle()
                } else {
                  this.$message.error(res.errorMessage)
                }
              })
            },
            popoverCon: [
              {
                contentText: '确认要下架吗？',
                status: 1
              }, {
                contentText: '确认要上架吗？',
                status: 2
              }
            ]
          },
          {
            label: '编辑',
            type: 'normal',
            btnId: '304000003',
            method: (row) => {
              this.editLesson(row)
              // this.$refs.addLessonDialog.addLessonDialogTitlt = '编辑课程'
            }
          },
          {
            label: '删除',
            btnId: '304000002',
            type: 'normal',
            method: (row) => {
              changeCourse({ status: 0, ids: row.id }).then(res => {
                const loading = this.$loading({
                  lock: true,
                  text: '拼命加载中。。。',
                  spinner: 'el-icon-loading',
                  fullscreen: true,
                  // background: 'rgba(0, 0, 0, 0.7)',
                  target: document.querySelector('.lessonShow-container')
                })
                if (res.data.errorCode === 0) {
                  loading.close()
                  this.resetFieldHanle()
                } else {
                  this.$message.error(res.errorMessage)
                }
              })
            },
            popoverCon: [
              {
                contentText: '确认删除？'
                // status: '1'
              }
            ]
          }
        ]
      },
      // 新增课程参数
      lessonShow: false
    }
  },

  methods: {
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      const params = {
        // courseName: this.formInline.id,
        // status: this.formInline.statu
        ...formValue
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      const params = {
        courseName: ''

      }
      this.$refs.tableCommon.getList(params)
    },
    //  二维码弹框方法
    showDialog(row) {
      this.$refs.eriweimaDialog.dialogVisible = true
      this.$refs.eriweimaDialog.showDialog(row)
    },
    // 新增课程
    addLessonShow() {
      this.lessonShow = true
      this.$refs.addLessonDialog.addLessonDialogTitlt = '新建课程'
    },
    editLesson(editObj) {
      this.lessonShow = true
      this.$refs.addLessonDialog.addLessonDialogTitlt = '课程信息'
      this.id = editObj.id
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中。。。',
        spinner: 'el-icon-loading',
        fullscreen: true,
        // background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.lessonShow-container')
      })
      queryCourseDetail({ courseId: editObj.id }).then(res => {
        if (res.data.errorCode === 0) {
          // console.log(res.data.results, this.$refs.addLessonDialog.lessonForm)
          const obj = { ...res.data.results }
          const arr = []
          obj.detailPic.split(',').map((val) => {
            arr.push({ url: val })
          })

          this.$refs.addLessonDialog.lessonForm.courseName = obj.name
          this.$refs.addLessonDialog.courseCoverArr = [{ url: obj.courseCover }]
          this.$refs.addLessonDialog.lessonForm.courseCover = [{ url: obj.courseCover }]
          this.$refs.addLessonDialog.lessonForm.detailPic = arr
          this.$refs.addLessonDialog.detailPicArr = arr
          this.$refs.addLessonDialog.lessonForm.sort = obj.sort
          this.$refs.addLessonDialog.lessonForm.courseType = obj.courseType.split(',')
          this.$refs.addLessonDialog.lessonForm.adAge = obj.adAge
          this.$refs.addLessonDialog.lessonForm.perTime = obj.perTime
          this.$refs.addLessonDialog.lessonForm.detailContent = JSON.parse(obj.detailContent)
          loading.close()
          this.lessonShow = true
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.lessonShow-container {
  width: calc(100%);
  padding: 0 20px;
  // border: 1px solid #f00;
  .lessonShow-top {
    width: 100%;
    padding: 20px 0;
    border-bottom: 1px solid rgb(204, 204, 204);
    font-size: 16px;
    // background: pink;
  }
  .search {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    height: 48px;
  }
}
</style>
<style lang="scss">
.lessonShow-container {
  .borderTable {
    .el-table--fit {
      border-left: none;
    }
    .el-table__body tbody tr td:first-child {
      border-left: 1px solid #ebeef5;
    }
  }
  .erweimaBox {
    width: 335px;
    // height: 435px;
    .el-dialog__header {
      border-bottom: 0;
    }
    .el-dialog__body {
      padding: 10px 0 0 17px !important;
      p {
        margin-top: 20px;
        margin-bottom: 10px;
        font-size: 15px;
        text-align: center;
      }
      .el-tree-select {
        margin-bottom: 10px;
      }
      .erweima-footer {
        display: flex;
        justify-content: space-around;
        margin-bottom: 10px;
        .ipt {
          width: 220px;
          height: 28px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          transition: all 0.3s;
          line-height: 28px;
          overflow: hidden;
        }
        .ipt:hover {
          border: 1px solid rgb(51, 141, 233);
        }
        .el-button {
          margin-left: 2%;
        }
      }
    }
  }
}
</style>

