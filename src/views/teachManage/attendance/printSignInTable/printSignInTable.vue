<template>
  <div class="printSignTable">
    <div>
      <el-form :inline="true">
        <el-form-item>
          <el-date-picker
            v-model="studyDate"
            type="date"
            placeholder="请选择上课日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item v-if="studyDate">
          <el-select
            v-model="course"
            multiple
            placeholder="请选择"
            @change="courseChange"
            @remove-tag="removeTagFunc"
          >
            <el-option
              v-for="item in options"
              :key="item.cpdId"
              :label="item.courseName+'('+item.startTime+'~'+item.endTime+')'"
              :value="item.cpdId"
            />
          </el-select>
        </el-form-item>
        <div style="float:right">
          <el-button
            class="cancel_btn"
            @click="exportContent"
          >导出</el-button>
          <el-button
            type="primary"
            @click="printSign"
          >打印签到表</el-button>
          <el-popover
            placement="bottom-end"
            visible-arrow
            width="160"
            trigger="click"
            popper-class="setPop"
          >
            <div class="tableList">
              <div class="checkList">
                <template v-for="checkColumn in checkList">
                  <el-checkbox-group
                    v-model="checkboxVal"
                    :key="checkColumn.label"
                  >
                    <el-checkbox
                      :disabled="checkColumn.isDisabled"
                      :label="checkColumn.prop"
                    >{{ checkColumn.label }}</el-checkbox>
                  </el-checkbox-group>
                </template>
              </div>
              <div class="save_btn">
                <el-button
                  type="primary"
                  size="mini"
                  @click="saveTableColumnFun"
                >保存</el-button>
              </div>
            </div>
            <div
              slot="reference"
              class="setting"
            >
              <el-button type="primary">内容项</el-button>
            </div>
          </el-popover>
        </div>
      </el-form>
      <div
        id="new_cerp_follow_course_print"
        class="print_area"
      >
        <div style="width:100%;height:100%;">
          <div style="position : relative ; margin-bottom : 10px ; height : 30px">
            <div class="sign_head">学员签到</div>
          </div>
          <div v-if="choosedArr && choosedArr.length>0">
            <div
              v-for="(all_item, index) of choosedArr"
              :key="index"
              class="print_area_content"
            >
              <div class="print_area_cont_head">
                <div class="print_area_cont_head_1">
                  <div class="print_area_cont_head_item">课程名称: {{ all_item.courseName || '--' }} </div>
                  <div class="print_area_cont_head_item">班级: {{ all_item.clsName || '--' }} </div>
                  <div class="print_area_cont_head_item">排课标题: {{ all_item.title || '--' }} </div>
                </div>
                <div class="print_area_cont_head_1">
                  <div class="print_area_cont_head_item">
                    <el-popover
                      placement="top"
                      trigger="hover"
                    >
                      <div>主教:{{ all_item.mtNames || '--' }} / 助教:{{ all_item.atNames || '--' }} </div>
                      <div slot="reference">老师: {{ ( all_item.mtNames || '--' ) + '/' + ( all_item.atNames || '--' ) }} </div>
                    </el-popover>
                  </div>
                  <div class="print_area_cont_head_item">教室:{{ all_item.roomName || '--' }} </div>
                  <!-- <div class="print_area_cont_head_item">所属校区:{{ all_item.orgName || '--' }} </div> -->
                </div>
                <div class="print_area_cont_head_1">
                  <div class="print_area_cont_head_item">日期:{{ all_item.studyDate || '--' }} </div>
                  <div class="print_area_cont_head_item">时间:{{ ( all_item.startTime || '--' ) + '~' + ( all_item.endTime || '--' ) }} </div>
                  <div class="print_area_cont_head_item">
                    <el-popover
                      placement="top"
                      trigger="hover"
                    >
                      <div>上课人数:{{ all_item.num || 0 }} / 补课人数:{{ all_item.mulNum || 0 }} / 试听人数:{{ all_item.tryNum || 0 }} </div>
                      <div slot="reference">人数: {{ (( all_item.num || 0 ) + '/' + ( all_item.mulNum || 0 ) + '/' + ( all_item.tryNum || 0 )) }} </div>
                    </el-popover>
                  </div>
                </div>
              </div>
              <div class="print_area_cont_table">
                <el-table
                  v-if="all_item.tableData"
                  :data="all_item.tableData"
                  border
                  style="width: 100%"
                  fit
                >
                  <el-table-column
                    label="序号"
                    type="index"
                    width="60"
                  />
                  <el-table-column
                    v-for="item in formThead"
                    :key="item.prop"
                    :label="item.label"
                    :formatter="item.formatter"
                    :min-width="item.width || '80px'"
                  >
                    <template slot-scope="scope">
                      {{ scope.row[item.prop] }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div
            v-else
            class="null_data"
          >
            <img src="https://img.ishanshan.com/gimg/user/n///1550211410.png">
            <div>当天无排课信息</div>
          </div>
        </div>
      </div>
      <div
        id="print_area_stu"
        style="height:0;width:1000px;padding-bottom:50px;opacity:0"
      />
    </div>
  </div>
</template>
<script src="./printSignInTable.js"></script>
<style lang="scss" scoped>
.printSignTable /deep/ {
  width: 100%;
  height: calc(100vh - 147px);
  overflow: auto;
  padding-right: 10px;
  .el-select {
    min-width: 220px;
    width: auto;
  }
  .el-select__tags {
    max-width: 500px !important;
  }
  .setting {
    display: inline-block;
    margin-left: 10px;
  }
  .checkList {
    max-height: 300px;
    overflow: auto;
  }
  .print_area {
    width: 1060px;
    .sign_head {
      margin: 0 auto;
      height: 100%;
      line-height: 30px;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
    }
    .print_area_content {
      width: 100%;
      margin-bottom: 20px;
      .print_area_cont_head {
        height: 80px;
        background: rgb(245, 245, 245);
        width: 100%;
        padding: 5px 0px;
        border: 1px solid #000;
        border-bottom: 0;
        .print_area_cont_head_1 {
          height: calc(100% / 3);
          display: flex;
          width: 100%;
          .print_area_cont_head_item {
            width: calc(100% / 3);
            height: 100%;
            line-height: 200%;
            padding: 0 10px;
            display: inline-block;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .print_area_cont_table /deep/ .el-table__empty-block {
        display: none;
      }
      .print_area_cont_table /deep/ {
        .el-table--border {
          border-right: 1px solid #000;
          border-bottom: 1px solid #000;
          border: 1px solid #000;
        }
        .el-table thead {
          color: rgba(0, 0, 0, 0.65);
        }
        .el-table .cell {
          line-height: 40px;
          height: 40px;
          white-space: nowrap;
          padding: 0 4px;
        }
        .el-table td,
        .el-table th.is-leaf {
          border-bottom: 1px solid #000;
        }
        .el-table--border td,
        .el-table--border th,
        .el-table__body-wrapper
          .el-table--border.is-scrolling-left
          ~ .el-table__fixed {
          border-right: 1px solid #000;
          font-size: 18px;
          font-weight: 550;
          font-family: 宋体;
          color: rgba(0, 0, 0, 0.65);
          padding: 0;
        }
      }
    }
    .null_data {
      height: 200px;
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
  }
}
/* 筛选框 */
.checkList {
  max-height: 300px;
  overflow: auto;
  padding-left: 14px;
}
.checkList /deep/ {
  .el-checkbox-group {
    margin: 0 20px 10px 0;
  }
}
.save_btn {
  text-align: center;
  border-top: 1px solid #ddd;
  padding-top: 14px;
  margin-top: 4px;
}
</style>
<style lang="scss">
.setPop {
  padding: 14px 0;
}
</style>
