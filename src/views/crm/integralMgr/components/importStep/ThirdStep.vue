<template>
  <div class="third">
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :table-loading="loading"
      :data-source="dataSource"
    />
  </div>
</template>

<script>
import CommonTable from '@/components/CommonTable/CommonTable'

export default {
  components: {
    CommonTable
  },

  props: {
    loading: {
      type: Boolean,
      required: true
    },
    cols: {
      type: Array,
      required: true
    },
    dataSource: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      tableHeight: '40vh'
    }
  },

  computed: {
    columns() {
      const newCols = []
      this.cols.forEach(item => {
        newCols.push({
          label: item.value,
          prop: item.key,
          isShowTooltip: true
        })
      })
      return newCols
    }
  }
}
</script>

<style lang="scss" scoped>
.third {
  margin-top: 20px;
  border: 1px solid rgba(221, 221, 221, 0.6);
}
</style>
