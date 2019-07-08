<template>
  <div class="batchAllotDialog_container">
    <el-dialog
      :visible.sync="batchAllotDialogShow"
      :close-on-click-modal="false"
      title="批量分配"
      width="700px"
      @close="cancelDialog('distributeDialogForm')"
    >
      <el-form
        ref="distributeDialogForm"
        :model="batchAllotData"
        label-width="90px"
      >
        <div class="main_title_con">
          <span>
            可分配数: <i>{{ canDispatchNum }}</i>
          </span>
          <span>
            已分配: <i>{{ !isNaN(alreadyDispatchNum) ? alreadyDispatchNum : 0 }}</i>
          </span>
          <span>
            剩余数: <i>{{ !isNaN(alreadyDispatchNum) && parseInt(canDispatchNum) - alreadyDispatchNum >= 0 ? parseInt(canDispatchNum) - alreadyDispatchNum : 0 }}</i>
          </span>
        </div>
        <div class="main_con_info">
          <p>友情提醒:</p>
          <div>1.若员工被选中而分配数未输入，则默认给此员工分配0个名单</div>
          <div>2.若使用平均分配模式，则由系统自动分配。若分配不合理，则可选择自由分配</div>
          <p>注:已分配数 ≤ 可分配数 <span v-if="parseInt(alreadyDispatchNum) > parseInt(canDispatchNum)">（已冲突）</span></p>
        </div>
        <div>
          <el-form-item
            label="分配方式:"
            prop="type"
          >
            <el-radio-group
              v-model="batchAllotData.type"
              @change="typeChange"
            >
              <el-radio label="1">自由分配</el-radio>
              <el-radio label="2">平均分配</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="按角色筛选:"
            prop="roles"
          >
            <el-select
              v-model="batchAllotData.roles"
              placeholder="请选择角色"
              clearable
              filterable
              style="width:198px"
              @change="sellerChange"
            >
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="batch_table_head">
          <div class="dispatch_leads_form_th_inner">
            <p>操作/账户名</p>
            <p>数量</p>
          </div>
          <div class="dispatch_leads_form_th_inner">
            <p>操作/账户名</p>
            <p>数量</p>
          </div>
        </div>
        <div class="table_con_main">
          <div
            v-for="(child, index) of sellerList"
            :key="index + '_batch_event'"
            :class="index%4===0 || index%4===1? ' table_con_row':'table_con_row bg'"
          >
            <el-checkbox
              v-model="child.check"
              style="width: 205px;"
              @change="(val) => {checkNameChange(val,child, index)}"
            >{{ child.name }}</el-checkbox>
            <el-input-number
              v-if="batchAllotData.type == '1'"
              v-model="child.num"
              :min="0"
              :disabled="!child.isDisabled"
              placeholder="0"
              controls-position="right"
              style="width: 80px;"
              @change="(val)=> {inputNumChange(val,child.id)}"
            />
            <el-input-number
              v-if="batchAllotData.type == '2'"
              v-model="child.num"
              :min="0"
              :disabled="true"
              placeholder="0"
              controls-position="right"
              style="width: 80px;"
              @change="(val)=> {inputNumChange(val,child.id)}"
            />
          </div>
        </div>
        <div
          v-if="parseInt(alreadyDispatchNum) > parseInt(canDispatchNum)"
          class="dispatch_leads_alert"
        >
          <span style="color:#D0021B">温馨提示：</span>
          <span>已分配数 > 可分配数，</span>
          <span style="color:#D0021B">请重新分配！</span>
        </div>
        <div
          v-if="warnVisible"
          class="dispatch_leads_alert"
        >
          <span style="float:left;color:#D0021B">员工分配提醒：</span>
          <div style="float:left">
            <p>员工姓名：{{ leadsDispatchAlertModalStaff.name }}</p>
            <p>员工已有名单数：{{ leadsDispatchAlertModalStaff.hasNum || 0 }}</p>
            <p>员工还能分配数：{{ remainNum }}</p>
            <p style="color:#D0021B">请重新分配！</p>
          </div>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('distributeDialogForm')"
        >取 消</el-button>
        <el-button
          :disabled="warnVisible"
          type="primary"
          @click="submitForm('distributeDialogForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryAllotData, tenantUserSummaryQuery, tenantRoleQuery, allotLeads } from '@/api/crm/studentInfo/highSeas' //eslint-disable-line
export default {
  components: {

  },
  data() {
    return {
      batchAllotDialogShow: false,
      currentSellerList: [], // 有人数分配的销售
      canDispatchNum: 0, // 可分配数
      alreadyDispatchNum: 0, // 已分配数
      sellerList: [], // 销售列表
      roleList: [], // 角色列表
      chooseArr: [], // 选中的销售
      batchAllotData: {
        type: '1',
        roles: ''
      },
      leadsDispatchAlertModalStaff: {}, // 超出的员工的信息
      dispatchMaxNum: 0, // 最大人数
      warnVisible: false, // 超出提示是否显示
      remainNum: 0,
      isBorder: false
    }
  },
  methods: {
    /* 分配方式改变 */
    typeChange(val) {
      for (const i in this.sellerList) {
        this.sellerList[i].num = 0
        this.sellerList[i].isDisabled = false
        this.sellerList[i].check = false
      }
      this.alreadyDispatchNum = 0
      this.chooseArr = []
      this.warnVisible = false
      // this.batchAllotData.roles = ''
    },
    /* 输入框的改变 */
    inputNumChange(val, id) {
      let num = 0
      for (const i in this.chooseArr) {
        if (id == this.chooseArr[i].id) { //eslint-disable-line
          let n = 0
          if (val != '' && val != null && val != undefined && !isNaN(parseInt(val))) { //eslint-disable-line
            n = parseInt(val)
          }
          this.chooseArr[i].num = n
        }
        num += this.chooseArr[i].num
      }
      this.alreadyDispatchNum = num
      this.warnVisible = false
      this.chooseArr && this.chooseArr.map(item => {
        for (const j in this.currentSellerList) {
          if (this.currentSellerList[j].sellerId == item.id) { //eslint-disable-line
            this.leadsDispatchAlertModalStaff = this.currentSellerList[j]
            this.leadsDispatchAlertModalStaff.name = item.name
            if (this.leadsDispatchAlertModalStaff) {
              if (parseInt(this.currentSellerList[j].hasNum) + parseInt(item.num) > parseInt(this.dispatchMaxNum)) {
                this.warnVisible = true
                this.remainNum = parseInt(this.dispatchMaxNum) - parseInt(this.leadsDispatchAlertModalStaff.hasNum)
              }
            }
          } else if (parseInt(item.num) > parseInt(this.dispatchMaxNum)) {
            this.leadsDispatchAlertModalStaff = item
            this.warnVisible = true
            this.remainNum = this.dispatchMaxNum
          }
        }
      })
    },
    /* 表格多选框选择控制input 是否禁用 */
    checkNameChange(val, item, index) {
      const tmp = Object.assign({}, item)
      if (val === true) {
        tmp.isDisabled = true
      } else {
        tmp.isDisabled = false
      }
      this.sellerList.splice(index, 1, tmp)
      if (item.isDisabled) {
        this.chooseArr.splice(item, 1)
      } else {
        this.chooseArr.push(item)
      }
      for (const i in this.sellerList) {
        if (this.sellerList[i].check != true) { //eslint-disable-line
          this.sellerList[i].num = 0
          this.sellerList[i].isDisabled = false
        }
      }
      let num = 0
      this.warnVisible = false
      for (const j in this.sellerList) {
        if (this.sellerList[j].check) {
          num += this.sellerList[j].num
          if (parseInt(this.sellerList[j].num) > parseInt(this.dispatchMaxNum)) {
            this.leadsDispatchAlertModalStaff = this.sellerList[j]
            this.warnVisible = true
            this.remainNum = this.dispatchMaxNum
          }
        } else {
          num -= this.sellerList[j].num
        }
      }
      this.alreadyDispatchNum = num
      if (this.batchAllotData.type === '2') {
        if (this.chooseArr && this.chooseArr.length > 0) {
          for (const arr in this.chooseArr) {
            for (const staff in this.sellerList) {
                if (this.chooseArr[arr].id == this.sellerList[staff].id) { //eslint-disable-line
                  if (this.chooseArr.length == 0) { //eslint-disable-line
                  this.sellerList[staff].num = 0
                } else if (this.chooseArr.indexOf(this.chooseArr[arr]) > -1) {
                    if ((parseInt(this.canDispatchNum) % this.chooseArr.length == 0)) { //eslint-disable-line
                    this.sellerList[staff].num = parseInt(this.canDispatchNum) / this.chooseArr.length
                  } else if (this.chooseArr.indexOf(this.chooseArr[arr]) < parseInt(this.canDispatchNum) % this.chooseArr.length) {
                    this.sellerList[staff].num = parseInt(parseInt(this.canDispatchNum) / this.chooseArr.length) + 1
                  } else {
                    this.sellerList[staff].num = parseInt(parseInt(this.canDispatchNum) / this.chooseArr.length)
                  }
                } else {
                  this.sellerList[staff].num = 0
                }
              }
            }
          }
        }
        this.alreadyDispatchNum = 0
      }
    },
    /* 销售选择改变 */
    sellerChange(val) {
      const params = {
        status: '1',
        roleIds: val
      }
      this.getUserList(params)
    },
    /* 显示弹框 */
    showDialog() {
      this.getNum()
      this.getRoleList()
      this.chooseArr = []
    },
    /* 分配数量 */
    getNum() {
      queryAllotData().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.getUserList()
          this.batchAllotDialogShow = !this.batchAllotDialogShow
          this.canDispatchNum = data.noSellerNum
          this.currentSellerList = data.results
          this.dispatchMaxNum = data.allowNum
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 获取员工列表 */
    getUserList(params) {
      tenantUserSummaryQuery(params).then(res => {
        const data = res.data

        if (data.errorCode === 0) {
          this.sellerList = data.results
          this.sellerList.map((item, index) => {
            item.num = 0
            item.check = false
          })
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 获取角色列表 */
    getRoleList() {
      tenantRoleQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.roleList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.batchAllotDialogShow = false
      this.$refs[formName].resetFields()
      this.alreadyDispatchNum = 0
      this.chooseArr = []
      this.$emit('toClose')
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = {}
          const userArr = []
          if (this.chooseArr && this.chooseArr.length > 0) {
            if(this.batchAllotData.type == '2') { //eslint-disable-line
              this.sellerList.map(item => {
                if (item.check) {
                  for (const i in this.chooseArr) {
                    if (item.id == this.chooseArr[i].id) { //eslint-disable-line
                      this.chooseArr[i].num = item.num
                      obj = {
                        id: item.id,
                        num: item.num
                      }
                      userArr.push(obj)
                    }
                  }
                }
              })
            } else {
              this.chooseArr.map(item => {
                obj = {
                  id: item.id,
                  num: item.num
                }
                userArr.push(obj)
              })
            }
            const params = {
              users: JSON.stringify(userArr)
            }
            allotLeads(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.$message.success(data.errorMessage)
                this.batchAllotDialogShow = false
                this.$emit('toUpdateTable')
              } else {
                this.$message.error(data.errorMessage)
              }
            })
          } else {
            this.$message.warning('请分配员工完成后保存')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.batchAllotDialog_container /deep/ {
  .el-dialog {
    width: 700px;
  }
  .el-dialog__footer {
    padding-top: 20px !important;
    border-top: 1px solid #ddd;
  }
  .el-dialog__body {
    margin-bottom: 14px !important;
  }
  .main_title_con {
    border-bottom: 1px solid rgba(221, 221, 221, 1);
    height: 37px;
    span {
      margin-right: 30px;
      i {
        font-style: normal;
      }
    }
    span:nth-child(1) {
      i {
        color: rgba(70, 182, 238, 1);
      }
    }
  }
  .main_con_info {
    margin: 20px 0 10px;
    padding-left: 16px;
    p {
      color: rgba(208, 2, 27, 1);
      // margin-bottom: 8px;
      line-height: 24px;
    }
    div {
      color: rgba(102, 102, 102, 1);
      line-height: 20px;
    }
  }
  .batch_table_head {
    display: flex;
    flex-direction: row;
    width: 660px;
    height: 44px;
    -webkit-box-pack: justify;
    justify-content: space-between;
    .dispatch_leads_form_th_inner {
      display: flex;
      height: 44px;
      width: 325px;
      padding: 10px;
      line-height: 22px;
      border: 1px solid rgba(221, 221, 221, 1);
      color: #666;
      -webkit-box-pack: start;
      -webkit-justify-content: flex-start;
      -ms-flex-pack: start;
      justify-content: flex-start;
      background: rgba(240, 242, 245, 0.6);
      border-bottom: 0;
      p:nth-child(1) {
        width: 250px;
      }
    }
  }
  .table_con_main {
    width: 660px;
    display: flex;
    // display: -webkit-box;
    flex-direction: row;
    flex-wrap: wrap;
    // margin-bottom: 14px;
    .event {
      // display: inline-block;
    }
    .table_con_row {
      width: 325px;
      height: 44px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-top: 0;
      justify-content: space-between;
      border-bottom: 0;
    }
    .table_con_row:nth-child(odd) {
      margin-right: 10px;
      border-right: 1px solid rgba(221, 221, 221, 1);
    }
    .table_con_row:nth-child(2n) {
      // background: rgba(240, 242, 245, 0.2);
    }
    .table_con_row:last-child {
      // border-bottom: 1px solid #ddd;
    }
    .bg {
      background: rgba(240, 242, 245, 0.2);
    }
  }
  .table_con_main /deep/ {
    .el-input-number.is-controls-right .el-input__inner {
      padding-left: 0;
      padding-right: 28px;
    }
  }
  .dispatch_leads_alert {
    margin: 20px 0;
    p {
      line-height: 25px;
    }
  }
}
</style>

