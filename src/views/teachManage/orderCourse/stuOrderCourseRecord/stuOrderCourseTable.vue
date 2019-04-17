<template>
  <div class="orderCourse">
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
        class="green_btn"
        @click="exportContent"
      >导出</el-button>
    </div>
    <div class="middle_all">
      <div class="operation">
        <span style="margin-right:10px;float:left">已选 <span style="color:#46B6EE">{{ checkNum || '0' }}</span> 条数据</span>
        <el-button
          class="cancel_btn edit_btn"
          @click="cancelOrderCourse"
        >取消</el-button>
        <el-button
          style="margin-left:5px;"
          class="cancel_btn edit_btn"
          @click="updateFix"
        >修改固定位</el-button>
      </div>
      <div
        v-if="tabKey == 1"
        class="chooseItem"
      >
        <a @click="OperationQuery('yesterday')">上一天</a>
        <div>
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
            style="color:rgb(221, 221, 221);cursor:default"
          >（返回今天）</span>

        </div>
        <a @click="OperationQuery('tomorrow')">下一天</a>
      </div>
      <div
        v-if="tabKey == 2"
        class="chooseItem"
      >
        <a @click="OperationQuery('lastWeek')">上一周</a>
        <div>
          <span style="font-size:20px;color:rgba(0,0,0,.65)"> {{ start }} ~ {{ end }}</span>
          <span
            v-if="isBackWeek"
            class="go_back"
            @click="OperationQuery('backToWeek')"
          >（返回本周）</span>
          <span
            v-else
            style="color:rgb(221, 221, 221);cursor:default"
          >（返回本周）</span>
        </div>
        <a @click="OperationQuery('nextWeek')">下一周</a>
      </div>
      <div
        v-if="tabKey == 3"
        class="chooseItem"
      >
        <a @click="OperationQuery('lastMonth')">上一月</a>
        <div>
          <span style="font-size:20px;color:rgba(0,0,0,.65)"> {{ start }} ~ {{ end }}</span>
          <span
            v-if="isBackMonth"
            class="go_back"
            @click="OperationQuery('backToMonth')"
          >（返回本月）</span>
          <span
            v-else
            style="color:rgb(221, 221, 221);cursor:default"
          >（返回本月）</span>
        </div>
        <a @click="OperationQuery('nextMonth')">下一月</a>
      </div>
      <div class="timeRadio">
        <div class="radioGroup">
          <el-radio-group
            v-model="tabKey"
            @change="tabChange"
          >
            <el-radio-button label="1">按天</el-radio-button>
            <el-radio-button label="2">按周</el-radio-button>
            <el-radio-button label="3">按月</el-radio-button>
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
      :operation="operates"
      :table-key="'teachManage_orderCourse_stuOrderCourseRecord_stuOrderCourseTable'"
      @toChildData="getCheckCol"
      @handleSelectionChange="selectionChange"
    />
    <updateSignType
      ref="updateSignType"
      @toUpdateSignType="getUpdateSignType"
    />
    <CancelOrderCourse
      ref="cancel"
      @toCancelOrder="getUpdateSignType"
    />
    <UpdateFix
      ref="updateFix"
      @toUpdateFix="getUpdateSignType"
    />
  </div>
</template>
<script src='./stuOrderCourseTable.js'></script>
<style lang="scss" scoped>
.orderCourse {
  a {
    color: #46b6ee;
  }
  .add {
    float: right;
  }
  .middle_all {
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-direction: row;
    flex-wrap: nowrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-bottom: 10px;
    .operation {
      line-height: 40px;
      width: 25%;
      span {
        color: #666;
      }
    }
    .chooseItem {
      line-height: 40px;
      width: 50%;
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-evenly;
      -webkit-box-align: baseline;
      user-select: none;
      cursor: default;
      a {
        color: #1d9df2;
        &:hover {
          color: #56c0f5;
        }
      }
      .go_back {
        color: #1d9df2;
        cursor: pointer;
        &:hover {
          color: #56c0f5;
        }
      }
    }
    .timeRadio {
      line-height: 40px;
      width: 25%;
      overflow: hidden;
      .radioGroup {
        float: right;
      }
    }
  }
}
</style>
