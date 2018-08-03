<template>
  <div class="goodDetail" v-if="detail.id">
    <Breadcrumb primaryTitle='拍品管理' link='/saleList' title='拍品详情'></Breadcrumb>
    <div class="wrap">
      <div class="left">
        <div class="item">拍品ID:{{detail.id}}</div>
        <div class="item">拍品名称：{{detail.name}}</div>
        <p class="intro">{{detail.description}}</p>
        <div class="img-list">
          <img :src="detail.imghost+item" v-for="(item,index) in detail.images" :key="index" preview="1" preview-text="描述文字1" alt="">
        </div>
        <div class="video-wrapper" v-if="detail.videoes">
          <video width="662" height="368" controls loop>
            <source :src="detail.imghost+detail.videoes" type="video/mp4">
            <source :src="detail.imghost+detail.videoes" type="video/ogg"> 您的浏览器不支持 video 标签。
          </video>
        </div>
      </div>
      <div class="right">
        <p class="title">拍卖纪录</p>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="auction_name" label="拍场名称" align='center'>
          </el-table-column>
          <el-table-column prop="create_time" label="拍卖日期" align='center'>
            <template slot-scope="scope">
              <span>{{getTime(scope.row.create_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="订单状态" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.status==1?'流拍':'待支付'}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      detail: {},
      tableData: []
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$get({
        api: "/seller/goods/view/" + this.$route.query.id
      })
        .then(({ data }) => {
          this.detail = data;
          this.tableData = data.his;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.goodDetail {
  padding: 0 15px 15px;
}
.wrap {
  display: flex;
  .left {
    width: 826px;
    flex: 0 0 826px;
    padding: 30px 25px;
    background-color: #fff;
    .item {
      font-weight: bold;
      line-height: 36px;
    }
    .intro {
      line-height: 22px;
      margin: 10px 0 30px;
    }
    .img-list {
      font-size: 0;
      img {
        width: 95px;
        height: 95px;
        margin: 0 15px 15px 0;
      }
    }
    .video-wrapper {
      text-align: center;
      margin-top: 30px;
      video {
        background: #ccc;
      }
    }
  }
  .right {
    flex: 1;
    padding: 30px 25px;
    margin-left: 13px;
    background: #fff;
  }
}
</style>
