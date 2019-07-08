<template>
  <div class="reservationSettingDialog">
    <el-dialog
      :visible.sync="reservationSettingDialogShow"
      :title="title"
      :append-to-body="true"
      custom-class="reservationSetting"
      width="600px"
    >
      <div class="tableStyle">
        <div class="table_head">
          <div class="head_tr_left">显示项目</div>
          <div class="head_tr_right">是否显示</div>
        </div>
        <div class="table_body">
          <el-form
            ref="formInline"
            :model="formInline"
            :rules="rules"
          >
            <div class="body_tr">
              <div class="body_td_left">
                {{ orgChoice }}
              </div>
              <div class="body_td_right">
                <el-switch
                  slot="suffix"
                  v-model="formInline.orgChoice"
                  :active-value="1"
                  :inactive-value="0"
                />
              </div>
            </div>
            <div class="body_tr">
              <div class="body_td_left">
                {{ orgAddr }}
              </div>
              <div class="body_td_right">
                <el-switch
                  slot="suffix"
                  v-model="formInline.orgAddr"
                  :active-value="1"
                  :inactive-value="0"
                />
              </div>
            </div>
            <div class="body_tr">
              <div class="body_td_left">
                {{ babyName }}
              </div>
              <div class="body_td_right">
                <el-switch
                  slot="suffix"
                  v-model="formInline.babyName"
                  :active-value="1"
                  :inactive-value="0"
                />
              </div>
            </div>
            <div class="body_tr">
              <div class="body_td_left">
                {{ babySex }}
              </div>
              <div class="body_td_right">
                <el-switch
                  slot="suffix"
                  v-model="formInline.babySex"
                  :active-value="1"
                  :inactive-value="0"
                />
              </div>
            </div>
            <div class="body_tr">
              <div class="body_td_left">
                {{ babyBirthday }}
              </div>
              <div class="body_td_right">
                <el-switch
                  slot="suffix"
                  v-model="formInline.babyBirthday"
                  :active-value="1"
                  :inactive-value="0"
                />
              </div>
            </div>
            <div class="body_tr">
              <div class="body_td_left">
                {{ tel }}
              </div>
              <div class="body_td_right">
                <el-switch
                  slot="suffix"
                  v-model="formInline.tel"
                  :active-value="1"
                  :inactive-value="0"
                />
              </div>
            </div>
            <div class="body_tr">
              <div class="body_td_left">
                {{ addr }}
              </div>
              <div class="body_td_right">
                <el-switch
                  slot="suffix"
                  v-model="formInline.addr"
                  :active-value="1"
                  :inactive-value="0"
                />
              </div>
            </div>
            <div class="body_tr">
              <div class="body_td_left">
                {{ appointmentTime }}
              </div>
              <div class="body_td_right">
                <el-switch
                  slot="suffix"
                  v-model="formInline.appointmentTime"
                  :active-value="1"
                  :inactive-value="0"
                />
              </div>
            </div>
            <div class="body_tr">
              <div class="body_td_left">
                {{ gift }}
              </div>
              <div class="body_td_right">
                <el-switch
                  slot="suffix"
                  v-model="formInline.gift"
                  :active-value="1"
                  :inactive-value="0"
                />
              </div>
            </div>
            <div
              v-if="formInline.gift"
              class="body_tr"
            >
              <div class="body_td_left">
                <el-form-item
                  prop="giftContent"
                  style="margin:7.5px 0"
                >
                  <el-input
                    v-model="formInline.giftContent"
                    :rows="3"
                    placeholder="请输入预约有礼内容，限30字"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="body_tr">
              <div class="body_td_left">
                {{ remark }}
              </div>
              <div class="body_td_right">
                <el-switch
                  slot="suffix"
                  v-model="formInline.remark"
                  :active-value="1"
                  :inactive-value="0"
                />
              </div>
            </div>
            <div
              v-if="formInline.remark"
              class="body_tr"
            >
              <div class="body_td_left">
                <el-form-item
                  prop="remarkContent"
                  style="margin:7.5px 0"
                >
                  <el-input
                    v-model="formInline.remarkContent"
                    :rows="3"
                    placeholder="请输入提醒内容，限30字"
                  />
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <!-- <el-form :model="formInline">
        <el-form-item label="">
          <el-input
            v-model="orgChoice"
            :readonly="true"
          >
            <el-switch
              slot="suffix"
              v-model="formInline.orgChoice"
              :active-value="1"
              :inactive-value="0"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="orgAddr"
            :readonly="true"
          >
            <el-switch
              slot="suffix"
              v-model="formInline.orgAddr"
              :active-value="1"
              :inactive-value="0"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="babyName"
            :readonly="true"
          >
            <el-switch
              slot="suffix"
              v-model="formInline.babyName"
              :active-value="1"
              :inactive-value="0"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="babySex"
            :readonly="true"
          >
            <el-switch
              slot="suffix"
              v-model="formInline.babySex"
              :active-value="1"
              :inactive-value="0"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="babyBirthday"
            :readonly="true"
          >
            <el-switch
              slot="suffix"
              v-model="formInline.babyBirthday"
              :active-value="1"
              :inactive-value="0"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="tel"
            :readonly="true"
          >
            <el-switch
              slot="suffix"
              v-model="formInline.tel"
              :active-value="1"
              :inactive-value="0"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="addr"
            :readonly="true"
          >
            <el-switch
              slot="suffix"
              v-model="formInline.addr"
              :active-value="1"
              :inactive-value="0"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="appointmentTime"
            :readonly="true"
          >
            <el-switch
              slot="suffix"
              v-model="formInline.appointmentTime"
              :active-value="1"
              :inactive-value="0"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="gift"
            :readonly="true"
          >
            <el-switch
              slot="suffix"
              v-model="formInline.gift"
              :active-value="1"
              :inactive-value="0"
            />
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="formInline.gift"
          label=""
        >
          <el-input
            v-model="formInline.giftContent"
            :rows="3"
            placeholder="请输入预约有礼内容，限30字"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="remark">
            <el-switch
              slot="suffix"
              v-model="formInline.remark"
              :active-value="1"
              :inactive-value="0"
            />
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="formInline.remark"
          label=""
        >
          <el-input
            v-model="formInline.remarkContent"
            :rows="3"
            placeholder="请输入提醒内容，限30字"
          />
        </el-form-item>
      </el-form>-->
      <div slot="footer">
        <el-button
          type="cancel_btn"
          @click="onSubmit"
        >取消</el-button>
        <el-button
          type="primary"
          @click="onSubmit('formInline')"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { get, save } from '@/api/microWeb/wechatReservation'
export default {
  data() {
    return {
      reservationSettingDialogShow: false,
      title: '预约设置',
      // 预约设置弹框
      orgChoice: '是否显示校区选择:',
      orgAddr: '是否显示校区地址:',
      babyName: '是否显示学员姓名',
      babySex: '是否显示学员性别',
      babyBirthday: '是否显示学员生日',
      tel: '是否显示联系方式',
      addr: '是否显示联系地址',
      appointmentTime: '是否显示预约时间',
      gift: '是否预约有礼',
      // giftContent:'',
      remark: '是否显示提醒内容',
      // remarkContent:'',
      formInline: {
        orgChoice: 1,
        orgAddr: 1,
        babyName: 1,
        babySex: 1,
        babyBirthday: 1,
        tel: 1,
        addr: 1,
        appointmentTime: 1,
        gift: 1,
        giftContent: '',
        remark: 1,
        remarkContent: ''
      },
      rules: {
        giftContent: [
          { required: true, min: 1, max: 30, message: '请输入预约有礼内容，限30字', trigger: 'change' }
        ],
        remarkContent: [
          { required: true, min: 1, max: 30, message: '请输入提醒内容，限30字', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    const loading = this.$loading({
      lock: true,
      text: '拼命加载中。。。',
      spinner: 'el-icon-loading',
      fullscreen: false,
      // background: 'rgba(0, 0, 0, 0.7)',
      target: document.querySelector('.reservationSettingDialog')
    })
    get().then(res => {
      if (res.data.errorCode === 0) {
        loading.close()
        this.formInline = res.data
      } else {
        this.$message.error(res.errorMessage)
      }
    })
  },
  methods: {
    onSubmit(formName) {
      const params = this.formInline
      delete params.data
      delete params.errorMessage
      delete params.errorCode
      delete params.id
      delete params.tenantId
      delete params.views
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中。。。',
        spinner: 'el-icon-loading',
        fullscreen: false,
        // background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.reservationSettingDialog')
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          save(params).then(res => {
            if (res.data.errorCode === 0) {
              loading.close()
              this.formInline = res.data
            } else {
              this.$message.error(res.errorMessage)
            }
          })
          this.reservationSettingDialogShow = false
        } else {
          return false
        }
      })
    }
  }
}

</script>
<style lang="scss">
.reservationSetting {
  // height: 600px;
  max-height: auto !important;
  // .el-dialog__body {
  //   overflow-y: auto;
  // }
  .el-form {
    // height: 420px;
    // background: #eff2f6;
    // overflow-y: auto;
    // padding: 20px 10px 1px 10px;
  }
  .tableStyle {
    border: 1px solid #ddd;
    margin-bottom: 14px;
    .table_head {
      display: flex;
      line-height: 44px;
      color: #666;
      background: rgba(240, 242, 245, 0.6);
      .head_tr_left {
        width: 70%;
        padding-left: 20px;
      }
      .head_tr_right {
        width: 30%;
        padding-right: 44px;
        text-align: end;
      }
    }
    .table_body {
      height: 400px;
      overflow: auto;
      color: #666;
      .body_tr {
        display: flex;
        line-height: 44px;
        &:nth-child(2n) {
          background: rgba(240, 242, 245, 0.2);
        }
        .body_td_left {
          width: 70%;
          padding-left: 20px;
        }
        .body_td_right {
          width: 30%;
          padding-right: 35px;
          text-align: end;
        }
      }
    }
  }
}
</style>
