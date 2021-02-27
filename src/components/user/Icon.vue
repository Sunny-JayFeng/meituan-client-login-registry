<template>
  <i :style="{
    backgroundImage: `url(${getIcon})`
  }" :iconName="iconName" :class="[extractClass]"></i>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    iconName: {
      type: String,
      required: true
    },
    extractClass: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      iconMap: {
        'tipIcons': require('../../assets/tipIcon.png'),
        'phoneIcon': require('../../assets/bypassword.png'),
        'personIcon': require('../../assets/bycode.png'),
        'spNormalIcon': require('../../assets/icon.png')
      }
    }
  },
  computed: {
    getIcon () {
      return this.iconMap[this.iconName]
    }
  }
}
</script>

<style scoped>

</style>
