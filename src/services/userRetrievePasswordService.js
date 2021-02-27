import { request } from '@/util/request'

export default {
  /**
   * 校验账号的安全性
   * @param account
   * @returns {Promise<*>}
   */
  async checkAccountSafe (account) {
    return request({
      method: 'POST',
      url: '/user/checkAccountSafe',
      data: {'account': account}
    })
  },

  /**
   * 重置密码
   * @param params
   * @returns {Promise<*>}
   */
  async retrievePassword (params) {
    return request({
      method: 'PUT',
      url: '/user/retrievePassword',
      data: params
    })
  }
}
