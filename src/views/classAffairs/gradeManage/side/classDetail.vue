<template>
  <side-dialog :visible.sync="sideDialogShow">
    <div class="order_detail">
      <div class="info_head">
        <div class="head_top">
          <div class="top_left">
            <img src="https://img.ishanshan.com/gimg/n/20190330/32ae2383cdee53ab3e3cabb119613fbe">
            <div class="name">
              <span>班级</span>
            </div>
          </div>
          <div class="top_right">
            <el-button
              type="primary"
              style="margin-right:10px"
              @click="editInfo"
            >编辑</el-button>
            <el-popover
              v-model="delVisible"
              placement="top"
              width="160"
            >
              <p style="margin:8px 0 20px 0">确认删除么？</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  class="delete_btn"
                  @click="delVisible = false"
                >取消</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  class="edit_btn"
                  @click="sureDelete"
                >确认</el-button>
              </div>
              <el-button
                slot="reference"
                class="cancel_btn"
              >删除</el-button>
            </el-popover>
          </div>
        </div>
        <div class="info_content">
          <div class="info_content_item">
            <span>班级名称：</span>
            <span>{{ rowInfo.clsName }}</span>
          </div>
          <div class="info_content_item">
            <span>托班类型：</span>
            <span>{{ rowInfo.nurseryType }}</span>
          </div>
          <div class="info_content_item">
            <span>主教：</span>
            <span>{{ rowInfo.mteachers }}</span>
          </div>
          <div class="info_content_item">
            <span>助教：</span>
            <span>{{ rowInfo.ateachers || '--' }}</span>
          </div>
          <div class="info_content_item">
            <span>保育员：</span>
            <span>{{ rowInfo.nurserys || '--' }}</span>
          </div>
          <div class="info_content_item">
            <span>人数：</span>
            <span>{{ rowInfo.clsNumber || '--' }}</span>
          </div>
        </div>
      </div>
      <div class="info_detail">
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="班级学员"
            name="1"
          >
            <div class="tab_item">
              <el-button
                type="primary"
                style="margin-bottom:20px"
                @click="addStuFunc"
              >添加学员</el-button>
              <ClassStuInfo
                :stu-table-data="stuTableData"
                :row-info="rowInfo"
                @toUpdateStuList="getUpdateStuList"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </side-dialog>
</template>
<script>
import SideDialog from '@/components/SideDialog'
import ClassStuInfo from './classStuInfo'
import { clsDetailStuInfo, excistStu, deleteClass } from '@/api/nurseryClass/gradeManage'
export default {
  components: {
    SideDialog,
    ClassStuInfo
  },
  data() {
    return {
      sideDialogShow: false,
      rowInfo: {}, // 该行数据
      activeName: '1',
      stuList: [], // 学员已选中的列表
      delVisible: false, // 是否删除
      stuTableData: []
    }
  },
  methods: {
    show(val) {
      this.rowInfo = val
      this.sideDialogShow = true
      const params = {
        id: val.id
      }
      clsDetailStuInfo(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.stuTableData = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 更新学员表格数据 */
    getUpdateStuList(row) {
      this.show(row)
    },
    close() {
      this.sideDialogShow = false
    },
    /* 添加学员 */
    addStuFunc() {
      this.$emit('toAddStu', this.stuTableData, this.rowInfo)
    },
    /* 编辑 */
    editInfo() {
      this.$emit('toEditStuInfo', this.rowInfo.id)
    },
    /* 删除 */
    sureDelete() {
      excistStu({ id: this.rowInfo.id }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          if (data.excist) {
            this.$emit('toDelClass', this.rowInfo)
          } else {
            deleteClass({ id: this.rowInfo.id }).then(res => {
              const ret = res.data
              if (ret.errorCode === 0) {
                this.delVisible = false
                this.$emit('toDelUpdateTable')
                this.$message.success(ret.errorMessage)
              } else {
                this.$message.error(ret.errorMessage || '删除班级失败')
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.order_detail {
  height: 100%;
  .el-tabs__content {
    padding-right: 0;
  }
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
      padding: 20px;
      -webkit-box-pack: justify;
      justify-content: space-between;
      .top_right {
        -webkit-box-pack: end;
        justify-content: flex-end;
        width: 50%;
        display: flex;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        align-items: center;
      }
      .top_left {
        width: 50%;
        display: flex;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          margin-right: 20px;
        }
        .name {
          font-size: 16px;
          color: #333;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      .top_right {
        -webkit-box-pack: end;
        justify-content: flex-end;
        width: 50%;
        display: flex;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        align-items: center;
      }
    }
    .info_content {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      padding: 0 20px 0 80px;
      flex-wrap: wrap;
      :nth-child(4) {
        padding-left: 28px;
        margin-bottom: 0 !important;
      }
      :nth-child(5) {
        padding-left: 14px;
        margin-bottom: 0 !important;
      }
      :nth-child(6) {
        margin-bottom: 0 !important;
      }
      .info_content_item {
        width: calc((100% - 80px) / 3);
        margin-right: 20px;
        margin-bottom: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        :first-child {
          color: #999;
        }
        :last-child {
          color: #666;
        }
      }
    }
  }
  .tab_item {
    padding: 10px 0px 0 20px;
  }
}
</style>
