/* eslint-disable vue/no-confusing-v-for-v-if */
/*
* prop:
*   tableKey           表格名称定义          String
*   isfullscreen       loading加载全屏显示   Boolean
*   isHighLight        行高亮               Boolean
*   tableHeight        表格高度             Str
*   isMaxHeight        是否把tableHeight设置为MaxHeight       Boolean    默认为true
*   offsetTop          距离窗口上边框的距离   Number
*   isBorder           表格边框             Boolean    默认是false
*   tableLoading       当使用外部数据时加载状态 Boolean
*   dataSource         外部获取数据         Array       必须和tableLoading配合使用
*   pagination         分页                 Obj
*    {
*      show            分页是否显示         Boolean
*    }
*   operation          操作按钮             Obj
*    {
*       width          所占宽度             Str
*       fixed          固定位置             Str         left/right/true,true表示固定在左侧
*       list           操作按钮数组         Array
*        [
*          label       操作按钮名称         Str
*          type        操作按钮的类型       Str          当操作按钮二次确认时用,例如删除 退款 ，类型是normal ，normal1, general: 文本按钮,无确认框
*          minLength   按钮不显示的最小长度  Num
*          method      操作的触发           Function
*          prop        状态参数             Str
*          popoverCon  二次触发的内容       Array        二次确认按钮使用
*            {
*               contentText    二次触发的文本   Str      二次确认都需要使用
*               status         二次触发的状态   Str      类似停用/启用切换的使用
*            }
*        ]
*    }
*  options              表格的操作            Obj
*    {
*       mutiSelect       多选框              Boolean         默认为false
*       index            表格前的序号         Boolean         默认为false
*       apiService       表格的数据请求api    Function
*       params           默认参数             Object
*       isSettingShow    是否出现设置         Boolean
*    }
*  columns              表格的列              Array
*    {
*       hasSort         排序                  Boolean
*       fixed           固定位置              Str         left/right/true, true表示固定在左侧
*       formatter       格式化数据            Function
*       renderHeader    表头渲染              Function
*       prop            对应列内容的字段名     Str
*       label           显示的标题	          Str
*       width           对应列的宽度          Str
*       align           对齐方式	            Str         left/center/right, 默认是left
*       headerAlign     表头对齐方式          Str          left/center/right, 若不设置该项，则使用表格的对齐方式
*       isShowSet       是否显示在设置中      Boolean      仅在设置表头显示使用, 默认为true
*       isShowTooltip   是否显示提示气泡      Boolean      默认为false
*       isColShow       列是否默认显示        Boolean      默认为true
*    }
*/
<template>
  <div class="common_table">
    <el-table
      v-loading="tableLoading ? tableLoading : isloading"
      ref="multipleTable"
      :default-sort="defaultSort"
      :v-loading-fullscreen="isfullscreen"
      :highlight-current-row="isHighLight"
      :height="getHeight()"
      :max-height="getMaxHeight()"
      :fit="true"
      :data="dataSource ? dataSource : tableData"
      :data-all="tableAllData"
      :key="key"
      :border="isBorder"
      element-loading-text="拼命加载中"
      style="width: 100%"
      size="medium"
      stripe
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="handleRowSelect"
    >
      <!-- 空数据显示 -->
      <div
        slot="empty"
        class="empty_data"
      >
        <img
          src="https://img.ishanshan.com/gimg/user/n///1550211410.png"
          alt="无数据"
        >
        <p :style="{marginTop: '10px'}">暂无数据</p>
      </div>
      <!--selection选择框-->
      <template v-if="options">
        <el-table-column
          v-if="options.mutiSelect"
          :selectable="options.selectableFunc"
          type="selection"
          width="50"
        />
        <!--序号-->
        <el-table-column
          v-if="options.index"
          label="序号"
          type="index"
          width="100"
        />
      </template>
      <!--数据源-->
      <el-table-column
        v-for="(column, index) in formThead"
        :sortable="column.hasSort"
        :key="index"
        :formatter="column.formatter"
        :render-header="column.renderHeader"
        :fixed="column.fixed"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.width || '96px'"
        :align="column.align"
        :header-align="column.headerAlign"
        :show-overflow-tooltip="column.isShowTooltip"
      >
        <template slot-scope="scope">
          <template v-if="!column.render">
            <template v-if="column.formatter">
              <template v-if="column.methods">
                <span
                  class="text_btn"
                  @click.prevent="()=>{column.methods(scope.row)}"
                  v-html="column.formatter(scope.row, column)"
                />
              </template>
              <template v-else>
                <span v-html="column.formatter(scope.row, column)" />
              </template>
            </template>
            <template v-else>
              <span :class="column.methods ? 'text_btn' : ''">{{ scope.row[column.prop] }}</span>
            </template>
          </template>
          <template v-else>
            <my-render
              v-if="column.render"
              :row="scope.row"
              :render="column.render"
              :index="index"
              :column="column"
            />
          </template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="operation"
        :width="operation.width"
        :fixed="operation.fixed"
        label="操作"
      >
        <template slot-scope="scope">
          <div
            v-if="operation.list && operation.list.length>3"
            class="operate-group"
          >
            <template v-for="(btn, key) in other">
              <template v-if="!btn.btnId ? true : hasBtn(btn.btnId)">
                <div
                  v-if="btn.popoverCon"
                  :key="key"
                  style="display:inline-block"
                >
                  <Popover
                    v-if="btn.type=='normal'"
                    placement="top"
                    popper-class="myPopover"
                    trigger="click"
                    @method="btn.method(scope.row)"
                  >
                    <div>
                      <i class="el-icon-warning confirm-icon" />
                      <div style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">{{ btn.popoverCon[0].contentText }}</div>
                    </div>
                    <a slot="reference">{{ btn.label }}</a>
                  </Popover>
                  <Popover
                    v-if="btn.type=='normal1'"
                    placement="top"
                    popper-class="myPopover"
                    trigger="click"
                    @method="btn.method(scope.row)"
                  >
                    <div>
                      <i class="el-icon-warning confirm-icon" />
                      <div style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">{{ btn.popoverCon[0].contentText }}</div>
                    </div>
                    <a slot="reference">{{ btn.label }}</a>
                  </Popover>
                  <Popover
                    v-if="btn.type == 'unnormal'"
                    placement="top"
                    trigger="click"
                    popper-class="myPopover"
                    @method="btn.method(scope.row)"
                  >
                    <div>
                      <i class="el-icon-warning confirm-icon" />
                      <div
                        v-if="scope.row[ btn.prop ||'status'] == btn.popoverCon[0].status"
                        style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;"
                      >{{ btn.popoverCon[0].contentText }}</div>
                      <div
                        v-if="scope.row[ btn.prop ||'status'] == btn.popoverCon[1].status"
                        style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;"
                      >{{ btn.popoverCon[1].contentText }}</div>
                    </div>
                    <a
                      v-if="scope.row[ btn.prop ||'status'] == btn.popoverCon[1].status"
                      slot="reference"
                    >{{ btn.label_1 }}</a>
                    <a
                      v-if="scope.row[ btn.prop ||'status'] == btn.popoverCon[0].status"
                      slot="reference"
                    >{{ btn.label_2 }}</a>
                  </Popover>
                  <span
                    v-if="btn.type == 'general'"
                    :class="btn.method ? 'text_btn' : ''"
                    @click="btn.method(scope.row, key)"
                  >{{ (scope.row[ btn.prop ||'status'] == btn.popoverCon[0].status) ? btn.popoverCon[0].contentText :
                  (scope.row[ btn.prop ||'status'] == btn.popoverCon[1].status) ? btn.popoverCon[1].contentText : ''
                  }}</span>
                </div>
                <a
                  v-else
                  slot="reference"
                  :key="key"
                  @click="btn.method(scope.row, key)"
                >{{ btn.label }}</a>
              </template>
            </template>
            <el-dropdown
              trigger="click"
              size="medium"
            >
              <span
                class="el-dropdown-link"
                style="color:#56C0F5"
              >
                <span>更多</span>
                <i class="el-icon-caret-bottom el-icon--right" />
              </span>
              <el-dropdown-menu
                slot="dropdown"
                class="dropMenu"
              >
                <el-dropdown-item
                  v-for="(item,index) in more"
                  :key="index"
                >
                  <template v-if="!item.btnId ? true : hasBtn(item.btnId)">
                    <div
                      v-if="item.popoverCon"
                      :key="key"
                      style="display:inline-block"
                    >
                      <Popover
                        v-if="item.type=='normal'"
                        placement="top"
                        popper-class="myPopover"
                        trigger="click"
                        @method="item.method(scope.row)"
                      >
                        <div>
                          <i class="el-icon-warning confirm-icon" />
                          <div style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">{{ item.popoverCon[0].contentText }}</div>
                        </div>
                        <a slot="reference">{{ item.label }}</a>
                      </Popover>
                      <Popover
                        v-if="item.type=='normal1'"
                        placement="top"
                        popper-class="myPopover"
                        trigger="click"
                        @method="item.method(scope.row)"
                      >
                        <div>
                          <i class="el-icon-warning confirm-icon" />
                          <div style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">{{ item.popoverCon[0].contentText }}</div>
                        </div>
                        <a slot="reference">{{ item.label }}</a>
                      </Popover>
                      <Popover
                        v-if="item.type == 'unnormal'"
                        placement="top"
                        trigger="click"
                        popper-class="myPopover"
                        @method="item.method(scope.row)"
                      >
                        <div>
                          <i class="el-icon-warning confirm-icon" />
                          <div
                            v-if="scope.row[ item.prop ||'status'] == item.popoverCon[0].status"
                            style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;"
                          >{{ item.popoverCon[0].contentText }}</div>
                          <div
                            v-if="scope.row[ item.prop ||'status'] == item.popoverCon[1].status"
                            style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;"
                          >{{ item.popoverCon[1].contentText }}</div>
                        </div>
                        <a
                          v-if="scope.row[ item.prop ||'status'] == item.popoverCon[1].status"
                          slot="reference"
                        >{{ item.label_1 }}</a>
                        <a
                          v-if="scope.row[ item.prop ||'status'] == item.popoverCon[0].status"
                          slot="reference"
                        >{{ item.label_2 }}</a>
                      </Popover>
                      <span
                        v-if="item.type == 'general'"
                        :class="item.method ? 'text_btn' : ''"
                        @click="item.method(scope.row, key)"
                      >{{ (scope.row[ item.prop ||'status'] == item.popoverCon[0].status) ? item.popoverCon[0].contentText :
                      (scope.row[ item.prop ||'status'] == item.popoverCon[1].status) ? item.popoverCon[1].contentText : ''
                      }}</span>
                    </div>
                    <span
                      v-else
                      :class="item.methods ? 'text_btn' : ''"
                      @click="item.method(scope.row, key)"
                    >{{ item.label }}</span>
                  </template>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div
            v-else
            class="operate-group"
          >
            <template v-for="(btn, key) in operation.list">
              <template v-if="!btn.btnId ? true : hasBtn(btn.btnId)">
                <div
                  v-if="btn.popoverCon && !(btn.minLength && btn.minLength === totalCount)"
                  :key="key"
                  style="display:inline-block"
                >
                  <Popover
                    v-if="btn.type=='normal'"
                    placement="top"
                    popper-class="myPopover"
                    trigger="click"
                    @method="btn.method(scope.row)"
                  >
                    <div>
                      <i class="el-icon-warning confirm-icon" />
                      <div style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">{{ btn.popoverCon[0].contentText }}</div>
                    </div>
                    <a slot="reference">{{ btn.label }}</a>
                  </Popover>
                  <Popover
                    v-if="btn.type=='normal1'"
                    :ref="btn.popoverName"
                    placement="top"
                    popper-class="myPopover"
                    trigger="click"
                    @method="btn.method(scope.row)"
                  >
                    <div>
                      <i class="el-icon-warning confirm-icon" />
                      <div style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">{{ btn.popoverCon[0].contentText }}</div>
                    </div>
                    <a slot="reference">{{ btn.label }}</a>
                  </Popover>
                  <!-- 操作后按钮消失 -->
                  <Popover
                    v-if="btn.type == 'singleCancel'"
                    placement="top"
                    trigger="click"
                    popper-class="myPopover"
                    @method="btn.method(scope.row)"
                  >
                    <div>
                      <i class="el-icon-warning confirm-icon" />
                      <div
                        v-if="scope.row[ btn.prop ||'status'] == btn.popoverCon[0].status"
                        style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;"
                      >{{ btn.popoverCon[0].contentText }}</div>
                    </div>
                    <a
                      v-if="scope.row[ btn.prop ||'status'] == btn.popoverCon[0].status ? 'operate_no':''"
                      slot="reference"
                    >{{ btn.label }}</a>
                  </Popover>
                  <Popover
                    v-if="btn.type == 'mulChoose'"
                    placement="top"
                    trigger="click"
                    popper-class="myPopover"
                    @method="btn.method(scope.row)"
                  >
                    <div>
                      <i class="el-icon-warning confirm-icon" />
                      <div style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">{{ btn.popoverCon[0].contentText }}</div>
                    </div>
                    <span slot="reference">
                      <span
                        v-for="(val,index) in btn.popoverCon"
                        :key="index"
                      >
                        <a v-if="scope.row[ btn.prop ||'status'] == val.status">{{ btn.label }}</a>
                      </span>
                    </span>
                  </Popover>
                  <Popover
                    v-if="btn.type == 'unnormal'"
                    placement="top"
                    trigger="click"
                    popper-class="myPopover"
                    @method="btn.method(scope.row)"
                  >
                    <div>
                      <i class="el-icon-warning confirm-icon" />
                      <div
                        v-if="scope.row[ btn.prop ||'status'] == btn.popoverCon[0].status"
                        style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;"
                      >{{ btn.popoverCon[0].contentText }}</div>
                      <div
                        v-if="scope.row[ btn.prop ||'status'] == btn.popoverCon[1].status"
                        style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;"
                      >{{ btn.popoverCon[1].contentText }}</div>
                    </div>
                    <a
                      v-if="scope.row[ btn.prop ||'status'] == btn.popoverCon[0].status"
                      slot="reference"
                    >{{ btn.label_1 }}</a>
                    <a
                      v-if="scope.row[ btn.prop ||'status'] == btn.popoverCon[1].status"
                      slot="reference"
                    >{{ btn.label_2 }}</a>
                  </Popover>
                  <span
                    v-if="btn.type == 'general'"
                    :key="'gbtn_'+key"
                    :class="btn.method ? 'text_btn' : ''"
                    @click="btn.method(scope.row, key)"
                  >{{ (scope.row[ btn.prop ||'status'] == btn.popoverCon[0].status) ? btn.popoverCon[0].contentText :
                  (scope.row[ btn.prop ||'status'] == btn.popoverCon[1].status) ? btn.popoverCon[1].contentText : ''
                  }}</span>
                </div>
                <a
                  v-else-if="!(btn.minLength && btn.minLength === totalCount)"
                  slot="reference"
                  :key="key"
                  :class="scope.row[btn.prop] == btn.text ? '' : btn.class"
                  @click="scope.row[btn.prop] == btn.text ? btn.method(scope.row, key) : ''"
                >{{ btn.label }}</a>
              </template>
            </template>
          </div>
        </template>

      </el-table-column>
    </el-table>

    <!-- 筛选设置 -->
    <el-popover
      v-if="tableKey && tableKey !== 'default'"
      placement="bottom-end"
      visible-arrow
      trigger="click"
      popper-class="setPop"
    >
      <div class="tableList">
        <div class="checkList">
          <template v-for="checkColumn in checkList">
            <el-checkbox-group
              v-if="checkColumn.isShowSet!=false"
              v-model="checkboxVal"
              :key="checkColumn.label"
            >
              <el-checkbox :label="checkColumn.prop">{{ checkColumn.label }}</el-checkbox>
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
        v-show="options && options.isSettingShow"
        slot="reference"
        class="setting"
      >
        <div class="setting_img">
          <el-tooltip
            content="显示表格字段"
            placement="bottom"
            effect="dark"
          >
            <i class="iconfont icon_gb_jgsz" />
          </el-tooltip>
        </div>
      </div>
    </el-popover>

    <!-- 分页-->
    <el-pagination
      v-if="pagination && pagination.show"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :current-page.sync="pageIndex"
      :total="pageCount || totalCount"
      :layout="pagination.noSizes ? 'total, prev, pager, next' : 'total, prev, pager, next, sizes'"
      @size-change="handleSizeChange"
      @current-change="handleIndexChange"
    />
  </div>
</template>
<script>
import { showTableColumn, saveTableColumn } from '@/api/orgSet/tableColumnSet'
import { mapMutations } from 'vuex'
import MyRender from './MyRender'
import Popover from './popover'
export default {
  name: 'CommonTable',
  components: {
    MyRender,
    Popover
  },
  props: {
    /* 表格行内*/
    columns: {
      type: Array,
      default: () => []
    },
    isMaxHeight: {
      type: Boolean,
      default() {
        return true
      }
    },
    /* 是否全屏*/
    isfullscreen: {
      type: Boolean,
      default() {
        return false
      }
    },
    /* 是否点击高亮*/
    isHighLight: {
      type: Boolean,
      default() {
        return false
      }
    },
    /* 表格高度*/
    tableHeight: {
      type: String,
      default() {
        return null
      }
    },
    /* 分页*/
    pagination: {
      type: Object,
      default() { }
    },
    /* 获取表格数据的函数*/
    // getList: Function, //eslint-disable-line
    /* 操作按钮*/
    operation: {
      type: Object,
      default: () => { }
    },
    /* 表格内部的操作*/
    options: {
      type: Object,
      default: () => { }
    },
    isBorder: {
      type: Boolean,
      default() {
        return false
      }
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Array,
      default: undefined
    },
    pageCount: {
      type: Number,
      default: undefined
    },
    defaultSort: {
      type: Object,
      default: undefined
    },
    tableKey: {
      type: String,
      default: 'default'
    },
    offsetTop: {
      type: Number,
      default: 0
    },
    offsetBottom: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formTheadOptions: [], // 表格的列
      checkboxVal: [], // 默认选中的表头
      formThead: this.columns, // 默认表头
      checkList: [], // 勾选表头的列表
      key: 1,
      more: [], // 显示更多的操作
      other: [], // 超过三个操作时的前两个
      tableData: [], // 表格数据
      tableAllData: {}, // 表格所有数据
      totalCount: 0, // 总条数
      pageSize: 10, // 当前页的页数
      pageIndex: 1, // 当前页
      isloading: false, // 是否loading加载
      tipVisibles: [],
      searchValue: {}, // 搜索内容
      flag: false, // 是否覆盖初始值
      maxHeight: undefined
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i.prop) >= 0)
      this.key = this.key + 1// 为了保证table 每次都会重渲
    },
    columns(newProp) {
      this.formThead = newProp
      this.key = this.key + 1
    }
  },
  created() {
    this.formTheadOptions = Object.assign([], this.columns)
    this.checkList = Object.assign([], this.columns)
    const checkArr = Object.assign([], this.columns)
    checkArr.map((item, index) => {
      if (item.isColShow !== false) {
        this.checkboxVal.push(item.prop)
      }
    })
  },
  mounted() {
    if (this.operation) {
      if (this.operation.list && this.operation.list.length > 3) {
        let more = []
        let other = []
        more = Object.assign([], this.operation.list)
        other = Object.assign([], this.operation.list)
        this.more = more.splice(2)
        this.other = other.slice(0, 2)
      }
    }
    if (!this.dataSource && this.options && this.options.apiService && !this.options.noMount) {
      // console.log(this.options.apiService, 'this.options.apiService)')
      this.getList()
    }
    if (this.tableKey && this.tableKey !== 'default') {
      this.showTableColumnFun()
    }
    this.$refs.multipleTable.$refs.bodyWrapper.style['max-height'] = this.tableHeight
  },
  methods: {
    ...mapMutations('commonTable', [
      'SHOW_LOADING',
      'HIDE_LOADING'
    ]),
    getHeight() {
      if (!this.isMaxHeight) {
        return this.tableHeight
      }
    },
    getMaxHeight() {
      let retHeight = 0
      if (this.isMaxHeight) {
        if (this.tableHeight && this.tableHeight.indexOf('calc') >= 0) {
          const height = this.tableHeight.replace('calc', '').replace('100vh', '').replace('(', '').replace(')', '').replace('px', '').replace('-', '')
          retHeight = (document.body.offsetHeight - parseInt(height))
        } else if (this.offsetTop) {
          retHeight = (document.body.offsetHeight - parseInt(this.offsetTop))
        }
      }
      // 判断最大高度
      if (retHeight < 250) {
        retHeight = 250
      }
      return retHeight
    },

    getList(val) {
      this.isloading = true
      this.SHOW_LOADING()
      let params
      if (val) {
        params = {
          pageSize: this.pageSize,
          pageIndex: 0
        }
        Object.assign(params, val)
        if (this.pagination.indexChange) {
          this.pageIndex = val.pageIndex + 1
        } else {
          this.pageIndex = 1
        }
      } else {
        params = {
          ...this.searchValue,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex - 1
        }
      }
      // 带上初始参数，可以覆盖
      if (this.options && this.options.params) {
        params = {
          ...this.options.params,
          ...params
        }
      }
      if (params.pageIndex) {
        this.pageIndex = params.pageIndex + 1
      }
      // console.info('params--->', params)
      if (this.options && this.options.apiService) {
        const func = this.options.apiService
        func(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            // console.info('Table-----data---->', data)
            this.tableData = data.results
            this.tableAllData = data
            if (data.data && data.data.resultCount >= 0) {
              this.totalCount = data.data.resultCount && data.data.resultCount
            }
            if (this.options.selected) {
              this.$nextTick(function() {
                this.toggleRowSelection(this.options.selected)
              })
            }
            this.searchValue = params
          } else {
            this.$message({
              message: data.errorMessage || '列表获取失败',
              type: 'error'
            })
          }
          this.isloading = false
          this.HIDE_LOADING()
        })
      }
    },
    handleSizeChange(size) {
      this.pageSize = size
      if (this.pagination.sizeChange) {
        this.pagination.sizeChange(size)
      } else {
        this.getList()
      }
    },
    handleIndexChange(current) {
      this.pageIndex = current
      if (this.pagination.indexChange) {
        this.pagination.indexChange(current)
      } else {
        this.getList()
      }
    },
    // 多行选中
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val)
    },
    // 排序
    handleSortChange(val) {
      this.$emit('handleSortChange', val)
    },
    // 行单击选中
    handleRowSelect(row, column, event) {
      this.$emit('handleRowSelect', row)
    },
    // 显示该表格选中的列
    showTableColumnFun() {
      const params = {
        tableKey: this.tableKey
      }
      showTableColumn(params).then(res => {
        if (res.data.errorCode === 0) {
          const columnSet = res.data.columnSet
          if (columnSet.length <= 0 && res.data.diy !== 'all') {
            this.checkboxVal = []
          } else {
            if (res.data.columnSet) {
              this.checkboxVal = JSON.parse(res.data.columnSet)
            }
          }
        }
      })
    },
    // 保存选中的列
    saveTableColumnFun() {
      const params = {
        tableKey: this.tableKey,
        columnSet: JSON.stringify(this.checkboxVal)
      }
      saveTableColumn(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.errorMessage)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 清除选择
    clearSelection() {
      this.$refs.multipleTable.clearSelection()
    },
    /* 默认选中某行 */
    toggleRowSelection(row, selected) {
      this.tableData.map((item, index) => {
        for (const i of row) {
          if (item.id === i) {
            this.$refs.multipleTable.toggleRowSelection(this.tableData[index])
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// .common_table /deep/ {
// ::-webkit-scrollbar {
//   width: 6px;
//   height: 6px;
//   background: transparent !important;
//   border-radius: 4px;
// }
// ::-webkit-scrollbar-thumb {
//   background: rgba(70, 182, 238, 0.5);
//   border-radius: 4px;
// }
// ::-webkit-scrollbar-button {
//   height: 0;
//   width: 0;
// }
// }
// 解决空数据不居中问题
.common_table /deep/ {
  .el-table__empty-block {
    width: 100% !important;
  }
}
.empty_data {
  margin: 60px 0;
}
.setting {
  position: absolute;
  top: 1px;
  right: 0;
  height: 44px;
  line-height: 44px;
  border-left: 1px solid #ddd;
  padding: 0 15px;
  background: #f0f2f5;
  cursor: pointer;
  z-index: 11;
  .setting_img {
    display: inline-block;
    position: relative;
    top: 0px;
    content: "";
  }
  &:hover .setting_img {
    color: #46b6ee;
  }
}
.operate-group {
  a {
    color: #1d9df2;
    font-size: 14px;
    cursor: pointer;
    margin-right: 20px;
  }
  a:hover {
    color: #56c0f5;
  }
}
.operate_no {
  display: none;
}
.confirm-icon {
  font-size: 16px;
  color: #ffaa00;
}
</style>

<style scoped>
a {
  color: #1d9df2;
  font-size: 14px;
  cursor: pointer;
  margin-right: 20px;
}
a:hover {
  color: #56c0f5;
}
.text_btn {
  color: #1d9df2;
  font-size: 14px;
  cursor: pointer;
}
.text_btn:hover {
  color: #56c0f5;
}
/* 筛选框 */
.checkList {
  max-height: 300px;
  overflow: auto;
  padding-left: 14px;
}
.checkList >>> .el-checkbox-group {
  margin: 0 20px 10px 0;
}
.save_btn {
  text-align: center;
  border-top: 1px solid #ddd;
  padding-top: 14px;
  margin-top: 4px;
}
.common_table {
  background: #fff;
  position: relative;
}
/*分页 start*/
.common_table >>> .el-pagination {
  text-align: end;
  padding: 7px 5px;
  color: #666;
  font-weight: normal;
  border-top: 1px solid #eee;
}
.common_table >>> .el-pager {
  padding: 5px 0 !important;
}
.common_table >>> .el-pager li.active {
  color: #fff;
  background: #46b6ee;
  border-radius: 4px;
  /*		width:30px;*/
  height: 18px;
  min-width: 18px;
  line-height: 18px;
  font-size: 12px;
}
.common_table >>> .el-pager li.active:hover {
  color: #fff !important;
}
.common_table >>> .el-pager li {
  height: 18px;
  font-size: 12px;
  /*		width: 30px;*/
  min-width: 18px;
  line-height: 18px;
}
.common_table >>> .el-pagination__sizes {
  height: 22px;
  line-height: 28px;
  margin: 0 10px;
}
.common_table >>> .el-pagination .el-select .el-input {
  width: 82px;
}
.common_table >>> .el-pagination__jump {
  margin-left: 10px;
  font-size: 12px;
  color: #666;
}
.common_table >>> .el-pagination__editor.el-input .el-input__inner {
  height: 22px;
  width: 36px;
}
.common_table >>> .el-pager li:hover {
  color: #46b6ee !important;
}
.common_table >>> .el-pagination button,
.el-pagination span:not([class*="suffix"]) {
  font-size: 12px;
}
.common_table >>> .el-input--mini .el-input__inner {
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  color: #666;
}
.el-select-dropdown__item.selected {
  color: #46b6ee !important;
}
.common_table >>> .el-select .el-input.is-focus .el-input__inner {
  border-color: #46b6ee;
}
.common_table >>> .el-pagination__sizes .el-input .el-input__inner:hover {
  border-color: #46b6ee;
}
.common_table >>> .el-pagination__jump .el-input .el-input__inner:focus {
  border-color: #46b6ee;
}
.common_table >>> .el-select .el-input__inner:focus {
  border-color: #ddd;
}
/*end*/

.common_table >>> .el-table td,
.el-table th.is-leaf {
  border-bottom: 0;
}
.common_table >>> .el-table th {
  background: #f6f7f9;
  font-size: 14px;
  color: #333;
  line-height: 44px;
  padding: 0;
  font-weight: 500;
}
.common_table >>> .el-table td {
  font-size: 14px;
  color: #666;
  line-height: 44px;
  padding: 0;
  font-weight: 400;
}
.common_table >>> .el-table__row.hover-row td {
  background: #ecf7fd;
}
.common_table >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #ecf7fd;
}
.common_table >>> tr.el-table__row.el-table__row--striped:hover {
  background: #ecf7fd !important;
}
.common_table >>> .el-table--striped .el-table__body tr.el-table__row--striped {
  background: #fcfcfd;
}
.common_table >>> .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #46b6ee;
}
.common_table >>> .el-checkbox__input.is-checked .el-checkbox__inner {
  background: #46b6ee;
  border-color: #46b6ee;
}
.common_table >>> .el-checkbox__inner:hover {
  border-color: #46b6ee;
}
.common_table >>> .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #46b6ee;
  border-color: #46b6ee;
}
.common_table >>> .el-table-column--selection .cell {
  padding-left: 26px;
}
.common_table >>> .el-table__fixed-right::before,
.el-table__fixed::before {
  background-color: transparent;
}
.common_table >>> .el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: transparent;
}
.common_table >>> .el-table .descending .sort-caret.descending {
  border-top-color: #46b6ee;
}
.common_table >>> .el-table .ascending .sort-caret.ascending {
  border-bottom-color: #46b6ee;
}
.common_table >>> .el-table .sort-caret.ascending {
  border-bottom-color: #ccc;
}
.common_table >>> .el-table .sort-caret.descending {
  border-top-color: #ccc;
}
/*loading*/
.common_table >>> .el-loading-spinner .path {
  stroke: #46b6ee;
}
.common_table >>> .el-loading-spinner .el-loading-text {
  color: #46b6ee;
}
.common_table >>> .el-table .cell {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  height: 44px;
  /* line-height: 44px; */
  /* display: -webkit-box; */
  /* white-space: normal !important; */
}
.common_table >>> .el-table .cell,
.el-table th div,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding-left: 20px;
}
.common_table >>> .el-icon--right {
  margin-left: -2px;
}
.dropMenu.el-popper[x-placement^="bottom"] {
  margin-top: 0;
}
.dropMenu >>> .popper__arrow {
  display: none;
}
</style>
<style lang="scss">
@import "@/styles/mixin.scss";

.common_table .el-table .cell {
  @include flex();
  @include itemCenter(center);
  span {
    // width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.common_table .el-table td.is-center .cell,
.common_table .el-table th.is-center .cell {
  @include flexCenter(center);
}
.common_table .el-table td.is-right .cell,
.common_table .el-table th.is-right .cell {
  @include flexCenter(flex-end);
}
.setPop {
  padding: 14px 0;
}
</style>
