import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Router from 'vue-router'

Vue.use(VueAxios, axios)
Vue.use(Router)

export default new Router({
  mode: 'history',
  // base: '/opt/test',
  routes: [
    {
      path: '/userLogin',
      name: 'UserLogin',
      component: () => import('@/components/user/UserLogin')
    },
    {
      path: '/userRegistry',
      name: 'UserRegistry',
      component: () => import('@/components/user/UserRegistry')
    },
    {
      path: '/userRetrievePassword',
      name: 'UserRetrievePassword',
      component: () => import('@/components/user/UserRetrievePassword')
    },
    {
      path: '/verify',
      name: 'VerificationCentre',
      component: () => import('@/components/user/VerificationCentre')
    },
    {
      path: '/upload',
      name: 'UploadFile',
      component: () => import('@/components/user/UploadFile')
    }
  ]
})
