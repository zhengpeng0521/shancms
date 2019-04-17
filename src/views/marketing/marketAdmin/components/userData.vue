<template>
  <div class="userDataContainer">
    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <div class="downloadBtn">
      <el-button
        v-if="hasBtn('204000003')"
        :disabled="disabled"
        plain
        @click="exportFormData"
      >导出</el-button>
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      table-key="marketing_marketAdmin_userData"
    />
  </div>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { formDataQuery, dictGetByKey, summaryQuery } from '@/api/marketing/marketAdmin.js'
import { exportFile } from '@/utils/exportFile.js'
export default {
  components: {
    CommonSearch,
    CommonTable
  },
  data() {
    return {
      dataSource: [],
      // 导出按钮
      disabled: false,
      // 搜索参数
      formValue: {},
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'select',
            placeholder: '请选择采单地点',
            modelValue: 'key',
            labelKey: 'value',
            valueKey: 'key',
            isFilterable: true,
            isClearable: true,
            apiService: dictGetByKey,
            params: { dictkey: 'secondChannel' },
            itemStyle: 'width:140px'
          },
          {
            itemType: 'select',
            placeholder: '请选择采单人员',
            modelValue: 'userId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            apiService: summaryQuery,
            labelKey: 'userName',
            valueKey: 'userId'
          },
          {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            rangeSeparator: '~',
            startPlaceholder: '报名开始时间',
            endPlaceholder: '报名结束时间',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'date2'
          }
        ]
      },
      // 表格参数
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '学员姓名',
          prop: 'babyName',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            return this.formatUserDataOfRow('babyName', row.formData)
          }
        },
        {
          label: '学员生日',
          prop: 'babyBirthday',
          isShowTooltip: true,
          isShowSet: true,
          width: 110,
          formatter: (row) => {
            return this.formatUserDataOfRow('babyBirthday', row.formData)
          }
        },
        {
          label: '联系方式',
          prop: 'tel',
          isShowTooltip: true,
          isShowSet: true,
          width: 120,
          formatter: (row) => {
            return this.formatUserDataOfRow('tel', row.formData)
          }
        },
        {
          label: '学员性别',
          prop: 'babySex',
          isShowTooltip: true,
          isShowSet: true,
          formatter: (row) => {
            return this.formatUserDataOfRow('babySex', row.formData)
          }
        },
        {
          label: '家长关系',
          prop: 'parentRelate',
          isShowTooltip: true,
          isShowSet: true,
          formatter: (row) => {
            return this.formatUserDataOfRow('parentRelate', row.formData)
          }
        },
        {
          label: '家长姓名',
          prop: 'parentName',
          isShowTooltip: true,
          isShowSet: true,
          formatter: (row) => {
            return this.formatUserDataOfRow('parentName', row.formData)
          }
        },
        {
          label: '地址',
          prop: 'address',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            return this.formatUserDataOfRow('address', row.formData)
          }
        },
        {
          label: '小区',
          prop: 'neighbourhood',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            return this.formatUserDataOfRow('neighbourhood', row.formData)
          }
        },
        {
          label: '学校',
          prop: 'school',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            return this.formatUserDataOfRow('school', row.formData)
          }
        },
        {
          label: '是否会员',
          prop: 'isVip',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            return this.formatUserDataOfRow('isVip', row.formData)
          }
        },
        {
          label: '采集地点',
          prop: 'placeStr',
          isShowSet: true,
          isShowTooltip: true,
          width: 170
        },
        {
          label: '采集人员',
          prop: 'members',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            if (row.memberName) {
              return `<span>${row.memberName}</span>`
            }
          }
        },
        {
          label: '报名时间',
          prop: 'createTime',
          isShowSet: true,
          isShowTooltip: true,
          width: 170
        }
      ],
      options: {
        isSettingShow: false, // 是否出现设置
        noMount: true,
        params: { activityId: '' },
        apiService: formDataQuery // 表格的数据请求接口
      },
      tableHeight: 'calc(100vh - 233px)'
    }
  },
  mounted() {
    this.options.params = { activityId: this.$parent.id }
    this.$refs.tableCommon.getList({ activityId: this.$parent.id })
  },
  methods: {
    /** 格式化处理行数据 */
    formatUserDataOfRow(key, rowData) {
      let retValue = ''
      if (rowData && rowData.length > 0) {
        const userData = JSON.parse(rowData)
        userData.forEach(item => {
          if (item.name === key) {
            retValue = item.value
          }
        })
      }
      return retValue
    },
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      if (this.formValue.date2 && this.formValue.date2.length > 0) {
        const obj = {
          pageSize: 10,
          pageIndex: 0,
          firstCreateTime: this.formValue.date2[0],
          endCreateTime: this.formValue.date2[1],
          place: this.formValue.key,
          sourceType: 1,
          sourceId: this.formValue.userId,
          activityId: this.$parent.id
        }
        const params = {}
        for (var i in obj) {
          if (obj[i] !== undefined) {
            params[i] = obj[i]
          }
        }
        this.$refs.tableCommon.getList(params)
      } else {
        const obj = {
          pageSize: 10,
          pageIndex: 0,
          firstCreateTime: '',
          endCreateTime: '',
          place: this.formValue.key,
          sourceType: 1,
          sourceId: this.formValue.userId,
          activityId: this.$parent.id
        }
        var params = {}
        for (var j in obj) {
          if (obj[j] !== undefined) {
            params[j] = obj[j]
          }
        }
        this.$refs.tableCommon.getList(params)
      }
    },
    // 导出方法
    exportFormData() {
      const path = '/ss-mic-provider/mic/MarketActivityQueryService/exportFormData'
      if (this.formValue.date2 && this.formValue.date2.length > 0) {
        if (this.formValue.userId === undefined && this.formValue.key) {
          const params = {
            pageSize: 10,
            pageIndex: 0,
            firstCreateTime: this.formValue.date2[0],
            endCreateTime: this.formValue.date2[1],
            place: this.formValue.key,
            sourceType: 1,
            activityId: this.$parent.id,
            tenantId: this.GLOBAL.tenantId,
            orgId: this.GLOBAL.orgId
          }
          exportFile(path, params)
        } else if (this.formValue.userId === undefined && this.formValue.key === undefined) {
          const params = {
            pageSize: 10,
            pageIndex: 0,
            firstCreateTime: this.formValue.date2[0],
            endCreateTime: this.formValue.date2[1],
            activityId: this.$parent.id,
            tenantId: this.GLOBAL.tenantId,
            orgId: this.GLOBAL.orgId
          }
          exportFile(path, params)
        } else if (this.formValue.userId && this.formValue.key === undefined) {
          const params = {
            pageSize: 10,
            pageIndex: 0,
            firstCreateTime: this.formValue.date2[0],
            endCreateTime: this.formValue.date2[1],
            sourceId: this.formValue.userId,
            activityId: this.$parent.id,
            tenantId: this.GLOBAL.tenantId,
            orgId: this.GLOBAL.orgId
          }
          exportFile(path, params)
        } else if (this.formValue.userId && this.formValue.key) {
          const params = {
            pageSize: 10,
            pageIndex: 0,
            firstCreateTime: this.formValue.date2[0],
            endCreateTime: this.formValue.date2[1],
            place: this.formValue.key,
            sourceType: 1,
            sourceId: this.formValue.userId,
            activityId: this.$parent.id,
            tenantId: this.GLOBAL.tenantId,
            orgId: this.GLOBAL.orgId
          }
          exportFile(path, params)
        }
      } else {
        if (this.formValue.userId === undefined && this.formValue.key) {
          const params = {
            pageSize: 10,
            pageIndex: 0,
            place: this.formValue.key,
            sourceType: 1,
            activityId: this.$parent.id,
            tenantId: this.GLOBAL.tenantId,
            orgId: this.GLOBAL.orgId
          }
          exportFile(path, params)
        } else if (this.formValue.userId === undefined && this.formValue.key === undefined) {
          const params = {
            pageSize: 10,
            pageIndex: 0,
            activityId: this.$parent.id,
            tenantId: this.GLOBAL.tenantId,
            orgId: this.GLOBAL.orgId
          }
          exportFile(path, params)
        } else if (this.formValue.userId && this.formValue.key === undefined) {
          const params = {
            pageSize: 10,
            pageIndex: 0,
            sourceId: this.formValue.userId,
            activityId: this.$parent.id,
            tenantId: this.GLOBAL.tenantId,
            orgId: this.GLOBAL.orgId
          }
          exportFile(path, params)
        } else if (this.formValue.userId && this.formValue.key) {
          const params = {
            pageSize: 10,
            pageIndex: 0,
            place: this.formValue.key,
            sourceType: 1,
            sourceId: this.formValue.userId,
            activityId: this.$parent.id,
            tenantId: this.GLOBAL.tenantId,
            orgId: this.GLOBAL.orgId
          }
          exportFile(path, params)
        }
      }
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageSize: 10,
        pageIndex: 0,
        firstCreateTime: '',
        endCreateTime: '',
        place: '',
        sourceType: 1,
        sourceId: '',
        activityId: this.$parent.id
      }
      this.$refs.tableCommon.getList(params)
      this.formValue = {}
    }

  }
}

</script>
<style lang="scss" scoped>
.downloadBtn {
  position: absolute;
  top: 0;
  right: 0;
}
.userDataContainer {
  position: relative;
}
</style>

