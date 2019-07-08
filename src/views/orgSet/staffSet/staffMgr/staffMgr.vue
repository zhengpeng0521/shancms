<template>
  <div class="staff_manage">

    <div class="staff_manage_left">
      <div class="tree_box">
        <div class="block_title">组织架构</div>
        <div class="block_tree">
          <el-tree
            :data="treeDataList"
            :expand-on-click-node="false"
            :props="defaultTreeProps"
            node-key="id"
            default-expand-all
          >
            <span
              slot-scope="{ node, data }"
              ref="trees"
              class="custom-tree-node"
            >
              <span @mouseover="!flag && toggleShow(node, data)">{{ node.label }}</span>

              <span
                v-show="node.label!=='全校区' && activeKey==data.label"
                class="tree_btn"
              >
                <el-button
                  type="text"
                  @click="() => editDepart(node,data)"
                >
                  编辑
                </el-button>

                <el-popover
                  v-model="data.org"
                  trigger="click"
                  placement="top"
                  width="100px"
                  class="pop_hover"
                >
                  <p class="m_b"> <i class="el-icon-warning confirm-icon" />
                    确定要<span style="color:red">删除 </span>此部门吗?</p>
                  <div style="text-align:center; margin: 0">
                    <el-button
                      class="delete_btn"
                      @click.stop="data.org=false,flag=false"
                    >取消</el-button>
                    <el-button
                      type="primary"
                      class="edit_btn"
                      @click.stop="() => removeDepart(node, data)"
                    >确定</el-button>
                  </div>
                  <el-button
                    slot="reference"
                    type="text"
                    class="delete_depts"
                    @click="showPopover"
                  >删除</el-button>
                </el-popover>
              </span>

            </span>
          </el-tree>
          <el-button
            class="block_btn"
            type="primary"
            @click="addDepart"
          >新增部门</el-button>
        </div>
      </div>

    </div>

    <div class="staff_manage_right">

      <div>
        <div class="staff_tabs">
          <el-radio-group
            v-model="tabsValue"
            @change="changeTabs"
          >
            <el-radio-button label="1">使用中</el-radio-button>
            <el-radio-button label="2">已停用</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div>

        <el-collapse-transition>
          <div v-show="isSearchSwitch">

            <div class="transition-box">

              <CommonSearch
                ref="search_com"
                :is-inline="true"
                :params="formInline"
                :forms="formInline"
                style="transition:all 1s"
                @toParent="resetFieldHanle"
              />

            </div>
          </div>
        </el-collapse-transition>

        <div class="staff_mgr_op">

          <span style="text-align:start;line-height: 28px;">

            <span>已选<span style="color:#46b6ee">{{ multipleSelection.length|| 0 }}</span>条数据</span>

            <el-popover
              v-model="isStopStaff"
              placement="top"
              width="264"
            >
              <p class="m_b">
                <i class="el-icon-warning confirm-icon" />
                确定要<span style="color:red">{{ tabsValue=='1'?'停用':'启用' }} </span>此员工吗?<span v-show="tabsValue=='1'">
                  (管理员不可被停用) </span></p>
              <div style="text-align:center; margin: 0">
                <el-button
                  class="delete_btn"
                  @click="isStopStaff = false"
                >取消</el-button>
                <el-button
                  type="primary"
                  class="edit_btn"
                  @click="operaStaff('stop')"
                >确定</el-button>
              </div>

              <el-button
                slot="reference"
                style="margin: 0 7px;"
                class="cancel_btn edit_btn"
              >{{ tabsValue=='1'?'停用':'启用' }}</el-button>
            </el-popover>

            <el-popover
              v-model="deleteConfirm"
              placement="top"
              width="100%"
            >
              <p class="m_b">
                <i class="el-icon-warning confirm-icon" />
                确定要<span style="color:red">删除</span>此员工吗?</p>
              <div style="text-align:center; margin: 0">
                <el-button
                  class="delete_btn"
                  @click="deleteConfirm = false"
                >取消</el-button>
                <el-button
                  type="primary"
                  class="edit_btn"
                  @click="operaStaff('delete')"
                >确定</el-button>
              </div>
              <el-button
                slot="reference"
                class="cancel_btn edit_btn"
              >删除</el-button>
            </el-popover>

          </span>

          <span style="text-align:end">

            <el-button
              class="green_btn"
              @click="addStaff()"
            >新增员工</el-button>
            <el-button
              type="primary"
              @click="isSearch"
            >筛选</el-button>

          </span>

        </div>
        <CommonTable
          ref="tableCommon"
          :columns="columns"
          :table-height="tableHeight"
          :pagination="listQuery"
          :options="optionsTab"
          :operation="operates"
          @handleSelectionChange="selectionChange"
        />

      </div>
    </div>
    <el-dialog
      :visible.sync="switchDialog"
      :title="dialogTitle"
      width="600px"
      @close="cancelForm()"
    >

      <div v-if="!isDeleteFail">

        <!-- 新增编辑部门 -->
        <div v-if="isAddDepart">
          <el-form
            ref="deptData"
            :model="deptData"
            label-width="100px"
          >

            <el-form-item
              label="上级部门："
              prop="pids"
            >

              <el-cascader
                :options="deptsOptions"
                v-model="deptData.pids"
                :props="props"
                :disabled="dialogTitle == '编辑部门'"
                change-on-select
                clearable
                placeholder="请选择所属部门"
              />

            </el-form-item>

            <el-form-item
              :rules="{ required: true, message: '部门名不能为空', trigger: 'blur' }"
              label="部门名称："
              prop="departmentName"
            >
              <el-input
                v-model="deptData.departmentName"
                size="mini"
                clearable
                placeholder="请填写部门名称"
              />

            </el-form-item>

          </el-form>
        </div>
        <!-- 新增部门 end-->

        <!-- 编辑新增员工消息 -->
        <div v-if="!isAddDepart">

          <div style="margin-bottom:14px"><span class="form_txt" />
            基本信息</div>
          <el-form
            ref="staffData"
            :model="staffData"
            :rules="rules"
            label-width="100px"
          >
            <div>
              <el-form-item
                label="头像:"
                prop="headimgurl"
              >

                <el-upload
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  class="avatar-uploader"
                  action="https://imgsrc.ishanshan.com/gimg/upload"
                >
                  <img
                    v-if="staffData.headimgurl"
                    :src="staffData.headimgurl"
                    class="avatar"
                  >
                  <i
                    v-else
                    style="display: contents;"
                    class="el-icon-plus avatar-uploader-icon"
                  />
                </el-upload>

              </el-form-item>

              <el-form-item
                label="员工姓名:"
                prop="name"
              >
                <el-input
                  v-model="staffData.name"
                  clearable
                  placeholder="请输入员工姓名"
                />

              </el-form-item>

              <el-form-item
                label="员工手机:"
                prop="mobile"
              >
                <el-input
                  v-model="staffData.mobile"
                  placeholder="请输入员工手机号"
                  clearable
                />

              </el-form-item>

              <el-form-item label="初始密码">
                <span style="color:#46b6ee">123456</span>

              </el-form-item>
              <el-form-item
                label="性别:"
                prop="sex"
              >
                <el-radio-group v-model="staffData.sex">
                  <el-radio label="1">男</el-radio>
                  <el-radio label="2">女</el-radio>

                </el-radio-group>

              </el-form-item>
              <el-form-item
                label="简介:"
                prop="intro"
              >
                <el-input
                  v-model="staffData.intro"
                  placeholder="请输入简介"
                  type="textarea"
                />
              </el-form-item>

            </div>
            <div>

              <div style="margin-bottom:14px;margin-top:20px"><span class="form_txt" />
                职能信息</div>
              <el-form-item
                label="角色:"
                prop="roleIds"
              >
                <el-select
                  v-model="staffData.roleIds"
                  :disabled="disableSelectRole"
                  placeholder="请选择角色"
                  filterable
                >
                  <el-option
                    v-for="item in tenantRole"
                    :disabled="item.roleKey === 'admin'"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>

              </el-form-item>
              <el-form-item
                label="数据权限:"
                prop="dataPermission"
                class="data_form"
              >

                <el-radio-group v-model="staffData.dataPermission">
                  <el-radio
                    style="margin-bottom:6px"
                    label="0"
                  >全部（可查看机构全部数据）</el-radio>
                  <el-radio label="1">个人（团队）（可查看自己和下属数据，若无下属则查看自己数据）</el-radio>

                </el-radio-group>
                <span class="note_title">提示：更改后需重新登录方可生效</span>

              </el-form-item>
              <el-form-item
                label="所属部门:"
                prop="deptId"
              >
                <el-cascader
                  :options="deptsOptions"
                  v-model="staffData.deptId"
                  :props="props"
                  change-on-select
                  clearable
                  filterable
                  placeholder="请选择所属部门"
                />
                <p class="note_title">请先选择所属部门再选择汇报对象，否则汇报对象可能无选项</p>
              </el-form-item>
              <el-form-item
                label="汇报对象:"
                prop="leaderId"
              >
                <el-select
                  v-model="staffData.leaderId"
                  placeholder="请选择汇报对象"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in chiefUser"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <p class="note_title">所选择的汇报对象可查看该员工数据，可不选中</p>
              </el-form-item>
            </div>
          </el-form>

        </div>
      </div>
      <span
        v-if="!isDeleteFail"
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelForm()"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm(isAddDepart?'deptData':'staffData')"
        >确 定</el-button>
      </span>

      <div v-if="isDeleteFail">
        <div>
          <span style="color: #46B6EE;">共操作（{{ failData.failNum+failData.num }}）</span>，
          <span style="color: #87D068;">成功（{{ failData.num }}）</span>，
          <span style="color: #D0021B">失败（{{ failData.failNum }}）</span>
        </div>
        <div style="margin:20px 0">

          <span><span style="color: #D0021B"> 失败理由 </span>：<span> 名单/学员/班级/排课 存在未交接</span></span>
          <span style="margin-left:10px"><span style="color: #87D068"> 建议 </span>：<span>请联系<span>系统管理员 </span>协助完成交接</span></span>
        </div>
        <el-table
          :data="failData.userJobInfo"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="uid"
            label="员工编号"
          />
          <el-table-column
            prop="userName"
            label="员工姓名"
          />
          <el-table-column
            prop="clueNum"
            label="名单数"
          />
          <el-table-column
            prop="stuNum"
            label="学员数"
          />
          <el-table-column
            prop="classNum"
            label="班级数"
          />
          <el-table-column
            prop="coursePlanNum"
            label="排课数"
          />
        </el-table>
        <div style="text-align:end;margin:20px 0">
          <el-button
            type="primary"
            @click="iKnow"
          >
            我知道了
          </el-button>
        </div>

      </div>
    </el-dialog>

    <WeChat ref="wechatCode" />
  </div>
</template>

<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import WeChat from '@/components/WeChat/WeChat'
import Confirm from '@/components/MiniCommon/Confirm'
// eslint-disable-next-line
import { queryList, chiefUserQuery, summaryRoleQuery, detailById, create, update, modifyFunctions, deleteOrFired, summaryQuery, formatList, tenantRoleQuery, creatDepartment, updateDepartment, deleteDepartment } from '@/api/orgSet/staffSet'
import CommonTable from '@/components/CommonTable/CommonTable'
export default {
  components: {
    CommonSearch,
    WeChat,
    CommonTable,
    Confirm

  },
  data() {
    return {
      activeKey: false,
      failData: '',
      isDeleteFail: false, // 删除员工返回数据--开关
      isStopStaff: false,
      listQuery: {
        show: true,
        sizes: true // 是否显示
      },
      columns: [
        {
          label: '员工编号',
          prop: 'id',
          width: '140px'
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '状态',
          prop: 'activeStatus',
          formatter: (row, column, cellValue) => {
            if (row.activeStatus == 1) {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #87D068;border-radius: 50px;margin-right: 5px;"></span>
                        ${'已激活'}
                      </div>`
            } else {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #D0021B;border-radius: 50px;margin-right: 5px;"></span>
                        ${'未激活'}
                      </div>`
            }
          }
        },
        {
          label: '手机号',
          prop: 'mobile',

          isShowTooltip: true
        },
        {
          label: '微信绑定',
          prop: 'isWechatBind',
          width: '140px',
          align: 'center',

          renderHeader: (h, { column, $index }) => {
            return h('div', {
              style: { lineHeight: '13px', paddingTop: '7px' }
            }, [h('span', {
              style: 'display:inline-block'
            }, '微信绑定',
            ), h('i', {
              class: 'iconfont icon_ym_ewm',
              style: { color: '#46B6EE', marginLeft: '8px' },
              on: {
                click: this.showWX
              }
            })])
          },
          formatter: (row, column, cellValue) => {
            return `<i class="iconfont icon_gb_wx ${row.isWechatBind ? 'nowx' : ''}" />`
          }

        }, {
          label: '角色',
          prop: 'roles',
          width: '120px',
          // formatter: (row, column, cellValue) => {
          //   return `<div>${row.roles[0].role_name ? row.roles[0].role_name : ''}</div>`
          // }
          render: (h, params) => {
            if (params.row.roles.length > 0) {
              return h('span', {}, params.row.roles[0].role_name)
            } else {
              return h('span', {}, '暂无角色')
            }
          }

        },
        {
          label: '数据权限',
          prop: 'dataPermission',
          formatter: (row, column, cellValue) => {
            return `<div >${row.dataPermission === '0' ? '全部' : '自己'}</div>`
          }
        },

        {
          label: '汇报对象',
          prop: 'leaderName'
        }

      ],
      optionsTab: {
        mutiSelect: 'selection', // 是否多选
        apiService: queryList, // 表格的数据请求接口
        isSettingShow: false // 是否出现设置
      },

      operates: {
        width: '150',
        fixed: 'right',
        list: [
          {
            label: '编辑',
            type: 'normal',
            method: (row) => {
              this.editStaff(row)
            }

          }

        ]
      },

      tableHeight: 'calc(100vh - 450px)',

      dialogTitle: '编辑员工',
      switchDialog: false,
      staffData: { // 员工 信息
        headimgurl: '',
        name: '',
        mobile: '',
        intro: '',
        sex: '1',
        roleIds: '',
        deptId: [],
        leaderId: '',
        dataPermission: '1',
        password: '123456'
      },

      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },

      deptData: {
        departmentName: '',
        pids: []
      },
      isAddDepart: false,
      isDelete: false,
      deleteConfirm: false,
      staffId: '',
      isSearchSwitch: false,
      imgBox: false,
      rules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'change' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|166|198|199|(147))+\d{8})$/,
            message: '手机号格式错误', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选中员工性别', trigger: 'change' }
        ],
        roleIds: [{ required: true, message: '请选中员工角色', trigger: 'change' }] },

      chiefUser: [],
      tenantRole: [],
      multipleSelection: [],
      tabsValue: '1',
      tabIndex: 2,

      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '请输入员工编号',
            modelValue: 'id',
            isClearable: true
          }, {
            itemType: 'input',
            placeholder: '请输入员工姓名',
            modelValue: 'name',
            isClearable: true
          }, {
            itemType: 'input',
            placeholder: '请输入手机号搜索',
            modelValue: 'mobile',
            isClearable: true
          },
          {
            itemType: 'select',
            placeholder: '请选择角色',
            modelValue: 'roleId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            labelKey: 'roleName',
            valueKey: 'id',
            apiService: summaryRoleQuery
            // selectOption: this.rolesItems
          }
        ]
      },
      deptsOptions: [],
      treeDataList: [],
      defaultTreeProps: {
        children: 'children',
        label: 'label'
      },
      orgId: '',
      showED: false,
      flag: false,
      disableSelectRole: false // 角色是否可修改
    }
  },

  mounted() {
    this.getDepartList()
    this.getRoleList()
    this.getChiefUser()

    setTimeout(() => {
      this.$refs.tableCommon.getList({ status: '1' })
    }, 500)
  },

  methods: {

    showPopover() {
      this.flag = true
    },

    toggleShow(node, data) {
      this.activeKey = data.label
    },

    // 切换停用与否请求
    changeTabs(tab) {
      const data = {}
      this.tabsValue === '2' ? data.status = '3' : data.status = '1'
      this.resetFieldHanle()
      this.$refs.search_com.resetForm(data)
    },

    // 部门
    getDepartList() {
      formatList().then(res => {
        if (res.data.errorCode === 0) {
          this.deptsOptions = res.data.results

          const treeData = [{
            label: '全校区',
            children: res.data.results
          }]
          this.treeDataList = JSON.parse(JSON.stringify(treeData))
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 角色
    getRoleList() {
      tenantRoleQuery().then(res => {
        if (res.data.errorCode === 0) {
          this.tenantRole = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 上级对象
    getChiefUser() {
      chiefUserQuery().then(res => {
        if (res.data.errorCode === 0) {
          this.chiefUser = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 新增部门
    addDepart() {
      this.switchDialog = true
      this.dialogTitle = '新增部门'
      this.isAddDepart = true

      this.getDepartList()
    },
    // 编辑部门
    editDepart(node, data) {
      this.getRoleList()
      this.switchDialog = true
      this.dialogTitle = '编辑部门'
      this.isAddDepart = true
      this.deptData.departmentName = data.label
      if (data.parentId === -1) { // 没有上级部门
        this.orgId = data.value
        this.deptData.pids = []
      } else {
        this.orgId = data.value
        this.deptData.pids = data.pids.split(',').splice(2)
        this.deptData.pids = this.deptData.pids.map((value) => {
          return parseInt(value)
        })
        this.orgId = data.value
      }
    },

    // 删除部门
    removeDepart(node, data) {
      const deleteId = {
        id: data.value
      }
      deleteDepartment(deleteId).then(res => {
        if (res.data.errorCode === 0) {
          this.flag = false
          this.getDepartList()
          // this.$refs.tableCommon.getList()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      const params = {
        id: formValue.id,
        name: formValue.name,
        mobile: formValue.mobile,
        roleIds: formValue.roleId
      }

      this.tabsValue === '2' ? params.status = '3' : params.status = '1'
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0
      }

      this.tabsValue === '2' ? params.status = '3' : params.status = '1'
      this.$refs.tableCommon.getList(params)
    },
    // 多选对象

    selectionChange(val) {
      this.multipleSelection = val
    },

    // 停用&删除员工
    operaStaff(val) {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择员工')
      } else {
        this.isStopStaff = false
        const names = []
        const ids = []
        this.multipleSelection.forEach((item) => {
          names.push(item.name)
          ids.push(item.id)
        })
        const data = {
          name: names.join(','),
          ids: ids.join(',')

        }
        // 停用
        if (this.tabsValue === '1' && val === 'stop') {
          data.status = 3
        }
        // 删除
        if (val === 'delete') {
          data.status = 0
        }

        // 启用状态
        if (this.tabsValue === '2' && val === 'stop') {
          data.status = 1
        }
        deleteOrFired(data).then(res => {
          if (res.data.errorCode === 0) {
            this.deleteConfirm = false

            if (res.data.failNum !== 0) {
              this.failData = res.data
              this.isDeleteFail = true
              this.switchDialog = true
              this.dialogTitle = '工作提醒'
            } else {
              this.$message.success(res.data.errorMessage)
              this.isDeleteFail = false
            }
            this.$refs.tableCommon.getList()
          } else {
            this.deleteConfirm = false
            this.$message.error(res.data.errorMessage)
          }
        })
      }
    },
    // 编辑员工
    editStaff(val) {
      this.dialogTitle = '编辑员工'
      this.switchDialog = true
      this.disableSelectRole = false

      const data = {
        id: val.id
      }
      this.staffId = val.id
      detailById(data).then(res => {
        if (res.data.errorCode === 0) {
          this.staffData = res.data.data

          if (res.data.data.leaderId == 0) {//eslint-disable-line
            this.staffData.leaderId = ''
          }
          this.staffData.sex = res.data.data.sex
          this.staffData.deptId = res.data.data.deptPids.split(',').map((value) => {
            return parseInt(value)
          })
          // 判断角色是否可修改
          this.tenantRole && this.tenantRole.length > 0 && this.tenantRole.forEach((item) => {
            if (this.staffData.roleIds === item.id && item.roleKey === 'admin') {
              this.disableSelectRole = true
              return
            }
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 修改职能
    editFunction(val) {
      this.switchDialog = true
      this.dialogTitle = '编辑员工'
    },

    isSearch() {
      this.isSearchSwitch = !this.isSearchSwitch
    },

    handleAvatarSuccess(res, file) {
      this.staffData.headimgurl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 新增员工
    addStaff() {
      this.switchDialog = true
      this.disableSelectRole = false
      this.dialogTitle = '新增员工'
      this.getRoleList()
      this.getChiefUser()
    },

    // 取消提交
    cancelForm(formName) {
      // let formName = ''
      this.flag = false
      if (this.isAddDepart) {
        formName = 'deptData'
      } else {
        formName = 'staffData'
      }
      // debugger
      this.$refs[formName].resetFields()
      this.$nextTick(() => {
        this.deptData = {
          departmentName: '',
          pids: []
        }
        this.switchDialog = false
      })

      this.isAddDepart = false
      this.isDeleteFail = false
    },

    iKnow() {
      this.isDeleteFail = false
      this.switchDialog = false
    },
    // 确认提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 新增编辑部门
          if (this.isAddDepart) {
            const data = {
              departmentName: this.deptData.departmentName
            }
            if (this.deptData.pids.length > 0) {
              data.pids = this.deptData.pids[this.deptData.pids.length - 1]
            } else {
              data.pids = -1
            }
            if (this.dialogTitle === '编辑部门') {
              data.id = this.orgId
              updateDepartment(data).then(res => {
                if (res.data.errorCode === 0) {
                  this.getDepartList()
                  this.cancelForm('deptData')
                  // this.chiefUser = res.data.results
                  // this.$refs.tableCommon.getList()
                } else {
                  this.$message.error(res.data.errorMessage)
                }
              })
            } else {
              // 创建部门

              creatDepartment(data).then(res => {
                if (res.data.errorCode === 0) {
                  this.getDepartList()
                  this.cancelForm('deptData')
                } else {
                  this.$message.error(res.data.errorMessage)
                }
              })
            }
          } else {
            const staffDatas = {
              headimgurl: this.staffData.headimgurl,
              name: this.staffData.name,
              mobile: this.staffData.mobile,
              intro: this.staffData.intro,
              sex: this.staffData.sex,
              roleIds: this.staffData.roleIds,
              deptId: this.staffData.deptId[this.staffData.deptId.length - 1] || 0,
              leaderId: this.staffData.leaderId || 0,
              password: '123456',
              dataPermission: this.staffData.dataPermission
            }

            if (this.dialogTitle === '编辑员工') {
              staffDatas.id = this.staffId
              update(staffDatas).then(res => {
                if (res.data.errorCode === 0) {
                  this.$message.success(res.data.errorMessage)
                  this.cancelForm('staffData')
                  this.$refs.tableCommon.getList()
                } else {
                  this.$message.error(res.data.errorMessage)
                }
              })
            } else {
              //  创建员工
              create(staffDatas).then(res => {
                if (res.data.errorCode === 0) {
                  this.cancelForm('staffData')
                  this.$refs.tableCommon.getList()
                } else {
                  this.$message.error(res.data.errorMessage)
                }
              })
            }
          }
        } else {
          return false
        }
      })
    },

    showWX(val) {
      this.$refs.wechatCode.openDialog()
      this.$refs.wechatCode.getQr()
    }

  }
}
</script>

<style lang="scss" scoped>
.staff_manage {
  display: flex;
  min-width: 1060px;
  height: calc(100vh - 150px);
}

.tree_box {
  width: 100%;
  height: 100%;
  border: 1px solid #dddddd;
  border-radius: 5px;
  // overflow: auto;
}

.block_title {
  // height: 32px;
  width: 100%;
  border-radius: 5px 5px 0 0;
  line-height: 32px;
  background-color: #f0f2f5;
  color: #333333;

  padding: 0 20px;
}
.block_tree {
  min-width: 268px;
  height: calc(100% - 32px);
  overflow: auto;
  padding: 20px;
  position: relative;
}

.block_btn {
  height: 22px;
  position: absolute;
  top: 22px;
  right: 22px;
  line-height: 7px;
}

.staff_manage_right {
  width: calc(100% - 270px);
  padding: 0px 20px 20px 20px;
  .el-tabs--card /deep/ {
    .el-tabs__nav-scroll {
      padding-left: 0 !important;
    }
    .el-tabs__item:first-child {
      padding: 0 5px !important;
    }
  }
}

.staff_tabs {
  margin-bottom: 20px;
}

.active_gre {
  display: inline-block;
  background: greenyellow;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.active_red {
  display: inline-block;
  background: red;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.staff_mgr_op {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.form_txt {
  width: 8px;
  height: 11px;
  background-color: #46b6ee;
  border-radius: 3px;
  display: inline-block;
}

.el-input {
  display: table-cell;
}

// .block_tree /deep/ {
//   .el-tree-node__content {
//     .tree_btn {
//       display: none;
//     }
//     .custom-tree-node:hover,
//     .custom-tree-node:active,
//     .custom-tree-node:focus {
//       .tree_btn {
//         display: inline;
//       }
//     }
//   }
// }

.data_form {
  .el-radio + .el-radio {
    margin-left: 0;
  }
}

.note_title {
  color: #999;
  font-size: 12px;
}

.m_b {
  margin: 10px 0;
}
</style>
<style>
.nowx {
  color: #46b6ee;
}
</style>

