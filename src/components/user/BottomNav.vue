<template>
  <div :class="[extractClass]">
    <el-divider direction="horizontal"></el-divider>
    <div class="nav-wrapper">
      <ul class="nav-content">
        <li class="nav-item" v-for="(item, index) in navContentList" :key="index">
          <!-- 后期需要改成 router-link -->
          <a :href="item.link" target="_blank">{{item.content}}</a>
          <template v-if="index !== navContentList.length - 1">
            <el-divider direction="vertical"></el-divider>
          </template>
        </li>
      </ul>
    </div>
    <el-divider direction="horizontal"></el-divider>
  </div>
</template>

<script>
export default {
  name: 'BottomNav',
  props: {
    navContentList: {
      type: Array,
      required: true
    },
    extractClass: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style scoped>
  .nav-wrapper {
    width: 100%;
    height: 100%;
  }
  .nav-wrapper ul {
    float: left;
    margin-top: 11px;
    padding-left: 0px;
  }
  .nav-wrapper ul li {
    display: inline-block;
    list-style: none;
  }
  .nav-wrapper ul li a {
    margin-left: 10px;
    margin-right: 10px;
    font-size: 12px;
    color: #999;
  }
</style>
