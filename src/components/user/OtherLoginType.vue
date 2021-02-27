<template>
  <div :class="extractClass">
    <div class="other-login-msg">
      <span class="other-login-title">用合作网站账号登录</span>
    </div>
    <div class="other-login-type">
      <a href="https://graph.qq.com/oauth2.0/show?which=Login&display=pc&response_type=code&redirect_uri=https%3A%2F%2Fpassport.meituan.com%2Faccount%2Fcallback%2Ftencent&client_id=214506">
        <Icon iconName="spNormalIcon" extractClass="login-by-qq" />
      </a>
      <a href="https://api.weibo.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fpassport.meituan.com%2Faccount%2Fcallback%2Fsina&client_id=579809138###">
        <Icon iconName="spNormalIcon" extractClass="login-by-sina" />
      </a>
    </div>
  </div>
</template>

<script>
import Icon from './Icon'
export default {
  name: 'OtherLoginType',
  components: {
    Icon
  },
  props: {
    extractClass: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style scoped>
  .other-login-msg {
    border-top: 1px solid #CCC;
  }
  .other-login-msg .other-login-title {
    position: relative;
    display: inline-block;
    width: 150px;
    font-size: 14px;
    font-weight: 400;
    color: #666;
    top: -13px;
    background-color: #FFF;
  }
  .other-login-type {
    /*border: 1px solid black;*/
    margin-top: 8px;
  }
  .other-login-type i {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 35px;
    cursor: pointer;
  }
  .other-login-type .login-by-qq {
    background-position: -1250px -491px;
  }
  .other-login-type .login-by-sina {
    background-position: -1250px -599px;
    margin-left: -20px;
  }
</style>
