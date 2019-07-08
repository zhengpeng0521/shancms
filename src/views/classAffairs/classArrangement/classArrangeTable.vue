<template>
  <div class="classArrange">
    <div class="page_title_text">
      班级排课
    </div>
    <div class="commonSearch">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :inline="true"
      >
        <el-form-item>
          <el-select
            v-model="ruleForm.clsId"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in classNameList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="ruleForm.month"
            :clearable="false"
            type="month"
            placeholder="选择月"
            value-format="yyyy-MM"
            style="width:140px"
          />
        </el-form-item>
        <el-form-item>
          <div class="common_search_btn">
            <el-button
              size="mini"
              type="primary"
              class="search_btn"
              @click="submit"
            >
              <img src="https://img.ishanshan.com/gimg/img/77ed55e16b08f3a7b9d986e75a2c1d7c">
            </el-button>
            <el-button
              size="mini"
              class="refresh_btn cancel_btn"
              @click="resetForm"
            >
              <img src="https://img.ishanshan.com/gimg/img/4967edad7d0d83947070c9a404a3b216">
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="btns">
      <el-button
        class="green_btn"
        @click="classArrange"
      >排课</el-button>
      <el-button
        type="primary"
        @click="copySchedule"
      >复制课表</el-button>
    </div>
    <div class="schedule_course">
      <div style="height:100%">
        <ul class="schedules_head">
          <li>周一</li>
          <li>周二</li>
          <li>周三</li>
          <li>周四</li>
          <li>周五</li>
          <li>周六</li>
          <li>周日</li>
        </ul>
        <div class="schedules_box">
          <div class="schedules_scroll">
            <div
              v-for="(week, index) of weeks"
              :key="index"
            >
              <ul class="date_list">
                <li class="date_title">日期</li>
                <li
                  v-for="(day, key) of days"
                  :key="key"
                  class="date_item"
                >
                  <span :class="myClass(index, key)">{{ dateFunc(index, key) }}</span>
                </li>
              </ul>
              <ul class="date_list data_sourse_list">
                <li class="date_title">上午</li>
                <li
                  v-for="(day1, key1) of days"
                  :key="key1"
                  class="date_item"
                >
                  <template v-for="(item1, index1) of amList">

                    <div
                      v-if="test(index,key1,item1)"
                      :key="index1"
                      class="class_block"
                      @click="setSchedules(item1)"
                    >
                      <el-popover
                        placement="right"
                        width="250"
                        trigger="hover"
                      >
                        <div class="popoverContent">
                          <p>
                            课程：
                            <span>{{ item1.title || '--' }}</span>
                          </p>
                          <p>
                            主题：
                            <span>{{ item1.themeName || '--' }}</span>
                          </p>
                          <p>
                            时间：
                            <span>{{ item1.studyDate }} {{ item1.startTime }}~{{ item1.endTime }}</span>
                          </p>
                        </div>
                        <div
                          slot="reference"
                          class="block_middle"
                        >
                          <p>{{ item1.title }}</p>
                          <p>{{ item1.startTime }} ~ {{ item1.endTime }}</p>
                        </div>
                      </el-popover>
                    </div>
                  </template>
                </li>
              </ul>
              <ul class="date_list data_sourse_list">
                <li class="date_title">下午</li>
                <li
                  v-for="(after, afterKey) of days"
                  :key="afterKey"
                  class="date_item"
                >
                  <template v-for="(pmItem, pmIndex) of pmList">
                    <div
                      v-if="test(index,afterKey,pmItem)"
                      :key="pmIndex"
                      class="class_block"
                      @click="setSchedules(pmItem)"
                    >
                      <el-popover
                        placement="right"
                        width="250"
                        trigger="hover"
                      >
                        <div class="popoverContent">
                          <p>
                            课程：
                            <span>{{ pmItem.title || '--' }}</span>
                          </p>
                          <p>
                            主题：
                            <span>{{ pmItem.themeName || '--' }}</span>
                          </p>
                          <p>
                            时间：
                            <span>{{ pmItem.studyDate }} {{ pmItem.startTime }}~{{ pmItem.endTime }}</span>
                          </p>
                        </div>
                        <div
                          slot="reference"
                          class="block_middle"
                        >
                          <p>{{ pmItem.title }}</p>
                          <p>{{ pmItem.startTime }} ~ {{ pmItem.endTime }}</p>
                        </div>
                      </el-popover>
                    </div>
                  </template>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 排课 -->
    <ClassArrange
      ref="classArrange"
      :class-name-list="classNameList"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 复制课表 -->
    <ClassArrangeCopy
      ref="classCopy"
      :class-name-list="classNameList"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 编辑排课 -->
    <EditClassArrange
      ref="edit"
      @toUpdateTable="getUpdateTable"
    />
  </div>
</template>
<script src="./classArrangeTable.js"></script>
<style lang="scss" scoped>
.classArrange {
  padding: 20px 20px 0;
  .page_title_text {
    font-weight: 500;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    margin-bottom: 20px;
    padding-left: 0;
    color: #333;
  }
  .commonSearch {
    display: inline-block;
  }
  .btns {
    float: right;
  }
  .schedule_course {
    width: 100%;
    height: calc(100vh - 190px);
    padding: 10px;
    ul {
      list-style: none;
    }
    .schedules_head {
      display: flex;
      padding-left: 8vw;
      li {
        -webkit-box-flex: 1;
        flex: 1;
        line-height: 30px;
        text-align: center;
      }
    }
    .schedules_box {
      overflow: auto;
      height: calc(100% - 30px);
      padding-right: 4px;
      .schedules_scroll {
        border-left: 1px solid #d9d9d9;
        border-top: 1px solid #d9d9d9;
        .date_list {
          display: flex;
          .date_title {
            width: 8vw;
          }
          li {
            text-align: center;
            border-right: 1px solid #d9d9d9;
            border-bottom: 1px solid #d9d9d9;
            line-height: 30px;
          }
          .date_item {
            padding: 1px;
            -webkit-box-flex: 1;
            flex: 1;
            display: flex;
            -webkit-box-direction: normal;
            -webkit-box-orient: vertical;
            flex-direction: column;
            .now {
              color: #46b6ee;
            }
            .day_disabled {
              color: rgba(0, 0, 0, 0.25);
            }
            .class_block:hover {
              background: rgba(29, 175, 228, 0.8);
            }
            .class_block {
              background: #1dafe4;
              color: #fff;
              border-radius: 4px;
              cursor: pointer;
              margin-bottom: 1px;
              -webkit-box-flex: 1;
              position: relative;
              flex: 1;
              transition: opacity 0.3s;
              .block_middle {
                width: 100%;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                p {
                  text-align: center;
                  line-height: 20px;
                }
              }
            }
            .class_block:last-child {
              margin-bottom: 0;
            }
          }
        }
        .data_sourse_list {
          height: 200px;
          .date_title {
            line-height: 200px;
          }
        }
      }
    }
  }
}
.popoverContent {
  p {
    color: #999;
    line-height: 26px;
  }
  span {
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
