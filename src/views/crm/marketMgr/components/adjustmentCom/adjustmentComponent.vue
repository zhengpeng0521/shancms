<template>
  <div class="adjustment_container">
    <!-- 搜索栏 -->
    <div class="search">
      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <div>
        <el-button
          class="green_btn"
          @click="addNewDialog()"
        >新增</el-button>
      </div>
    </div>
    <!-- 已选数据操作 -->
    <div class="table_checked_box">
      <span class="table_checked_text">已选
        <span class="checked_nums">{{ (checkedData && checkedData.length) || '0' }}</span>条数据
      </span>
      <span>
        <el-popover
          v-model="visible2"
          placement="top"
          width="160"
        >
          <p class="pop_content">确定要删除吗？</p>
          <div class="br">
            <el-button
              size="mini"
              class="delete_btn"
              @click="visible2 = false"
            >取消</el-button>
            <el-button
              type="primary"
              size="mini"
              class="edit_btn"
              @click="deleteStockAction"
            >确定</el-button>
          </div>
          <el-button
            slot="reference"
            class="cancel_btn edit_btn"
            size="mini"
          >删除</el-button>
        </el-popover>
      </span>
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      table-key="crm_inventory_adjust"
      @handleSelectionChange="selectionChange"
    />
    <!-- 新增弹框 -->
    <el-dialog
      :visible.sync="addNewDialogShow"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="700px"
      @close="cancelDialog('addNewForm')"
    >
      <el-form
        ref="addNewForm"
        :rules="rules"
        :model="addNewData"
        label-suffix=":"
        label-width="120px"
      >
        <div class="add_form_box">
          <el-form-item
            label="库存调整日期"
            prop="date"
          >
            <el-date-picker
              v-model="addNewData.date"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请输入库存调整日期"
            />
          </el-form-item>
        </div>
        <span class="tip_text">*若数量输入正数则增加库存，若输入负数则减少库存</span>
        <div class="dialog_table_box">
          <el-table
            :data="addDataTble"
            style="width: 100%"
            border
            stripe
          >
            <el-table-column
              label="物品名称"
              prop="product"
              width="180"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.product"
                  :loading="loading"
                  :disabled="dialogTitle === '编辑'"
                  value-key="id"
                  size="small"
                  placeholder="物品名称"
                  @change="(value) => {nameChange(scope.$index, value)}"
                >
                  <el-option
                    v-for="item in goodList"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="单位"
              prop="unit"
              width="65"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.unit }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="数量"
              prop="num"
              width="110"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.num"
                  controls-position="right"
                  size="small"
                  placeholder="数量"
                  class="stock-all-width"
                  @change="(value) => {numChange(scope.$index, value)}"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="进货单价"
              prop="purPrice"
              width="120"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.purPrice"
                  :min="0.00"
                  :precision="2"
                  controls-position="right"
                  size="small"
                  placeholder="进货单价"
                  class="stock-all-width"
                  @change="(value) => {priceChange(scope.$index, value)}"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="总价"
              prop="total"
              align="right"
            >
              <template slot-scope="scope">
                <span>{{ parseFloat(scope.row.total).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-button
                  v-if="!rowId && addDataTble && addDataTble.length > 1"
                  type="text"
                  @click="deleteTableRow(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="!rowId"
            class="addBtn"
            type="text"
            @click="addTableRow()"
          >
            <img src="https://img.ishanshan.com/gimg/n/20190411/a673728401ab2d7c6416aed1559b59c2">
            <div class="add_text">新增</div>
          </div>
        </div>
        <el-form-item
          label="合计"
          prop="allTotal"
          class="total"
        >
          <span>{{ parseFloat(addNewData.allTotal).toFixed(2) }}</span>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="addNewData.remark"
            clearable
            type="textarea"
            maxlength="500"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :loading="loading"
          class="cancel_btn"
          @click="cancelDialog('addNewForm')"
        >取 消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="submitForm('addNewForm')"
        >保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src='./adjustmentComponent.js'></script>

<style lang="scss" scoped>
.adjustment_container /deep/ {
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: none;
  }
  .el-table th {
    background: rgba(240, 242, 245, 0.6);
    font-size: 14px;
    color: #333;
    line-height: 44px;
    padding: 0;
    font-weight: 500;
  }
  .el-table--border th {
    border-right: 0;
  }
  .el-table--border td {
    border-right: 0;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: rgba(240, 242, 245, 0.2);
  }
}
.search {
  display: flex;
  justify-content: space-between;
  height: 48px;
}
.addBtn {
  margin-top: 10px;
  display: flex;
  cursor: pointer;
  .add_text {
    margin-left: 4px;
    color: #46b6ee;
    line-height: 22px;
  }
}
.total {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}
.table_checked_box {
  margin-bottom: 16px;
  .table_checked_text {
    margin-right: 10px;
  }
  .checked_nums {
    margin: 0 3px;
    color: #46b6ee;
  }
}
.add_form_box {
  display: flex;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 180px;
  }
}
.tip_text {
  font-size: 12px;
  color: #f04134;
  margin: 0 0 10px 10px;
  display: inline-block;
}
.stock-all-width {
  width: 100%;
}
.adjustment_container /deep/ {
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 10px;
    padding-right: 40px;
    text-align: left;
  }
}
</style>
<style lang="scss">
.adjustment_container {
  .date {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
