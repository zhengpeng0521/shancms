<template>
  <div class="schedulePrintByDay">
    <div class="btn">
      <el-button
        type="primary"
        @click="print"
      >打印课程表</el-button>
    </div>
    <div class="scroll_area">
      <div class="choose_area">
        <el-select
          v-model="type"
          placeholder="请选择"
          style="margin-right:10px;width:140px"
        >
          <el-option
            label="老师"
            value="1"
          />
          <el-option
            label="教室"
            value="2"
          />
        </el-select>
        <el-select
          v-model="list"
          :placeholder="placeholder"
          multiple
          style="margin-right:10px;width:180px"
          @change="selectChange"
        >
          <template v-if="type == '2'">
            <el-option
              v-for="item in roomList"
              :key="item.id"
              :label="item.name? item.name:''"
              :value="item.id + '-' + item.name"
            />
          </template>
          <template v-else>
            <el-option
              v-for="item in teachList"
              :key="item.id"
              :label="item.name"
              :value=" item.id + '-' + item.name "
            />
          </template>
        </el-select>
        <el-date-picker
          v-model="modifyTime"
          :clearable="false"
          style="width:140px"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="datePickerOnChange"
        />
        <div class="tip">
          <span>友情建议：</span>
          <span>横向打印</span>
        </div>
      </div>
      <div class="print_area">
        <div style="height:20px;line-height:20px">{{ modifyTime }}</div>
        <div class="print_show">
          <template v-if="printList && printList.length>0">
            <div
              v-for="(item, index) of printList"
              :key="index"
              :style="{ 'border-left': index == 0 ? '1px solid #ddd' : 0}"
              class="print_item"
            >
              <div class="print_name">{{ item.name }}</div>
              <div class="print_content">
                <div
                  v-for="(courseItem, courseIndex) of item.course"
                  :key="courseIndex"
                  :style="{ 'margin-bottom': index != printList.length - 1 ? 5 : 0 }"
                  class="print_content_item"
                >
                  <div class="content_item">
                    <div class="course_name">{{ courseItem.courseName }}</div>
                    <div class="course_time">{{ courseItem.startTime || '未知' }} ~ {{ courseItem.endTime|| '未知' }}</div>
                    <div class="course_cont">课程:{{ courseItem.courseName || '--' }}</div>
                    <div class="course_cont">教室:{{ courseItem.roomName || '--' }}</div>
                    <div class="course_cont">主教:{{ courseItem.mtNames || '--' }}</div>
                    <div class="course_cont">助教:{{ courseItem.atNames || '--' }}</div>
                    <div style="width:100%;line-height:18px;">{{ courseItem.stuArrSum }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div
        id="schedule_print_by_day"
        style="display : none"
      >
        <div
          v-for="i of realPrintArr"
          :key="i"
        >
          <template v-if="i != (realPrint - 1) && realPrint > 1">
            <div class="print_area">
              <div style="height:20px;line-height:20px">{{ modifyTime }}</div>
              <div style=" height: calc(100% - 20px);display: flex;flex-wrap: nowrap; width: 100%;">
                <template v-if="printList && printList.length>0">
                  <div
                    v-for="(item, index) of realPrintItem"
                    :key="index"
                    :style="{ 'border-left': index == 0 ? '1px solid #ddd' : 0}"
                    style="width: calc(100% / 5);height: 100%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;border-bottom: 1px solid #ddd;"
                  >
                    <div style="width: 100%;height: 40px;line-height: 40px;text-align: center; border-top: 1px solid #ddd;border-bottom: 1px solid #ddd;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;padding: 0 5px;">{{ printList[item].name }}</div>
                    <div style="width: 100%;height: calc(100% - 40px);display: flex;flex-flow: column nowrap;">
                      <div
                        v-for="(courseItem, courseIndex) of printList[item].course"
                        :key="courseIndex"
                        :style="{ 'margin-bottom': index != printList.length - 1 ? 5 : 0 }"
                        style="width: calc(100% - 5px);border: 1px solid #ddd;border-radius: 3px;padding: 2px;background: #f5f5f5;font-size: 12px;overflow: hidden;margin-bottom: 5px;margin-right: 5px;"
                      >
                        <div style="display: flex;flex-wrap: wrap;color: rgba(0, 0, 0, 0.65);">
                          <div style=" width: 50%;float: left;font-weight: 600;line-height: 18px;">{{ courseItem.courseName }}</div>
                          <div style=" width: 50%;float: right;color: #000;line-height: 18px;">
                            <div style="padding: 0 2px; text-align: right;">{{ courseItem.startTime || '未知' }} ~ {{ courseItem.endTime|| '未知' }}</div>
                          </div>
                          <div style="width: 50%;text-align: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;line-height: 18px;">课程:{{ courseItem.courseName || '--' }}</div>
                          <div style="width: 50%;text-align: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;line-height: 18px;">教室:{{ courseItem.roomName || '--' }}</div>
                          <div style="width: 50%;text-align: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;line-height: 18px;">主教:{{ courseItem.mtNames || '--' }}</div>
                          <div style="width: 50%;text-align: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;line-height: 18px;">助教:{{ courseItem.atNames || '--' }}</div>
                          <div style="width:100%;line-height:18px;">{{ courseItem.stuArrSum }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="print_area">
              <div style="height:20px;line-height:20px">{{ modifyTime }}</div>
              <div style=" height: calc(100% - 20px);display: flex;flex-wrap: nowrap; width: 100%;">
                <template v-if="printList && printList.length>0">
                  <div
                    v-for="(item, index) of realRemainderArr"
                    :key="item"
                    :style="{ 'border-left': index == 0 ? '1px solid #ddd' : 0}"
                    style="width: calc(100% / 5);height: 100%;border-left: 1px solid #ddd;border-right: 1px solid #ddd;border-bottom: 1px solid #ddd;"
                  >
                    <div style="width: 100%;height: 40px;line-height: 40px;text-align: center; border-top: 1px solid #ddd;border-bottom: 1px solid #ddd;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;padding: 0 5px;">{{ printList[item].name }}</div>
                    <div style="width: 100%;height: calc(100% - 40px);display: flex;flex-flow: column nowrap;">
                      <div
                        v-for="(courseItem, courseIndex) of printList[item].course"
                        :key="courseIndex"
                        :style="{ 'margin-bottom': index != printList.length - 1 ? 5 : 0 }"
                        style="width: calc(100% - 5px);border: 1px solid #ddd;border-radius: 3px;padding: 2px;background: #f5f5f5;font-size: 12px;overflow: hidden;margin-bottom: 5px;margin-right: 5px;"
                      >
                        <div style="display: flex;flex-wrap: wrap;color: rgba(0, 0, 0, 0.65);">
                          <div style=" width: 50%;float: left;font-weight: 600;line-height: 18px;">{{ courseItem.courseName }}</div>
                          <div style=" width: 50%;float: right;color: #000;line-height: 18px;">
                            <div style="padding: 0 2px; text-align: right;">{{ courseItem.startTime || '未知' }} ~ {{ courseItem.endTime|| '未知' }}</div>
                          </div>
                          <div style="width: 50%;text-align: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;line-height: 18px;">课程:{{ courseItem.courseName || '--' }}</div>
                          <div style="width: 50%;text-align: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;line-height: 18px;">教室:{{ courseItem.roomName || '--' }}</div>
                          <div style="width: 50%;text-align: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;line-height: 18px;">主教:{{ courseItem.mtNames || '--' }}</div>
                          <div style="width: 50%;text-align: left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;line-height: 18px;">助教:{{ courseItem.atNames || '--' }}</div>
                          <div style="width:100%;line-height:18px;">{{ courseItem.stuArrSum }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./schedulePrintByDay.js"></script>
<style lang="scss" scoped>
.schedulePrintByDay {
  width: 100%;
  height: calc(100vh - 167px);
  overflow: auto;
  margin-bottom: 20px;
  .btn {
    float: right;
  }
  .tip {
    display: inline-block;
    margin-left: 10px;
    :first-child {
      color: red;
    }
  }
  .print_area {
    min-width: 1350px;
    height: 900px;
    min-height: 900px;
    margin-top: 20px;
    .real_print_show {
      height: calc(100% - 20px);
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
      .real_print_item {
        width: calc(100% / 5);
        height: 100%;
        border-left: 2px solid #ddd;
        border-right: 2px solid #ddd;
        border-bottom: 2px solid #ddd;
        font-size: 12px;
        .print_name {
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-top: 2px solid #ddd;
          border-bottom: 2px solid #ddd;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 5px;
        }
        .print_content {
          width: 100%;
          height: calc(100% - 40px);
          display: flex;
          flex-flow: column nowrap;
          :last-child {
            margin-bottom: 0;
          }
          .print_content_item {
            width: calc(100% - 5px);
            border: 2px solid #ddd;
            border-radius: 3px;
            padding: 2px;
            background: #f5f5f5;
            font-size: 12px;
            overflow: hidden;
            margin-bottom: 5px;
            margin-right: 5px;
            .content_item {
              display: flex;
              flex-wrap: wrap;
              color: rgba(0, 0, 0, 0.65);
              .course_name {
                width: 50%;
                text-align: left;
                font-weight: 600;
                line-height: 18px;
              }
              .course_time {
                width: 50%;
                float: right;
                color: #000;
                padding: 0 2px;
                text-align: right;
                line-height: 18px;
              }
              .course_cont {
                width: 50%;
                text-align: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 18px;
              }
            }
          }
        }
      }
    }
    .print_show {
      height: 100%;
      display: flex;
      flex-wrap: nowrap;
      margin-bottom: 20px;
      :last-child {
        margin-right: 20px;
      }
      .print_item {
        width: 250px;
        height: calc(100% - 20px);
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #ddd;
        .print_name {
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-top: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 5px;
        }
        .print_content {
          width: 100%;
          height: calc(100% - 40px);
          display: flex;
          flex-flow: column nowrap;
          :last-child {
            margin-bottom: 0;
          }
          .print_content_item {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 2px;
            background: #f5f5f5;
            font-size: 12px;
            overflow: hidden;
            margin-bottom: 5px;
            .content_item {
              display: flex;
              flex-wrap: wrap;
              color: rgba(0, 0, 0, 0.65);
              .course_name {
                width: 50%;
                text-align: left;
                font-weight: 600;
                line-height: 18px;
              }
              .course_time {
                width: 50%;
                float: right;
                color: #000;
                padding: 0 2px;
                text-align: right;
                line-height: 18px;
              }
              .course_cont {
                width: 50%;
                text-align: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 18px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
