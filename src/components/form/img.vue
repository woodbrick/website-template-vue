<template>
  <el-upload class="img-uploader"
             :action="field.editorUploadUrl"
             :show-file-list="false"
             :on-success="imgUpload">
    <img v-if="row[field.prop] && /http/.test(row[field.prop])" :src="row[field.prop]">
    <i v-else class="el-icon-plus"></i>
  </el-upload>
</template>
<script>
  export default {
    props: ['field', 'row'],
    methods: {
      imgUpload(res) {
        this.$emit('updateProp', this.field.prop, res.data[this.field.prop])
      }
    }
  }
</script>
