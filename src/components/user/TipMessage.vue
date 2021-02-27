<template>
  <span :class="[extractClass]">
    <Icon v-if="tipIcon !== ''" :iconName="tipIcon" :extractClass="iconExtractClass"/>
    {{tipMessage}}
  </span>
</template>

<script>
import Icon from './Icon'
export default {
  name: 'TipMessage',
  props: {
    extractClass: {
      type: String,
      required: false,
      default: ''
    },
    tipMessage: {
      type: String,
      required: true
    },
    tipIcon: {
      type: String,
      required: false,
      default: ''
    },
    iconExtractClass: {
      type: String,
      required: false
    }
  },
  components: {
    Icon
  }
}
</script>

<style scoped>

</style>
