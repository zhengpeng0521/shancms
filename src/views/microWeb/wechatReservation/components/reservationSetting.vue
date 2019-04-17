<template>
  <div class="reservationSettingDialog">
    <el-dialog
      :visible.sync="reservationSettingDialogShow"
      :title="title"
      :append-to-body="true"
      custom-class="reservationSetting"
      width="600px"
    >
      <el-form :model="formInline">
        <el-form-item label="">
          <el-input v-model="orgChoice" :readonly="true">
            <el-switch
              slot="suffix"
              v-model="formInline.orgChoice"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="orgAddr" :readonly="true">
            <el-switch
              slot="suffix"
              v-model="formInline.orgAddr"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="babyName" :readonly="true">
            <el-switch
              slot="suffix"
              v-model="formInline.babyName"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="babySex" :readonly="true">
            <el-switch
              slot="suffix"
              v-model="formInline.babySex"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="babyBirthday" :readonly="true">
            <el-switch
              slot="suffix"
              v-model="formInline.babyBirthday"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="tel" :readonly="true">
            <el-switch
              slot="suffix"
              v-model="formInline.tel"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="addr" :readonly="true">
            <el-switch
              slot="suffix"
              v-model="formInline.addr"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="appointmentTime" :readonly="true">
            <el-switch
              slot="suffix"
              v-model="formInline.appointmentTime"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="gift" :readonly="true">
            <el-switch
              slot="suffix"
              v-model="formInline.gift"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
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
              active-text="是"
              inactive-text="否"
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
        <!-- <el-form-item>
          <el-button
            type="plain"
            @click="onSubmit"
          >取消</el-button>
          <el-button
            type="primary"
            @click="onSubmit"
          >保存</el-button>
        </el-form-item> -->
      </el-form>
      <div class="foot">
        <el-button
          type="plain"
          @click="onSubmit"
        >取消</el-button>
        <el-button
          type="primary"
          style="margin-right:20px"
          @click="onSubmit"
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
        console.log(res.data)
        this.formInline = res.data
      } else {
        this.$message.error(res.errorMessage)
      }
    })
  },
  methods: {
    onSubmit() {
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
      save(params).then(res => {
        if (res.data.errorCode === 0) {
          loading.close()
          console.log(res.data)
          this.formInline = res.data
        } else {
          this.$message.error(res.errorMessage)
        }
      })
      this.reservationSettingDialogShow = false
      // console.log('submit!')
    }
  }
}
</script>
<style lang="scss">
.reservationSetting {
  height: 600px;
  max-height: auto !important;
  // .el-dialog__body {
  //   overflow-y: auto;
  // }
  .el-form {
    height: 450px;
    background: #eff2f6;
    overflow-y: auto;
    padding: 20px 10px 1px 10px;
  }
  .foot {
    width: 100%;
    border-top: 1px solid #ddd;
    padding-top: 20px;
    position: absolute;
    right: 0px;
    bottom: 20px;
    text-align: right;
  }
}
</style>

