import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/index'
import Common from '@/pages/common/index'

import Home from '@/pages/home/index' //首页


import SaleList from '@/pages/saleGoods/index' //拍品列表
import AddGoods from '@/pages/saleGoods/addGoods' //新增拍品
import GoodsDetail from '@/pages/saleGoods/goodsDetail' //拍品详情

import PlaceList from '@/pages/salePlace/index' //拍场列表
import PlaceManage from '@/pages/salePlace/placeManage' //新增编辑拍场
import PlaceDetail from '@/pages/salePlace/placeDetail' //拍场详情

import MyAlliance from '@/pages/alliance/myAlliance' //我的联盟
import AllianceCheck from '@/pages/alliance/allianceCheck' //加盟审核
import AlliancePalceCheck from '@/pages/alliance/alliancePalceCheck' //加盟拍场审核
import MyAllianceSeller from '@/pages/alliance/myAllianceSeller' //我的加盟卖家


import OrderList from '@/pages/order/index' //订单列表
import OrderDetail from '@/pages/order/OrderDetail' //订单详情


import CouponList from '@/pages/coupon/index' //优惠券列表
import CouponDetail from '@/pages/coupon/couponDetail' //优惠券详情


import WithDraw from '@/pages/withDraw/index' //提现列表

Vue.use(Router)


var router = new Router({
  routes: [
    { path: "*", redirect: '/home' },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: '首页',
      component: Home,
      meta: {
        primaryTitle: '首页',
        title: '首页'
      }
    },
    {
      path: '/',
      name: 'common',
      component: Common,
      redirect: '/home',
      children: [
        {
          path: '/saleList',
          name: '拍品管理',
          component: SaleList,
          meta: {
            primaryTitle: '拍品',
            title: '拍品管理'
          }
        },
        {
          path: '/addGoods',
          name: '新增拍品',
          component: AddGoods,
          meta: {
            primaryTitle: '拍品',
            title: '拍品管理'
          }
        },
        {
          path: '/goodsDetail',
          name: '拍品详情',
          component: GoodsDetail,
          meta: {
            primaryTitle: '拍品',
            title: '拍品管理'
          }
        },
        {
          path: '/placeList',
          name: '拍场管理',
          component: PlaceList,
          meta: {
            primaryTitle: '拍场',
            title: '拍场管理'
          }
        },
        {
          path: '/placeManage',
          name: '新增拍场',
          component: PlaceManage,
          meta: {
            primaryTitle: '拍场',
            title: '拍场管理'
          }
        },
        {
          path: '/placeDetail',
          name: '拍场详情',
          component: PlaceDetail,
          meta: {
            primaryTitle: '拍场',
            title: '拍场管理'
          }
        },
        {
          path: '/couponList',
          name: '优惠券管理',
          component: CouponList,
          meta: {
            primaryTitle: '优惠券',
            title: '优惠券管理'
          }
        },
        {
          path: '/couponDetail',
          name: '优惠券详情',
          component: CouponDetail,
          meta: {
            primaryTitle: '优惠券',
            title: '优惠券管理'
          }
        },
        {
          path: '/myAlliance',
          name: '我的联盟',
          component: MyAlliance,
          meta: {
            primaryTitle: '加盟管理',
            title: '我的联盟'
          }
        },
        {
          path: '/myAllianceSeller',
          name: '我的加盟卖家',
          component: MyAllianceSeller,
          meta: {
            primaryTitle: '加盟管理',
            title: '我的加盟卖家'
          }
        },
        {
          path: '/alliancePalceCheck',
          name: '加盟拍场审核',
          component: AlliancePalceCheck,
          meta: {
            primaryTitle: '加盟管理',
            title: '加盟拍场审核'
          }
        },
        {
          path: '/allianceCheck',
          name: '加盟审核',
          component: AllianceCheck,
          meta: {
            primaryTitle: '加盟管理',
            title: '加盟审核'
          }
        },
        {
          path: '/orderList',
          name: '订单列表',
          component: OrderList,
          meta: {
            primaryTitle: '订单',
            title: '订单列表'
          }
        },
        {
          path: '/orderDetail',
          name: '订单详情',
          component: OrderDetail,
          meta: {
            primaryTitle: '订单',
            title: '订单列表'
          }
        },
        {
          path: '/withDraw',
          name: '提现列表',
          component: WithDraw,
          meta: {
            primaryTitle: '提现管理',
            title: '提现列表'
          }
        },
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  document.title = to.name;
  if (localStorage.getItem('auth_token')) {
    next();
  } else {
    if (to.path == "/login" || to.path == '/home') {
      next();
    } else {
      next('/login');
    }
  }
});
export default router
