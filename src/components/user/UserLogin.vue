<template>
  <div class="app-container">
    <div class="user-login-container">

      <!-- 顶部 logo -->
      <div class="top-wrapper">
        <Logo />
      </div>

      <!-- 中间 图片 + 登录 -->
     <div class="center-wrapper">
       <!-- 图片 -->
       <div class="left-img-content">
         <img class="left-img" :src="image" />
       </div>
       <!-- 错误提示 -->
      <TipMessage
        v-show="errorTipMessage !== ''"
        :tipMessage="errorTipMessage"
        extractClass="error-tip-message"
        tipIcon="tipIcons"
        iconExtractClass="tip-status"/>
       <!-- 登录框 -->
       <div class="login-container">
         <div class="top-content">
           <span class="account-login">账号登录</span>
           <span @click="handleChangeLoginType" class="login-type" :class="{
             'common-type': !isPassword
           }">{{ loginType }}</span>
           <Icon v-if="isPassword" iconName="phoneIcon" />
           <Icon v-else iconName="personIcon" />
         </div>

         <div class="input-wrapper">
           <!-- 手机号输入框 -->
           <div class="phone-content input-content" :class="{
             active: phoneIsFocus,
             redBorder: noAccount
           }">
             <span class="plus">+</span>
             <span class="phone-prefix">86</span>
             <i class="right-arrow"></i>
             <template>
               <input @focus="phoneIsFocus = true" @blur="phoneIsFocus = false" :style="{
                 background: passwordLoginMsg.phone !== '' ? 'rgb(232, 240, 254) !important' : ''
               }" v-if="isPassword" v-model="passwordLoginMsg.phone" type="text" class="phone-number" placeholder="手机号" />
               <input @focus="phoneIsFocus = true" @blur="phoneIsFocus = false" :style="{
               background: codeLoginMsg.phone !== '' ? 'rgb(232, 240, 254) !important' : ''
               }"  v-else v-model="codeLoginMsg.phone" type="text" class="phone-number" placeholder="手机号" />
             </template>

           </div>

           <template>
             <!-- 密码输入框 -->
             <div v-if="isPassword" class="password-content input-content" :class="{
               active: passwordIsFocus,
             }">
               <Icon iconName="spNormalIcon" />
               <input @focus="passwordIsFocus = true" @blur="passwordIsFocus = false" v-model="passwordLoginMsg.password" type="password" class="password" placeholder="密码" />
             </div>
             <!-- 动态码输入框 -->
             <div v-else class="identify-code-content input-content" :class="{
               active: identifyCodeIsFocus,
             }">
               <Icon iconName="spNormalIcon" />
               <input @focus="identifyCodeIsFocus = true" @blur="identifyCodeIsFocus = false" v-model="codeLoginMsg.identifyCode" type="text" class="identify-code" placeholder="动态码" />
               <span @click="getIdentifyCode" class="get-code-btn">{{identifyCodeMsg}}</span>
             </div>
           </template>

           <div v-show="getCodeTipMsg && !isPassword" class="please-get-code-content">
             <span class="please-get-code" :style="{
               color: identifyCodeMsg === '获取手机动态码' ? '#f76120' : '#666'
             }">{{getCodeTipMsg}}</span>
           </div>
           <div class="forget-password-content">
             <!-- 后期需要改成 router-link -->
             <router-link :to="{name: 'UserRetrievePassword'}" class="forget-password">忘记密码?</router-link>
           </div>

           <div @click="handleLogin" class="login-btn-content" :class="{
             'in-login': inLogin
           }">
             <YellowButton :value="loginButtonValue" extractClass="login-btn"/>
           </div>
         </div>

         <!-- 信息提示框 -->
         <div class="message-container">
           <div v-if="isPassword" class="password-type-msg">
             <span class="no-have-account">还没有账号?</span>
             <!-- 后期需要改成 router-link -->
             <router-link :to="{name: 'UserRegistry'}" class="free-registry">免费注册</router-link>
           </div>
           <div v-else class="identify-code-type-msg">
             <span class="tip-message">提示：未注册美团账号的手机号，登录时将自动注册美团账号，且代表您已同意</span>
             <a target="_blank" href="https://rules-center.meituan.com/rules-detail/4" class="user-server-protocol">《美团点评用户服务协议》</a>
             <a target="_blank" href="https://rules-center.meituan.com/rules-detail/2" class="secret-protocol">《美团点评隐私政策》</a>
           </div>
         </div>

         <!-- 其他登录方式 -->
         <OtherLoginType extractClass="other-login-container" />
       </div>
      </div>

      <!-- 下方导航栏 -->
      <BottomNav :navContentList="navContentList" extractClass="bottom-wrapper" />

    </div>
  </div>
</template>

<script>
import userService from '../../services/userLoginService'
import identifyCodeService from '../../services/identifyCodeService'
import Logo from './Logo'
import YellowButton from './YellowButton'
import Icon from './Icon'
import BottomNav from './BottomNav'
import OtherLoginType from './OtherLoginType'
import TipMessage from './TipMessage'
export default {
  name: 'UserLogin',
  components: {
    YellowButton,
    Logo,
    Icon,
    BottomNav,
    OtherLoginType,
    TipMessage
  },
  data () {
    return {
      errorTipMessage: '',
      image: require('../../assets/banner/loginPage.jpg'),
      loginType: '手机动态码登录', // 登录方式
      isPassword: true, // 是否为密码登录，如果否，则为动态码登录
      phoneIsFocus: false, // 手机号输入框聚焦的时候，设置为 true 给予黄色边框
      passwordIsFocus: false, // 密码输入框聚焦的时候，设置为 true 给予黄色边框
      identifyCodeIsFocus: false, // 动态码输入框聚焦的时候，设置为 true 给予黄色边框
      noAccount: false, // 没有输入手机号就点登录，手机号输入框给予红色边框
      second: undefined,
      getCodeTipMsg: '',
      inLogin: false, // 正在登录
      loginButtonValue: '登录',
      passwordLoginMsg: {
        phone: '',
        password: ''
      },
      codeLoginMsg: {
        phone: '',
        identifyCode: ''
      },
      navContentList: [
        {
          content: '关于美团',
          link: 'https://www.baidu.com'
        },
        {
          content: '加入我们',
          link: ''
        },
        {
          content: '商家入驻',
          link: ''
        },
        {
          content: '帮助中心',
          link: ''
        },
        {
          content: '美团手机版',
          link: ''
        }
      ]
    }
  },
  computed: {
    identifyCodeMsg () {
      if (this.second === undefined) return '获取手机动态码'
      else if (this.second === 0) return '重新获取'
      else return '重新获取(' + this.second + ')'
    }
  },

  methods: {
    handleChangeLoginType () {
      this.isPassword = !this.isPassword
      this.errorTipMessage = ''
      if (this.loginType === '手机动态码登录') this.loginType = '普通方式登录'
      else this.loginType = '手机动态码登录'
    },
    getIdentifyCode () {
      // 无论后端验证码发送成功还是失败，前端都不做展示
      // 前端只负责，点击之后去后端请求发送验证码
      // 并且设置为不可点击，60 秒后可重新获取验证码。
      // 如果后端返回发送频繁（理论上不会触发分钟级流控制，因为前端已经设置了 60 s）
      if (!(/^1[0-9]{10}$/).test(this.codeLoginMsg.phone)) {
        this.errorTipMessage = '手机号输入不正确，请重新输入'
        return
      }
      if (this.second !== 0 && this.second !== undefined) return
      identifyCodeService.getIdentifyCode(this.codeLoginMsg.phone).then(response => {
        console.log(response)
        if (response.requestStatus === 0) {
          let responseData = response.responseData
          let sendResult = responseData.sendIdentifyCodeInfo
          if (!sendResult) {
            this.errorTipMessage = responseData.failMessage.message
          }
        }
      })
      this.second = 60
      this.getCodeTipMsg = '已发送，1分钟后可重新获取'
      let timer = setInterval(() => {
        this.second--
        if (this.second === 0) {
          this.getCodeTipMsg = ''
          clearInterval(timer)
        }
      }, 1000)
    },
    handleLogin () {
      if (this.checkMessage()) {
        this.inLogin = true
        this.loginButtonValue = '登录中...'
        if (this.isPassword) {
          userService.loginByPassword(this.passwordLoginMsg).then(response => {
            if (response.requestStatus === 0) {
              this.inLogin = false
              this.loginButtonValue = '登录'
              console.log(response)
              this.handleLoginResult(response)
            }
          })
        } else {
          userService.loginByIdentifyCode(this.codeLoginMsg).then(response => {
            if (response.data.requestStatus === 0) {
              this.inLogin = false
              this.loginButtonValue = '登录'
              console.log(response)
              this.handleLoginResult(response)
            }
          })
        }
      }
    },
    handleLoginResult (response) {
      if (response.requestStatus === null) {
        if (this.isPassword) this.errorTipMessage = '账号或密码错误，请重新输入'
        else this.errorTipMessage = '动态码错误，请重新输入'
      } else {
        console.log(response)
      }
    },
    checkMessage () {
      if (this.isPassword) {
        if (this.passwordLoginMsg.phone === '' && this.passwordLoginMsg.password === '') {
          this.errorTipMessage = '请输入账号和密码'
          return false
        } else if (this.passwordLoginMsg.phone === '') {
          this.errorTipMessage = '请输入账号'
          return false
        } else if (this.passwordLoginMsg.password === '') {
          this.errorTipMessage = '请输入密码'
          return false
        } else if (!(/^1[0-9]{10}$/).test(this.passwordLoginMsg.phone)) {
          this.errorTipMessage = '请输入正确的手机号'
          return false
        }
      } else {
        if (this.codeLoginMsg.phone === '' && this.codeLoginMsg.identifyCode === '') {
          this.errorTipMessage = '请输入手机号和动态码'
          return false
        } else if (this.codeLoginMsg.phone === '') {
          this.errorTipMessage = '请输入手机号'
          return false
        } else if (this.codeLoginMsg.identifyCode === '') {
          this.errorTipMessage = '请输入动态码'
          return false
        } else if (this.identifyCodeMsg === '获取手机动态码') {
          this.getCodeTipMsg = '请获取动态码'
          return false
        } else if (!(/^1[0-9]{10}$/).test(this.codeLoginMsg.phone)) {
          this.errorTipMessage = '手机号输入不正确，请重新输入'
          return false
        }
      }
      return true
    }
  }
}
</script>

<style scoped>
  .app-container {
    height: 100%;
  }
  .user-login-container {
    width: 970px;
    margin: 40px auto;
    position: relative;
  }

  .user-login-container .top-wrapper {
    width: 130px;
    height: 47px;
  }

  .user-login-container .center-wrapper .left-img-content {
    /*border: 1px solid black;*/
    width: 48.5%;
    margin-top: 3%;
  }

  .user-login-container .center-wrapper .login-container {
    /*border: 1px solid black;*/
    position: absolute;
    width: 275px;
    left: 60%;
    top: 130px;
  }
  .user-login-container .center-wrapper >>> .error-tip-message {
    position: absolute;
    left: 60%;
    top: 80px;
    width: 260px;
    background: #fff6db;
    padding: 8px;
    border: 1px solid #f5d8a7;
    font-size: 12px;
    color: #666;
  }
  .user-login-container .center-wrapper >>> .tip-status {
    background-position: 0 -296px;
    display: inline-block;
    width: 17px;
    height: 17px;
    margin-right: 5px;
    overflow: hidden;
    vertical-align: -3px;
  }
  .center-wrapper .login-container .top-content {
    /*border: 1px solid black;*/
    position: relative;
    color: #666;
    margin-bottom: 8px;
  }
  .center-wrapper .login-container .top-content .account-login {
    font-size: 14px;
  }
  .center-wrapper .login-container .top-content .login-type {
    position: relative;
    right: -108px;
    font-size: 13px;
    /*padding-left: 35%;*/
    margin-top: -5px;
    cursor: pointer;
  }
  .center-wrapper .login-container .top-content .common-type {
    right: -120px;
  }
  .center-wrapper .login-container .top-content i {
    position: absolute;
    top: 23%;
    right: 0;
    width: 14px;
    height: 14px;
    background-repeat: no-repeat !important;
    background-size: 100% !important;
    cursor: pointer;
  }

  .center-wrapper .input-wrapper input {
    width: 220px;
    height: 23px;
    padding: 5px;
    border: none;
  }
  .center-wrapper .input-wrapper .input-content {
    position: relative;
    border: 1px solid #aaa;
    margin-bottom: 15px;
  }
  .center-wrapper .input-wrapper .input-content input {
    font-size: 15px;
    outline: none;
  }
  .center-wrapper .input-wrapper .phone-content .plus {
    font-size: 16px;
    font-weight: 600;
    color: #aaaaaa;
  }
  .center-wrapper .input-wrapper .phone-content .phone-prefix {
    font-size: 13px;
  }
  .center-wrapper .input-wrapper .phone-content .right-arrow {
    width: 5px;
    height: 5px;
    display: inline-block;
    border-right: 1px solid #646464;
    border-top: 1px solid #646464;
    transform: rotate(45deg);
    position: absolute;
    left: 11%;
    top: 43%;
  }
  .center-wrapper .input-wrapper .phone-content .phone-prefix {
    margin-left: -5px;
    color: #646464;
  }
  .center-wrapper .input-wrapper .phone-content input {
    position: relative;
    left: 3%;
  }
  .center-wrapper .input-wrapper .password-content input,
  .center-wrapper .input-wrapper .identify-code-content input{
    position: relative;
    left: 10%;
  }
  .center-wrapper .input-wrapper .input-content i {
    position: absolute;
    width: 18px;
    height: 18px;
    top: 8px;
    left: 5px;
    background-position: -1250px -527px;
    background-repeat: no-repeat !important;
  }
  .center-wrapper .input-wrapper .input-content .get-code-btn {
    position: absolute;
    right: 2%;
    margin-top: 3.5%;
    font-size: 12px;
    color: #666;
  }
  .center-wrapper .input-wrapper .input-content .get-code-btn:hover {
    cursor: pointer;
  }
  .center-wrapper .input-wrapper .active {
    border: 1px solid #FFC300;
  }
  .center-wrapper .input-wrapper .redBorder {
    border: 1px solid #f76120;
  }

  .center-wrapper .input-wrapper .please-get-code-content {
    margin-top: -10px;
    margin-bottom: 10px;
  }
  .center-wrapper .input-wrapper .please-get-code-content .please-get-code {
    font-size: 12px;
    color: #f76120;
  }
  .center-wrapper .input-wrapper .forget-password-content {
    margin-top: -5px;
    margin-bottom: 14px;
  }
  .center-wrapper .input-wrapper .forget-password-content .forget-password {
    margin-left: 78%;
    color: #FE8C00;
    font-size: 12px;
    cursor: pointer;
  }
  .center-wrapper .input-wrapper .login-btn-content >>> .login-btn {
    font-size: 14px;
    font-weight: bold;
    padding: 3%;
    width: 100%;
    height: 100%;
  }
  .center-wrapper .input-wrapper .in-login >>> .login-btn {
    background-image: linear-gradient(135deg,#eeeeee 0,#eeeeee 100%);
    color: #bbbbbb;
  }

  .center-wrapper .message-container {
    /*margin-top: 18px;*/
  }
  .center-wrapper .message-container .password-type-msg {
    margin-top: 5px;
  }
  .center-wrapper .message-container .password-type-msg .no-have-account {
    font-size: 14px;
    color: #666;
  }
  .center-wrapper .message-container .password-type-msg .free-registry {
    font-size: 14px;
    color: #FE8C00;
    margin-left: 5px;
  }

  .center-wrapper .message-container .identify-code-type-msg {
    margin-top: 18px;
    line-height: 1.4em;
    font-size: 12px;
  }
  .center-wrapper .message-container .identify-code-type-msg .tip-message {
    color: #999;
    font-size: 12px;
  }
  .center-wrapper .message-container .identify-code-type-msg a {
    color: #FE8C00;
    font-size: 12px;
  }

  .center-wrapper >>> .other-login-container {
    /*border: 1px solid black;*/
    position: relative;
    margin-top: 25px;
    text-align: center;
  }

  >>> .bottom-wrapper {
    /*border: 1px solid black;*/
    /*margin-top: 100px;*/
    position: relative;
    top: 60px;
    height: 45px;
  }

  /*去除 element-ui 自带css*/
  >>> .el-divider--horizontal {
    margin: 0;
  }
</style>
