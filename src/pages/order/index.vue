<template>
  <div class="order">
    <ul class="query">
      <li class="query-item">
        <span>订单号码</span>
        <el-input placeholder="请输入订单号码" size="small" v-model="query.code"></el-input>
      </li>
      <li class="query-item">
        <span>拍品名称</span>
        <el-input placeholder="请输入拍品名称" size="small" v-model="query.goodName"></el-input>
      </li>
      <li class="query-item">
        <span>下单时间</span>
        <el-date-picker type="date" placeholder="选择日期" size="small" value-format="timestamp" v-model="query.orderTimePre">
        </el-date-picker>
        至
        <el-date-picker type="date" placeholder="选择日期" size="small" value-format="timestamp" v-model="query.orderTimeAfter">
        </el-date-picker>
      </li>
      <li class="query-item">
        <span>拍场名称</span>
        <el-input placeholder="请输入拍场名称" size="small" v-model="query.auctionName"></el-input>
      </li>
      <li class="query-item">
        <span>订单状态</span>
        <el-select placeholder="请选择" size="small" v-model="query.status">
          <el-option label="全部" value=""></el-option>
          <el-option label="新建" :value="1"></el-option>
          <el-option label="已支付" :value="2"></el-option>
          <el-option label="已发货" :value="3"></el-option>
          <el-option label="确定发货" :value="5"></el-option>
          <el-option label="交易关闭" :value="0"></el-option>
        </el-select>
      </li>
      <li class="query-item">
        <span>物流单号</span>
        <el-input placeholder="请输入物流单号" size="small" v-model="query.courierNumber"></el-input>
      </li>
      <li class="query-item">
        <el-button type="primary" @click="getTableData(1)">查询订单</el-button>
      </li>
    </ul>
    <div class="table-wrapper">
      <p class="title">订单列表</p>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="code" label="订单号" align='center'>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" align='center'>
          <template slot-scope="scope">
            <span>{{getTime(scope.row.create_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="拍品名称" align='center'>
        </el-table-column>
        <el-table-column prop="purchase_price" label="订单金额（元）" align='center'>
        </el-table-column>
        <el-table-column prop="new_commission" label="佣金（元）" align='center'>
        </el-table-column> 
        <el-table-column prop="new_coupon_amount" label="优惠金额（元）" align='center'>
        </el-table-column>
        <el-table-column prop="auction_name" label="所属拍场" align='center'>
        </el-table-column>
        <el-table-column prop="courier" label="物流公司" align='center'>
        </el-table-column>
        <el-table-column prop="courier_number" label="物流单号" align='center'>
        </el-table-column>
        <el-table-column prop="deadline" label="支付截至时间" align='center'>
          <template slot-scope="scope">
            <span>{{getTime(scope.row.deadline)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="发货截至时间" align='center'>
          <template slot-scope="scope">
            <span>{{getTime(scope.row.delivery_deadline)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="订单状态" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.status==0?'关闭':scope.row.status==1?'新建':scope.row.status==2?'已支付':scope.row.status==3?'已发货':'确认发货'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button @click="view(scope.row.id)" type="text" size="small" class="view-btn">查看</el-button>
            <el-button type="text" size="small" class="send-btn" v-if="scope.row.status==2" @click="sendGood(scope.row.id)">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="page.total>page.pageSize" @current-change="getTableData" background :current-page="page.current" :page-size="page.pageSize" layout="prev,pager,next,total,jumper" :total="page.total">
      </el-pagination>
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
      courierList: [], //物流列表
      dialog: {
        show: false,
        data: {
          id: "",
          name: "",
          number: ""
        }
      },
      query: {
        orderTimePre: "",
        orderTimeAfter: "",
        auctionName: "",
        code: "",
        goodName: "",
        courierNumber: "",
        status: ""
      },
      tableData: [],
      page: {
        total: 0,
        pageSize: 10,
        current: 1
      }
    };
  },
  mounted() {
    this.getCourierList();
    this.getTableData();
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
    sendGood(id) {
      this.dialog.data.id = id;
      this.dialog.show = true;
    },
    toggleDialog() {
      this.dialog.show = !this.dialog.show;
    },
    confirmSend() {
      this.$post({
        api: "/seller/order/delivery",
        data: this.dialog.data
      })
        .then(({ data }) => {
          this.getTableData();
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    getTableData(param) {
      if (param) {
        this.page.current = param;
      }
      this.$get({
        api: "/seller/order/list",
        data: {
          page: this.page.current,
          size: this.page.pageSize,
          orderTimePre: this.query.orderTimePre,
          orderTimeAfter: this.query.orderTimeAfter,
          auctionName: this.query.auctionName,
          code: this.query.code,
          goodName: this.query.goodName,
          courierNumber: this.query.courierNumber,
          status: this.query.status
        }
      })
        .then(({ data }) => {
          this.tableData = data.content;
          this.page.total = data.total_elements;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    view(id) {
      this.$router.push({ path: "/orderDetail", query: { id: id } });
    }
  }
};
</script>
<style lang="scss" scoped>
.order {
  padding: 15px;
}
.query {
  overflow: hidden;
  background: #fff;
  padding: 0 28px;
  .query-item {
    display: inline-block;
    margin: 20px 100px 20px 0;
    &:last-child {
      margin-left: -20px;
    }
    span {
      display: inline-block;
      width: 75px;
      vertical-align: middle;
    }
    .el-input,
    .el-select {
      width: 170px;
    }
  }
}
.table-wrapper {
  margin-top: 15px;
  background: #fff;
  padding: 25px;
  .title {
    font-size: 18px;
    line-height: 30px;
  }
  .view-btn {
    color: #333;
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
