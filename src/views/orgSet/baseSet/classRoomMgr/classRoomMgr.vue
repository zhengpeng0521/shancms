<template>
  <div class="wageSet">

    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <el-button
      class="fr"
      type="primary"
      @click="addNewClassRoom('classDatas')"
    >新增教室</el-button>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="optionsTab"
      :operation="operates"
    />

    <el-dialog
      :visible.sync="switchDialog"
      :title="dialogTitle"
      @close="cancelForm('classDatas')"
    >

      <el-form
        ref="classDatas"
        :model="classRoomData"
        :rules="rules"
        label-width="100px"
      >

        <el-form-item
          label="教室名称:"
          prop="name"
        >
          <el-input
            v-model="classRoomData.name"
            clearable
            placeholder="请输入教室名称"
          />

        </el-form-item>

        <el-form-item
          label="大致方位:"
          prop="intro"
        >
          <el-input
            v-model="classRoomData.intro"
            placeholder="请输入大致方位"
            clearable
          />

        </el-form-item>

      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelForm('classDatas')"
        >取 消</el-button>
        <el-button
          v-repeatdely="2000"
          type="primary"
          @click="submitForm('classDatas')"
        >保存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import { queryClassRoom, statusUpdate, createClassroom, updateClassroom, deleteClassroom } from '@/api/orgSet/baseSet'

import CommonTable from '@/components/CommonTable/CommonTable'
import CommonSearch from '@/components/CommonSearch/CommonSearch'

export default {
  components: {
    CommonSearch,
    CommonTable
  },
  data() {
    return {
      classRoomData: {
        name: '',
        intro: ''
      },

      rules: {
        name: [
          { required: true, message: '请输入教室名称', trigger: 'blur' }
        ]
      },
      isPopOpen: [],
      isPopHover: false,

      switchDialog: false,
      dialogTitle: '新增教室',
      listQuery: {
        show: true // 是否显示
      },
      columns: [

        {
          label: '教室名称',
          prop: 'name',

          formatter: (row, column, cellValue) => {
            return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.name}</div>`
          }
        },
        {
          label: '大致方位',
          prop: 'intro'
        },
        {
          label: '创建日期',
          prop: 'createTime'
        },
        { label: '启用状态',
          prop: 'status',

          render: (h, params) => {
            return (
              <el-switch v-model={params.row.status} active-value='1' inactive-value='0' active-color='#46b6ee'
                inactive-color='#dcdfe6' nativeOnClick={() => {
                  this.switchClassRoom(params.row)
                }}></el-switch>
            )
          }

        }

        // {
        //   label: '所属校区',
        //   prop: 'orgName',
        //   render: (h, params) => {
        //     return h('span', {}, [
        //       h('el-popover', {
        //         props: { placement: 'top', trigger: 'hover', content: params.row.orgName }
        //       }, [
        //         h('a', { slot: 'reference' }, params.row.orgName)
        //       ])
        //     ])
        //   }
        // }

      ],
      optionsTab: {
        apiService: queryClassRoom, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },

      operates: {
        width: '150',
        fixed: 'right',
        list: [

          {
            label: '删除',
            type: 'normal',
            method: (row) => {
              this.deleteClassRoom(row)
            },
            popoverCon: [
              {
                contentText: '确定要删除吗？'
              }
            ]
          },
          {
            label: '编辑',
            type: 'normal',
            method: (row) => {
              this.editClassRoom(row)
            }

          }
        ]
      },

      tableHeight: 'calc(100vh - 234px)',
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '请输入教室名称',
            modelValue: 'id',
            isClearable: true
          }
        ]
      }

    }
  },
  mounted() {
    this.getClassRoomList()
  },
  methods: {

    getClassRoomList() {
      queryClassRoom().then(res => {
        if (res.data.errorCode !== 0) {
          this.$message.success(res.data.errorMessage)
        }
      })
    },
    searchHandle(formValue) {
      // 搜索的入参

      const params = {
        name: formValue.id
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    // 新增添加教室
    addNewClassRoom(formName) {
      this.switchDialog = true
      this.dialogTitle = '新增教室'
    },
    // 编辑
    editClassRoom(val) {
      this.switchDialog = true
      this.dialogTitle = '编辑教室'
      const temp = Object.assign({}, val)
      this.$nextTick(() => {
        this.classRoomData.name = temp.name
        this.classRoomData.intro = temp.intro
        this.classRoomData.id = temp.id
      })
    },
    switchClassRoom(val) {
      const data = {
        status: val.status,
        ids: val.id
      }
      statusUpdate(data).then(res => {
        if (res.data.errorCode === 0) {
          if (val.status === '0') {
            this.$message({
              message: '禁用教室成功',
              type: 'warning'
            })
          } else {
            this.$message({
              message: '启用教室成功',
              type: 'success'
            })
          }
          // this.$refs.tableCommon.getList()
        } else {
          this.$message.error(res.data.errorMessage)
        }

        this.$refs.tableCommon.getList()
      })
    },
    // 删除教室
    deleteClassRoom(val) {
      const data = {
        id: val.id
      }
      deleteClassroom(data).then(res => {
        if (res.data.errorCode === 0) {
          this.$refs.tableCommon.getList()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    // 取消提交
    cancelForm(formName) {
      this.switchDialog = false
      this.$nextTick(() => {
        this.$refs['classDatas'].resetFields()
      })
    },
    // 确认提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增教室') {
            createClassroom(this.classRoomData).then(res => {
              if (res.data.errorCode === 0) {
                this.cancelForm()
                this.$refs.tableCommon.getList()
              } else {
                this.$message.error(res.data.errorMessage)
              }
            })
          } else {
            updateClassroom(this.classRoomData).then(res => {
              if (res.data.errorCode === 0) {
                this.cancelForm()
                this.$refs.tableCommon.getList()
              } else {
                this.$message.error(res.data.errorMessage)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

  }
}
</script>
