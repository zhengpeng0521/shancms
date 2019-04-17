<template>
  <div>
    <div
      v-if="!isSchedulePrintByDay"
      class="orderCourse"
    >
      <div v-if="!isSchedule">
        <CommonSearch
          ref="search"
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <advanced-search v-bind="superSearch" />
        <div class="add">
          <el-button
            type="primary"
            @click="schedulePrintByDay"
          >按天打印课表</el-button>
          <el-button
            class="cancel_btn"
            style="float:right"
            @click="toSchedule"
          >切换成课程表</el-button>
        </div>
        <div>
          <div class="middle_all">
            <div
              v-if="tabKey == 1"
              class="chooseItem"
            >
              <a @click="OperationQuery('yesterday')">上一天</a>
              <div style="display:inline-block">
                <span
                  v-if="start == end"
                  style="font-size:20px;color:rgba(0,0,0,.65)"
                > {{ start }}</span>
                <span
                  v-else
                  style="font-size:20px;color:rgba(0,0,0,.65)"
                > {{ start }} ~ {{ end }}</span>
                <span
                  v-if="isBackDay"
                  class="go_back"
                  @click="OperationQuery('today')"
                >（返回今天）</span>
                <span
                  v-else
                  style="color:#999;cursor:default"
                >（返回今天）</span>

              </div>
              <a @click="OperationQuery('tomorrow')">下一天</a>
            </div>
            <div
              v-if="tabKey == 2"
              class="chooseItem"
            >
              <a @click="OperationQuery('lastWeek')">上一周</a>
              <div style="display:inline-block">
                <span style="font-size:20px;color:rgba(0,0,0,.65)"> {{ start }} ~ {{ end }}</span>
                <span
                  v-if="isBackWeek"
                  class="go_back"
                  @click="OperationQuery('backToWeek')"
                >（返回本周）</span>
                <span
                  v-else
                  style="color:#999;cursor:default"
                >（返回本周）</span>
              </div>
              <a @click="OperationQuery('nextWeek')">下一周</a>
            </div>
            <div class="timeRadio">
              <div class="radioGroup">
                <el-radio-group
                  v-model="tabKey"
                  @change="tabChange"
                >
                  <el-radio-button label="1">按天</el-radio-button>
                  <el-radio-button label="2">按周</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>
          <CommonTable
            ref="tableCommon"
            :columns="columns"
            :table-height="tableHeight"
            :pagination="listQuery"
            :options="options"
            :table-key="'teachManage_orderCourse_orderCourseList_orderCourseTable_orderCourseTable'"
            @toChildData="getCheckCol"
          />
          <OrderCourseDetail
            ref="orderDetail"
            @toParent="getCancelData"
            @toLineStu="getLineCancelData"
            @toTryStu="getTryCancelData"
            @toOnceOrderCourse="getOnceOrderCourse"
            @toBatchOrderCourse="getBatchOrderCourse"
            @toOrderMissCourse="getOrderMissCourse"
            @toOrderTryCourse="getOrderTryCourse"
            @toCancelUpdate="getUpdateOnceOrder"
            @toInlineUpdate="getInlineUpdate"
            @toleaveUpdate="getUpdateOnceOrder"
            @toReturnUpdate="getUpdateOnceOrder"
          />
          <!-- 取消 -->
          <CancelOrderCourse
            ref="cancel"
            @toCancelUpdate="getUpdateOnceOrder"
          />
          <!-- 取消试听 -->
          <CancelTryStudent
            ref="cancelTry"
            @toCancelUpdate="getUpdateOnceOrder"
          />
          <!-- 单次约课 -->
          <OnceOrderCourse
            ref="onceOrderCourse"
            @toUpdateOnceOrder="getUpdateOnceOrder"
          />
          <!-- 批量约课 -->
          <BatchOrderCourse
            ref="batchOrderCourse"
            @toUpdateOnceOrder="getUpdateOnceOrder"
          />
          <!-- 预约补课 -->
          <OrderMissLesson
            ref="orderMissLesson"
            @toUpdateOnceOrder="getUpdateOnceOrder"
          />
          <!-- 预约试听 -->
          <OrderTryCourse
            ref="orderTryCourse"
            @toUpdateOnceOrder="getUpdateOnceOrder"
          />
        </div>
      </div>
      <!-- 课程表 -->
      <OrderCourseSchedule
        v-if="isSchedule"
        @toUpdateSchedule="getUpdateSchedule"
        @toUpdateSchdulePrint="schedulePrintByDay"
      />
    </div>
    <!-- 按天打印课程表 -->
    <SchedulePrintByDay v-if="isSchedulePrintByDay" />
  </div>
</template>
<script src='./orderCourseTable.js'></script>
<style lang="scss" scoped>
.orderCourse {
  min-width: 1060px;
  .add /deep/ {
    float: right;
    .el-button--primary.is-plain {
      color: #46b6ee;
      border-color: #46b6ee;
      background: #fff;
    }
    .el-button--primary.is-plain:focus,
    .el-button--primary.is-plain:hover {
      background: #fff;
      border-color: #46b6ee;
      color: #46b6ee;
    }
    .el-button--primary.is-plain:active {
      background: #fff;
      border-color: #46b6ee;
      color: #46b6ee;
    }
  }
  .middle_all {
    padding: 0px 0 16px 0px;
    text-align: center;
    .chooseItem {
      line-height: 28px;
      cursor: default;
      display: inline-block;
      .go_back {
        color: #1d9df2;
        cursor: pointer;
        &:hover {
          color: #56c0f5;
        }
      }
      a {
        margin-right: 20px;
        margin-left: 20px;
        color: #1d9df2;
        &:hover {
          color: #56c0f5;
        }
      }
    }
    .timeRadio {
      float: left;
      line-height: 28px;
      // width: 25%;
      // overflow: hidden;
      // .radioGroup {
      //   float: right;
      // }
    }
  }
}
</style>
<style lang="scss">
.orderCourse {
  .studyDate {
    color: #1d9df2;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
