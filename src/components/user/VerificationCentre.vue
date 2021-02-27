<template>
  <div class="app-container">
    <!-- 顶部logo -->
    <div class="header">
      <div class="logo" :style="{
        background: `url(${logoImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '82px 54px'
      }">验证中心</div>
    </div>
    <!-- 验证框 -->
    <div class="wrapper">
      <div class="content">
        <!-- 文字提示 -->
        <div class="content-text">
          <span class="text">为了您的账户安全，请先验证手机</span>
        </div>
        <!-- 提示信息 -->
        <div class="content-tip" :class="{'active': showTip}" :style="{
          background: `url(${pctip})`,
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: '5%',
          backgroundPositionY: '40%'
        }">
          <label class="tip">{{ tip }}</label>
        </div>
        <!-- 手机号 -->
        <div class="content-phone">
          <label class="area-code" :style="{
            background: `url(${downImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '80%'
          }">+86</label>
          <div class="phone">
            <span class="phone-text">{{ showPhone }}</span>
          </div>
        </div>
        <!-- 验证码 -->
        <div class="content-code">
          <div class="code-input">
            <input v-model="params.identifyCode" class="code" type="text" placeholder="请输入验证码" />
            <span class="clear-btn" :class="{'active': codeClear}"></span>
          </div>
          <button class="get-code-btn" :class="{
            'active': getCodeBtnActive
          }" type="button" @click="getIdentifyCode">{{getCodeBtnMsg}}</button>
        </div>
        <!-- 下一步 -->
        <div @click="verifyCheckIdentifyCode" class="next-btn">
          <YellowButton value="下一步" :border-radius="'4px'"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import identifyCodeService from '../../services/identifyCodeService'
import verifyService from '../../services/verifyService'
import YellowButton from './YellowButton'
export default {
  name: 'VerificationCentre',
  components: {
    YellowButton
  },
  data () {
    return {
      tip: '验证码已发送，请稍后',
      showTip: false,
      showPhone: '',
      second: undefined,
      getCodeBtnActive: false,
      params: {
        phone: '',
        identifyCode: ''
      },
      logoImg: require('../../assets/verify-logo.png'),
      pctip: require('../../assets/pctip.png'),
      downImg: require('../../assets/pcdown.png')
    }
  },
  created () {
    if (this.$route.params.user === undefined) return
    this.params.phone = this.$route.params.user
    this.showPhone = ''
    this.showPhone += this.params.phone.substring(0, 3) + '****' + this.params.phone.substring(7)
  },
  methods: {
    getIdentifyCode () {
      if (this.second !== undefined && this.second !== 0) return
      console.log(this.params.phone)
      if (this.params.phone === '') {
        this.tip = '手机号为空'
        this.showTip = true
        return
      }
      // 获取验证码之前，要先判断 ticket 是否已过期，如果已过期，提示
      verifyService.checkExistsTicket(this.params.phone).then(response => {
        console.log(response)
        if (response.requestStatus === 0) {
          let responseData = response.responseData
          let checkResult = responseData.checkTicketExistsInfo
          if (checkResult) { // 存在 ticket，发送验证码
            console.log('获取验证码')
            identifyCodeService.getIdentifyCode(this.params.phone).then(response => {
              console.log(response)
              if (response.requestStatus === 0) {
                this.second = 60
                this.getCodeBtnActive = true
                this.showTip = true
                let timer = setInterval(() => {
                  this.second--
                  if (this.second === 0) {
                    this.getCodeBtnActive = false
                    this.showTip = false
                    clearInterval(timer)
                  }
                }, 1000)
              } else {
                this.tip = '系统繁忙, 请稍后再试'
                this.showTip = true
              }
            })
          } else { // 不存在 ticket，或 ticket 已过期，提示
            this.tip = responseData.failMessage.message
            this.showTip = true
            // 不存在 ticket 或 ticket 已过期，返回找回登录密码页面
            console.log('不存在 ticket 或 ticket 已过期，返回找回登录密码页面')
            setTimeout(() => {
              this.$router.push({name: 'UserRetrievePassword'})
            }, 1000)
          }
        } else {
          this.tip = '系统繁忙, 请稍后再试'
          this.showTip = true
        }
      })
    },
    verifyCheckIdentifyCode () {
      console.log('二次校验')
      if (this.params.phone === '' || this.params.identifyCode === '') {
        this.tip = '手机号或验证码为空'
        this.showTip = true
        return
      }
      verifyService.verifyCheckIdentifyCode(this.params).then(response => {
        console.log(response)
        if (response.requestStatus === 0) {
          let data = response.responseData
          let infoData = data.verifyCheckIdentifyCodeInfo
          if (infoData === false) {
            this.tip = data.failMessage.message
            this.showTip = true
          } else {
            let user = infoData.user
            let ticket = infoData.ticket
            this.$router.push({name: 'UserRetrievePassword', query: {user: user, ticket: ticket}})
          }
        } else {
          this.tip = '系统繁忙, 请稍后再试'
          this.showTip = true
        }
      })
    }
  },
  computed: {
    codeClear () {
      return this.params.code !== ''
    },
    getCodeBtnMsg () {
      if (this.second === undefined || this.second === 0) return '获取验证码'
      else return this.second + 's后重新获取'
    }
  }
}
</script>

<style scoped>
  .app-container {
    width: 52%;
    margin: 0 auto;
    margin-top: 8px;
  }
  .header {
    height: 70px;
    font-size: 28px;
    color: #999999;
    border-bottom: 3px solid #1db9aa;
    overflow: hidden;
  }
  .header .logo {
    margin-top: 8px;
    margin-left: 1px;
    height: 54px;
    line-height: 54px;
    padding-left: 102px;
  }

  .wrapper {
    min-height: 335px;
    position: relative;
    border-bottom: 1px solid #e1e1e1;
  }
  .wrapper .content {
    width: 370px;
    position: absolute;
    top: 50%;
    left: 53%;
    margin-left: -180px;
    margin-top: -117px;
  }
  .content .content-text .text {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #333;
  }

  .content .content-tip {
    width: 310px;
    margin-top: 13px;
    height: 36px;
    padding-left: 40px;
    box-sizing: border-box;
    white-space: normal;
    overflow: hidden;
    visibility: hidden;
  }
  .content .content-tip.active {
    visibility: visible;
  }
  .content-tip .tip {
    display: inline-block;
    margin: 0;
    height: 36px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #592d00;
    vertical-align: sub;
  }

  .content .content-phone {
    position: relative;
    width: 310px;
    margin-top: 10px;
    display: inline-block;
    display: -ms-flexbox;
    display: flex;
    border: 1px solid rgba(0,0,0,.12);
    border-radius: 2px;
    box-sizing: border-box;
  }
  .content-phone .area-code {
    padding-right: 10px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0,0,0,.84);
    display: inline-block;
    width: 83px;
    line-height: 32px;
    height: 32px;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
  }
  .content-phone .phone {
    display: inline-block;
    border-left: 1px solid rgba(0,0,0,.12);
    position: relative;
    box-sizing: border-box;
  }
  .content-phone .phone .phone-text {
    width: 82px;
    line-height: 32px;
    height: 32px;
    margin-left: 6px;
    font-size: 14px;
    color: rgba(0,0,0,.84);
    letter-spacing: -.34px;
    padding-right: 17px;
  }

  .content .content-code {
    margin-top: 10px;
    position: relative;
    display: inline-block;
    display: -ms-flexbox;
    display: flex;
    width: 310px;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    padding: 0;
    box-sizing: border-box;
  }
  .content-code .code-input {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
  }
  .content-code .clear-btn {
    position: absolute;
    width: 13px;
    height: 13px;
    display: none;
    right: 11px;
    top: 14px;
    cursor: pointer;
  }
  .content-code .clear-btn.active {
    display: inline;
  }
  .content-code .clear-btn::before {
    content: "";
    position: absolute;
    width: 12px;
    height: 1px;
    background-color: #c5c6cb;
    transform: rotate(45deg);
    border-radius: 1px;
    bottom: 10px;
  }
  .content-code .clear-btn::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 1px;
    background-color: #c5c6cb;
    transform: rotate(-45deg);
    border-radius: 1px;
    bottom: 10px;
  }
  .content-code .code-input .code {
    display: inline-block;
    line-height: 32px;
    width: 200px;
    height: 32px;
    padding-left: 7px;
    font-size: 14px;
    color: #222;
    background: 0 0;
    letter-spacing: -.34px;
    box-sizing: border-box;
    outline: 0;
    border: none;
  }

  .content-code .get-code-btn {
    color: #fe8c00;
    cursor: pointer;
    display: inline-block;
    width: 104px;
    line-height: 32px;
    height: 32px;
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    background: 0 0;
    outline: 0;
    text-align: center;
    border: none;
    border-left: 1px solid rgba(0,0,0,.12);
    overflow: hidden;
  }
  .content-code .get-code-btn.active {
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.25);
  }

  .content .next-btn {
    border-radius: 4px;
    margin-top: 12px;
    width: 310px;
    line-height: 40px;
    height: 40px;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    list-style: none;
    color: #222;
    text-align: center;
    cursor: pointer;
  }
  .next-btn >>>.yellow-btn {
    font-size: 16px;
  }
</style>
