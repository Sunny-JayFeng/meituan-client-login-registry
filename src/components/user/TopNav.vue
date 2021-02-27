<template>
  <div :class="wrapperClass">
    <div :class="contentClass">
      <Logo />
      <div :class="loginBtnWrapperClass">
        <span :class="haveAccountClass">已有美团账号？</span>
        <router-link :to="{name: 'UserLogin'}" :class="routerLinkClass">
          <YellowButton  value="登录" :extract-class="yellowBtnClass"/>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from './Logo'
import YellowButton from './YellowButton'
export default {
  name: 'TopNav',
  components: {
    Logo,
    YellowButton
  },
  props: {
    wrapperClass: {
      type: String,
      required: false,
      default: ''
    },
    contentClass: {
      type: String,
      required: false,
      default: ''
    },
    loginBtnWrapperClass: {
      type: String,
      required: false,
      default: ''
    },
    haveAccountClass: {
      type: String,
      required: false,
      default: ''
    },
    routerLinkClass: {
      type: String,
      required: false,
      default: ''
    },
    yellowBtnClass: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
