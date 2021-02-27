<template>
  <div class="yellow-btn-wrapper" :style="{
    width: width,
    height: height,
    borderRadius: borderRadius
  }">
    <input type="submit" class="yellow-btn" :value="value" :class="[extractClass]"/>
  </div>
</template>

<script>
export default {
  name: 'YellowButton.vue',
  props: {
    value: {
      type: String,
      required: true // 必须传递该属性
    },
    extractClass: {
      type: String,
      required: false,
      default: ''
    },
    width: {
      type: String,
      required: false,
      default: '100%'
    },
    height: {
      type: String,
      required: false,
      default: '100%'
    },
    borderRadius: {
      type: String,
      required: false
    }
  }
}
</script>

<style scoped>
  .yellow-btn-wrapper {
    background-image: linear-gradient(135deg,#FFD000 0,#FFBD00 100%);
  }
  .yellow-btn-wrapper .yellow-btn {
    background-image: linear-gradient(135deg,#FFD000 0,#FFBD00 100%);
    border: none;
    outline: none;
    cursor: pointer;
  }
</style>
