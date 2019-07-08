import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import {
  queryStuWork,
  getWorkTagList,
  deleteStuWork
} from '@/api/teachManage/homeSchoolConnect'
import ManageProType from './dialog/manageProType'
import StuWorkInfo from './dialog/stuWorkInfo'
import EditStuWorkInfo from './dialog/editStuWorkInfo'
import Confirm from '@/components/MiniCommon/Confirm'
export default {
  components: {
    CommonSearch,
    CommonTable,
    AdvancedSearch,
    ManageProType,
    StuWorkInfo,
    EditStuWorkInfo,
    Confirm
  },
  data() {
    return {
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名/电话号码',
            modelValue: 'nameOrMobile',
            isFilterable: true,
            isClearable: true
          },
          // 学员较多时会造成卡顿,采用输入学员姓名和电话号码的方式过滤
          // {
          //   itemType: 'select',
          //   placeholder: '请选择学员',
          //   modelValue: 'stuId',
          //   isFilterable: true,
          //   isClearable: true,
          //   itemStyle: 'width:140px',
          //   valueKey: 'stuId',
          //   labelKey: 'stuName',
          //   apiService: stuSummaryQuery // 是否从接口中获取
          // },
          {
            itemType: 'select',
            placeholder: '作品分类',
            modelValue: 'tagId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            valueKey: 'id',
            labelKey: 'name',
            isVisibleList: true,
            apiService: getWorkTagList // 是否从接口中获取
          }
        ]
      },
      advancedSearchShow: false,
      superSearch: {
        onClear: () => {
          this.onClear()
        },
        onSearch: superValue => {
          this.onSearch(superValue)
        },
        fields: [
          {
            type: 'input',
            key: 'wId',
            label: '作品编号'
          },
          {
            type: 'input',
            key: 'wName',
            label: '作品名称'
          }
        ]
      },
      columns: [
        {
          label: '作品编号',
          prop: 'id',
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '作品名称',
          prop: 'title',
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '作品类型',
          prop: 'tagName',
          isShowTooltip: true,
          width: '100',
          formatter: row => {
            if (row.tagName == null) {
              return `未分类`
            } else {
              return `${row.tagName}`
            }
          }
        },
        {
          label: '所属学员',
          prop: 'stuName',
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '上传时间',
          prop: 'createTime',
          isShowTooltip: true,
          width: '100'
        }
      ],
      listQuery: {
        show: true // 是否显示
      },
      options: {
        mutiSelect: true, // 是否多选
        apiService: queryStuWork, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 269px)',
      operates: {
        width: '150',
        fixed: 'right',
        list: [
          {
            label: '查看',
            method: row => {
              this.toLookImg(row)
            }
          },
          {
            label: '修改',
            method: row => {
              this.toUpdateInfo(row)
            }
          }
        ]
      },
      checkNum: 0, // 选中的数据条数
      delVisible: false, // 是否删除的气泡
      allSize: 5368709120, // 全部空间
      usedSize: 0, // 已经使用空间
      superValue: {}, // 高级搜索数据
      checkList: [], // 选中的列表
      formValue: {} // 搜索栏的数据
    }
  },
  methods: {
    /* 多选 */
    selectionChange(val) {
      this.checkNum = val.length
      this.checkList = val
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...formValue,
        ...this.superValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0,
        ...this.superValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.formValue,
        ...this.superValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      const params = {
        pageIndex: 0,
        ...this.formValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.superValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /* 更新表格数据 */
    getUpdateTable() {
      const params = {
        pageIndex: 0
      }
      this.$refs.search.formValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /* 使用空间 */
    sizeChange(size) {
      if (size < 1024) {
        return size + ' B '
      } else if (size < 1024 * 1024) {
        return size / 1024 + ' KB '
      } else if (size < 1024 * 1024 * 1024) {
        return size / 1024 / 1024 + ' M '
      } else if (size < 1024 * 1024 * 1024 * 1024) {
        return size / (1024 * 1024 * 1024) + ' G '
      }
    },
    /* 是否删除 */
    deleteSureFunc() {
      this.delVisible = false
      let workIds = ''
      const workIdArr = []
      this.checkList.map(item => {
        workIdArr.push(item.id)
      })
      workIds = workIdArr && workIdArr.join(',')
      const params = {
        workIds: workIds
      }
      deleteStuWork(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.$refs.tableCommon.getList({ pageIndex: 0 })
        } else {
          this.$message.error(data.errorMessage || '删除失败')
        }
      })
    },
    /* 查看图片 */
    toLookImg(row) {
      window.open(row.imgurl)
    },
    /* 修改信息 */
    toUpdateInfo(row) {
      this.$refs.editStuWorkInfo.show(row)
    },
    /* 管理分类 */
    manageWorksType() {
      this.$refs.manageType.show()
    },
    /* 上传作品 */
    uploadWorks() {
      this.$refs.stuWorkInfo.show('add')
    }
  }
}
