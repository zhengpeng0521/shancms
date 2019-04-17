<template>
  <div>

    <div class="role_content">
      <div class="role_mgr_left">

        <div class="role_mgr_box">
          <div class="role_title">
            <span style="margin-left: 10px;">角色名称</span>
          </div>

          <ul class="role_name">

            <li
              v-for="(i,index) in rolesName"
              :key="index"
              @click="getRolesDetail(i,index)"
            >

              <div v-if="!i.editLi">
                <span :class="[activeLi==index?'active_li':'','show_full']">
                  {{ i.name }}
                </span>

                <span class="fr">
                  <el-button
                    v-if="i.id!==1"
                    type="text"
                    class="copy_btn"
                    @click="copyRoleName(i)"
                  >
                    复制
                  </el-button>

                  <el-button
                    v-if=" i.name!=='系统管理员'"
                    type="text"
                    class="rename_btn"
                    @click="editRoleName(i,index)"
                  >

                    重命名
                  </el-button>

                  <Confirm
                    v-if=" i.name!=='系统管理员'"
                    :text="'删除'"
                    :placement="'top'"
                    :content="'确定删除吗？'"
                    :confirm="()=>{deleteRoleName(i)}"
                    :is-button="true"
                    :btn-type="'text'"
                  />
                </span>
              </div>
              <div
                v-if="i.editLi"
                class="edit_name"
              >

                <el-input
                  v-model="i.name"
                  placeholder="请输入角色名称"
                  clearable
                  @blur="checkNameLength(i.name,index)"
                />
                <span class="edit_name_btn">

                  <el-button
                    :disable="i.name.length>=15"
                    type="text"
                    style="margin-left: 9px;"
                    @click="confirmEdit(i)"
                  >
                    确认
                  </el-button>
                  <el-button
                    type="text"
                    @click="cancelEdit(i,index)"
                  >
                    取消
                  </el-button>

                </span>
              </div>
            </li>
          </ul>
          <div class="bottom_box">
            <el-button
              class="bottom_btn"
              type="primary"
              @click="openDialog"
            >
              新增
            </el-button>

          </div>
        </div>

      </div>

      <div class="role_mgr_right">
        <div class="role_mgr_box">

          <p class="role_mgr_title">权限设置</p>
          <div class="role_mgr_tree_box">

            <div
              style="    margin: 20px 20px;"
              class="role_mgr_tree"
            >
              <span>菜单权限</span>
              <el-tree
                ref="tree"
                :data="treeDatas"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                highlight-current
                @node-click="handleNodeClick"
              />

            </div>

            <div
              style="margin-right:20px"
              class="role_mgr_tree"
            >
              <span>
                操作权限
              </span>
              <el-tree
                v-if="operateDatas.length>0"
                ref="operateTree"
                :data="operateDatas"
                :props="defaultOperateProps"
                default-expand-all
                show-checkbox
                node-key="id"
                highlight-current
                @check-change="checkOperations"
              />

            </div>
          </div>
          <div class="bottom_box">

            <el-button
              class="bottom_btn"
              type="primary"
              @click="saveCheckedKeys"
            >
              保存
            </el-button>
          </div>
        </div>

      </div>
    </div>

    <el-dialog
      :visible.sync="switchDialog"
      title="新增角色"
      width="400px"
      @close="cancelForm('formData')"
    >

      <el-form
        ref="formData"
        :model="formData"
        label-width="93px"
      >

        <el-form-item
          :rules="{ required: true, message: '请输入角色名称', trigger: 'blur' }"
          label="角色名称："
          prop="roleName"
        >
          <el-input v-model="formData.roleName" />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelForm('formData')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('formData')"
        >确 定</el-button>
      </span>

    </el-dialog>
  </div>

</template>

<script>
// eslint-disable-next-line
import { tenantRoleQuery, resourceTreeQuery, tenantRoleCreate, tenantRoleCopy, tenantRoleUpdate, tenantRoleDelete, operateQuery } from '@/api/orgSet/staffSet'
import Confirm from '@/components/MiniCommon/Confirm'
export default {
  components: {
    Confirm
  },
  data() {
    return {

      editLi: false,
      switchDialog: false,
      rolesName: [],
      treeDatas: [],
      operateDatas: [],
      formData: {
        rolesName: ''
      },
      isLength: false,
      activeLi: '',
      saveRole: '',
      saveOperateIds: [],
      defaultProps: {
        children: 'list',
        label: 'name',
        id: 'id'
      },
      defaultOperateProps: {
        children: 'list',
        label: 'text',
        id: 'id'
      }
    }
  },
  mounted() {
    this.getRoleName()
    this.getTreeList()
  },
  methods: {
    getRoleName() {
      tenantRoleQuery().then(res => {
        if (res.data.errorCode === 0) {
          this.rolesName = res.data.results
          setTimeout(() => {
            this.$nextTick(() => {
              this.getRolesDetail(res.data.results[0], 0)
            })
          }, 1000)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    getTreeList() {
      resourceTreeQuery().then(res => {
        if (res.data.errorCode === 0) {
          this.treeDatas = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    handleNodeClick(data, checked, indeterminate) {
      this.operateDatas = []
      if (checked.level === 2) {
        this.operateDatas = Object.assign([], data.operateItemList)
        setTimeout(() => {
          this.$refs.operateTree.setCheckedKeys(this.saveOperateIds)
        }, 400)
      }
    },

    checkOperations(data, checked, indeterminate) {
      if (checked) {
        if (this.saveOperateIds.indexOf(data.id) === -1) {
          this.saveOperateIds.push(data.id)
        }
      }

      if (!checked) {
        const index = this.saveOperateIds.indexOf(data.id)
        this.saveOperateIds.splice(index, 1)
      }
    },

    // 保存已选择checked
    saveCheckedKeys() {
      const data = {
        id: this.saveRole.id,
        name: this.saveRole.name,
        resIds: this.$refs.tree.getCheckedKeys().join(',')

      }
      if (this.saveOperateIds.length > 0) {
        data.operateIds = this.saveOperateIds.join(',')
      } else {
        data.operateIds = ''
      }

      tenantRoleUpdate(data).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.errorMessage)
          this.getRoleName()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    copyRoleName(val) {
      const data = {
        copyId: val.id
      }
      tenantRoleCopy(data).then(res => {
        if (res.data.errorCode === 0) {
          this.getRoleName()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    editRoleName(i, index) {
      const temp = Object.assign({}, i)
      temp.editLi = true
      this.rolesName.splice(index, 1, temp)
    },

    checkNameLength(name, index) {
      if (name.length >= 15 || name.length === 0) {
        this.$message.warning('请检查角色名是否填写或者过长（不超过15个字）')
        this.isLength = true
      } else {
        this.isLength = false
      }
    },

    confirmEdit(val) {
      const data = {
        id: val.id,
        name: val.name,
        resIds: this.$refs.tree.getCheckedKeys().join(','),
        operateIds: this.saveOperateIds.join(',')
        // operateIds: this.$refs.operateTree.getCheckedKeys().join(',')
      }
      if (!this.isLength) {
        tenantRoleUpdate(data).then(res => {
          if (res.data.errorCode === 0) {
            this.getRoleName()
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      }
    },

    cancelEdit(i, index) {
      if (!this.isLength) {
        // const temp = Object.assign({}, i)
        // delete temp.editLi
        // this.rolesName.splice(index, 1, temp)
        this.getRoleName()
      }
    },

    deleteRoleName(val) {
      const data = {
        id: val.id

      }
      tenantRoleDelete(data).then(res => {
        if (res.data.errorCode === 0) {
          this.getRoleName()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    getRolesDetail(val, index) {
      this.operateDatas = []
      this.saveOperateIds = []
      this.activeLi = index
      this.$refs.tree.setCheckedKeys([])
      this.saveRole = Object.assign({}, val)

      const treeData = Object.assign([], val.resIds) // 菜单权限
      var me = this
      treeData.forEach(element => {
        me.$refs.tree.setChecked(element, true, false)
      })
      this.saveOperateIds = Object.assign([], val.operateIds)// 操作权限
      var resultArr
      resultArr = this.saveOperateIds.filter(function(item, index, self) {
        return self.indexOf(item) == index && item //eslint-disable-line
      })
      this.saveOperateIds = resultArr
    },

    openDialog() {
      this.switchDialog = true
    },
    // 取消提交
    cancelForm(formName) {
      this.$nextTick(() => {
        this.switchDialog = false
      })

      this.$refs[formName].resetFields()
    },
    // 确认提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            name: this.formData.roleName

          }
          tenantRoleCreate(data).then(res => {
            if (res.data.errorCode === 0) {
              this.getRoleName()
              this.cancelForm('formData')
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.role_content {
  display: flex;
}
.active_li {
  color: #46b6ee;
}

.role_mgr_left {
  // float: left;
  max-width: 28%;
  min-width: 278px;
}

.role_mgr_box {
  border: 1px solid #dddddd;
  border-radius: 5px;
  overflow: hidden;
}

.role_mgr_right {
  // float: right;
  width: 70%;

  overflow: hidden;
  // padding-left: 92px;
  margin-left: 20px;
  .el-tree {
    margin-top: 20px;
  }
}
.bottom_btn {
  text-align: end;
  margin-right: 20px;
  margin-top: 20px;
}
.role_title {
  line-height: 32px;
  background-color: #f0f2f5;
  color: #333333;
  padding: 0 10px;
}

.copy_btn {
  margin-right: 5px !important;
}

.rename_btn {
  margin-left: 0px !important;
  margin-right: 3px !important;
}

.show_full {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  width: 110px;
}

.role_mgr_title {
  line-height: 32px;
  background-color: #f0f2f5;
  color: #333333;
  font-size: 14px;
  font-family: MicrosoftYaHei;

  padding: 0 20px;
  border-radius: 5px 5px 0 0;
  // border: 1px solid #5d9cec;
}

.role_mgr_tree_box {
  display: flex;
  justify-content: space-around;
}

.role_mgr_tree {
  border: 1px solid #ddd;
  padding: 20px;
  width: 50%;
  margin: 20px 0;
}
.role_name {
  li {
    height: 50px;
    line-height: 50px;

    border-bottom: 1px solid #ddd;
    // margin: 0px 5px;
    padding: 0 20px;
    color: #666666;
    cursor: pointer;
    .fr {
      color: #46b6ee;
    }
  }
}
.bottom_box {
  text-align: end;
  line-height: 26px;
  margin-bottom: 20px;
  border-top: 1px solid #dddddd;
}
.role_name li:last-child {
  border-bottom: none;
}

.edit_name {
  .el-input {
    width: 136px;
  }
  color: #5d9cec;
}
.btn_box {
  margin-bottom: 20px;
}
</style>
