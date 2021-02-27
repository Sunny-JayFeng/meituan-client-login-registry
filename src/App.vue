<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  /* 加载组件，覆盖element-ui样式 */
  .el-loading-mask.is-fullscreen .el-loading-spinner {
    width: 140px;
    height: 88px;
    background-color: black;
    border-radius: 8px;
    margin-left: 47%;
  }
  .el-loading-spinner i {
    margin-top: 21px;
    font-size: 25px;
    color: #eef;
  }
  .el-loading-spinner .el-loading-text {
    font-size: 15px;
    color: #eef;
  }
  .el-loading-mask.is-fullscreen .el-loading-spinner {
    margin-top: -80px;
  }
</style>
