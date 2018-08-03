<template>
  <div class="placeDetail">
    <Breadcrumb primaryTitle='拍场管理' link='/placeList' title='拍场详情'></Breadcrumb>
    <div class="detail-wrapper">
      <div class="left">
        <div class="left-cont">
          <img class="cover" :src="detail.imghost+detail.images" alt="">
          <div class="share" v-if="detail.audit_state==2 && detail.status ==0">
            <el-popover placement="right" width="150" trigger="click">
              <img width="150" height="150" :src="detail.imghost+detail.qrc" alt="">
              <span slot="reference">分享</span>
            </el-popover>
          </div>
          <div class="title">
            <p>{{detail.name}}</p>
            <p>{{detail.detail}}</p>
          </div>
          <div class="list">
            <ul class="list-left">
              <li class="list-option">
                <span>类&emsp;&emsp;别：</span>
                <span>{{detail.category_name}}</span>
              </li>
              <li class="list-option">
                <span>保 证 金 &nbsp;：</span>
                <span>{{detail.earnest}}元</span>
              </li>
              <li class="list-option">
                <span>成交佣金：</span>
                <span>{{detail.commission}}%</span>
              </li>
              <li class="list-option">
                <span>支付期限：</span>
                <span>成交后{{detail.payment_countdown_time}}小时内</span>
              </li>
              <li class="list-option">
                <span>竞价规则：</span>
                <ul class="rule-list">
                  <li v-for="(item,index) in detail.rule.bidrule" :key="index">
                    <span>{{item.code}}元：</span>
                    <span>{{item.amount}}元</span>
                  </li>
                  <li v-if="detail.info">
                    优惠券 <br>金额 {{detail.info.amount}}元 ，前置条件满{{detail.info.requirement}}元
                  </li>
                </ul>
              </li>
            </ul>
            <ul class="list-right">
              <li class="list-option">
                <span>主 持 人：</span>
                <img :src="detail.compere.portrait" class="thumbnail" width="48" height="48" style="border-radius:50%" alt="">
                <span>{{detail.compere.name}}</span>
              </li>
              <li class="list-option">
                <span>开拍时间：</span>
                <span>{{getTime(detail.start_time)}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right-cont table-wrapper">
          <p class="title">拍品列表</p>
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column type="index" label="序号" align='center'>
            </el-table-column>
            <el-table-column prop="name" label="拍品名称" align='center'>
            </el-table-column>
            <el-table-column prop="starting_price" label="起拍价" align='center'>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      detail: {
        compere: {},
        rule: {
          bidrule: []
        }
      },
      tableData: []
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$get({
        api: "/seller/auction/view/" + this.$route.query.id
      })
        .then(({ data }) => {
          this.detail = data;
          this.tableData = data.goods;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.placeDetail {
  padding: 0 15px 15px;
}
.detail-wrapper {
  width: 100%;
  overflow: hidden;
  .left {
    float: left;
    width: 49.5%;
    margin-bottom: -3000px;
    padding-bottom: 3000px;
    background: #fff;
    .left-cont {
      padding: 66px 80px;
    }
    .cover {
      width: 100%;
      height: 332px;
    }
    .title {
      line-height: 34px;
      padding: 15px 0;
      p:first-child {
        font-size: 16px;
        font-weight: bold;
      }
      p:last-child {
        font-size: 14px;
      }
    }
    .list {
      overflow: hidden;
      .list-left {
        float: left;
        width: 60%;
      }
      .rule-list {
        display: inline-block;
        vertical-align: top;
        span {
          font-weight: normal !important;
        }
      }
      .thumbnail {
        vertical-align: middle;
      }
      .list-right {
        float: left;
        width: 40%;
      }
      .list-option {
        line-height: 26px;
        span:first-child {
          font-weight: bold;
        }
      }
    }
  }
  .share {
    text-align: right;
    margin: 15px 0;
    color: #409efe;
    font-weight: bold;
    cursor: pointer;
  }
  .right {
    margin-bottom: -3000px;
    padding-bottom: 3000px;
    float: right;
    width: 49.5%;
    background: #fff;
    box-sizing: border-box;
    .right-cont {
      padding: 20px;
    }
    .title {
      margin-top: 12px;
      font-weight: bold;
    }
  }
}
</style>
