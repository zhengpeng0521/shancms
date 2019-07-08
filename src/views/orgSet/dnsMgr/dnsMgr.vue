<template>
  <div class="dns_mgr">
    <el-steps
      :active="active"
      finish-status="success"
    >
      <el-step title="开通" />
      <el-step title="等待审核" />
      <el-step title="审核通过" />
      <el-step title="设置" />
    </el-steps>
    <div :class="contentClass">
      <div v-if="firstStep">
        <div
          class="dns_title"
          style="margin-top:15px"
        >
          <OrgSetBlock>独立域名特点:</OrgSetBlock>
        </div>

        <div class="dns_box">
          <div>1.拥有机构自己独立的登录站点</div>
          <div>2.可以根据自身的需要设置登录站点的风格</div>
          <div>3.登录页拥有自己的品牌LOGO和品牌背景图</div>
        </div>
        <p class="dns_title">
          <OrgSetBlock>输入自己需要3级域名的名称:</OrgSetBlock>
        </p>

        <div class="dns_name">

          <!-- <el-input
            v-model="dnsName"

            placeholder="域名名称"
          /> -->

          <el-form
            ref="dnsForm"
            :model="dnsData"
            :rules="rule"
          >
            <el-form-item
              prop="name"
              style="width: 300px; margin-right: 5px;margin-bottom:6px"
            >
              <el-input
                v-model="dnsData.name"
                placeholder="域名名称"
                @blur="checkisUsed"
              /> <span class="dns_www">
                .saas.ishanshan.com
              </span>
            </el-form-item>
          </el-form>
        </div>
        <p style="font-size: 12px;color: #999;line-height:16px">
          请输入5~20位字母或数字
        </p>
        <p class="dns_title">
          <OrgSetBlock>闪闪saas子域名注册及使用规则：</OrgSetBlock>
        </p>
        <div class="domain_rules___1VEpM">

          <div class="domain_rules_content">
            <div>用户通过闪闪saas系统可申请闪闪子域名，申请成功之后可在服务期间内使用。申请和使用前，请仔细阅读本规则，并同意受本规则约束。</div>
            <div>1.域名定义</div>
            <div class="text_indent_2___yXJdt">闪闪子域名是指用户在遵守本规则的前提下，根据其个性化需求在“saas.ishanshan.com”的域名下申请三级子域名，其展现形式如“****.saas.ishanshan.com”，“****”为用户依据本规则自行设定的内容。</div>
            <div>2.域名申请</div>
            <div class="text_indent_2___yXJdt">2.1.申请子域名的用户需符合如下条件：</div>
            <div class="text_indent_4___2NPom">1）闪闪saas系统用户</div>
            <div class="text_indent_4___2NPom">2）子域名申请符合本规则要求</div>
            <div>2.2.子域名规则</div>
            <div class="text_indent_2___yXJdt">子域名不得使用国家或者地区名称、外国地名、国际组织名称、行政区划名称的全称或者缩写；不得违反法律法规的规定及国家政策的相关内容；不得侵犯他人包括知识产权在内的各项合法权益；不得申请域名开展不正当竞争等违法违规行为；不得违反闪闪saas平台公示的各项规则及服务政策，不得损害闪闪及其关联公司的合法权益。否则，闪闪有权随时暂停用户使用子域名服务。</div>
            <div>2.3.申请规范</div>
            <div class="text_indent_2___yXJdt">子域名的字符数应大于等于5位且小于20位，域名由字母（A-Z，a－z，大小写等价）、数字（0－9）组成。</div>
            <div>2.4.域名审核</div>
            <div class="text_indent_2___yXJdt">子域名申请后闪闪有权抽查审核，子域名不得重复；子域名申请成功后不能修改，用户资质不符合平台约定或存在侵权情形除外。</div>
            <div>3.域名的所有权及使用保留，闪闪所有子域名归闪闪所有。用户对子域名的使用权不得出租、出借或以其他任何形式对外转让；闪闪与用户的合作终止的，用户对该子域名的使用权亦随之终止。</div>
            <div>4.免责声明</div>
            <div class="text_indent_2___yXJdt">因用户申请及使用闪闪子域名违反国家法律、法规、国家政策或侵犯他人合法权益（包括但不限于知识产权）的，用户应当独立承担全部法律责任，因此导致闪闪及其关联公司利益受损的，用户应当全额赔偿。</div>
          </div>
          <div class="first_bottom_agree">
            <el-checkbox
              v-model="isAgree"
              class="agree_check"
            >同意以上规则</el-checkbox>
            <div class="first_step_btn">
              <div v-if="active===0">
                <!-- 产品要大按钮 -->
                <el-button
                  :disabled="!isAgree"
                  type="primary"
                  size="medium"
                  style="height:36px;"
                  @click="apply"
                >
                  申请使用
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="secondStep">
        <p style="margin:15px 0 14px;"><span style="color:#46b6ee">
          登陆域名：
        </span>
        <span>{{ dnsData.name }}</span> .saas.ishanshan.com</p>
        <div class="domain_alert___QcpK_">该域名正在审核中，请耐心等待；或者拨打400-660-5733加速审核</div>
      </div>
      <div v-if="thirdStep">

        <p style="margin:15px 0 14px;"><span style="color:#46b6ee">

          登陆域名：
        </span>
          <span>{{ dnsData.name }}</span><span class="dns_www">
            .saas.ishanshan.com
        </span></p>
        <div class="domain_alert___QcpK_">域名审核通过！工作人员将在24小时内联系您，届时完成支付即可使用个性化域名</div>

      </div>
      <div v-if="fourthStep">
        <div
          class="dns_title"
          style="margin-top:15px"
        >
          <OrgSetBlock>
            域名设置
          </OrgSetBlock>
        </div>
        <div style="margin-left:12px">登录域名：{{ dnsData.name }}.saas.ishanshan.com</div>
        <div class="dns_title">
          <OrgSetBlock>
            登陆页设置
          </OrgSetBlock>
        </div>
        <el-form
          ref="setData"
          :model="setData"
          :rules="rule"
          label-suffix=":"
          label-width="90px"
        >
          <div class="login_bg">
            <p style="margin:0 0 14px 12px;">登陆页背景图</p>
            <el-form-item
              class="login_image"
              prop="bcCover"
            >
              <!-- <el-upload
                :show-file-list="false"
                :on-success="handleBackImgeAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                class="avatar-uploader"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                action="https://imgsrc.ishanshan.com/gimg/upload"
              >
                <img
                  v-if="setData.bcCover"
                  :src="setData.bcCover"
                  class="avatar"
                >
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                />
                <span class="el-upload-actions">
                  <span class="el-upload-preview">
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span class="el-upload-preview">
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </el-upload> -->
              <el-upload
                :class="{'disabled ': bgVisible}"
                :on-success="handleBackImgeAvatarSuccess"
                :on-preview="handleBackImgeAvatarPreview"
                :on-remove="handleBackImgeAvatarRemove"
                :on-change="handleBackImgeAvatarChange"
                :limit="1"
                :file-list="bgFilelist"
                action="https://imgsrc.ishanshan.com/gimg/upload"
                list-type="picture-card"
              >
                <i class="el-icon-plus" />
                <div class="upload-text">上传照片</div>
              </el-upload>
              <el-dialog
                :visible.sync="bgDialogVisible"
                size="full"
                title="预览"
              >
                <img
                  :src="setData.bcCover"
                  width="100%"
                  alt=""
              ></el-dialog>
              <div class="upload_dec">
                支持png、jpg、jpeg、gif格式的图片，建议尺寸1920*1080，大小不超过5M!
              </div>
            </el-form-item>
          </div>
          <div class="dns_title">
            <OrgSetBlock>
              登陆页LOGO和品牌设置
            </OrgSetBlock>
          </div>
          <div class="login_content">

            <div class="login_left">
              <div class="login_left_title">登录页预览</div>
              <div class="login_left_content">
                <img
                  :src="setData.cover"
                  class="login_logo"
                >
                <p class="login_title">{{ setData.title ||'闪闪管家' }}</p>
                <p class="login_desc">{{ setData.dec|| '一站式早教管理云平台' }}</p>
                <el-input
                  name="username"
                  type="text"
                  disabled
                  style="width:200px"
                >
                  <template slot="prepend">
                    <span class="svg-container">
                      <img src="//img.ishanshan.com/gimg/n/20181127/041388ff824571aea706fa2ceb93b7c1">
                    </span>
                  </template>
                </el-input>
                <el-input
                  name="password"
                  disabled
                  style="width:200px"
                >
                  <template slot="prepend">
                    <span class="svg-container">
                      <img src="//img.ishanshan.com/gimg/n/20181127/f034b19f801e7844c65ebe217dde462a">
                    </span>
                  </template>
                </el-input>
                <el-button
                  type="primary"
                  style="width:200px;"
                >登陆</el-button>
              </div>
            </div>
            <div class="login_right">

              <el-form-item
                class="image_upload"
                prop="bcCover"
                label="LOGO图片"
              >
                <!-- <el-upload
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  class="avatar-uploader"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  action="https://imgsrc.ishanshan.com/gimg/upload"
                >
                  <img
                    v-if="setData.cover"
                    :src="setData.cover"
                    class="avatar"
                  >
                  <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                  />
                </el-upload> -->
                <el-upload
                  :class="{'disabled ': logoVisible}"
                  :on-success="handleLogoSuccess"
                  :on-preview="handleLogoPreview"
                  :on-remove="handleLogoRemove"
                  :on-change="handleLogoChange"
                  :limit="1"
                  :file-list="logoFileList"
                  action="https://imgsrc.ishanshan.com/gimg/upload"
                  list-type="picture-card"
                >
                  <i class="el-icon-plus" />
                  <div class="upload-text">上传照片</div>
                </el-upload>
                <el-dialog
                  :visible.sync="logoDialogVisible"
                  size="full"
                  title="预览"
                >
                  <img
                    :src="setData.cover"
                    width="100%"
                    alt=""
                ></el-dialog>
                <div class="upload_dec upload_small_dec">
                  支持png、jpg、jpeg、gif格式的图片，建议尺寸1920*1080，大小不超过5M!
                </div>

              </el-form-item>

              <el-form-item
                class="text_input"
                prop="title"
                label="品牌名称"
              >
                <el-input
                  v-model="setData.title"
                  style="width:198px"
                />
              </el-form-item>
              <el-form-item
                class="text_input"
                prop="dec"
                label="品牌简介"
              >
                <el-input
                  v-model="setData.dec"
                  style="width:198px"
                />
              </el-form-item>

            </div>
          </div>
        </el-form>
        <div v-if="active===3">
          <el-popover
            v-model="visible2"
            placement="bottom"
            width="368"
          >
            <p><i class="el-icon-warning confirm-icon" />
              即将恢复为默认背景图，logo图与品牌名称，是否继续</p>
            <div style="text-align: right; margin: 0">
              <el-button
                class="cancel_btn"
                @click="visible2 = false"
              >取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="saveSet('reset')"
              >确定</el-button>
            </div>
            <el-button
              slot="reference"
              class="cancel_btn"
            >
              还原默认设置</el-button>
          </el-popover>

          <el-button
            style="margin-left:10px"
            type="primary"
            @click="saveSet"
          >
            保存
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkUsable, applyHost, queryLoginPage, queryStatus, loginPageSet } from '@/api/orgSet/dnsMgr'//eslint-disable-line
import OrgSetBlock from '@/components/MiniCommon/OrgSetBlock'
export default {
  components: {
    OrgSetBlock
  },
  data() {
    return {
      active: 0,

      dnsData: {
        name: ''
      },
      visible2: false,
      setData: {
        cover: 'https://img.ishanshan.com/gimg/img/f204fd8affff8cdb30b68554143ef4f5',
        title: '闪闪管家',
        dec: '一站式早教管理云平台',
        bcCover: 'https://img.ishanshan.com/gimg/img/5d8629ed4cbfbc3da826e1233f723ec5'
      },
      setLoginData: {
        title: '',
        dec: ''
      },
      isAgree: true,
      rule: {
        name: [
          { required: true, message: '域名不能为空, 域名中不能包含空格', trigger: 'blur' },
          { min: 5, max: 20, message: '域名必须是5~20字母或数字', trigger: ['blur', 'change'] }
        ]
      },
      bgDialogVisible: false, // 背景图片查看
      logoDialogVisible: false, // logo图片查看
      bgFilelist: [], // 背景图片列表
      logoFileList: [], // logo列表
      bgVisible: false,
      logoVisible: false
    }
  },
  computed: {
    firstStep: function() {
      return this.active === 0
    },
    secondStep: function() {
      return this.active === 1
    },
    thirdStep: function() {
      return this.active === 2
    },
    fourthStep: function() {
      return this.active === 3
    },
    contentClass() {
      const className = this.active === 0 ? 'dns_content' : 'dns_content_next'
      return className
    }
  },
  mounted() {
    this.queryDnsStatus()
  },
  methods: {
    reset() {
      queryLoginPage().then(res => {
        if (res.data.errorCode === 0) {
          //eslint-disable-line
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    queryDnsStatus() {
      queryStatus().then(res => {
        if (res.data.errorCode === 0) {
          this.bgFilelist = []
          this.logoFileList = []
          this.dnsData.name = res.data.hostName
          this.setData.cover = res.data.logoimg
          this.setData.title = res.data.brandName
          this.setData.dec = res.data.brandNameTitle
          this.setData.bcCover = res.data.bgimg
          this.active = parseInt(res.data.status)
          this.bgFilelist.push({ url: res.data.bgimg })
          if (this.bgFilelist && this.bgFilelist.length > 0) {
            this.bgVisible = true
          }
          this.logoFileList.push({ url: res.data.logoimg })
          if (this.logoFileList && this.logoFileList.length > 0) {
            this.logoVisible = true
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    checkisUsed() {
      const data = {
        host: this.dnsData.name + '.saas.ishanshan.com'
      }
      checkUsable(data).then(res => {
        if (res.data == 1) {//eslint-disable-line
          this.$message.success('该域名可用！！！')
        } else {
          this.$message.warning('当前域名不可用！！！')
        }
      })
    },
    apply() {
      this.$refs['dnsForm'].validate((valid) => {
        if (valid) {
          const data = {
            hostName: this.dnsData.name + '.saas.ishanshan.com'
          }

          applyHost(data).then(res => {
            if (res.data.errorCode === 0) {
              this.active++
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          this.$message({
            message: '请输入网址',
            type: 'warning'
          })
          return false
        }
      })
    },

    saveSet(val) {
      this.$refs['setData'].validate((valid) => {
        if (valid) {
          const data = {
            logoimg: this.setData.cover,
            bgimg: this.setData.bcCover,
            brandName: this.setData.title,
            brandNameTitle: this.setData.dec
          }
          if (val === 'reset') {
            data.logoimg = 'https://img.ishanshan.com/gimg/img/f204fd8affff8cdb30b68554143ef4f5'
            data.brandName = '闪闪管家'
            data.brandNameTitle = '一站式早教管理云平台'
            data.bgimg = 'https://img.ishanshan.com/gimg/img/5d8629ed4cbfbc3da826e1233f723ec5'
            this.visible2 = false
          }

          loginPageSet(data).then(res => {
            if (res.data.errorCode === 0) {
              this.queryDnsStatus()
              this.$message.success(res.data.errorMessage)
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          this.$message({
            message: '请输入完整信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    /* logo图片上传成功回调 */
    handleLogoSuccess(res, file) {
      this.setData.cover = res.url
    },
    /* logo查看 */
    handleLogoPreview(file) {
      this.setData.cover = file.url
      this.logoDialogVisible = true
    },
    /* logo移除 */
    handleLogoRemove(file, fileList) {
      if (file.status == 'success') { //eslint-disable-line
        if (fileList.length < 1) {
          this.logoVisible = false
        } else {
          this.logoVisible = true
        }
      }
    },
    /* logo改变 */
    handleLogoChange(file, fileList) {
      if (file.status == 'success') { //eslint-disable-line
        if (fileList.length === 1) {
          this.logoVisible = true
        }
      }
    },
    /* 背景图片上传成功回调 */
    handleBackImgeAvatarSuccess(res, file) {
      this.setData.bcCover = res.url
    },
    /* 背景图片查看 */
    handleBackImgeAvatarPreview(file) {
      this.setData.bcCover = file.url
      this.bgDialogVisible = true
    },
    /* 背景图片移除 */
    handleBackImgeAvatarRemove(file, fileList) {
      if (file.status == 'success') { //eslint-disable-line
        if (fileList.length < 1) {
          this.bgVisible = false
        } else {
          this.bgVisible = true
        }
      }
    },
    /* 背景图片改变 */
    handleBackImgeAvatarChange(file, fileList) {
      if (file.status == 'success') { //eslint-disable-line
        if (fileList.length === 1) {
          this.bgVisible = true
        }
      }
    },
    /* 上传前校验 */
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/jpg' || 'image/png' || 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 png、jpg、jpeg、gif格式的图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    }

  }
}
</script>
<style lang="scss" scoped>
.dns_mgr /deep/ {
  margin: 20px;
  .dns_content {
    height: calc(100vh - 316px);
    overflow: auto;
    border-bottom: 1px solid #ddd;
  }
  .dns_content_next {
    height: calc(100vh - 240px);
    overflow: auto;
  }
  .first_bottom_agree {
    width: calc(100% - 247px);
    text-align: center;
    margin-bottom: 20px;
    position: fixed;
    bottom: 0;
  }
  .agree_check /deep/ {
    .el-checkbox__label {
      font-size: 12px;
    }
  }
  .first_step_btn {
    margin-top: 10px;
  }
  .dns_title {
    font-size: 14px;
    color: #666;
    margin: 20px auto 14px;
  }
  .dns_box {
    width: 350px;
    padding: 6px 20px;
    color: #666;
    font-size: 14x;
    line-height: 23px;
    border-radius: 5px;
    background-color: rgba(240, 242, 245, 0.6);

    display: inline-flex;

    flex-direction: column;

    justify-content: space-between;
  }
  .dns_www {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #666;
    margin-left: 7px;
  }

  .domain_rules_content {
    height: 350px;
    width: 500px;
    padding: 6px 20px 45px;
    color: #666;
    background-color: rgba(240, 242, 245, 0.6);
    border-radius: 5px;
    overflow: auto;
    margin-bottom: 14px;
    line-height: 23px;
  }
  .text_indent_2___yXJdt {
    text-indent: 22px;
  }
  .text_indent_4___2NPom {
    text-indent: 44px;
  }
  .el-form-item--mini .el-form-item__error {
    position: absolute !important;
  }
  .domain_alert___QcpK_ {
    padding: 10px;
    border-radius: 5px;
    background-color: rgba(240, 242, 245, 0.6);
    color: #666;
    display: inline-block;
    cursor: default;
  }

  .login_image {
    margin-left: 12px;
    .avatar-uploader .el-upload {
      width: 300px;
      height: 180px;
    }

    .avatar {
      width: 300px;
      height: 180px;
    }
  }

  .upload_dec {
    color: #999;
    font-size: 12px;
    line-height: 16px;
    margin-top: 4px;
  }
  .upload_small_dec {
    width: 259px;
    height: 36px;
    line-height: 20px;
    margin-top: 2px;
  }
  .login_left {
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 285px;
    line-height: 32px;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
    // align-items: center;
    .login_left_title {
      padding-left: 20px;
      border-bottom: 1px solid #ddd;
      background: rgba(240, 242, 245, 0.8);
      border-radius: 5px 5px 0px 0px;
    }
    .login_left_content {
      padding: 30px 42px 30px 43px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .login_title {
        font-size: 16px;
        color: #333;
        line-height: 16px;
        font-weight: 800;
        margin: 10px 0;
      }
      .login_desc {
        color: #333;
        line-height: 14px;
        font-size: 14px;
        margin-bottom: 20px;
      }
    }
  }

  .login_right {
    margin-left: 38px;
  }
  .el-input-group {
    margin-bottom: 14px;
  }

  .el-input-group__prepend {
    padding: 0 5px !important;
  }
  .login_logo {
    width: 100px;
    height: 100px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .login_content {
    display: flex;
    margin-bottom: 20px;
  }
  .image_upload {
    width: 400px;
  }
  .text_input {
    width: 200px;
  }
}
.confirm-icon {
  font-size: 16px;
  color: #ffaa00;
}
.dns_name /deep/ {
  .el-form-item__content {
    display: flex;
  }
}
.login_bg /deep/ {
  .el-form-item__content {
    margin-left: 0 !important;
  }
  .el-upload-list__item.is-success {
    width: 288px;
    height: 168px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 288px;
    height: 168px;
  }
  .el-upload--picture-card {
    width: 288px;
    height: 168px;
  }
  .upload-text {
    line-height: 14px;
    color: #666;
    margin-top: 9px;
  }
  .el-upload--picture-card i {
    margin-top: 65px;
  }
}
.image_upload {
  .upload-text {
    line-height: 14px;
    color: #666;
    margin-top: 9px;
  }
}
.disabled /deep/ .el-upload--picture-card {
  display: none;
}
</style>
