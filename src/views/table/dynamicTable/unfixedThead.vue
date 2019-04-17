<template>
  <div class="app-container">

    <div class="filter-container">
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox
          v-for="checkColumn in checkList"
          :label="checkColumn.label"
          :key="checkColumn.label"
        />
      </el-checkbox-group>
    </div>

    <el-table
      :data="tableData"
      :key="key"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="fruitName"
        width="180"
      />
      <el-table-column
        v-for="(fruit,index) in formThead"
        :key="index"
        :label="fruit.label"
        :prop="fruit.prop"
      >
        <!-- <template slot-scope="scope">
          {{ scope.row[fruit.prop] }}
        </template> -->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// const defaultFormThead = ['apple', 'banana']
const defaultFormThead = []
const defaultheader = [
  {
    label: '苹果',
    prop: 'apple'
  },
  {
    label: '香蕉',
    prop: 'banana'
  },
  {
    label: '橘子',
    prop: 'orange'
  }
]
defaultheader.map(function(item, index) {
  defaultFormThead.push(item.prop)
})
const defaultCheck = ['苹果', '香蕉']
const header = [
  {
    prop: 'apple',
    label: '苹果'
  },
  {
    label: '香蕉',
    prop: 'banana'
  },
  {
    label: '橘子',
    prop: 'orange'
  }
]
const checkList = [
  {
    prop: 'apple',
    label: '苹果'
  }, {
    prop: 'banana',
    label: '香蕉'
  }
]
export default {
  data() {
    return {
      tableData: [
        {
          name: 'fruit-1',
          apple: 'apple-10',
          banana: 'banana-10',
          orange: 'orange-10'
        },
        {
          name: 'fruit-2',
          apple: 'apple-20',
          banana: 'banana-20',
          orange: 'orange-20'
        }
      ],
      key: 1, // table key
      tableHeader: header,
      checkboxVal: defaultCheck, // checkboxVal
      formThead: defaultheader, // 默认表头 Default header
      checkList: checkList
    }
  },
  watch: {
    header(val, oldVal) {
      this.formThead = val
    },
    checkboxVal(valArr) {
      this.formThead = this.tableHeader.filter(i => valArr.indexOf(i.label) >= 0)
      this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  }
}
</script>

