<template>
  <div class="parent-info">
    <el-button
      type="primary"
      @click="openAdd"
    >添加关联家长</el-button>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :pagination="listQuery"
      :table-height="tableHeight"
      :options="options"
      :operation="operates"
      class="parent-list"
    />
    <ParentAdd
      ref="parentAdd"
      :base-data="baseData"
      :save-add="saveAdd"
      :check-mobile="checkMobile"
    />
  </div>
</template>

<script>
import CommonTable from '@/components/CommonTable/CommonTable'
import ParentAdd from './ParentAdd'
import {
  getParentDictGetByKey,
  getParentList, // 获取学员家长信息数据
  parentOrderList, // 获取名单家长信息数据
  addClueParent, // 添加学员家长信息
  createParent, // 添加名单家长信息
  getOpenIdByMobile, // 学员家长手机号查重
  parentDupCheck, // 名单家长手机号查重
  deleteClueParent, // 名单删除家长信息
  deleteParents // 在读学员家长删除
} from '@/api/crmDetail/crmDetail'

export default {
  components: {
    CommonTable,
    ParentAdd
  },

  props: {
    headerHeight: {
      type: Number,
      required: true
    },
    baseData: {
      type: Object,
      required: true
    },
    params: {
      type: Object,
      required: true
    }
  },

  data() {
    const height = this.headerHeight + 40 + 30 + 40 + 74
    return {
      listQuery: {
        show: false // 是否显示
      },
      columns: [
        {
          label: '家长姓名',
          prop: 'name'
        }, {
          label: '家长关系',
          prop: 'relation'
        }, {
          label: '联系电话',
          prop: 'mobile',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'hover', popperClass: 'detail-parent-pop', content: params.row.mobile }
              }, [
                h('a', { slot: 'reference' }, '查看')
              ])
            ])
          }
        }, {
          label: '绑定微信',
          prop: 'bandStatus',
          render: (h, params) => {
            // eslint-disable-next-line
            const text = params.row.bandStatus && params.row.bandStatus == '0' ? '未绑定' : '已绑定'
            return h('span', {}, text)
          }
        }, {
          label: '绑定人脸',
          prop: 'bandStatus',
          render: (h, params) => {
            // eslint-disable-next-line
            const text = params.row.parentfaceBinding == '0' ? '未绑定' : '已绑定'
            return h('span', {}, text)
          }
        }, {
          label: '邮箱',
          prop: 'email',
          width: '140px'
        }, {
          label: '固定电话',
          prop: 'tel',
          width: '120px'
        }
      ],
      columnsClue: [
        {
          label: '家长姓名',
          prop: 'parentName'
        }, {
          label: '家长关系',
          prop: 'relation'
        }, {
          label: '联系电话',
          prop: 'parentMobile',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'click', popperClass: 'detail-parent-pop', content: params.row.parentMobile }
              }, [
                h('a', { slot: 'reference' }, '查看')
              ])
            ])
          }
        }, {
          label: '绑定微信',
          prop: 'openId',
          render: (h, params) => {
            // eslint-disable-next-line
            const text = params.row.openId == false ? '未绑定' : '已绑定'
            return h('span', {}, text)
          }
        }, {
          label: '邮箱',
          prop: 'email',
          width: '140px'
        }, {
          label: '固定电话',
          prop: 'tel',
          width: '120px'
        }
      ],
      options: {
        // apiService: getParentList // 表格的数据请求接口
      },
      tableHeight: `calc(100vh - ${height}px)`,
      operates: {
        width: '120',
        fixed: 'right',
        list: [
          {
            label: '删除',
            type: 'normal',
            minLength: 1,
            method: (row) => {
              this.deleteHandle(row)
            },
            popoverCon: [
              {
                contentText: '确定删除？'
              }
            ]
          }
        ]
      },
      allParentLinkList: [],
      tableDataLength: '' // 表格数据的数据长度
    }
  },

  created() {
    this.getParentListFun()
  },

  mounted() {
    this.getParentListFun()
  },

  methods: {
    /* 获取家长信息列表 */
    getParentListFun() {
      // 名单家长信息
      if(this.$props.params.source && this.$props.params.source == '2'){ //eslint-disable-line
        this.getClueParentList()
      } else {
        this.getStuParentList()
      }
    },
    /** 学员家长列表获取 */
    getStuParentList() {
      const params = {
        pageSize: 20,
        pageIndex: 0,
        stuId: this.$props.params.stuId
      }
      getParentList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$refs.tableCommon.tableData = res.data.results
          this.tableDataLength = res.data.results.length
          // 家长 长度为1时处理
          if(this.tableDataLength == 1 ) {//eslint-disable-line
            this.operates.list[0].label = ''
          } else {
            this.operates.list[0].label = '删除'
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 名单家长列表刷新 */
    getClueParentList() {
      const params = {
        pageSize: 20,
        pageIndex: 0,
        stuId: this.$props.params.stuId
      }
      parentOrderList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.columns = this.columnsClue
          this.$refs.tableCommon.tableData = res.data.results
          this.tableDataLength = res.data.results.length
          // 家长 长度为1时处理
          if(this.tableDataLength == 1 ) {//eslint-disable-line
            this.operates.list[0].label = ''
          } else {
            this.operates.list[0].label = '删除'
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /* 获取家长关系下拉数据 */
    getParentDictGetByKeyFun() {
      const params = {
        dictkey: 'parentRelationship'
      }
      getParentDictGetByKey(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allParentLinkList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /* 学员家长列表刷新 */
    getOrderParentList() {
      const params = {
        pageIndex: 0,
        stuId: this.$props.params.stuId
      }
      this.options.apiService = getParentList
      this.$refs.tableCommon.getList(params)
    },

    /* 查重手机号 */
    checkMobile(values) {
      let params = {}
      // 名单家长信息
      if(this.$props.params.source && this.$props.params.source == '2'){ //eslint-disable-line
        params = {
          parentMobile: values
        }
        parentDupCheck(params).then(res => {
          if (res.data.errorCode === 0) {
            // if(res.data.allowedAdd == false){ //eslint-disable-line
            //   this.$message.error(res.data.errorMessage)
            // }
            if (res.data.results && res.data.results.length > 0) {
              this.$refs.parentAdd.parentAddForm.parentInfo = '2'
              this.$refs.parentAdd.isParentListSelect = true
              this.$refs.parentAdd.allParentNameList && this.$refs.parentAdd.allParentNameList.length > 0 && this.$refs.parentAdd.allParentNameList.map(item => {
                if(item.id == res.data.results[0].parentId) { //eslint-disable-line
                  this.$refs.parentAdd.parentAddForm.parentName = item.id
                }
              })
            }
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else {
        params = {
          mobile: values
        }
        getOpenIdByMobile(params).then(res => {
          if (res.data.errorCode === 0) {
            if (res.data.parentId && res.data.parentId.length > 0) {
              this.$refs.parentAdd.parentAddForm.parentInfo = '2'
              this.$refs.parentAdd.isParentListSelect = true
              this.$refs.parentAdd.allParentNameList && this.$refs.parentAdd.allParentNameList.length > 0 && this.$refs.parentAdd.allParentNameList.map(item => {
                if(item.id == res.data.parentId) { //eslint-disable-line
                  this.$refs.parentAdd.parentAddForm.parentName = item.id
                }
              })
            }
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      }
    },

    /** 删除 */
    deleteHandle(row) {
      // 名单
      if(this.$props.params.source && this.$props.params.source == '2') { //eslint-disable-line
        this.deleteClueParentFun(row)
      } else {
        this.deleteStuParentFun(row)
      }
    },
    /** 学员删除家长信息 */
    deleteStuParentFun(row) {
      const params = {
        pid: row.id,
        stuId: row.stuId
      }
      deleteParents(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.errorMessage)
          this.getParentListFun()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 名单删除家长信息 */
    deleteClueParentFun(row) {
      const params = {
        parentId: row.parentId,
        stuId: this.$props.params.stuId
      }
      deleteClueParent(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.errorMessage)
          this.getClueParentList()
          // this.deleteParentOne()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /** 打开新增 */
    openAdd() {
      this.$refs.parentAdd.addVisible = true
      if(this.$props.params.source && this.$props.params.source == '2') { //eslint-disable-line
        this.$refs.parentAdd.summeryParentInfoFun()
      } else {
        this.$refs.parentAdd.parentSummaryFun()
      }
      this.$refs.parentAdd.getParentDictGetByKeyFun()
      this.$refs.parentAdd.parentAddForm.parentInfo = '1'
      this.$refs.parentAdd.parentAddForm.parentName = ''
      this.$refs.parentAdd.parentAddForm.parentMobile = ''
      this.$refs.parentAdd.isParentListSelect = false
    },

    /** 保存新增 */
    saveAdd(values) {
      let params = {}
      if(this.$props.params.source && this.$props.params.source == '2') { //eslint-disable-line
        if(values.parentInfo && values.parentInfo == '2') { //eslint-disable-line
          params = {
            relation: values.relation,
            trade: values.trade,
            email: values.email,
            qqNumber: values.qqNumber,
            parentId: values.parentName,
            tel: values.tel,
            stuId: this.$props.params.stuId
          }
        } else {
          params = {
            relation: values.relation,
            trade: values.trade,
            email: values.email,
            qqNumber: values.qqNumber,
            parentMobile: values.parentMobile,
            parentName: values.parentName,
            tel: values.tel,
            stuId: this.$props.params.stuId
          }
        }
        addClueParent(params).then(res => {
          if (res.data.errorCode === 0) {
            if (res.data.allowedAdd === false) {
              this.$message.success('家长重复：' + (res.data.results[0] && (res.data.results[0].parentName + res.data.results[0].mobile)))
              return
            }
            this.$message.success(res.data.errorMessage)
            this.$refs.parentAdd.closeAdd()
            this.getClueParentList()
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else {
        if(values.parentInfo && values.parentInfo == '2') { //eslint-disable-line
          params = {
            id: values.parentName,
            relation: values.relation,
            qqNumber: values.qqNumber,
            trade: values.trade,
            email: values.email,
            tel: values.tel,
            stuId: this.$props.params.stuId
          }
        } else {
          params = {
            name: values.parentName,
            mobile: values.parentMobile,
            relation: values.relation,
            qqNumber: values.qqNumber,
            trade: values.trade,
            email: values.email,
            tel: values.tel,
            stuId: this.$props.params.stuId
          }
        }
        createParent(params).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success(res.data.errorMessage)
            this.$refs.parentAdd.closeAdd()
            this.getStuParentList()
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.parent-info {
  padding-left: 20px;
}
.parent-list {
  margin-top: 20px;
}
</style>

<style lang="scss">
.detail-parent-pop {
  text-align: center;
}
</style>
