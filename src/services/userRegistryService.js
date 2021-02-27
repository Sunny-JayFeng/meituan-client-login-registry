import { request } from '@/util/request'

export default {

  /**
   * 用户注册
   * @param userMessage
   * @returns {Promise<*>}
   */
  async userRegistry (userMessage) {
    return request({
      method: 'POST',
      url: '/user/registry',
      data: userMessage
    })
  },

  /**
   * 检验手机号是否已被注册
   * @param phone
   * @returns {Promise<*>}
   */
  async checkPhoneExist (phone) {
    return request({
      method: 'GET',
      url: '/user/checkPhoneExist/' + phone,
      data: null
    })
  },

  async resetPasswordByPhone (resetPasswordMessage) {
    return request({
      method: 'PUT',
      url: '/user/resetPasswordByPhone',
      data: resetPasswordMessage
    })
  },

  async resetPasswordByUserName (resetPasswordMessage) {
    return request({
      method: 'PUT',
      url: '/user/resetPasswordByUserName',
      data: resetPasswordMessage
    })
  },

  async resetPasswordByEmail (resetPasswordMessage) {
    return request({
      method: 'PUT',
      url: '/user/resetPasswordByEmail',
      data: resetPasswordMessage
    })
  }
}
