
<template>
  <div style="margin-left:100px">
    <h2>size=mini按钮</h2>
    <el-row>
      <el-button
        class="cancel_btn"
        size="mini"
      >取消</el-button>
      <el-button
        size="mini"
        type="primary"
      >确定</el-button>

      <el-button class="green_btn">健康绿色</el-button>
      <el-button
        size="mini"
        disabled="true"
      >禁用</el-button>

      <el-button
        size="mini"
        type="danger"
      >危险</el-button>

      <el-button type="text">文字按钮</el-button>
      <el-button
        type="text"
        disabled
      >文字按钮</el-button>

      <el-button
        type="primary"
        class="search_btn"
        size="mini"
      >
        <img src="//img.ishanshan.com/gimg/n/20181114/77ed55e16b08f3a7b9d986e75a2c1d7c">
      </el-button>

      <el-button
        class="refresh_btn cancel_btn"
        size="mini"
      >
        <img src="//img.ishanshan.com/gimg/n/20181114/4967edad7d0d83947070c9a404a3b216">
      </el-button>
      <h2>编辑更小按钮</h2>
      <el-button
        class="cancel_btn edit_btn"
        size="mini"
      >编辑</el-button>

      <el-button
        class="cancel_btn edit_btn"
        disabled
        size="mini"
      >编辑</el-button>

      <el-button
        class="delete_btn"
        size="mini"
      >删除</el-button>

      <el-button
        class="delete_btn"
        disabled="true"
        size="mini"
      >删除</el-button>

      <el-button
        class="edit_btn"
        type="primary"
        size="mini"
      >确定</el-button>

    </el-row>
    <h2>Dialog</h2>
    <el-button
      class="diaolog-btn"
      type="text"
      @click="centerDialogVisible = true"
    >点击打开 Dialog</el-button>

    <el-dialog
      :visible.sync="centerDialogVisible"
      title="提示"
      width="30%"
      center
    >

      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        size="mini"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="活动名称"
          prop="name"
        >
          <el-input
            v-model="ruleForm.name"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="活动区域"
          prop="region"
        >
          <el-select
            v-model="ruleForm.region"
            placeholder="请选择活动区域"
            filterable
          >
            <el-option
              label="区域一"
              value="shanghai"
            />
            <el-option
              label="区域二"
              value="beijing"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="活动时间"
          required
        >
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                v-model="ruleForm.date1"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="2"
            class="line"
          >-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                v-model="ruleForm.date2"
                type="fixed-time"
                placeholder="选择时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="即时配送"
          prop="delivery"
        >
          <el-switch v-model="ruleForm.delivery" />
        </el-form-item>
        <el-form-item
          label="活动性质"
          prop="type"
        >
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox
              label="美食/餐厅线上活动"
              name="type"
            />
            <el-checkbox
              label="地推活动"
              name="type"
            />
            <el-checkbox
              label="线下主题活动"
              name="type"
            />
            <el-checkbox
              label="单纯品牌曝光"
              name="type"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="特殊资源"
          prop="resource"
        >
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助" />
            <el-radio label="线下场地免费" />
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="活动形式"
          prop="desc"
        >
          <el-input
            v-model="ruleForm.desc"
            type="textarea"
            placeholder="输入内容，200字以内"
          />
        </el-form-item>
        <!-- <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >立即创建</el-button>
          <el-button
            class="cancel_btn"
            @click="resetForm('ruleForm')"
          >重置</el-button>
        </el-form-item> -->
      </el-form>
      <span slot="footer">
        <el-button
          size="mini"
          class="cancel_btn"
          @click="centerDialogVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="centerDialogVisible = false"
        >确 定</el-button>
      </span>

    </el-dialog>
    <h2>input输入框</h2>
    <el-input
      v-model="input10"
      placeholder="请输入内容"
      size="mini"
      clearable
    />

    <hr>
    <el-radio-group
      v-model="radio5"
      size="small"
    >
      <el-radio-button label="上海" />
      <el-radio-button
        label="北京"
        disabled
      />
      <el-radio-button label="广州" />
      <el-radio-button label="深圳" />
    </el-radio-group>
    <h2>单选</h2>
    <el-radio-group v-model="radio2">
      <el-radio :label="3">备选项</el-radio>
      <el-radio :label="6">备选项</el-radio>
      <el-radio
        :label="9"
        disabled
      >备选项</el-radio>
    </el-radio-group>

    <h2>复选</h2>

    <el-checkbox-group v-model="checkList">
      <el-checkbox label="复选框 A" />
      <el-checkbox label="复选框 B" />
      <el-checkbox label="复选框 C" />
      <el-checkbox
        label="禁用"
        disabled
      />
      <el-checkbox
        label="选中且禁用"
        disabled
      />
    </el-checkbox-group>
    <hr>
    <h2>下拉选择</h2>
    <el-select
      v-model="value2"
      size="mini"
      filterable
      placeholder="请选择"
    >
      <el-option
        v-for="item in options2"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      />
    </el-select>

    <hr>
    <h2 height="100px">
      tabs标签切换
    </h2>
    <el-tabs
      v-model="activeName"
      width="calc(100% - 10px)"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="用户管理"
        name="first"
      >用户管理</el-tab-pane>
      <el-tab-pane
        label="配置管理"
        name="second"
      >配置管理</el-tab-pane>
      <el-tab-pane
        label="角色管理"
        name="third"
      >角色管理</el-tab-pane>
      <el-tab-pane
        label="定时任务补偿"
        name="fourth"
      >定时任务补偿</el-tab-pane>
    </el-tabs>

    <h2>form表单</h2>
    <div style="margin:100pxwidth:500px">

      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        size="mini"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="活动名称"
          prop="name"
        >
          <el-input
            v-model="ruleForm.name"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="活动区域"
          prop="region"
        >
          <el-select
            v-model="ruleForm.region"
            filterable
            placeholder="请选择活动区域"
          >
            <el-option
              label="区域一"
              value="shanghai"
            />
            <el-option
              label="区域二"
              value="beijing"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="活动时间"
          required
        >
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                v-model="ruleForm.date1"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="2"
            class="line"
          >-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                v-model="ruleForm.date2"
                type="fixed-time"
                placeholder="选择时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="即时配送"
          prop="delivery"
        >
          <el-switch v-model="ruleForm.delivery" />
        </el-form-item>
        <el-form-item
          label="活动性质"
          prop="type"
        >
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox
              label="美食/餐厅线上活动"
              name="type"
            />
            <el-checkbox
              label="地推活动"
              name="type"
            />
            <el-checkbox
              label="线下主题活动"
              name="type"
            />
            <el-checkbox
              label="单纯品牌曝光"
              name="type"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="特殊资源"
          prop="resource"
        >
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助" />
            <el-radio label="线下场地免费" />
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="活动形式"
          prop="desc"
        >
          <el-input
            v-model="ruleForm.desc"
            type="textarea"
            placeholder="输入内容，200字以内"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >立即创建</el-button>
          <el-button
            class="cancel_btn"
            @click="resetForm('ruleForm')"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>

      <h2>上传</h2>

      <el-upload
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
      >
        <i class="el-icon-plus" />
        <span>上传照片</span>
      </el-upload>

      <el-dialog :visible.sync="dialogVisible">
        <img
          :src="dialogImageUrl"
          width="90px"
          height="90px"
          alt=""
        >
      </el-dialog>

    </div>
    <h2>气泡</h2>
    <el-popover
      :content="content"
      placement="top-start"
      title="标题"
      width="200"
      trigger="click"
    >
      <el-button slot="reference">click 激活</el-button>
    </el-popover>
    <h2>确认删除小弹窗</h2>
    <el-popover
      v-model="visible2"
      placement="top"
      width="160"
    >
      <p class="pop_content">这是一段内容这是一段内容确定删除吗？</p>
      <div class="bc">
        <el-button
          size="mini"
          class="delete_btn"
          @click="visible2 = false"
        >取消</el-button>
        <el-button
          type="primary"
          size="mini"
          class="edit_btn"
          @click="visible2 = false"
        >确定</el-button>
      </div>
      <el-button
        slot="reference"
        class="delete_btn"
      >删除</el-button>
    </el-popover>
    <h2>分页</h2>
    <el-pagination
      :current-page="5"
      :page-size="50"
      :page-sizes="[10, 20, 30, 40]"
      :total="100"
      layout="  prev, pager, next, sizes,jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      visible2: false,
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      content: `<el-alert title="警告提示的文案" type="warning"  show-icon />`,
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true,
            message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },

      centerDialogVisible: false,
      radio5: '',
      radio2: '',
      input10: '',
      options2: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶',
        disabled: true
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      checkList: ['选中且禁用', '复选框 A'],
      value2: '',
      activeName: 'second'
    }
  },

  methods: {

    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }, handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },

    handleClick(tab, event) {
      console.log(tab, event)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}

</script>

<style lang="scss">
</style>
