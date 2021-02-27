<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <div class="top-container">
      <TopNav
        wrapper-class="wrapper"
        content-class="content"
        login-btn-wrapper-class="login-btn-wrapper"
        have-account-class="have-account"
        router-link-class="login-btn-content"
        yellow-btn-class="login-btn"/>
      <el-divider class="nav-line" direction="horizontal"></el-divider>
    </div>

    <!-- 注册 -->
    <div class="registry-wrapper">
      <div class="wrapper">
        <div class="input-wrapper">
          <!-- 手机号输入框wrapper -->
          <div class="phone-wrapper text-input-wrapper">
            <label class="phone-text">手机号</label>
            <input
              v-model="registryMessage.phone"
              @focus="showCommonUse = showPhoneTip = false"
              @blur="handlePhoneBlur"
              type="text"
              class="phone-input"
              :class="{
                active: phoneTipStatus === 'error-tip'
              }"/>
            <TipMessage
              v-show="showCommonUse"
              extract-class="in-common-use"
              tip-message="注册成功后，全美团通用" />
            <TipMessage
              v-show="showPhoneTip"
              extract-class="tip"
              :tip-message="phoneErrorTip"
              tip-icon="tipIcons"
              :icon-extract-class="phoneTipStatus + ' tip-status'"/>
          </div>
          <!-- 获取动态码按钮 -->
          <div class="get-code-btn-wrapper">
            <input @click="handleGetIdentifyCode" type="button" class="get-code-btn" :class="{
              'send-active': this.second !== 0 && this.second !== undefined
            }" :value="identifyCodeMsg"/>
            <TipMessage extract-class="code-tip-msg" :class="{
              'get-code-error': getCodeBusy || this.getCodeTipMsg === '该手机号已经注册，请直接登录或找回密码',
            }" :tip-message="getCodeTipMsg" />
          </div>
          <!-- 动态码输入框wrapper -->
          <div class="identify-code-wrapper text-input-wrapper">
            <label class="identify-code-text">短信动态码</label>
            <input
              v-model="registryMessage.identifyCode"
              @focus="showCodeTip = false"
              @blur="handleCodeBlur"
              type="text"
              class="identify-code-input"
              :class="{
                active: codeTipStatus === 'error-tip'
              }"/>
            <TipMessage
              v-show="showCodeTip"
              extract-class="tip"
              :tip-message="codeErrorTip"
              tip-icon="tipIcons"
              :icon-extract-class="codeTipStatus + ' tip-status'"/>
          </div>
          <!-- 创建密码输入框wrapper -->
          <div class="create-password-wrapper text-input-wrapper">
            <label class="create-password-text">创建密码</label>
            <input
              v-model="registryMessage.password"
              @focus="showCreatePasswordTip = false"
              @blur="handlePasswordBlur"
              type="password"
              class="password-input"
              :class="{
                active: passwordTipStatus === 'error-tip'
              }"/>
            <TipMessage
              v-show="showCreatePasswordTip"
              extract-class="tip phone-tip"
              :tip-message="passwordErrorTip"
              tip-icon="tipIcons"
              :icon-extract-class="passwordTipStatus + ' tip-status'"/>
          </div>
          <!-- 密码安全级别 -->
          <PasswordLevel
            pwLevelWrapperClass="password-level-wrapper"
            pw-level-bg-color-class="password-level-color"
            :pw-level="getPwLevel"
            pw-level-text-wrapper-class="password-level-text"
            pw-level-text-class="password-level"
            last-pw-level-class="level-no-border"
            />
          <!-- 再次输入密码wrapper -->
          <div class="confirm-password-input-wrapper text-input-wrapper">
            <label class="confirm-password-text">确认密码</label>
            <input
              v-model="confirmPassword"
              @focus="showConfirmPasswordTip = false"
              @blur="handleConfirmPasswordBlur"
              type="password"
              class="confirm-password-input"
              :class="{
                active: confirmPasswordTipStatus === 'error-tip'
              }"/>
            <TipMessage
              v-show="showConfirmPasswordTip"
              extract-class="tip"
              :tip-message="confirmPasswordErrorTip"
              tip-icon="tipIcons"
              :icon-extract-class="confirmPasswordTipStatus + ' tip-status'"/>
          </div>
        </div>
        <div class="registry-btn-wrapper">
            <input @click="handleRegistry" type="button" class="registry-btn" value="同意以下协议并注册"/>
        </div>
        <!-- 协议 -->
        <div class="protocol-wrapper">
          <a target="_blank" href="https://rules-center.meituan.com/rules-detail/4" class="user-server-protocol">《美团点评用户服务协议》</a>
          <a target="_blank" href="https://rules-center.meituan.com/rules-detail/2" class="secret-protocol">《美团点评隐私政策》</a>
        </div>
      </div>
    </div>
    <el-divider class="bottom-line" direction="horizontal"></el-divider>
  </div>
</template>

<script>
import userRegistryService from '../../services/userRegistryService'
import identifyCodeService from '../../services/identifyCodeService'
import TopNav from './TopNav'
import Logo from './Logo'
import TipMessage from './TipMessage'
import PasswordLevel from './PasswordLevel'
export default {
  name: 'UserRegistry',
  components: {
    TopNav,
    Logo,
    TipMessage,
    PasswordLevel
  },
  data () {
    return {
      getCodeTipMsg: '',
      getCodeBusy: false,
      second: undefined, // 获取验证码倒数计时（重新获取）
      // 是否显示输入框后面的提示信息（错误信息）
      showCommonUse: true, // 注册成功后全美团通用
      showPhoneTip: false,
      showCodeTip: false,
      showCreatePasswordTip: false,
      showConfirmPasswordTip: false,
      // 错误信息
      phoneErrorTip: '',
      codeErrorTip: '',
      passwordErrorTip: '',
      confirmPasswordErrorTip: '',
      // 提示信息图标
      phoneTipStatus: '',
      codeTipStatus: '',
      passwordTipStatus: '',
      confirmPasswordTipStatus: '',
      registryMessage: {
        userName: '',
        image: '', // 给上注册后默认的头像的图片 url（存在于文件服务器中）
        phone: '',
        password: '',
        identifyCode: ''
      },
      // 重复输入密码
      confirmPassword: ''
    }
  },
  methods: {
    // 输入框失焦事件
    handlePhoneBlur () {
      this.showPhoneTip = true
      if (this.registryMessage.phone === '') {
        this.phoneErrorTip = '请输入您的手机号码'
      } else if (!(/^1[0-9]{10}$/).test(this.registryMessage.phone)) {
        this.phoneErrorTip = '请输入正确的11位手机号码'
      } else {
        this.phoneTipStatus = 'ok-tip'
        this.phoneErrorTip = ''
        return true
      }
      this.phoneTipStatus = 'error-tip'
      return false
    },
    handleGetIdentifyCode () {
      if (!this.handlePhoneBlur()) return
      if (this.second !== 0 && this.second !== undefined) {
        this.getCodeTipMsg = '操作过于频繁，请60秒后重试'
        this.getCodeBusy = true
        return
      }
      this.getCodeBusy = false
      if (this.phoneTipStatus === 'ok-tip') {
        userRegistryService.checkPhoneExist(this.registryMessage.phone).then(response => {
          if (response.requestStatus === 0) {
            console.log(response)
            if (response.responseData.checkPhoneExist) {
              console.log('手机号已被注册')
              this.getCodeTipMsg = '该手机号已经注册，请直接登录或找回密码'
            } else {
              identifyCodeService.getIdentifyCode(this.registryMessage.phone).then(response => {
                console.log(response)
                if (response.requestStatus === 0) {
                  let data = response.responseData
                  if (data.sendIdentifyCodeInfo) { // 发送成功返回 true
                    this.second = 60
                    this.getCodeTipMsg = '已发送，1分钟后可重新获取。'
                    let timer = setInterval(() => {
                      this.second--
                      if (this.second === 0) {
                        this.getCodeTipMsg = ''
                        clearInterval(timer)
                      }
                    }, 1000)
                  } else { // 否则发送失败
                    this.getCodeBusy = true
                    this.getCodeTipMsg = data.failMessage.message
                  }
                } else {
                  this.getCodeTipMsg = '系统繁忙'
                }
              })
            }
          } else {
            this.getCodeTipMsg = '系统繁忙'
          }
        })
      }
    },
    handleCodeBlur () {
      this.showCodeTip = true
      let identifyCode = this.registryMessage.identifyCode
      if (identifyCode === '') {
        this.codeErrorTip = '请输入短信动态码'
      } else if (identifyCode.length !== 6) {
        this.codeErrorTip = '输入错误，请重新输入'
      } else {
        this.codeTipStatus = 'ok-tip'
        this.codeErrorTip = ''
        return true
      }
      this.codeTipStatus = 'error-tip'
      return false
    },
    handlePasswordBlur () {
      this.showCreatePasswordTip = true
      let password = this.registryMessage.password
      if (password === '') {
        this.passwordErrorTip = '请填写密码'
      } else if (password.length < 8) {
        this.passwordErrorTip = '密码太短，至少8个字符'
      } else if (password.length > 32) {
        this.passwordErrorTip = '密码太长，最多32个字符'
      } else {
        this.passwordTipStatus = 'ok-tip'
        this.passwordErrorTip = ''
        return true
      }
      this.passwordTipStatus = 'error-tip'
      return false
    },
    handleConfirmPasswordBlur () {
      this.showConfirmPasswordTip = true
      if (this.confirmPassword === '') {
        this.confirmPasswordErrorTip = '请再次输入密码'
      } else if (this.confirmPassword !== this.registryMessage.password) {
        this.confirmPasswordErrorTip = '两次输入的密码不一致，请重新输入'
      } else {
        this.confirmPasswordErrorTip = ''
        this.confirmPasswordTipStatus = 'ok-tip'
        return true
      }
      this.confirmPasswordTipStatus = 'error-tip'
      return false
    },
    // 注册
    handleRegistry () {
      let phone = this.handlePhoneBlur()
      let code = this.handleCodeBlur()
      let password = this.handlePasswordBlur()
      let confirmPassword = this.handleConfirmPasswordBlur()
      if (phone && code && password && confirmPassword) {
        userRegistryService.userRegistry(this.registryMessage).then(response => {
          console.log(response)
          if (response.requestStatus === 0) {
            let data = response.responseData
            if (!data.userRegistryInfo) { // 注册不成功返回 false, 注册成功返回 user 对象
              this.getCodeBusy = true
              this.getCodeTipMsg = data.failMessage.message
              this.$message.error(data.failMessage.message)
            } else {
              this.$message({message: '注册成功', type: 'success'})
              this.resetMessage()
            }
          }
        })
      }
    },
    resetMessage () {
      this.registryMessage = {
        userName: '',
        image: '', // 给上注册后默认的头像的图片 url（存在于文件服务器中）
        phone: '',
        password: '',
        identifyCode: ''
      }
      this.confirmPassword = ''
      this.showPhoneTip = false
      this.showCodeTip = false
      this.showCreatePasswordTip = false
      this.showConfirmPasswordTip = false
    },
    // 计算密码的安全级别
    charMode (charCode) {
      if (charCode >= 48 && charCode <= 57) return 1
      else if (charCode >= 65 && charCode <= 90) return 2
      else if (charCode >= 97 && charCode <= 122) return 4
      else return 8
    },
    bitTotal (num) {
      let modes = 0
      for (let i = 0; i < 4; i++) {
        if (num && 1) modes++
        num >>>= 1
      }
      return modes
    }
  },
  computed: {
    identifyCodeMsg () {
      if (this.second === undefined) return '免费获取短信动态码'
      else if (this.second === 0) return '重新获取'
      else return '重新获取(' + this.second + ')'
    },
    getPwLevel () {
      let password = this.registryMessage.password
      if (password === '') return ''
      else if (password.length <= 8) return 'weak'
      else if (password.length > 32) return 'strong'
      else {
        let modes = 0
        for (let i = 0; i < password.length; i++) {
          modes |= this.charMode(password.charCodeAt(i))
        }
        let level = this.bitTotal(modes)
        if (level === 1) return password.length > 18 ? 'normal' : 'weak'
        else if (level === 2) return 'normal'
        else if (level === 3) return 'strong'
        return ''
      }
    }
  }
}
</script>

<style scoped>
  .app-container {
    width: 100%;
    height: 100%;
  }
  .top-container,
  .registry-wrapper{
    width: 100%;
    height: 100%;
  }
  /* 中间部分定宽，两边margin自适应 */
  .top-container >>> .wrapper,
  .registry-wrapper .wrapper{
    position: relative;
    margin: 10px auto 0;
    width: 980px;
    height: 100%;
  }
  .top-container >>> .wrapper .content {
    width: 99px;
    height: 36px;
  }
  /* 已有账号-登录 */
  .top-container >>> .wrapper .login-btn-wrapper {
    position: absolute;
    right: 1px;
    top: 20%;
  }
  /* 已有账号 */
  .top-container >>> .wrapper .login-btn-wrapper .have-account {
    position: relative;
    top: -1px;
    color: #666666;
    font-size: 14px;
    vertical-align: sub;
    margin-right: 9px;
  }
  /* 登录按钮 */
  .top-container >>> .wrapper .login-btn-wrapper .login-btn-content {
    display: inline-block;
    font-size: 12px;
    border-width: 0;
    border-color: rgba(191,105,0,.15);
    background-image: linear-gradient(135deg,#FFD000 0,#FFBD00 100%);
    box-shadow: 0 2px 1px rgba(191,105,0,.15);
    background-size: 100%;
    border-radius: 2px;
    padding: 1px 10px 2px;
  }
  .top-container >>> .wrapper .login-btn-wrapper .login-btn-content .login-btn {
    font-size: 12px;
    letter-spacing: .1em;
  }

  /* 注册wrapper */
  .registry-wrapper .wrapper .input-wrapper {
    position: relative;
  }
  /* 所有input */
  .registry-wrapper .wrapper >>> .text-input-wrapper input {
    width: 248px;
    height: 24px;
    padding: 5px;
    outline: none;
    border: 1px solid #aaa;
  }
  .registry-wrapper .wrapper .input-wrapper .text-input-wrapper input:focus {
    border-color: #FFC300;
  }
  .registry-wrapper .wrapper .input-wrapper input.active {
    border-color: #f76120;
  }
  /* 各个input的wrapper */
  .registry-wrapper .wrapper .input-wrapper>div,
  .registry-wrapper .wrapper .registry-btn-wrapper{
    padding: 8px 0 8px 110px;
  }

  /* 输入框前面的信息 */
  .registry-wrapper .wrapper .input-wrapper label {
    position: absolute;
    left: 0;
    width: 100px;
    padding-top: 6px;
    font-size: 14px;
    text-align: right;
    color: #333;
  }
  /* 各个输入框的wrapper有padding */
  .registry-wrapper .wrapper .input-wrapper .get-code-btn-wrapper,
  .registry-wrapper .wrapper .input-wrapper .password-level-wrapper,
  .registry-wrapper .wrapper .input-wrapper .identify-code-wrapper,
  .registry-wrapper .wrapper .protocol-wrapper{
    padding: 0 0 8px 110px;
  }
  /* 获取动态码按钮 */
  .registry-wrapper .wrapper .get-code-btn-wrapper .get-code-btn {
    /*width: 136px;*/
    height: 21px;
    color: #333;
    font-size: 12px;
    padding: 1px 8px 0;
    border: 1px solid #e3e3e3;
    background-image: linear-gradient(to bottom,#f7f7f7,#dedede);
    border-bottom: 1px solid #aaa;
    background-size: 100%;
    line-height: 1.5;
    letter-spacing: .1em;
    text-align: center;
    cursor: pointer;
    user-select: none;
    outline: none;
  }
  .registry-wrapper .wrapper .get-code-btn-wrapper .get-code-btn:active {
    color: #333;
    background-color: #efeffe;
    border: 1px solid #ddd;
    border-bottom: 1px solid #aaa;
    background-size: 100%;
    background-image: linear-gradient(to bottom,#ddd,#eee);
  }
  /* 获取动态码按钮，鼠标移入时改变样式 */
  .wrapper >>> .get-code-btn-wrapper .get-code-btn:hover {
    background-image: none;
  }
  .registry-wrapper .wrapper .get-code-btn-wrapper .send-active,
  .registry-wrapper .wrapper .get-code-btn-wrapper .send-active:active {
    color: #bbbbbb;
    border: 1px solid #eeeeee;
    background-color: #eeeeee;
    cursor: not-allowed;
    background-image: linear-gradient(to bottom,#eee,#eee);
    background-size: 100%;
  }
  .registry-wrapper .wrapper .get-code-btn-wrapper >>> .code-tip-msg {
    font-size: 13px;
    color: #666666;
    background-color: #fff;
  }
  .registry-wrapper .wrapper .get-code-btn-wrapper >>> .get-code-error {
    color: #f76120;
  }

  /* 注册按钮 */
  .registry-wrapper .wrapper .registry-btn-wrapper .registry-btn{
    width: 178px;
    height: 34px;
    font-weight: bold;
    font-size: 14px;
    border-radius: 2px;
    color: #222;
    background-image: linear-gradient(135deg,#FFD000 0,#FFBD00 100%);
    border-width: 0;
    box-shadow: 0 2px 1px rgba(191,105,0,.15);
    background-size: 100%;
    line-height: 1.5;
    letter-spacing: .1em;
    text-align: center;
    cursor: pointer;
    user-select: none;
    outline: none;
  }

  /* 提示信息：注册成功后，全美团通用 */
  .registry-wrapper .wrapper .input-wrapper .phone-wrapper .in-common-use {
    margin-left: 3.5px;
    padding: 6px 0;
    line-height: 24px;
    font-size: 12px;
    color: #999;
    margin-right: 2px;
    zoom: 1;
  }
  /* 各个输入框后面的提示信息 */
  .registry-wrapper .wrapper .input-wrapper >>> .tip {
    width: 260px;
    padding: 8px;
    font-size: 12px;
    color: #666;
    margin-left: -5px;
  }
  /* 各个输入框后面的提示的图标 */
  .registry-wrapper .wrapper .input-wrapper >>> .tip-status {
    display: inline-block;
    width: 17px;
    height: 17px;
    overflow: hidden;
    margin-right: 2px;
    vertical-align: -3px;
  }
  /* 成功提示图标 */
  .registry-wrapper .wrapper .input-wrapper >>> .ok-tip {
    background-position: 0 -453px;
  }
  /* 错误提示图标 */
  .registry-wrapper .wrapper .input-wrapper >>> .error-tip {
    background-position: 0 -296px;
  }
  /* 密码安全级别 */
  .registry-wrapper .wrapper .input-wrapper >>> .password-level-wrapper {
    position: relative;
    width: 260px;
    height: 20px;
    background: #eee;
    padding: 0;
    margin-left: 110px;
  }
  .registry-wrapper .wrapper .input-wrapper >>> .password-level-wrapper .password-level-color {
    background: #d3ebee;
    height: 20px;
    width: 0;
    overflow: hidden;
    transition: all .4s linear;
    -webkit-transition: all .4s linear;
    -moz-transition: all .4s linear;
    -o-transition: all .4s linear;
  }
  /* 安全级别对应颜色 */
  .registry-wrapper .wrapper .input-wrapper >>> .password-level-wrapper .password-level-color.weak {
    width: 85px;
    background: #f76120;
  }
  .registry-wrapper .wrapper .input-wrapper >>> .password-level-wrapper .password-level-color.normal {
    width: 172px;
    background: #ff8900;
  }
  .registry-wrapper .wrapper .input-wrapper >>> .password-level-wrapper .password-level-color.strong {
    width: 260px;
    background: #5bab3c;
  }
  .registry-wrapper .wrapper .input-wrapper >>> .password-level-wrapper .password-level-text {
    position: absolute;
    top: 0;
  }
  .input-wrapper >>> .password-level-wrapper .password-level-text .password-level {
    display: block;
    float: left;
    text-align: center;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    width: 85px;
    border-right: 2px solid #fff;
    color: #fff;
  }
  .input-wrapper >>> .password-level-wrapper .password-level-text .level-no-border {
    border: none;
  }

  .registry-wrapper .wrapper .protocol-wrapper {
    padding: 3px 0 8px 110px;
  }
  .registry-wrapper .wrapper .protocol-wrapper a{
    font-size: 13px;
    color: #FE8C00;
  }
  /* 覆盖 element-ui 默认属性 */
  .nav-line.el-divider--horizontal {
    height: 2px;
    margin-top: 14px;
    background-color: rgb(216, 216, 216);
  }
  .bottom-line.el-divider--horizontal {
    background-color: #eeeeee;
    margin-top: 26px;
  }
</style>
