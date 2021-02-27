<template>
  <div :class="pwLevelWrapperClass">
    <div :class="[pwLevelBgColorClass, pwLevel]"></div>
    <div :class="pwLevelTextWrapperClass">
      <span :class="pwLevelTextClass">弱</span>
      <span :class="pwLevelTextClass">中</span>
      <span :class="[pwLevelTextClass, lastPwLevelClass]">强</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordLevel',
  props: {
    pwLevelWrapperClass: {
      type: String,
      required: false,
      default: ''
    },
    pwLevelBgColorClass: {
      type: String,
      required: false,
      default: ''
    },
    pwLevelTextWrapperClass: {
      type: String,
      required: false,
      default: ''
    },
    pwLevelTextClass: {
      type: String,
      required: false,
      default: ''
    },
    lastPwLevelClass: {
      type: String,
      required: false,
      default: ''
    },
    pwLevel: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
