<template>
  <div class="alliancePalceCheck">
    <ul class="query">
      <li class="query-option">
        <span>卖家名称</span>
        <el-input placeholder="请输入卖家名称" size="small" v-model="query.name" style="width:270px;"></el-input>
      </li>
      <li class="query-option">
        <span>状态</span>
        <el-select placeholder="请选择" size="small" v-model="query.status">
          <el-option label="全部" value=""></el-option>
          <el-option label="待审核" :value="1"></el-option>
          <el-option label="通过" :value="2"></el-option>
        </el-select>
      </li>
      <li class="query-option">
        <el-button type="primary" @click="getTableData(1)">查询</el-button>
      </li>
    </ul>
    <div class="wrapper">
      <div class="table-wrapper">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="name" label="拍场名称" width="180" align='center'>
          </el-table-column>
          <el-table-column prop="start_time" label="开拍时间" align='center'>
            <template slot-scope="scope">
              <span>{{getTime(scope.row.start_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="创建人" align='center'>
          </el-table-column>
          <el-table-column prop="" label="状态" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.status==1?'待审核':'通过'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <el-button @click="view(scope.row)" type="text" size="small" class="view-btn">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="page.total>page.pageSize" @current-change="getTableData" background :current-page="page.current" :page-size="page.pageSize" layout="prev,pager,next,total,jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="dialog" title="加盟拍场审核" :visible.sync="dialog.show" width="42.5%" :before-close="toggleDialog">
      <div class="dialog-cont">
        <p class="title">拍品列表</p>
        <el-table :data="dialog.good_detail" stripe>
          <el-table-column type="index" label="序号" align='center'>
          </el-table-column>
          <el-table-column prop="name" label="名称" align='center'>
             <template slot-scope="scope">
               <router-link :to="'/goodsDetail?id='+scope.row.id" target="_blank">{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="starting_price" label="起拍价" align='center'>
          </el-table-column>
        </el-table>
        <div class="intro">
          <div class="header">
            <p>{{dialog.name}}</p>
            <p>{{dialog.description}}</p>
          </div>
          <div class="content">
            <ul class="left">
              <li class="item">
                <span>类&emsp;&emsp;别：</span>
                <span>{{dialog.catagory}}</span>
              </li>
              <li class="item">
                <span>保 证 金&nbsp;：</span>
                <span>{{dialog.earnest}}元</span>
              </li>
              <li class="item">
                <span>佣金比例：</span>
                <span>{{dialog.commission}}%</span>
              </li>
              <li class="item">
                <span>支付期限：</span>
                <span>成交后{{dialog.payment_countdown_time}}小时内</span>
              </li>
              <li class="item">
                <span>竞价规则：</span>
                <div class="rule">
                  <p v-for="(item,value) in dialog.auction_bid_rule" :key="item">{{value}}元： {{item}}元</p>
                  <p v-if="dialog.requirement">优惠券</p>
                  <p v-if="dialog.requirement">金额 {{dialog.coupon}}元 ， 前置条件 满 {{dialog.requirement}} 元</p>
                </div>
              </li>
            </ul>
            <ul class="right">
              <li class="item">
                <span>主 持 人：</span>
                <img width="48" height="48" :src="dialog.portrait" alt="" style="border-radius:50%;">
                <span> {{dialog.host_name}}</span>
              </li>
              <li class="item">
                <span>开拍时间：</span>
                <span>{{getTime(dialog.start_time)}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="reject">
          <el-input type="textarea" resize="none" :autosize="{minRows:4,maxRows:4}" v-model="dialog.reason" placeholder="请输入..." size="small"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit(2)">通过</el-button>
        <el-button @click="submit(3)">驳回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      tableData1: [],
      query: {
        name: "",
        status: ""
      },
      page: {
        total: 0,
        pageSize: 10,
        current: 1
      },
      dialog: {
        show: false,
        id: "",
        reason: ""
      }
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData(param) {
      if (param) {
        this.page.current = param;
      }
      this.$get({
        api: "/seller/union/applyAuction",
        data: {
          name: this.query.name,
          status: this.query.status,
          size: this.page.pageSize,
          page: this.page.current
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
    view(data) {
      for (var attr in data) {
        this.dialog[attr] = data[attr];
      }
      this.dialog.show = true;
    },
    toggleDialog() {
      this.dialog.show = !this.dialog.show;
    },
    submit(type) {
      if (type == 3 && !this.dialog.reason) {
        this.$message.error("请填写驳回原因");
        return;
      }
      this.$post({
        api: "/seller/union/auctionVerify",
        data: {
          id: this.dialog.id,
          reason: this.dialog.reason,
          type: type
        }
      })
        .then(({ data }) => {
          this.dialog = {
            show: false,
            id: "",
            reason: ""
          };
          this.getTableData();
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.alliancePalceCheck {
  padding: 15px;
}
.query {
  overflow: hidden;
  background: #fff;
  padding: 18px 26px;
  .query-option {
    float: left;
    margin-right: 80px;
    span {
      display: inline-block;
      margin-right: 10px;
    }
  }
}
.wrapper {
  min-height: calc(100vh - 185px);
  padding: 30px;
  margin-top: 15px;
  background: #fff;
  .table-wrapper {
    width: 770px;
    .view-btn {
      color: #333;
    }
  }
}
.dialog-cont {
  .title {
    font-weight: bold;
    font-size: 16px;
  }
  .intro {
    .header p {
      font-size: 14px;
      margin-bottom: 30px;
      &:first-child {
        font-weight: bold;
        font-size: 16px;
        margin: 25px 0 18px;
      }
    }
  }
  .content {
    overflow: hidden;
    .left {
      width: 50%;
      float: left;
    }
    .right {
      width: 50%;
      float: left;
      img {
        vertical-align: middle;
      }
    }
    .item {
      line-height: 30px;
      span {
        font-size: 16px;
        &:first-child {
          font-weight: bold;
        }
      }
      .rule {
        display: inline-block;
        vertical-align: top;
        font-size: 16px;
      }
    }
  }
}
.reject {
  margin: 45px 10px 75px;
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
.dialog .el-dialog__body {
  padding: 10px 20px;
}
</style>

