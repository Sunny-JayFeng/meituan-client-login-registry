<template>
  <div style="width: 480px;">
    <el-upload
      ref="uploadFile"
      action="http://127.0.0.1:20002/meituan/user/uploadFile"
      list-type="picture-card"
      :multiple="true"
      :on-preview="handlePictureCardPreview"
      :with-credentials="true"
      :auto-upload="false"
      :limit="9"
      :on-exceed="moreFile"
      :on-change="handleFileListChange"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <!-- list-type="picture-card" 文件列表的类型 -->
    <!-- :multiple="true" 是否支持多选文件 -->
    <!-- :on-preview="handlePictureCardPreview 点击文件列表中已上传的文件时的钩子 -->
    <!-- :with-credentials="true" 支持发送cookie凭证信息 -->
    <!-- :auto-upload="false" 是否在选取文件后立即进行上传 -->
    <!-- :limit="9" 最大允许上传个数 -->
    <!-- :on-exceed="moreFile" 文件超出个数限制时的钩子 -->
    <!-- :on-change="handleFileListChange" 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 -->
    <!-- :on-remove="handleRemove" 文件列表移除文件时的钩子 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <p></p>
    <div @click="uploadFile" style="width: 100px; height: 30px; background-image: linear-gradient(135deg,#FFD000 0,#FFBD00 100%); text-align: center; line-height: 30px;">点击上传</div>
    <p></p>
    <div @click="$refs.uploadFile.clearFiles()" style="width: 100px; height: 30px; background-image: linear-gradient(135deg,#FFD000 0,#FFBD00 100%); text-align: center; line-height: 30px;">点击清空</div>
  </div>
</template>

<script>
import uploadFile from '../../services/uploadFile'
export default {
  name: 'UploadFile',
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: []
    }
  },
  methods: {
    // 删除文件
    handleRemove (file, fileList) {
      document.querySelector('.el-upload.el-upload--picture-card').style.display = 'inline-block'
    },
    // 放大图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 已超出
    moreFile (file, fileList) {
      this.$message({message: '超出', type: 'error'})
    },
    // 上传文件
    uploadFile () {
      if (this.fileList.length === 0) {
        this.$message({message: '没有文件', type: 'error'})
        return
      }
      let form = new FormData()
      this.fileList.forEach(function (file) {
        form.append('files', file.raw, file.name)
      })
      uploadFile.uploadFile(form).then(response => {
        this.$refs.uploadFile.clearFiles()
        this.fileList = []
        document.querySelector('.el-upload.el-upload--picture-card').style.display = 'inline-block'
        console.log(response.data)
        console.log(response.data.responseData.uploadFileInfo)
      })
    },
    // 改变文件列表
    handleFileListChange (file, fileList) {
      this.fileList = fileList
      if (fileList.length === 9) {
        document.querySelector('.el-upload.el-upload--picture-card').style.display = 'none'
      }
    }
  }
}
</script>

<style scoped>
</style>
