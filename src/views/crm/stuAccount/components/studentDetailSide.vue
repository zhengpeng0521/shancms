<template>
  <side-dialog
    :visible.sync="sideDialogShow"
    class="studentDetailSide_container"
  >
    <div class="student_detail">
      <div class="info_head">
        <div class="head_top">
          <div class="top_left">
            <img src="https://img.ishanshan.com/gimg/n/20190409/a904c3a3e85790862e0eacba8331c5e8">
          </div>
          <div class="top_right">
            <div class="name">{{ stuDetailData.name }}</div>
          </div>
        </div>
        <div class="head_text">
          <p>
            <span>负责销售:</span>
            <span>{{ stuDetailData.sellerName || '--' }}</span>
          </p>
          <p>
            <span>负责老师:</span>
            <span>{{ stuDetailData.counselorName || '--' }}</span>
          </p>
        </div>
      </div>
      <div class="info_detail">
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="学员详情"
            name="1"
          >
            <div class="side_detail_box">
              <div class="side_headImg">
                <!-- <img
                  :src="stuDetailData.iheadimgurl || 'https://img.ishanshan.com/gimg/n/20190409/31a41395c7ab808d1ae337bd0215b67d'"
                  alt=""
                > -->
                <div v-if="stuDetailData.sex === '1'">
                  <img
                    v-if="stuDetailData.headimgurl"
                    :src="stuDetailData.headimgurl"
                  >
                  <img
                    v-else
                    src="https://img.ishanshan.com/gimg/img/d75fdb312bbaca043a97d24c5453a337"
                    alt
                  >
                </div>
                <div v-else-if="stuDetailData.sex === '2'">
                  <img
                    v-if="stuDetailData.headimgurl"
                    :src="stuDetailData.headimgurl"
                  >
                  <img
                    v-else
                    src="https://img.ishanshan.com/gimg/img/ad8cc625441146bdf8e373dec1cd600f"
                    alt
                  >
                </div>
                <img
                  v-else
                  src="https://img.ishanshan.com/gimg/img/e51c6060b326c9cf12ddb4f1c4e12443"
                  alt
                >
              </div>
              <div class="side_content">
                <p>
                  <span>姓名:</span>
                  <span>{{ stuDetailData.name || '--' }}</span>
                </p>
                <p>
                  <span>姓别:</span>
                  <span>{{ stuDetailData.sex === '1' ? '男' : stuDetailData.sex === '2' ?'女' : '--' }}</span>
                </p>
                <p>
                  <span>生日:</span>
                  <span>{{ stuDetailData.birthday || '--' }}</span>
                </p>
                <p>
                  <span>月龄:</span>
                  <span>{{ stuDetailData.month || '--' }}</span>
                </p>
                <p>
                  <span>年龄:</span>
                  <span>{{ stuDetailData.age || '--' }}</span>
                </p>
                <p>
                  <span>年级:</span>
                  <span>{{ stuDetailData.grade || '' }}</span>
                </p>
                <p>
                  <span>星座:</span>
                  <span>{{ stuDetailData.constellation || '--' }}</span>
                </p>
                <p>
                  <span>民族:</span>
                  <span>{{ stuDetailData.nation || '--' }}</span>
                </p>
                <p>
                  <span>特长:</span>
                  <span>{{ stuDetailData.speciality || '--' }}</span>
                </p>
                <p>
                  <span>爱好:</span>
                  <span>{{ stuDetailData.hobby || '--' }}</span>
                </p>
                <p>
                  <span>血型:</span>
                  <span>{{ stuDetailData.bloodType || '--' }}</span>
                </p>
                <p>
                  <span>社保号码:</span>
                  <span>{{ stuDetailData.socialSecurityNum || '--' }}</span>
                </p>
                <p>
                  <span>手机号:</span>
                  <el-popover
                    ref="popover1"
                    placement="top-start"
                    width="120"
                    trigger="hover"
                  >
                    <p>{{ stuDetailData.mobile }}</p>
                  </el-popover>
                  <span
                    v-popover:popover1
                    style="color:#1D9DF2;"
                  >查看</span>
                </p>
                <p>
                  <span>学员类型:</span>
                  <span>--</span>
                </p>
                <p>
                  <span>地址:</span>
                  <span>{{ stuDetailData.community || '--' }}</span>
                </p>
                <p>
                  <span>一级来源:</span>
                  <span>{{ stuDetailData.channelName || '--' }}</span>
                </p>
                <p>
                  <span>二级来源:</span>
                  <span>{{ stuDetailData.secondChannelName || '--' }}</span>
                </p>
                <p>
                  <span>备注:</span>
                  <span>{{ stuDetailData.remark || '--' }}</span>
                </p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </side-dialog>
</template>

<script>
import { getStuMsg } from '@/api/crm/stuAccount/stuAccount.js'
import SideDialog from '@/components/SideDialog'
export default {
  components: {
    SideDialog
  },
  data() {
    return {
      sideDialogShow: false,
      activeName: '1',
      stuDetailData: {}
    }
  },
  methods: {
    /* 显示侧边弹框 */
    showSideDialog(row) {
      this.sideDialogShow = true
      this.getStuMsgData(row)
    },
    /* 学员详情数据 */
    getStuMsgData(row) {
      const params = {
        stuId: row.stuId
      }
      getStuMsg(params).then(res => {
        if (res.data.errorCode === 0) {
          this.stuDetailData = res.data.data
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.studentDetailSide_container {
  .student_detail {
    .info_head {
      display: flex;
      flex-wrap: wrap;
      -webkit-box-pack: start;
      justify-content: flex-start;
      overflow: hidden;
      .head_top {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        -webkit-box-align: center;
        width: 100%;
        padding: 20px 20px 0px 20px;
        -webkit-box-pack: justify;
        .top_left {
          display: flex;
          flex-wrap: nowrap;
          -webkit-box-align: center;
          align-items: center;
          img {
            width: 40px;
            height: 40px;
            margin-right: 20px;
          }
        }
        .top_right {
          font-size: 16px;
          color: #333;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      .head_text {
        display: flex;
        -webkit-box-pack: start;
        justify-content: flex-start;
        padding: 0 20px 0 80px;
        flex-wrap: wrap;
        width: 100%;
        p {
          width: calc((100% - 80px) / 3);
          font-size: 14px;
          margin-right: 20px;
          margin-bottom: 10px;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
    .side_detail_box {
      padding: 0px 0 20px 30px;
      overflow: auto;
      height: calc(100vh - 307px);
      .side_headImg {
        width: 80px;
        height: 80px;
        background-size: cover;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
      .side_content {
        display: flex;
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        -webkit-box-pack: start;
        justify-content: flex-start;
        p {
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #ddd;
          width: calc((100% - 50px) / 2);
          overflow: hidden;
          white-space: nowrap;
          margin: 0;
          padding: 0;
          span:first-child {
            color: #999;
          }
          span:nth-child(2) {
            color: #666;
          }
        }
        p:nth-child(odd) {
          margin-right: 20px;
        }
      }
    }
  }
}
</style>

