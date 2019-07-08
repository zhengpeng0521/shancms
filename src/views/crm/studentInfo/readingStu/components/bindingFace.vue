<template>
  <div class="bindingFaceDialog_container">
    <el-dialog
      :visible.sync="bindingFaceDialogShow"
      :modal="true"
      :modal-append-to-body="false"
      title="绑定人脸"
      @close="cancelDialog()"
    >
      <!-- 学员人脸 -->
      <div
        v-if="studentParentShow"
        class="studentParent"
      >
        <div class="studentPart">
          <div class="stuPartTitle">学员人脸</div>
          <!-- 学员人脸主要部分 -->
          <div class="stuPartContent">
            <div class="stuParConLeft">
              <img :src="contnetStudentData.faceUrl">
              <p>{{ contnetStudentData.name }}</p>
            </div>
            <div class="stuParConRight">
              <el-button type="text" @click="bindingFaceOrder(contnetStudentData, tenantId, orgId)">{{ contnetStudentData.isFaceBind == '0' ? '绑定人脸' : '重设人脸' }}</el-button>
            </div>
          </div>
        </div>

        <!-- 家长人脸 -->
        <div class="parentsPart">
          <div class="parPartTitle">家长人脸</div>
          <!-- 家长人脸主要部分 -->
          <div
            v-for="(item, index) of contentParentsPartData"
            :key="item + index"
            class="parPartContent"
          >
            <div class="parParConLeft">
              <img :src="item.faceUrl">
              <p>{{ item.name }}</p>
            </div>
            <div class="parParConRight">
              <el-button type="text" @click="bindingFaceOrder(contentParentsPartData[index], tenantId, orgId)">{{ item.isFaceBind == '0' ? '绑定人脸' : '重设人脸' }}</el-button>
            </div>
          </div>
          <!-- 家长人脸末尾 -->
        </div>
      </div>

      <!-- 没有人脸探槽弹窗 -->
      <div v-if="advertisingShow" class="advertising">
        <span>您未购买人脸识别套餐，无法体验</span>
        <span>购买请扫描二维码咨询</span>
        <img src="https://img.ishanshan.com/gimg/user/n///1557308283.png" alt="">
      </div>

      <!-- 绑定人脸验证顺序弹窗 -->
      <bindingFaceOrder
        ref="bindingFaceOrder"
        @closeCreateDialog="closeCreateDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  isBindFace // 检测机构是否已绑定
} from '@/api/crm/studentInfo/bindingFace.js'
import bindingFaceOrder from './bindingFaceOrder.vue'
export default {
  components: {
    bindingFaceOrder
  },
  data() {
    return {
      bindingFaceDialogShow: false,
      studentParentShow: true, // 有人脸套餐显示的内容
      advertisingShow: false, // 没有人脸套餐显示的联系客服内容
      boySmallPic: 'https://img.ishanshan.com/gimg/n/20190610/255e2d17ce30ab8bc0d5e6cc5614f491', // 男孩小图
      girlSmallPic: 'https://img.ishanshan.com/gimg/n/20190610/badc8d90a57986501e6fa446513937fa', // 女孩小图
      manSmallPic: 'https://img.ishanshan.com/gimg/n/20190610/8cefa27d9d2c16561e15103389d0dbb4', // 男家长小图
      womanSmallPic: 'https://img.ishanshan.com/gimg/n/20190610/6258248072be5c936a9661fc165a72c1', // 女家长小图
      tenantId: '',
      orgId: '',
      contnetStudentData: { // 学生人脸数据
        id: '',
        name: '闪闪',
        isFaceBind: '0', // 是否绑定人脸
        faceUrl: '', // 人脸如偏地址
        isStudent: '1' // 是否是学生
      },
      contentParentsPartData: [] // 家长人脸数据
    }
  },
  methods: {
    closeCreateDialog() {
      this.cancelDialog()
    },
    // 人脸识别步骤弹窗
    bindingFaceOrder(data, tenantId, orgId) {
      this.$refs.bindingFaceOrder.showDialog(data, tenantId, orgId)
    },
    /* 显示弹框 */
    showDialog(row) {
      this.bindingFaceDialogShow = true
      this.isBindFaceFun(row)
    },

    // 判断是否有人脸识别
    isBindFaceFun(row) {
      const params = {
        tenantId2: String(row.tenantId),
        orgId2: row.orgId,
        stuId: row.id
      }
      const sex = row.sex
      this.tenantId = row.tenantId
      this.orgId = row.orgId
      isBindFace(params).then(res => {
        if (res.data.errorCode === 0) { // 有人脸识别显示的内容
          this.studentParentShow = true
          this.advertisingShow = false
          this.contnetStudentData = res.data.results[0]
          this.contentParentsPartData = res.data.results.slice(1)
          // 学生人脸
          this.contnetStudentData.id = res.data.results[0].id
          this.contnetStudentData.name = res.data.results[0].name // 学生姓名
          this.contnetStudentData.isFaceBind = res.data.results[0].isFaceBind // 学生是否绑定人脸
          if (res.data.results[0].faceUrl === null) {
            if (sex === '2') {
              this.contnetStudentData.faceUrl = this.girlSmallPic
            } else {
              this.contnetStudentData.faceUrl = this.boySmallPic
            }
          } else {
            this.contnetStudentData.faceUrl = res.data.results[0].faceUrl
          }

          // 家长人脸
          res.data.results.forEach((item, index) => {
            item.name = res.data.results[index].name
            item.isFaceBind = res.data.results[index].isFaceBind
            if (res.data.results[index].faceUrl === null) { // 学生默认男孩，家长默认女家长
              if (res.data.results[index].sex === '2') {
                item.faceUrl = this.womanSmallPic
              } else if (res.data.results[index].sex === '1') {
                item.faceUrl = this.manSmallPic
              } else {
                item.faceUrl = this.womanSmallPic
              }
            } else {
              item.faceUrl = res.data.results[index].faceUrl
            }
          })
        } else { // 没有人脸识别的内容
          this.studentParentShow = false
          this.advertisingShow = true
        }
      })
    },

    /* 关闭弹框 */
    cancelDialog() {
      this.bindingFaceDialogShow = false
      this.$emit('toUpdateTableFace')
    }

  }
}
</script>

<style lang="scss" scoped>
.bindingFaceDialog_container /deep/ {
  .el-dialog {
    width: 400px;
    .studentParent{
      .studentPart { //学员人脸部分
        .stuPartContent {
          width: 380px;
          padding:  0 15px;
          margin: 0 auto;
          text-align: center;
          line-height: 70px;
          overflow: hidden;
          .stuParConLeft {
            float: left;
            img {
              display: block;
              float: left;
              width: 45px;
              height: 45px;
              border-radius: 50%;
              margin: 10px auto 0;
            }
            p {
              display: block;
              float: left;
              font-size: 14px;
              margin-left: 5px;
            }
          }
          .stuParConRight {
            float: right;
          }
        }
      }

      .parentsPart { // 家长人脸部分
        margin-top: 15px;
        .parPartContent {
          width: 380px;
          padding:  0px 15px;
          margin: 0 auto;
          text-align: center;
          line-height: 70px;
          overflow: hidden;
          .parParConLeft {
             float: left;
            img {
              display: block;
              float: left;
              width: 45px;
              height: 45px;
              border-radius: 50%;
              margin: 10px auto 0;
            }
            p {
              display: block;
              float: left;
              font-size: 14px;
              margin-left: 5px;
            }
          }
          .parParConRight {
            float: right;
          }
        }
      }
    }
    .advertising {
      width: 300px;
      height: 300px;
      margin: 0 auto;
      span:nth-of-type(1) {
        width: 240px;
        font-size: 16px;
        display: block;
        margin: 0 auto;
        color: #666666;
      }
      span:nth-of-type(2) {
        width: 200px;
        font-size: 20px;
        display: block;
        margin: 5px auto 0;
        color: #333333;
      }
      img {
        display: block;
        width: 220px;
        margin: 20px auto 0;
        border: 1px solid #F2F6FC;
      }
    }
  }
}
</style>

