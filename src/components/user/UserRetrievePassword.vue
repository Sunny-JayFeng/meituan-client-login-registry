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
    <!-- 遮罩层 -->
    <div class="passport-mask" v-show="showSlider"></div>

    <div class="retrieve-password-wrapper">
      <!-- 找回密码文字信息 -->
      <div class="tip-wrapper">
        <span class="message">找回登录密码</span>
        <el-divider class="message-line" direction="horizontal"></el-divider>
      </div>
      <!-- 步骤条 -->
      <ul class="steps-wrapper" >
        <li class="step-item" :class="{
          'current': stepCurrent === index + 1
        }" v-for="(item, index) in stepItems" :key="index">
          <span class="step-content">{{item}}</span>
        </li>
      </ul>
      <div class="step-item-options-wrapper">
        <div class="step-op step-1-op" :class="{
          'current': stepCurrent === 1
        }">
          <div class="step-1-title">请填写你要找回密码的美团账号</div>
          <input v-model="params.account" type="text" class="user-input" placeholder="手机号/用户名/邮箱" maxlength="32" />
          <button @click="nextStep" class="btn next-step-btn" :disabled="nextStepDisabled">下一步</button>
        </div>
        <!-- 从第一步到第二步过度的时候，触发滑块验证 -->
        <vue-simple-verify v-show="showSlider" ref="verify" @success="sliderValidation" />
        <div class="step-op step-2-op" :class="{
          'current': stepCurrent === 2
        }">
          <div class="sm-container">
            <div class="img-wrapper">
              <img v-show="!smError" class="sm-outer-img" :src="smOuterImg" alt="智能检测" />
              <img v-show="!smError" class="sm-inner-img" :src="smInnerImg" alt="智能检测" />
              <img v-show="smError" class="sm-error-img" :src="smErrorImg" alt="智能检测" />
            </div>
            <div class="text-wrapper">{{smText}}</div>
          </div>
        </div>
        <div class="step-op step-3-op" :class="{
          'current': stepCurrent === 3
        }">
          <div class="step3-title">请为你的账号 {{params.account}} 设置一个新的密码</div>
          <div class="password-input-wrapper">
            <input v-model="params.newPassword" :type="pwInputType" class="password-input" placeholder="请设置8-32位(数字+字母)" maxlength="32" minlegnth="8" />
            <img class="clear" :src="clearImg" v-show="params.newPassword !== ''" @click="params.newPassword = ''"/>
            <img class="show-pw" :src="pwImg" @click="changeInputPwType" />
          </div>
          <button class="btn save-new-pw-btn" @click="saveNewPassword">保存新密码</button>
          <TipMessage
            v-show="showNewPwTip"
            extract-class="new-pw-tip"
            :tip-message="newPwTip"
            tip-icon="tipIcons"
            icon-extract-class="error-tip"
          />
        </div>
        <div class="step-op step-4-op" :class="{
          'current': stepCurrent === 4
        }">
          <h3 class="retrieve-tips">恭喜您已成功修改了登录密码</h3>
          <p class="retrieve-tips">您的登录密码已经重新设置，请妥善保管</p>
          <router-link :to="{name: 'UserLogin'}" class="btn">立即登录</router-link>
        </div>
      </div>
    </div>

    <BottomNav :navContentList="navContentList" extractClass="bottom-wrapper" />

  </div>
</template>

<script>
import userRetrievePasswordService from '../../services/userRetrievePasswordService'
import TopNav from './TopNav'
import BottomNav from './BottomNav'
import TipMessage from './TipMessage'
export default {
  name: 'UserRetrievePassword',
  components: {
    TopNav,
    BottomNav,
    TipMessage
  },
  data () {
    return {
      loading: true,
      stepItems: ['1.确认账号', '2.安全校验', '3.设置密码', '4.完成'],
      stepCurrent: 1,
      showSlider: false,
      showPw: false,
      pwInputType: 'password',
      pwImg: require('../../assets/closeEye.png'),
      clearImg: require('../../assets/clear.png'),
      eyeImg: require('../../assets/eye.png'),
      closeEyeImg: require('../../assets/closeEye.png'),
      smOuterImg: require('../../assets/sm-outer.png'),
      smInnerImg: require('../../assets/sm-inner.png'),
      smErrorImg: require('../../assets/sm-error.png'),
      smText: '正在进行智能安全检测...',
      smError: false,
      showNewPwTip: false,
      newPwTip: '',
      params: {
        account: '', // 账号
        newPassword: '', // 新密码
        ticket: ''// 如果需要二次验证，这个 ticket 会有值，保存新密码的时候后端需要校验一遍
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
  created () {
    this.setParams()
  },
  methods: {
    // url 参数赋值
    setParams () {
      this.params.account = this.$route.query.user
      this.params.ticket = this.$route.query.ticket
      // 如果经过参数解析赋值之后，账号跟通行证都不为空，证明是通过了二次验证的，直接跳到第三步
      if (this.params.account !== '' && this.params.account !== undefined && this.params.ticket !== '' && this.params.ticket !== undefined) {
        this.stepCurrent = 3
      } else { // 如果缺了其中一个，则都设置为空字符串
        this.params.account = ''
        this.params.ticket = ''
      }
    },
    // 输入账号之后点击下一步，触发滑块验证
    nextStep () {
      let loading = this.$loading({
        lock: false,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // 关闭“加载中”
      setTimeout(() => {
        loading.close()
        this.showSlider = true
      }, 1500)
    },
    // 滑块验证回调方法
    sliderValidation () {
      setTimeout(() => {
        this.showSlider = false
        // 验证通过，去到下一步：安全校验
        this.checkAccountSafe()
      }, 1000)
    },
    // 检测账号的安全性
    checkAccountSafe () {
      this.stepCurrent = 2 // 来到第 2 步
      // 模拟检测样式
      let timer = setInterval(() => {
        if (this.smText === '正在进行智能安全检测...') this.smText = '正在检测您的账户环境...'
        else if (this.smText === '正在检测您的账户环境...') this.smText = '正在检测当前账号状态...'
      }, 1000)
      setTimeout(() => {
        clearInterval(timer) // 初步检测完成
        userRetrievePasswordService.checkAccountSafe(this.params.account).then(response => {
          console.log(response)
          if (response.requestStatus === 0) {
            let data = response.responseData
            let checkResult = data.checkAccountSafeInfo
            if (checkResult !== true) { // 安全校验不通过
              let failMessage = data.failMessage.message
              this.smError = true
              this.smText = failMessage
              if (checkResult !== false) { // 返回的checkAccountSafeInfo 是一个手机号，证明需要二次验证
                setTimeout(() => { // 提示信息展示 1 秒后跳转到二次验证页面
                  console.log('需要二次验证，跳转到二次验证页面')
                  this.$router.push({name: 'VerificationCentre', params: {user: checkResult}})
                }, 1000)
              }
            } else { // 不需要二次验证
              this.stepCurrent = 3
              this.smText = '正在进行智能安全检测...'
            }
          }
        })
      }, 4000)
    },
    // 改变密码样式
    changeInputPwType () {
      this.showPw = !this.showPw
      if (this.showPw) { // 明文显示密码
        this.pwInputType = 'text'
        this.pwImg = this.eyeImg
      } else { // 显示小黑点
        this.pwInputType = 'password'
        this.pwImg = this.closeEyeImg
      }
    },
    // 保存新密码
    saveNewPassword () {
      if (this.params.newPassword === '') {
        this.showNewPwTip = true
        this.newPwTip = '密码不能为空'
        return
      } else if (this.params.newPassword.length < 8 || this.params.newPassword.length > 32) {
        this.showNewPwTip = true
        this.newPwTip = '密码长度必须为 8 ~ 32 位（数字+字母）'
        return
      }
      this.showNewPwTip = false
      console.log('重置密码')
      userRetrievePasswordService.retrievePassword(this.params).then(response => {
        console.log(response)
        if (response.requestStatus === 0) {
          let data = response.responseData
          let result = data.retrievePasswordInfo
          if (result) { // 如果重置密码成功, 跳到第四步
            this.stepCurrent = 4
          } else { // 重置失败，提示信息
            this.showNewPwTip = true
            this.newPwTip = data.failMessage.message
          }
        } else {
          this.$message({'message': '系统繁忙', type: 'error'})
        }
      })
    }
  },
  computed: {
    nextStepDisabled () {
      if (this.params.account !== '') return false
      return true
    }
  }
}
</script>

<style scoped>
  .app-container {
    width: 100%;
    height: 100%;
  }
  .top-container{
    width: 100%;
    height: 100%;
  }
  /* 遮罩层 */
  .passport-mask {
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    z-index: 999;
  }
  /* 滑块验证 */
  >>> .simple-verify {
    z-index: 1000;
    left: 36%;
    top: -45%;
  }
  /* 中间部分定宽，两边margin自适应 */
  /* 顶部导航栏 */
  .top-container >>> .wrapper,
  .registry-wrapper .wrapper{
    position: relative;
    margin: 20px auto 0;
    width: 1190px;
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
    top: 13%;
  }
  /* 已有账号 */
  .top-container >>> .wrapper .login-btn-wrapper .have-account {
    position: relative;
    top: -1px;
    color: #666666;
    font-size: 16px;
    vertical-align: middle;
    margin-right: 5px;
  }
  /* 登录按钮 */
  .top-container >>> .wrapper .login-btn-wrapper .login-btn-content {
    display: inline-block;
    font-size: 16px;
    border-width: 0;
    border-color: rgba(191,105,0,.15);
    background-image: linear-gradient(135deg,#FFD000 0,#FFBD00 100%);
    box-shadow: 0 2px 1px rgba(191,105,0,.15);
    background-size: 100%;
    border-radius: 2px;
    padding: 2px 10px;
  }
  .top-container >>> .wrapper .login-btn-wrapper .login-btn-content .login-btn {
    font-size: 16px;
    line-height: 1.4em;
  }

  /* 找回登录密码 */
  .retrieve-password-wrapper {
    /*border: 1px solid black;*/
    width: 1190px;
    margin: 48px auto 0;
    overflow: hidden;
  }
  .retrieve-password-wrapper .tip-wrapper,
  .retrieve-password-wrapper .steps-wrapper{
    width: 100%;
  }
  /* 文字“找回登录密码” */
  .tip-wrapper .message {
    display: inline-block;
    border-bottom: 2px solid #333;
    padding: 12px 0;
    margin-bottom: -2px;
    font-size: 18px;
  }
  /* 步骤条 */
  .retrieve-password-wrapper .steps-wrapper {
    list-style: none;
    padding: 0;
    margin-bottom: 30px;
    font-size: 0;
    line-height: 0;
    background: #fff;
    border-radius: 3px;
    overflow: hidden;
    white-space: nowrap;
  }
  /* 步骤文字 */
  .steps-wrapper .step-item {
    background: #dedede;
    display: inline-block;
    width: 296px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    color: #666;
    margin-right: 2px;
  }
  /* 当前步骤 */
  .steps-wrapper .step-item.current {
    color: #222222;
    background: linear-gradient(135deg,#FFD000 0,#FFBD00 100%);
  }

  /* 每一个步骤的内容 */
  .retrieve-password-wrapper .step-item-options-wrapper {
    width: 1190px;
    border: 1px solid #DDD;
    padding: 67px 0 58px;
    background: #FFF;
    margin-bottom: 60px;
    height: 330px;
    box-sizing: border-box;
    font-size: 16px;
  }
  .retrieve-password-wrapper .step-item-options-wrapper .step-op {
    width: 300px;
    display: none;
    margin: 0 auto;
  }
  .retrieve-password-wrapper .step-item-options-wrapper .step-op.current {
    display: block;
  }
  .retrieve-password-wrapper .step-item-options-wrapper .step-op .btn {
    font-size: 16px;
    background: linear-gradient(135deg,#FFD000 0,#FFBD00 100%);
    border-radius: 8px;
    border: 1px solid #FFD000;
    text-align: center;
    color: #222222;
    height: 36px;
    line-height: 36px;
    width: 300px;
    display: inline-block;
  }

  /* 第一步 */
  .step-1-op .step-1-title {
    font-size: 16px;
    color: #333;
    margin-bottom: 50px;
  }
  .step-1-op .user-input {
    font-size: 16px;
    border: none;
    border-bottom: 1px solid #d8d8d8;
    width: 300px;
    box-sizing: border-box;
    margin-bottom: 30px;
    background-color: #fff;
    outline: none;
  }
  .step-1-op .next-step-btn,
  .step-3-op .save-new-pw-btn {
    outline: none;
    cursor: pointer;
  }
  .step-1-op .next-step-btn[disabled] {
    border: none;
    background-image: linear-gradient(135deg,#FFF5CA 0,#FFF2CC 100%);
    color: rgba(34,34,34,.5);
    cursor: not-allowed;
  }
  /* 第二步 */
  .step-2-op .img-wrapper {
    text-align: center;
    height: 100px;
    position: relative;
  }
  .step-2-op .img-wrapper .sm-outer-img,
  .step-2-op .img-wrapper .sm-error-img{
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100px;
  }
  .step-2-op .img-wrapper .sm-outer-img {
    animation: rotate 1s linear 0s normal none infinite;
    -webkit-animation: rotate 1s linear 0s normal none infinite;
  }
  .step-2-op .img-wrapper .sm-inner-img {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 50px;
  }
  .step-2-op .text-wrapper {
    text-align: center;
    padding-top: 20px;
  }

  /* 第三步 */
  .step-3-op .step3-title {
    margin-bottom: 50px;
  }
  .step-3-op .password-input-wrapper {
    position: relative;
    margin-bottom: 30px;
  }
  .step-3-op .password-input-wrapper .password-input {
    font-size: 16px;
    border: none;
    border-bottom: 1px solid #d8d8d8;
    width: 300px;
    box-sizing: border-box;
    background-color: #fff;
    outline: none;
  }
  .step-3-op .password-input-wrapper .password-input::-ms-reveal {
    display: none;
  }
  .step-3-op .password-input-wrapper .clear {
    position: absolute;
    right: 40px;
    bottom: 0;
    padding: 5px 0;
    width: 15px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .step-3-op .password-input-wrapper .show-pw {
    position: absolute;
    right: 2px;
    bottom: 0;
    padding: 7px 0;
    width: 20px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .step-3-op .save-new-pw-btn[disabled] {
    border: none;
    background-image: linear-gradient(135deg,#FFF5CA 0,#FFF2CC 100%);
    color: rgba(34,34,34,.5);
    cursor: not-allowed;
  }
  .step-3-op >>> .new-pw-tip {
    position: absolute;
    left: 59%;
    top: 44.5%;
    color: #f76120;
    font-size: 14px;
  }
  .step-3-op >>> .error-tip {
    display: inline-block;
    width: 17px;
    height: 17px;
    overflow: hidden;
    margin-right: 2px;
    vertical-align: -3px;
    background-position: 0 -296px;
  }
  /* 第四步 */
  .step-4-op .retrieve-tips {
    margin-bottom: 35px;
  }

  /* 下方导航栏 */
  >>> .bottom-wrapper {
    /*border: 1px solid black;*/
    /*margin-top: 100px;*/
    position: relative;
    height: 45px;
    width: 1190px;
    margin: 0 auto;
  }
  >>> .bottom-wrapper .el-divider--horizontal {
    margin: 12px 0;
  }
  >>> .bottom-wrapper .nav-wrapper .nav-content {
    margin-left: 400px;
  }

  /* 覆盖 element-ui 默认属性 */
  .nav-line.el-divider--horizontal {
    height: 2px;
    margin-top: 22px;
    background-color: rgb(216, 216, 216);
  }
  .message-line.el-divider--horizontal {
    height: 2px;
    margin: 0 0 19px 108px;
    background-color: rgb(216, 216, 216);
  }

</style>
