<template>
  <div class="app-container">

    <div class="filter-container">
      <template v-for="checkColumn in checkList">
        <el-checkbox-group
          v-model="checkboxVal"
          :key="checkColumn.label"
        >
          <el-checkbox :label="checkColumn.prop">{{ checkColumn.label }}</el-checkbox>
        </el-checkbox-group>
      </template>
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
        v-for="fruit in formThead"
        :key="fruit.prop"
        :label="fruit.label"
      >
        <template slot-scope="scope">
          {{ scope.row[fruit.prop] }}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
const defaultFormThead1 = ['apple', 'banana', 'orange']
const defaultFormThead = [
  {
    prop: 'apple',
    label: '苹果'
  }, {
    prop: 'banana',
    label: '香蕉'
  }, {
    prop: 'orange',
    label: '香蕉111'
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
      // formTheadOptions: ['apple', 'banana', 'orange'],
      formTheadOptions: [
        {
          prop: 'apple',
          label: '苹果'
        }, {
          prop: 'banana',
          label: '香蕉'
        },
        {
          prop: 'orange',
          label: '香蕉111'
        }
      ], // 比较用的
      checkboxVal: defaultFormThead1, // checkboxVal
      formThead: defaultFormThead, // 默认表头 Default header
      checkList: checkList // 选择遍历
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i.prop) >= 0)
      this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  }
}
</script>
