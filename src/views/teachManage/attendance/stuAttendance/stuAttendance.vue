<template>
  <div class="stuAttendance">
    <div class="dayChoose">
      <!-- <span>日期选择：</span> -->
      <el-date-picker
        v-model="studyDate"
        :picker-options="pickerOptions"
        :clearable="false"
        style="vertical-align:top"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
      />
      <el-button
        style="margin-left:15px;"
        type="primary"
        @click="OperationQuery('beforeDay')"
      >上一天</el-button>
      <el-button
        :disabled="isCurrentDay"
        type="primary"
        @click="OperationQuery('nextDay')"
      >下一天</el-button>
    </div>
    <div class="stuAttendancecont">
      <div
        v-if="attendanceList && attendanceList.length>0"
        class="stuAttendanceconttest"
      >
        <div
          v-for="(item,index) of attendanceList"
          :key="index"
          class="stuAttendance_item"
        >
          <div class="stuAttendance_item_title">
            <div class="stuAttendance_item_title_left">
              <div class="stuAttendance_item_left_top">
                <p>
                  <span>课程名称：</span>
                  <span>{{ item.courseName || '--' }}</span>
                </p>
                <p>
                  <span>排课标题：</span>
                  <span>{{ item.title }}</span>
                </p>
                <p>
                  <span>消耗课时：</span>
                  <span>{{ item.cost || '--' }}</span>
                </p>
                <p>
                  <span>班级名称：</span>
                  <span>{{ item.clsName || '--' }}</span>
                </p>
                <p>
                  <span>时间段：</span>
                  <span>{{ item.startTime + '-' + item.endTime }}</span>
                </p>
              </div>
              <div class="stuAttendance_item_left_bottom">
                <p>
                  <span>主教：</span>
                  <span>{{ item.mtNames || '--' }}</span>
                </p>
                <p>
                  <span>助教：</span>
                  <span>{{ item.atNames || '--' }}</span>
                </p>
                <p>
                  <span>教室：</span>
                  <span>{{ item.roomName || '--' }}</span>
                </p>
                <p v-if="isCurrentDay">
                  <span>最大人数：</span>
                  <span>{{ item.maxNum || '--' }}</span>
                </p>
                <p>
                  <span>已考勤/总考勤人数：</span>
                  <span>{{ ( (item.yetCheckNum != null ? item.yetCheckNum : '0') + '/' + (item.totalCheckNum != null ? item.totalCheckNum : '0')) || '--' }}</span>
                </p>
              </div>
            </div>
            <div class="stuAttendance_item_title_right">
              <el-button
                v-if="!isCurrentDay"
                type="primary"
                @click="stuAttendanceDetail(item)"
              >明细</el-button>
              <el-button
                v-else
                type="primary"
                @click="stuAttendanceChange(item)"
              >考勤</el-button>
              <el-button
                class="cancel_btn"
                @click="reapplyTicket(item)"
              >补打小票</el-button>
            </div>
          </div>
          <div class="stuAttendance_item_info">
            <div class="stuAttendance_item_info_cont">
              <div class="stuAttendance_item_info_cont_top">
                <img src="https://img.ishanshan.com/gimg/n/20190404/547e509d15bab9c5470d2947ccf08108">
                <span>上课学员</span>
                <span v-if="item.maxAttNum == '-1' ">{{ (item.num || 0) + '(' + (item.lineNum || 0) + ')' }}</span>
                <span v-else>{{ (item.num || 0) + '/' + (item.maxAttNum || 0) + '(' + (item.lineNum || 0) + ')' }}</span>
              </div>
              <div
                v-if="!isCurrentDay"
                class="stuAttendance_item_info_cont_bottom"
              >
                <span>{{ '出勤:' + (item .cq || 0) }}</span>
                <span>{{ '请假:' + (item .qj || 0) }}</span>
                <span>{{ '旷课:' +(item .kk || 0) }}</span>
                <span>{{ '取消:' + (item .qx || 0) }}</span>
              </div>
            </div>
            <div class="stuAttendance_item_info_cont">
              <div class="stuAttendance_item_info_cont_top">
                <img src="https://img.ishanshan.com/gimg/n/20190404/35de416782a6e6ce3e2b003d43c618b6">
                <span>补课学员</span>
                <span v-if="item.maxMulNum == '-1'">{{ (item.mulNum || 0) }}</span>
                <span v-else>{{ (item.mulNum || 0) + '/' + (item.maxMulNum || 0) }}</span>
              </div>
              <div
                v-if="!isCurrentDay"
                class="stuAttendance_item_info_cont_bottom"
              >
                <span>{{ '出勤:' + (item .bkcq || 0) }}</span>
                <span>{{ '请假:' + (item .bkqj || 0) }}</span>
                <span>{{ '旷课:' +(item .bkkk || 0) }}</span>
                <span>{{ '取消:' + (item .bkqx || 0) }}</span>
              </div>
            </div>
            <div class="stuAttendance_item_info_cont">
              <div class="stuAttendance_item_info_cont_top">
                <img src="https://img.ishanshan.com/gimg/n/20190404/b9becd5a65ffe36b893edb4a28a4848c">
                <span>预约试听</span>
                <span v-if="item.maxTryNum == '-1'">{{ (item.tryNum || 0) }}</span>
                <span v-else>{{ (item.tryNum || 0) + '/' + (item.maxTryNum || 0) }}</span>
              </div>
              <div
                v-if="!isCurrentDay"
                class="stuAttendance_item_info_cont_bottom"
              >
                <span>{{ '已试听:' + (item .st || 0) }}</span>
                <span>{{ '旷课:' + (item .stkk || 0) }}</span>
                <span>{{ '取消:' + (item .stqx || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="null_data"
      >
        <img src="https://img.ishanshan.com/gimg/user/n///1550211410.png">
        <div>暂无数据</div>
      </div>
    </div>

    <!-- 分页-->
    <el-pagination
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :current-page="pageIndex"
      :total="totalCount"
      layout=" total, prev, pager, next, sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 考勤/明细 -->
    <EditAndAttendance
      ref="editAttendance"
      :teacher-list="teacherList"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 补办考勤小票 -->
    <ReapplyAttendanceTicket
      ref="reapplySmallTicket"
      :teacher-list="teacherList"
    />
  </div>
</template>
<script src="./stuAttendance.js"></script>
<style lang="scss" scoped>
.stuAttendance {
  .dayChoose /deep/ {
    margin-bottom: 20px;
    .el-button.is-disabled,
    .el-button.is-disabled:focus,
    .el-button.is-disabled:hover {
      width: 74px;
    }
  }
  .null_data {
    min-height: 200px;
    text-align: center;
    height: 100%;
    width: 100%;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    min-height: 100px;
    -webkit-box-pack: center;
    img {
      margin-top: -10px;
    }
    div {
      cursor: default;
      font-size: 12px;
      color: #999;
      margin-top: 10px;
    }
  }
  .stuAttendancecont {
    height: calc(100vh - 238px);
    overflow: auto;
    position: relative;
    .stuAttendanceconttest {
      width: 100%;
      min-width: 1300px;
      height: 100%;
      .stuAttendance_item {
        margin-bottom: 20px;
        width: 100%;
        border-radius: 5px;
        border: 1px solid #ddd;
        .stuAttendance_item_title {
          padding: 10px 20px;
          height: auto;
          width: 100%;
          background: #f3f5f7;
          border-bottom: 1px solid #ddd;
          display: flex;
          flex-wrap: nowrap;
          -webkit-box-pack: justify;
          justify-content: space-between;
          .stuAttendance_item_title_left {
            width: calc(100% - 180px);
            .stuAttendance_item_left_top {
              margin-bottom: 10px;
              display: flex;
              width: 100%;
              p {
                width: 20%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                span:first-child {
                  color: #999;
                }
                span:last-child {
                  color: #666;
                }
              }
            }
            .stuAttendance_item_left_bottom {
              display: flex;
              width: 100%;
              p {
                width: 20%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                span:first-child {
                  color: #999;
                }
                span:last-child {
                  color: #666;
                }
              }
            }
          }
          .stuAttendance_item_title_right {
            height: inherit;
            display: flex;
            flex-wrap: nowrap;
            -webkit-box-align: center;
            align-items: center;
            width: 170px;
          }
        }
        .stuAttendance_item_info {
          width: 100%;
          overflow: hidden;
          padding: 20px;
          display: flex;
          flex-wrap: nowrap;
          -webkit-box-pack: justify;
          justify-content: space-between;
          .stuAttendance_item_info_cont:last-child {
            border: 0;
          }
          .stuAttendance_item_info_cont {
            // height: 75px;
            border-right: 1px solid #ddd;
            width: 33.33%;
            .stuAttendance_item_info_cont_top {
              display: flex;
              flex-wrap: nowrap;
              -webkit-box-pack: center;
              -webkit-box-align: center;
              align-items: center;
              justify-content: center;
              img {
                height: 40px;
                margin-right: 20px;
                width: 40px;
              }
              span:nth-child(2) {
                margin-right: 40px;
              }
              span {
                color: #666;
                height: 20px;
                line-height: 20px;
              }
            }
            .stuAttendance_item_info_cont_bottom {
              margin-top: 18px;
              display: flex;
              flex-wrap: nowrap;
              -webkit-box-pack: center;
              -webkit-box-align: center;
              align-items: center;
              justify-content: center;
              span {
                color: #999;
                margin-top: -5px;
                margin-left: 30px;
              }
              span:first-child {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
