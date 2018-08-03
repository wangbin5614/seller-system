<template>
  <div class="home">
    <div class="header">
      <img class="left" src="../../imgs/logo.png" alt="" @click="$router.go(0)">
      <div class="right">
        <span class="seller-center" v-if="userInfo.id" @click="$router.push({path:'/saleList'})">卖家中心</span>
        <el-popover placement="bottom" width="70" trigger="hover" v-if="userInfo.id" class="user-info">
          <div class="user" slot="reference">
            <img width="48" height="48" :src="userInfo.portrait" alt="">
            <span>{{userInfo.name}}</span>
          </div>
          <p style="text-align:center;cursor:pointer" @click="logout">退出登录</p>
        </el-popover>
        <span v-else class="login-btn" @click="$router.push({path:'/login'})">登录</span>
      </div>
    </div>
    <el-carousel arrow="always" trigger="click" height="315px" class="banner">
      <el-carousel-item>
        <img src="../../imgs/banner01.png" alt="">
      </el-carousel-item>
      <el-carousel-item>
        <img src="../../imgs/1.png" alt="">
      </el-carousel-item>
      <el-carousel-item>
        <img src="../../imgs/banner01.png" alt="">
      </el-carousel-item>
    </el-carousel>
    <ul class="category-list">
      <li class="category-item">
        <img src="../../imgs/category02.png" alt="">
      </li>
      <li class="category-item">
        <img src="../../imgs/category02.png" alt="">
      </li>
      <li class="category-item">
        <img src="../../imgs/category04.png" alt="">
      </li>
      <li class="category-item">
        <img src="../../imgs/category06.png" alt="">
      </li>
      <li class="category-item">
        <img src="../../imgs/category01.png" alt="">
      </li>
      <li class="category-item">
        <img src="../../imgs/category03.png" alt="">
      </li>
      <li class="category-item">
        <img src="../../imgs/category05.png" alt="">
      </li>
    </ul>
    <div class="wrap">
      <p class="title">如何成为盟主?</p>
      <ul class="list">
        <li class="item item1">
          <img src="../../imgs/homeIcon01.png" alt="">
          <p>用户注册成为平台卖家</p>
        </li>
        <li class="item">
          <img src="../../imgs/homeIcon02.png" alt="">
          <p>申请盟主</p>
        </li>
        <li class="item">
          <img src="../../imgs/homeIcon03.png" alt="">
          <p>管理平台通过审核</p>
        </li>
        <li class="item">
          <img src="../../imgs/homeIcon04.png" alt="">
          <p>成为平台盟主</p>
        </li>
      </ul>
    </div>
    <div class="wrap">
      <p class="title">如何成为盟众?</p>
      <ul class="list">
        <li class="item">
          <img src="../../imgs/homeIcon05.png" alt="">
          <p>平台盟主邀请用户</p>
        </li>
        <li class="item">
          <img src="../../imgs/homeIcon06.png" alt="">
          <p>用户通过邀请链接注册</p>
        </li>
        <li class="item">
          <img src="../../imgs/homeIcon07.png" alt="">
          <p>成为盟主（邀请人）的盟众</p>
        </li>
      </ul>
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
  mounted() {
    if (this.$route.query.code && !localStorage.getItem("auth_token")) {
      this.login();
    }
  },
  methods: {
    login() {
      this.$post({
        api: "/wx/weblogin",
        data: {
          code: this.$route.query.code,
          thirdparty: "wx"
        }
      })
        .then(({ data }) => {
          localStorage.setItem("auth_token", data.third_session);
          this.getUserInfo();
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    logout() {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("userInfo");
      this.$router.push({ path: "/login" });
    },
    getUserInfo() {
      this.$get({
        api: "/seller/user/details"
      })
        .then(({ data }) => {
          //0非卖家 1独立卖家 2盟主 3盟众
          if (data.is_seller == 1) {
            if (data.union) {
              if (data.union.user_id == data.id) {
                data.type = 2;
              } else {
                data.type = 3;
              }
            } else {
              data.type = 1;
            }
          } else {
            data.type = 0;
          }
          localStorage.setItem("userInfo", JSON.stringify(data));
          this.userInfo = data;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  background: #ebeef5;
  overflow: hidden;
}
.header {
  font-size: 18px;
  overflow: hidden;
  height: 80px;
  background: #fff;
  padding: 0 90px 0 22px;
  .left {
    float: left;
    margin-top: 18px;
    cursor: pointer;
  }
  .right {
    float: right;
    .seller-center {
      line-height: 80px;
      font-size: 20px;
      color: #409eff;
      font-weight: bold;
      cursor: pointer;
      margin-right: 25px;
    }
    .user-info {
      display: inline-block;
      cursor: pointer;
      img {
        border-radius: 50%;
        vertical-align: middle;
        padding: 1px;
        border: 1px solid #ccc;
        margin-right: 5px;
      }
    }
    .login-btn {
      line-height: 80px;
      color: #409eff;
      cursor: pointer;
    }
  }
}
.banner {
  margin: 10px;
  img {
    width: 100%;
  }
}
.category-list {
  margin: 0 10px;
  overflow: hidden;
  background: #fff;
  .category-item {
    float: left;
    width: 230px;
    height: 115px;
    margin: 32px 19px;
    img {
      width: 100%;
    }
  }
}
.wrap {
  background: #fff;
  padding: 30px 26px;
  margin: 10px;
  .title {
    margin-bottom: 60px;
    font-weight: bold;
  }
  .list {
    overflow: hidden;
    .item {
      position: relative;
      float: left;
      width: 170px;
      font-size: 14px;
      color: #333333;
      text-align: center;
      margin-right: 11px;
      &:after {
        content: "";
        position: absolute;
        top: 23px;
        right: 0;
        width: 11px;
        height: 20px;
        background-image: url("../../imgs/homeIcon08.png");
        background-size: 100% 100%;
      }
      &:last-child {
        margin-right: 0;
        &:after {
          display: none;
        }
      }
      img {
        width: 66px;
        height: 66px;
        margin-bottom: 28px;
      }
    }
  }
}
</style>
