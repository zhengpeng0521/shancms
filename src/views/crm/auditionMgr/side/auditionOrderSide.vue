<template>
  <div>
    <side-dialog :visible.sync="sideDialogShow">
      <div>ID是</div>
    </side-dialog>
  </div>
</template>

<script>
import SideDialog from '@/components/SideDialog'
export default {
  components: {
    SideDialog
  },
  data() {
    return {
      sideDialogShow: false
    }
  },
  methods: {
    openSideDialog(row) {
      this.sideDialogShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

