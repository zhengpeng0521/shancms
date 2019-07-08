<template>
  <div>
    <el-dialog
      :visible.sync="contractOrderDialogShow"
      :append-to-body="true"
      :close-on-click-modal="false"
      title="合同订单"
      class="contractOrderDialog_container_shy"
      @close="cancelDialog('contractOrderForm')"
    >
      <el-form
        ref="contractOrderForm"
        :model="contractOrderData"
        :rules="rules"
        label-width="100px"
      >

        <!-- 订单类型 -->
        <el-form-item
          label="订单类型:"
          prop="orderType"
        >
          <el-radio-group
            v-model="contractOrderData.orderType"
            :disabled="disabledType"
            @change="orderTypeValue(contractOrderData.orderType)"
          >
            <el-radio label="2">课时包</el-radio>
            <el-radio label="3">托班</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="rowInfo"
          label="学员姓名:"
        >
          <span>{{ rowInfo.name }}</span>
          <a
            v-if="studentType ==='0'"
            style="color: #1d9df2;"
            @click="showReadingStuDialog"
          >若已是在读学员，点此处将信息合并 </a>
        </el-form-item>
        <el-form-item
          v-if="isSelectReadingStu"
          label="在读学员"
          prop="targetStuId"
        >
          <span>{{ readStuName }}</span>
        </el-form-item>

        <!-- 合同编号 -->
        <el-form-item
          label="合同编号:"
          prop="orderNum"
        >
          <el-input
            v-model="contractOrderData.orderNum"
            :disabled="disabledType"
            clearable
            placeholder="请输入合同编号"
            style="width: 60%"
          />
          <div class="input_span_text">合同保存之后不可修改，请仔细核对！</div>
        </el-form-item>

        <!-- 选择学员 -->
        <el-form-item
          v-if="!rowInfo"
          label="选择学员:"
          prop="stuId"
        >
          <el-select
            v-model="contractOrderData.stuId"
            :disabled="disabledType"
            placeholder="请输入学员姓名"
            clearable
            filterable
            style="width:60%"
            @change="stuIdChange(contractOrderData.stuId)"
          >
            <el-option
              v-for="item in allStudentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span
            v-if="!disabledType"
            style="color: #46B6EE;margin-left: 10px;cursor: pointer;"
            @click="openSearchDialog()"
          >精确查找</span>
        </el-form-item>

        <!-- 学员账户 -->
        <div v-if="studentType==='1' && isShowCardNum">
          <el-form-item
            label="学员账户:"
            prop="stuCardId"
          >
            <span>{{ contractOrderData.stuCardId }}</span>
          </el-form-item>
        </div>

        <!-- 签约家长 -->
        <el-form-item
          label="签约家长:"
          prop="parentId"
        >
          <el-select
            v-model="contractOrderData.parentId"
            :disabled="disabledType"
            placeholder="请输入家长姓名或手机号进行搜索"
            clearable
            filterable
            style="width:60%"
          >
            <el-option
              v-for="item in allParentList"
              :key="item.id"
              :label="item.parentName + '(' + item.mobile + ')'"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <!-- 签约类型 -->
        <el-form-item
          label="签约类型:"
          prop="signType"
        >
          <el-radio-group
            v-model="contractOrderData.signType"
            :disabled="disabledType"
          >
            <el-radio label="0">新签约</el-radio>

            <el-tooltip
              :disabled="disabledsignTypeToolTip"
              class="item"
              effect="dark"
              content="根据续约规则不能续约"
              placement="top-start"
            >
              <el-radio
                v-if="isShowContract"
                :disabled="disabledsignType"
                label="1"
                @change="signTypetwo"
              >续约
              </el-radio>
            </el-tooltip>

            <el-radio
              v-if="isShowzhuanjie"
              label="2"
            >新签-转介绍</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 转介绍人 -->
        <div v-if="contractOrderData.signType == 2">
          <el-form-item
            label="转介绍人:"
            prop="introduce"
          >
            <el-select
              v-model="contractOrderData.introduce"
              :disabled="disabledType"
              placeholder="请输入家长姓名或手机号进行搜索"
              clearable
              filterable
              style="width:60%"
            >
              <el-option
                v-for="item in everyParentList"
                :key="item.id"
                :label="item.parentName + '(' + item.mobile + ')'"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <!-- 关联销售 -->
        <div class="link_table_sell">
          <el-form-item
            label="关联销售:"
            prop="sellInfo"
          >
            <label
              slot="label"
              class="sell_info_required"
            >关联销售:</label>
            <el-form
              v-for="(child, index) of contractOrderData.sellTableList"
              :key="index + 'sell'"
              :inline="true"
              style="margin-bottom: 10px;"
            >
              <el-form-item
                label="姓名"
              >
                <el-select
                  v-model="child.userId"
                  clearable
                  filterable
                  placeholder="请选择姓名"
                >
                  <el-option
                    v-for="item in allTenantUserList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id + ''"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :prop="'child.' + index + '.rate'"
                :rules="[{type:'number', min:1, max: 100, trigger: 'blur'}]"
                label="占比"
              >
                <el-input
                  v-model.number="child.rate"
                  clearable
                  placeholder="占比"
                  style="width: 70%"
                />
              </el-form-item>
              <el-form-item label="%" style="margin-left: -10%"/>
              <el-form-item
                v-show="delSellTableRowHidden"
              >
                <a style="color: #46b6ee;" @click="delSellTableRow(index)">删除</a>
              </el-form-item>
            </el-form>
          </el-form-item>
        </div>

        <div class="class_time_add" style="margin-left: 100px">
          <a>
            <div
              style="float:left;display:flex"
              @click="addSellInfo()"
            >
              <img src="https://img.ishanshan.com/gimg/n/20190322/e6c073e90ca20cf3ec74d6e580c35efb">
              <div class="add_text">新增</div>
            </div>
          </a>
        </div>

        <!-- 课时套餐切换 -->
        <div class="switchClass">
          <el-checkbox-group
            v-model="checkedCities"
            :disabled="disabledType"
            :min="1"
            :max="3"
            @change="checkedCitiesChange"
          >
            <!-- 课时套餐 -->
            <el-checkbox
              label="0"
              @change="goodsClassChange"
            >{{ contractOrderData.orderType == '3' ? '托班套餐' : '课时套餐' }}</el-checkbox>
            <!-- 物资 -->
            <el-checkbox
              label="1"
              @change="goodsMateChange"
            >物资</el-checkbox>
            <!-- 赠送课时 -->
            <el-checkbox
              label="2"
              @change="giveClassChange"
            >{{ contractOrderData.orderType == '3' ? '赠送天数' : '赠送课时' }}</el-checkbox>
          </el-checkbox-group>
        </div>

        <!-- 商品 -->
        <span class="form_txt" />
        <span style="font-size: 16px;color: #333; margin-left: 10px;">商品</span>
        <!-- 课时包 -->
        <div v-if="isShowGoodsClass">
          <div
            class="shop_box_top shop_table_margin"
            style="margin-top:10px;"
          >
            <ul class="shop_table_head">
              <li v-if="contractOrderData.orderType == 2">课时包</li>
              <li v-if="contractOrderData.orderType == 3">托班套餐</li>
              <li>标准价格</li>
              <li>数量</li>
              <li>合计价格</li>
              <li>优惠</li>
              <li>实收价格</li>
              <li>操作</li>
            </ul>
          </div>
          <div class="shop_table_margin">
            <ul
              v-for="(child, index) of contractOrderData.shopTableList"
              :key="'shop' + index"
              class="shop_table_row"
            >
              <li>
                <el-form-item
                  :prop="'shopTableList.' + index +'.pid'"
                  style="margin-bottom: 0"
                >
                  <el-select
                    v-model="child.pid"
                    :placeholder="contractOrderData.orderType == 2?'请选课时包':'请选择套餐'"
                    filterable
                    @change="(value) => {classChangeValue(value, index)}"
                  >
                    <el-option
                      v-for="item in allClassesList"
                      :key="item.id + '_allClassesList'"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </li>
              <li>{{ child.price }}元</li>
              <li>
                <el-form-item
                  :prop="'shopTableList.' + index + '.amount'"
                  :rules="shopTableListRules.shopTableListAmount"
                >
                  <el-input
                    v-model.number="child.amount"
                    placeholder="数量"
                    @input="classAmountChange(child.amount, child)"
                  />
                </el-form-item>
              </li>
              <li>{{ child.aTotalPrice }}元</li>
              <li :title="child.preferentialPrice">{{ child.preferentialPrice }}</li>
              <li>
                <el-form-item prop="money">
                  <el-input
                    v-model="child.money"
                    :disabled="disabledClass"
                    clearable
                    placeholder="价格"
                    @input="priceChange(index, 'class')"
                  />
                  <span class="right_yuan">元</span>
                </el-form-item>
              </li>
              <li>
                <a
                  v-if="(contractOrderData.goodsTableList && contractOrderData.goodsTableList.length > 0) || (contractOrderData.shopTableList && contractOrderData.shopTableList.length > 1)"
                  @click="delShopTableRow(index)"
                >删除</a>
              </li>
            </ul>
          </div>
          <div
            v-if="contractOrderData.orderType == 2 || (contractOrderData.orderType == 3 && contractOrderData.shopTableList.length < 1)"
            class="class_time_add shop_table_margin"
          >
            <div
              style="float:left;display:flex"
              @click="addShopClass()"
            >
              <img src="https://img.ishanshan.com/gimg/n/20190322/e6c073e90ca20cf3ec74d6e580c35efb">
              <div class="add_text">新增</div>
            </div>
          </div>
        </div>

        <!-- 物资 -->
        <div v-if="isShowGoodsMate">
          <div
            class="shop_box_top shop_table_margin"
            style="margin-top:14px;"
          >
            <ul class="shop_table_head">
              <li>物资</li>
              <li>标准价格</li>
              <li>数量</li>
              <li>合计价格</li>
              <li>优惠</li>
              <li>实收价格</li>
              <li>操作</li>
            </ul>
          </div>
          <div class="shop_table_margin">
            <ul
              v-for="(child, index) of contractOrderData.goodsTableList"
              :key="'goods' + index"
              class="shop_table_row"
            >
              <li>
                <el-form-item
                  prop="taId"
                  style="margin-bottom:0"
                >
                  <el-select
                    v-model="child.taId"
                    placeholder="请选择物资"
                    filterable
                    @change="(value) => {materailChangeValue(value, index)}"
                  >
                    <el-option
                      v-for="item in allTeachList"
                      :key="item.id + 'allTeachList'"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </li>
              <li>{{ child.price }}元</li>
              <li>
                <el-form-item
                  :prop="'goodsTableList.' + index + '.amount'"
                  :rules="goodsTableListRules.goodsTableListAmount"
                >
                  <el-input
                    v-model.number="child.amount"
                    clearable
                    placeholder="数量"
                    @keyup.native="materialAmount(child.amount, child)"
                  />
                </el-form-item>
              </li>
              <li>{{ child.aTotalPrice }}元</li>
              <li :title="child.preferentialPrice">{{ child.preferentialPrice }}</li>
              <li>
                <el-form-item prop="money">
                  <el-input
                    v-model="child.money"
                    :disabled="disabledMaterial"
                    clearable
                    placeholder="价格"
                    @input="priceChange(index, 'goods')"
                  />
                  <span class="right_yuan">元</span>
                </el-form-item>
              </li>
              <li>
                <a
                  v-if="(contractOrderData.shopTableList && contractOrderData.shopTableList.length > 0) || (contractOrderData.goodsTableList && contractOrderData.goodsTableList.length > 1)"
                  @click="delGoodsTableRow(index)"
                >删除</a>
              </li>
            </ul>
          </div>
          <div class="class_time_add shop_table_margin">
            <div
              style="float:left;display:flex"
              @click="addGoodsClass()"
            >
              <img src="https://img.ishanshan.com/gimg/n/20190322/e6c073e90ca20cf3ec74d6e580c35efb">
              <div class="add_text">新增</div>
            </div>
          </div>
        </div>

        <!-- 总金额 -->
        <div
          class="shop_box_top shop_table_margin shop_all_table"
          style="margin-bottom: 20px;"
        >
          <div>
            <span>总金额:</span>
            <span>￥{{ contractOrderData.atotalPrice || '0.0' }}</span>
          </div>
          <div>
            <span>总实收:</span>
            <span class="red_price_color">￥{{ contractOrderData.atotalRealPrice || '0.0' }}</span>
          </div>
        </div>

        <!-- 赠课类型 -->
        <div v-if="isGiveInfoShow">
          <el-form-item
            label="赠课类型:"
            prop="giveType"
          >
            <el-radio-group
              v-model="contractOrderData.giveType"
              @change="giveTypeValue(contractOrderData.giveType)"
            >
              <el-radio label="1">通用课时</el-radio>
              <el-radio label="2">专用课时</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="isSelectClassShow">
            <el-form-item
              :rules="[
                { required: true, message: '请选择课程', trigger: 'change' }
              ]"
              label="选择课程"
              prop="selectClasses"
            >
              <el-select
                v-model="contractOrderData.selectClasses"
                placeholder="请选择课程"
                filterable
                style="width: 60%"
              >
                <el-option
                  v-for="item in allCourseDataList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>

          <!-- 课时包赠送课时 -->
          <el-form-item
            label="赠送课时:"
            prop="giveTime"
          >
            <el-input
              v-model.number="contractOrderData.giveTime"
              clearable
              placeholder="请输入赠送课时，非负数，可精确到小数点后2位"
              style="width:60%"
            />
            <!-- <div class="input_span_text">非负数，可精确到小数点后2位</div> -->
          </el-form-item>
          <el-form-item
            label="赠课总成本:"
            prop="giveAllPrice"
          >
            <el-input
              v-model.number="contractOrderData.giveAllPrice"
              clearable
              placeholder="请输入赠课总成本"
              style="width:60%"
            />
            <div class="input_span_text">(用于统计赠课消耗的成本，不计入合同总额，也不计入消课统计)</div>
          </el-form-item>
        </div>
        <!-- 托班赠送天数 -->
        <div v-if="isGiveInfoFalse">
          <el-form-item
            label="赠送天数:"
            prop="giveDatas"
          >
            <el-input
              v-model.number="contractOrderData.giveDatas"
              clearable
              placeholder="请输入赠送天数"
              style="width:60%"
              @blur="giveDatasChange"
            />
            <div class="input_span_text">请填写正整数</div>
          </el-form-item>
        </div>

        <!--赠课原因  -->
        <el-form-item
          v-if="isGiveInfoShow || isGiveInfoFalse"
          label="赠课原因:"
          prop="giveBeacuse"
        >
          <el-input
            v-model="contractOrderData.giveBeacuse"
            clearable
            placeholder="请输入赠课原因"
            style="width:60%"
          />
          <br>
          <span class="quickSelect_text">
            快速选择:
            <span
              v-for="(item, index) of giveClassBecause"
              :key="index + '_giveClassBecause'"
              @click="quickGiveClassFun(item.key)"
            >{{ item.value }}</span>
          </span>
        </el-form-item>

        <!-- 合同附件 -->
        <el-form-item
          label="合同附件:"
          prop="txt"
        >
          <el-upload
            :class="{'disabled ': imgVisible}"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="onChange"
            :before-upload="beforeAvatarUpload"
            :limit="9"
            :file-list="fileList"
            :disabled="disabledType"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            action="https://imgsrc.ishanshan.com/gimg/upload"
            list-type="picture-card"
          >
            <i class="el-icon-plus" />
            <span>上传照片</span>
          </el-upload>
          <el-dialog :visible.sync="classImgVisible">
            <img
              :src="contractOrderData.imgUrl"
              alt=""
            >
          </el-dialog>
          <span class="input_span_text">最多9张，支持png,jpeg,gif格式的图片，不大于5M</span>
        </el-form-item>

        <!-- 合同签订日 -->
        <el-form-item
          label="合同签订日:"
          prop="data"
        >
          <el-date-picker
            v-model="contractOrderData.data"
            :picker-options="dateOptions"
            type="date"
            clearable
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请输入合同签订日"
            style="width:60%"
          />
        </el-form-item>

        <!-- 托班合同期限 -->
        <el-form-item
          v-if="contractOrderData.orderType == '2' ? true : false"
          label="合同期限:"
          prop="picker"
        >
          <el-date-picker
            v-model="contractOrderData.picker"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:60%"
            @change="conPickerChange"
          />
        </el-form-item>

        <!-- 课时包合同期限 -->
        <el-form-item
          v-if="contractOrderData.orderType == '3' ? true : false"
          :rules="[
            { required: true, message: '请输入合同期限', trigger: 'blur' },
          ]"
          label="合同期限:"
          prop="startTime"
        >
          <el-date-picker
            v-model="contractOrderData.startTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            style="width:150px"
            placeholder="开始日期"
            @change="changeStartDate"
          />
          <span style="display: inline-block;">
            <span style="display: inline-block;vertical-align: top; width: 18px;">至</span>
            <span>
              <el-date-picker
                v-model="contractOrderData.endTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                disabled
                style="width:150px"
                placeholder="结束日期"
              />
              <!-- <el-date-picker
              v-model="contractOrderData.picker"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:60%"
              @change="conPickerChange"
            /> -->
            </span>
          </span>
        </el-form-item>
        <el-checkbox
          v-if="isExpireCheckShow"
          v-model="contractOrderData.expireCheck"
          style="padding-left: 40px;margin-bottom: 10px;"
          @change="expireCheckChange"
        >合同过期课时自动作废</el-checkbox>

        <!-- 备注 -->
        <el-form-item
          label="备注:"
          prop="detail"
        >
          <el-input
            v-model="contractOrderData.detail"
            clearable
            type="textarea"
            placeholder="请输入备注"
            style="width:60%"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('contractOrderForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('contractOrderForm')"
        >保 存</el-button>
        <el-button
          :disabled="disabledSaveMoneyType"
          type="primary"
          @click="saveGathingForm('contractOrderForm')"
        >保存并收款</el-button>
      </span>
    </el-dialog>
    <!-- 精确查找弹框组件 -->
    <ExactSearchDialog
      ref="exactSearchDialog"
      @toStudentName="getStudentName"
    />
    <!-- 保存收款弹框 -->
    <GatheringDialog ref="gatheringDialog" />

    <!-- 在读学员 -->
    <ReadingStuDialog
      ref="readingStuDialog"
      @afterSumit="afterReadingStuDialogSumit"
    />
  </div>
</template>

<script src="./contractOrderDialog.js" ></script>

<style lang="scss" scoped>
.switchClass{
  margin-left: 20px;
  margin-top: 20px;
  padding: 20px;
}
.link_table_sell { // 关联销售样式
  .sell_info_required:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
}
.shop_table_row li {
  height: 52px;
}
.shop_table_row li:nth-of-type(1) {
  width: 125px;
}
</style>

