<template>
  <a class="site-logo" target="_blank" :href="logo.link" :style="{
    backgroundImage: `url(${logo.logoImageUrl})`
  }">美团网</a>
</template>

<script>
export default {
  name: 'Logo',
  data () {
    return {
      logo: {
        logoImageUrl: require('../../assets/logo.png'),
        link: 'http://www.meituan.com'
      }
    }
  }
}
</script>

<style scoped>
  .site-logo {
    display: inline-block;
    width: 100%;
    height: 100%;
    background-size: 100%;
    background-repeat: no-repeat;
    text-indent: -9999px;
  }
</style>
