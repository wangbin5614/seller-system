<template>
  <div class="login">
    <div class="login-wrapper">
      <h3>卖家登录</h3>
      <div id="wxBox"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    if (localStorage.getItem("auth_token")) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("userInfo");
    }
    var obj = new WxLogin({
      self_redirect: false,
      id: "wxBox",
      appid: "wx739e43f51db59724",
      scope: "snsapi_login",
      redirect_uri: "http%3a%2f%2fwww.wekouling.com%2f%23%2flist",
      state: "413533758",
      style: "white",
      href: ""
    });
  },
  methods: {}
};
</script>
<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background: #333333;
  text-align: center;
  color: #fff;
  display: flex;
  align-items: center;
  h3 {
    font-size: 26px;
    margin-bottom: 66px;
  }
  .login-wrapper {
    margin: 0 auto;
  }
}
</style>
