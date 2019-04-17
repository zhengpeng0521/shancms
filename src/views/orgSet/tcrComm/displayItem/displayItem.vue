<template>
  <div>

    <div class="display_box">

      <table border="1">
        <tr>
          <th>模块名称</th>
          <th>状态</th>
        </tr>
        <tr
          v-for="(item,index) in displayData"
          :key="index"
        >
          <td>{{ item.title }}</td>
          <td>
            <el-switch
              v-model="item.status"
              active-value="1"
              inactive-value="0"
              @change="isSwitch(item.status)"
            />

          </td>
        </tr>

      </table>
    </div>

  </div>
</template>
<script>

import { menuConfList, changeCommentMenu } from '@/api/orgSet/tcrComm'

export default {
  data() {
    return {
      value3: true,
      displayData: ''
    }
  },

  mounted() {
    this.getMenuList()
  },
  methods: {

    getMenuList() {
      menuConfList().then(res => {
        if (res.data.errorCode === 0) {
          this.displayData = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    isSwitch(val) {
      const data = {
        value: JSON.stringify(this.displayData)
      }
      changeCommentMenu(data).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('修改成功')
          this.getMenuList()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
table {
  border-collapse: collapse;
}

table,
td,
th {
  border: 1px solid #ccc;
}

table {
  width: 600px;
}
th {
  height: 40px;
}
td {
  height: 40px;
  text-align: center;
}
</style>
