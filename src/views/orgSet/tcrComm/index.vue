<template>
  <div class="tcr_container">
    <BlockTitle class="tcr_title">显示项配置</BlockTitle>
    <DisplayItem />
    <BlockTitle class="tcr_title second_title">自主约课规则</BlockTitle>
    <BookCourse />
  </div>
</template>

<script>
import BlockTitle from '@/components/MiniCommon/OrgSetBlock'
import DisplayItem from '@/views/orgSet/tcrComm/displayItem/displayItem'
import BookCourse from '@/views/orgSet/tcrComm/bookCourse/bookCourse'

export default {
  components: {
    BlockTitle,
    DisplayItem,
    BookCourse
  }
}
</script>

<style lang="scss" scoped>
.tcr_container {
  height: calc(100vh - 202px);
  overflow: auto;
  border-bottom: 1px solid #ddd;
}

.tcr_title {
  margin-bottom: 20px;
  color: #333;
}
.second_title {
  margin-top: 20px;
}
</style>
