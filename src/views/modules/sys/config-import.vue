<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    title="上传文件"
    @close="closeHandle">
    <el-upload
      :action="url"
      :before-upload="beforeUploadHandle"
      :on-success="successHandle"
      :file-list="fileList"
      drag
      multiple
      style="text-align: center;">
      <i class="el-icon-upload"/>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只支持jpg、png、gif格式的图片！</div>
    </el-upload>
  </el-dialog>
</template>

<script>
export default {
  name: 'ConfigImport',
  data() {
    return {
      visible: false,
      url: '',
      num: 0,
      successNum: 0,
      fileList: []
    }
  },
  methods: {
    init() {
      this.url = this.$http.adornUrl(`/sys/config/importExcel?token=${this.$cookie.get('token')}`)
      this.visible = true
    },
    // 上传之前
    beforeUploadHandle(file) {
      if (file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$message.error('只支持xls、xlsx格式的表格！')
        return false
      }
      this.num++
    },
    // 上传成功
    successHandle(response, file, fileList) {
      this.fileList = fileList
      this.successNum++
      if (response && response.code === 0) {
        if (this.num === this.successNum) {
          this.$confirm('操作成功, 是否继续操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(() => {
            this.visible = false
          })
        }
      } else {
        this.$message.error(response.msg)
      }
    },
    // 弹窗关闭时
    closeHandle() {
      this.fileList = []
      this.$emit('refreshDataList')
    }
  }
}
</script>

<style scoped>

</style>
