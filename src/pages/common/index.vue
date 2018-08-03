<template>
  <div class="container">
    <div class="sideBar">
      <div class="homeMenu" @click="$router.push({path:'/home'})">
        <img class="menuIcon" src="../../imgs/logo1.png" alt="">
      </div>
      <el-menu :default-active="$route.meta.title" background-color="#333333" text-color="#fff" active-text-color="#fff" @select="menuSelect">
        <el-submenu v-for="(item,index) in menuList" :key="index" :index="String(index+2)">
          <template slot="title">
            <img class="menuIcon" :src="item.src" alt="">
            <span>{{item.subtitle}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="(todo,k) in item.child" :key="k" :index="todo.title">{{todo.title}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div class="cont">
      <div class="header">
        <div class="left">{{$route.meta.primaryTitle}}</div>
        <div class="right">
          <el-popover placement="bottom" width="70" trigger="hover">
            <div class="user" slot="reference">
              <img width="48" height="48" :src="userInfo.portrait" alt="">
              <span>{{userInfo.name}}</span>
            </div>
            <p style="text-align:center;cursor:pointer" @click="logout">退出登录</p>
          </el-popover>
        </div>
      </div>
      <router-view/>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : {}
    };
  },
  computed: {
    menuList() {
      let arr = [
        {
          subtitle: "拍品",
          src: require("../../imgs/menuIcon02.png"),
          child: [
            {
              title: "拍品管理",
              path: "/saleList"
            }
          ]
        },
        {
          subtitle: "拍场",
          src: require("../../imgs/menuIcon03.png"),
          child: [
            {
              title: "拍场管理",
              path: "/salePlace"
            }
          ]
        },
        {
          subtitle: "优惠券",
          src: require("../../imgs/menuIcon04.png"),
          child: [
            {
              title: "优惠券管理",
              path: "/couponList"
            }
          ]
        },
        {
          subtitle: "加盟管理",
          src: require("../../imgs/menuIcon05.png"),
          child: []
        },
        {
          subtitle: "订单管理",
          src: require("../../imgs/menuIcon06.png"),
          child: [
            {
              title: "订单列表",
              path: "/orderList"
            }
          ]
        },
        {
          subtitle: "提现管理",
          src: require("../../imgs/menuIcon07.png"),
          child: [
            {
              title: "提现列表",
              path: "/withDraw"
            }
          ]
        }
      ];
      if ((JSON.parse(localStorage.getItem("userInfo"))).type==2) {
        arr[3].child = [
          {
            title: "我的联盟",
            path: "/myAlliance"
          },
          {
            title: "我的加盟卖家",
            path: "/myAllianceSeller"
          },
          {
            title: "加盟拍场审核",
            path: "/alliancePalceCheck"
          },
          {
            title: "加盟审核",
            path: "/allianceCheck"
          }
        ];
      } else {
        arr[3].child = [
          {
            title: "我的联盟",
            path: "/myAlliance"
          }
        ];
      }
      return arr;
    }
  },
  methods: {
    menuSelect(index) {
      this.$router.push({ name: index });
    },
    logout() {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("userInfo");
      this.$router.push({ path: "/login" });
    }
  }
};
</script>
<style lang="scss" scoped>
$color: #409eff;
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .sideBar {
    width: 241px;
    height: 100%;
    background: #333333;
    box-sizing: border-box;
  }
}
.sideBar {
  font-size: 18px;
}
.homeMenu {
  padding: 20px 15px 10px;
  color: #fff;
  cursor: pointer;
  img {
    width: 190px;
    height: 50px;
  }
}
.menuIcon {
  width: 18px;
  height: 18px;
  margin-right: 16px;
}
.cont {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 240px;
  right: 0;
  overflow-y: auto;
  background: #ebeef5;
  .header {
    overflow: hidden;
    background: #fff;
    height: 80px;
    line-height: 80px;
    padding: 0 40px;
    .left {
      float: left;
      font-size: 20px;
      color: $color;
      font-weight: bold;
    }
    .right {
      float: right;
      overflow: hidden;
      cursor: pointer;
      .user,
      .help {
        display: inline-block;
        line-height: 32px;
        margin-right: 50px;
        font-size: 16px;
        img {
          border-radius: 50%;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
