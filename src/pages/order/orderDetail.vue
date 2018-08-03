<template>
  <div class="orderDetail">
    <Breadcrumb primaryTitle='订单列表' link='/orderList' title='订单详情'></Breadcrumb>
    <ul class="order-info">
      <li class="order-item">
        <span>订单号码</span>
        <span>{{detail.code}}</span>
      </li>
      <li class="order-item">
        <span>下单时间</span>
        <span>{{getTime(detail.create_time)}}</span>
      </li>
      <li class="order-item">
        <span>拍场名称</span>
        <span>{{detail.auction_name}}</span>
      </li>
      <li class="order-item">
        <span>订单状态</span>
        <span>{{detail.status==0?'关闭':detail.status==1?'新建':detail.status==2?'已支付':detail.status==3?'已发货':'确认发货'}}</span>
      </li>
      <li class="order-item">
        <el-button type="primary" class="send-btn" @click="toggleDialog" v-show="detail.status==2">发货</el-button>
      </li>
      <li class="order-item">
        <span>收款总额</span>
        <span>{{detail.total_amount}}元</span>
      </li>
      <li class="order-item">
        <span>成交价</span>
        <span>{{detail.purchase_price}}元</span>
      </li>
      <li class="order-item">
        <span>佣金({{detail.new_commission_per}}%)</span>
        <span>-{{detail.new_commission}}元</span>
      </li>
      <li class="order-item">
        <span>盟主分成({{detail.union_price_per}}%)</span>
        <span>-{{detail.union_price}}元</span>
      </li>
      <li class="order-item">
        <span>优惠券抵扣</span>
        <span>-{{detail.new_coupon_amount}}元</span>
      </li>
      <li class="order-item">
        <span>拍场名称</span>
        <span>{{detail.name}}</span>
      </li>
      <li class="order-item">
        <span>平台服务费</span>
        <span>-{{detail.service_price}}元</span>
      </li>
      <li class="order-item">
        <span>物流公司</span>
        <span>{{detail.courier}}</span>
      </li>
      <li class="order-item">
        <span>物流单号</span>
        <span>{{detail.courier_number}}</span>
      </li>
      <li class="order-item">
        <span>收 件 人</span>
        <span>{{detail.user_receipt?detail.user_receipt.receipt_name:""}}</span>
      </li>
      <li class="order-item">
        <span>联系方式</span>
        <span>{{detail.user_receipt?detail.user_receipt.phone:""}}</span>
      </li>
      <li class="order-item last-item">
        <span>收件地址</span>
        <span>{{detail.user_receipt?detail.user_receipt.region:""}}</span>
      </li>
    </ul>
    <div class="goods-detail">
      <p>拍品详情</p>
      <p>拍品ID: {{detail.gid}}</p>
      <p @click="$router.push({path:'/goodsDetail',query:{id:detail.gid}})">拍品名称：{{detail.name}}</p>
    </div>
    <el-dialog class="dialog" title="填写发货信息" :visible.sync="dialog.show" width="30%" :before-close="toggleDialog">
      <ul class="dialog-cont">
        <li class="item">
          <span>物流公司</span>
          <el-select placeholder="请选择" size="small" v-model="dialog.data.name">
            <el-option :label="item.kuaidi" :value="item.kuaidi" v-for="(item,index) in courierList" :key="index"></el-option>
          </el-select>
        </li>
        <li class="item">
          <span>物流单号</span>
          <el-input placeholder="请输入物流单号" size="small" v-model="dialog.data.number"></el-input>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="toggleDialog">取消</el-button>
        <el-button type="primary" @click="confirmSend">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      detail: {},
      courierList: [], //物流列表
      dialog: {
        show: false,
        data: {
          id: "",
          name: "",
          number: ""
        }
      }
    };
  },
  mounted() {
    this.getCourierList();
    this.getDetail();
  },
  methods: {
    getCourierList() {
      this.$get({
        api: "/seller/wuliu"
      })
        .then(({ data }) => {
          this.courierList = data;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    getDetail() {
      this.$get({
        api: "/seller/order/detail",
        data: {
          id: this.$route.query.id
        }
      })
        .then(({ data }) => {
          this.detail = data;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    toggleDialog() {
      this.dialog.show = !this.dialog.show;
    },
    confirmSend() {
      this.dialog.data.id = this.detail.id;
      this.$post({
        api: "/seller/order/delivery",
        data: this.dialog.data
      })
        .then(({ data }) => {
          this.$router.go(-1);
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.orderDetail {
  padding: 15px;
}
.order-info {
  overflow: hidden;
  background: #fff;
  padding: 0 30px;
  font-size: 14px;
  .order-item {
    width: 306px;
    height: 14px;
    float: left;
    margin: 25px 0;
    span:first-child {
      display: inline-block;
      font-weight: bold;
      margin-right:5px;
    }
    &.last-item {
      width: auto;
    }
  }
  .send-btn {
    margin-top: -10px;
  }
}
.goods-detail {
  min-height: calc(100vh - 370px);
  margin-top: 15px;
  background: #fff;
  padding: 25px;
  line-height: 48px;
  font-weight: bold;
  p:first-child {
    font-size: 18px;
    font-weight: normal;
  }
  p:last-child {
    display: inline-block;
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
  }
}
.dialog-cont {
  .item {
    margin-bottom: 15px;
    span {
      font-size: 14px;
      display: inline-block;
      width: 80px;
      font-weight: bold;
      text-align: center;
    }
    .el-select,
    .el-input {
      width: 440px;
    }
  }
}
.dialog-footer {
  .el-button {
    width: 108px;
    padding: 8px 20px;
  }
  .el-button--primary {
    background: #67c239;
    border: 1px solid #67c239;
  }
}
</style>
<style>
.el-dialog__body {
  padding: 10px 20px;
}
</style>

