<template>
  <div class="login-container">

    <el-form v-if="pageIndex===1" ref="firstForm" :model="firstForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left" >
      <div class="title-container">
        <h3 class="title">密码重置</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="firstForm.username"
          placeholder="手机号码"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="firstForm.code"
          placeholder="验证码"
          name="password"
          auto-complete="on"
          style="width:60%"
        />
        <el-button :loading="messageBtnLoading" @click.native.prevent="sendMessage">发送验证码</el-button>
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:45%;margin-bottom:30px;" @click.native.prevent="handleLogin">返回登录</el-button>
      <el-button :loading="loading" type="primary" style="width:45%;margin-bottom:30px;" @click.native.prevent="nextPage">下一步</el-button>
    </el-form>

    <el-form v-if="pageIndex===2" ref="secendForm" :model="secendForm" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">密码重置</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-select v-model="secendForm.tenantId" placeholder="请选择机构" style="width: 90%;" filterable @change="orgSelectChange">
          <el-option
            v-for="item in orgOptions"
            :key="item.orgId"
            :label="item.orgName"
            :value="item.orgId"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="secendForm.password"
          type="password"
          placeholder="新密码"
          name="password"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="newpassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="secendForm.newpassword"
          placeholder="确认密码"
          type="password"
          name="newpassword"
          auto-complete="on"
        />
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:45%;margin-bottom:30px;" @click.native.prevent="handleLogin">返回登录</el-button>
      <el-button :loading="loading" type="primary" style="width:45%;margin-bottom:30px;" @click.native.prevent="handleLogin">确认修改</el-button>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'
import {
  queryOrgListByUsername
} from '@/api/login'
export default {
  name: 'Login',
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      firstForm: {
        username: '',
        code: ''
      },
      secendForm: {
        username: '',
        password: '',
        newpassword: '',
        tenantId: '',
        orgId: ''
      },

      orgOptions: [{
        orgName: '测试机构',
        tenantId: 10000,
        orgId: 1000
      }],
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }]
      },
      pageIndex: 1,
      passwordType: 'password',
      loading: false,
      messageBtnLoading: false,
      showDialog: false,
      dialogTableVisible: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    orgSelectChange(value) {
      this.secendForm.orgId = value
    },
    // orgItemClik(item) {
    //   this.loginForm.tenantId = item.tenantId
    //   this.loginForm.orgId = item.orgId
    //   this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
    //     this.loading = false
    //     this.$router.push({ path: this.redirect || '/' })
    //   }).catch(data => {
    //     this.loading = false
    //     this.$message.error(data)
    //   })
    // },
    nextPage() {
      this.$refs.firstForm.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            mobile: this.firstForm.username
          }
          queryOrgListByUsername(params).then(response => {
            const data = response.data
            if (data.errorCode === 0) {
              this.pageIndex = 2
              this.secendForm.username = this.firstForm.username
              this.orgOptions = data.results
            } else {
              this.$message.error(data.errorMessage)
            }
            this.loading = false
          })
        } else {
          this.$message.error('请输入正确的账号')
          return false
        }
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    sendMessage() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.messageBtnLoading = true
          alert('发送验证码成功')
          this.messageBtnLoading = false
        }
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            mobile: this.loginForm.username
          }
          queryOrgListByUsername(params).then(response => {
            const data = response.data
            if (data.errorCode === 0) {
              this.dialogTableVisible = true
              this.items = data.results
            } else {
              this.$message.error(data.errorMessage)
            }
            this.loading = false
          })
        } else {
          this.$message.error('请输入正确的账号')
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

.org_item{
		width: 100%;
		font-size: 16px;
		height: 40px;
		line-height: 40px;
		border-radius: 5px;
		padding-left: 10px;
}
.org_item:hover {
  background: #e4e7ed
}
  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
}
</style>
