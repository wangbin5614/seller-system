<template>
  <div class="couponDetail">
    <Breadcrumb primaryTitle='优惠券' link='/couponList' title='优惠券详情'></Breadcrumb>
    <div class="wrap">
      <ul class="basic-info">
        <li class="item">
          <span>金&emsp;&emsp;额：</span>
          <span>{{detail.amount}}元</span>
        </li>
        <li class="item">
          <span>前置条件：</span>
          <span>满{{detail.requirement}}元</span>
        </li>
        <li class="item">
          <span>种&emsp;&emsp;类：</span>
          <span>{{detail.type==1?'抵用券':''}}</span>
        </li>
        <li class="item">
          <span>有效期：</span>
          <span>{{detail.deadline}}个月</span>
        </li>
        <li class="item">
          <span>适用范围：</span>
          <span>{{detail.scope==1?'全场':'单场'}}</span>
        </li>
        <li class="item">
          <span>数量限额：</span>
          <span>{{detail.limited==1?(detail.total+'张'):'不限量'}}</span>
        </li>
        <li class="item">
          <span>剩余数量：</span>
          <span>{{detail.limited==1?(detail.remain+'张'):'不限量'}}</span>
        </li>
        <li class="item">
          <span>截至时间：</span>
          <span>{{getTime(detail.dead_day)}}</span>
        </li>
      </ul>
      <div class="layout">
        <div class="left">
          <p class="title">调用拍场</p>
          <el-table :data="placeTable" stripe>
            <el-table-column prop="name" label="拍场名称" align='center'>
            </el-table-column>
            <el-table-column prop="start_time" label="开拍时间" align='center'>
              <template slot-scope="scope">
                <span>{{getTime(scope.row.start_time)}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-if="placePage.total>placePage.pageSize" @current-change="getObtainData" background :current-page="placePage.current" :page-size="placePage.pageSize" layout="prev,pager,next" :total="placePage.total">
          </el-pagination>
        </div>
        <div class="middle">
          <p class="title">已获取用户列表</p>
          <el-table :data="obtainTable" stripe>
            <el-table-column prop="" label="头像" align='center'>
              <template slot-scope="scope">
                <img :src="scope.row.user.portrait" width="48" height="48" style="border-radius:50%" alt="">
              </template>
            </el-table-column>
            <el-table-column prop="" label="昵称" align='center'>
              <template slot-scope="scope">
                <span>{{scope.row.user.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="获取时间" align='center'>
              <template slot-scope="scope">
                <span>{{getTime(scope.row.create_time)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="auction_name" label="获取拍场" align='center'>
            </el-table-column>
          </el-table>
          <el-pagination v-if="obtainPage.total>obtainPage.pageSize" @current-change="getObtainData" background :current-page="obtainPage.current" :page-size="obtainPage.pageSize" layout="prev,pager,next" :total="obtainPage.total">
          </el-pagination>
        </div>
        <div class="right" id="myChart">
        </div>
      </div>
      <div class="user-list">
        <p class="title">获取用户列表</p>
        <el-table :data="usedTable" stripe>
          <el-table-column prop="index" label="头像" align='center'>
            <template slot-scope="scope">
              <img :src="scope.row.user.portrait" width="48" height="48" style="border-radius:50%" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="" label="昵称" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.user.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="used_time" label="使用时间" align='center'>
            <template slot-scope="scope">
              <span>{{getTime(scope.row.user.create_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="target_good_name" label="使用拍品" align='center'>
          </el-table-column>
          <el-table-column prop="target_auction_name" label="使用拍场" align='center'>
          </el-table-column>
          <el-table-column prop="" label="卖家头像" align='center'>
            <template slot-scope="scope">
              <img :src="scope.row.seller.portrait" width="48" height="48" style="border-radius:50%" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="" label="使用卖家" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.seller.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="获取时间" align='center'>
            <template slot-scope="scope">
              <span>{{getTime(scope.row.create_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="auction_name" label="获取拍场" align='center'>
          </el-table-column>
        </el-table>
        <el-pagination v-if="usedPage.total>usedPage.pageSize" @current-change="getUsedData" background :current-page="usedPage.current" :page-size="usedPage.pageSize" layout="prev,pager,next" :total="usedPage.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartData: {
        xData: [],
        yData: []
      },
      detail: {},
      obtainTable: [], //已获取用户列表
      placeTable: [], //拍场列表
      usedTable: [], //已使用列表
      placePage: {
        total: 0,
        pageSize: 10,
        current: 1
      },
      usedPage: {
        total: 0,
        pageSize: 10,
        current: 1
      },
      obtainPage: {
        total: 0,
        pageSize: 10,
        current: 1
      }
    };
  },
  mounted() {
    this.getDetail();
    this.getPlaceData();
    this.getUsedData();
    this.getObtainData();
  },
  methods: {
    getDetail() {
      this.$get({
        api: "/seller/coupon/view/" + this.$route.query.id
      })
        .then(({ data }) => {
          this.detail = data;
          data.info.forEach(item => {
            this.chartData.xData.push(item.name);
            this.chartData.yData.push(item.amount);
          });
          this.$nextTick(() => {
            this.drawChart();
          });
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    // 获取拍场列表
    getPlaceData(param) {
      if (param) {
        this.placePage.current = param;
      }
      this.$get({
        api: "/seller/coupon/ac/" + this.$route.query.id,
        data: {
          page: this.placePage.current,
          size: this.placePage.pageSize
        }
      })
        .then(({ data }) => {
          this.placeTable = data.content;
          this.placePage.total = data.total_elements;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    // 获取已使用列表
    getUsedData(param) {
      if (param) {
        this.usedPage.current = param;
      }
      this.$get({
        api: "/seller/coupon/giftused/" + this.$route.query.id,
        data: {
          page: this.usedPage.current,
          size: this.usedPage.pageSize
        }
      })
        .then(({ data }) => {
          this.usedTable = data.content;
          this.usedPage.total = data.total_elements;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    // 已获取列表
    getObtainData(param) {
      if (param) {
        this.obtainPage.current = param;
      }
      this.$get({
        api: "/seller/coupon/gift/" + this.$route.query.id,
        data: {
          page: this.obtainPage.current,
          size: this.obtainPage.pageSize
        }
      })
        .then(({ data }) => {
          this.obtainTable = data.content;
          this.obtainPage.total = data.total_elements;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    drawChart() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        xAxis: {
          data: this.chartData.xData
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            itemStyle: {
              color: function(params) {
                var colorList = [
                  "#67c239",
                  "#e6a23d",
                  "#409efe",
                  "#f46c6c",
                  "#333333"
                ];
                return colorList[params.dataIndex];
              }
            },
            data: this.chartData.yData
          }
        ]
      });
    }
  }
};
</script>
<style>
.layout .el-table {
  margin: 10px 0;
}
.layout .el-pagination {
  margin-top: 0;
}
</style>

<style lang="scss" scoped>
.couponDetail {
  padding: 0 15px;
}
.wrap {
  overflow: hidden;
  background-color: #fff;
  padding: 28px;
  .basic-info {
    width: 1180px;
    overflow: hidden;
    margin-bottom: 46px;
    .item {
      width: 293px;
      float: left;
      line-height: 36px;
    }
    span:first-child {
      font-weight: bold;
    }
  }
  .layout {
    overflow: hidden;
    .title {
      font-weight: bold;
    }

    .left {
      float: left;
      width: 375px;
    }
    .middle {
      float: left;
      width: 678px;
      margin-left: 20px;
    }
    .right {
      float: right;
      width: 472px;
      height: 340px;
    }
  }
  .user-list {
    .title {
      font-weight: bold;
    }
  }
}
</style>
