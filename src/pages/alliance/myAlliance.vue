<template>
  <div class="myAlliance" v-if="myUnionData.id!=null">
    <div class="wrapper">
      <div class="section1" v-if="!myUnionData.id">
        <p class="title">创建联盟后，您的拍场将以联盟的身份展示</p>
        <ul class="create-list">
          <li class="create-option">
            <span>联盟照片</span>
            <el-upload class="avatar-uploader" accept="image/jpeg,image/jpg,image/png" action="https://upload.qiniup.com" :show-file-list="false" :data="postData" :on-success="handleAvatarSuccess">
              <img v-if="cover.key" :src="cover.src" class="avatar">
              <i v-if="!cover.key" class="el-icon-plus avatar-uploader-icon"></i>
              <p v-if="!cover.key" class="note">添加图片（限一张）</p>
            </el-upload>
          </li>
          <li class="create-option">
            <span>名&emsp;&emsp;称</span>
            <el-input placeholder="请输入名称" size="small" v-model="createData.name"></el-input>
          </li>
          <li class="create-option">
            <span>类&emsp;&emsp;别</span>
            <el-checkbox-group v-model="createData.catagory_id">
              <el-checkbox :label="item.id" v-for="(item,index) in cateList" :key="index">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </li>
        </ul>
        <el-button type="primary" class="create-btn" @click="createSubmit">创建</el-button>
      </div>
      <div class="section2" v-if="myUnionData.id">
        <div class="intro">
          <img :src="myUnionData.logo" width="218" height="218" alt="">
          <div class="right">
            <p class="title">{{myUnionData.name}}</p>
            <p>
              <span>类&emsp;&emsp;别</span>
              <span v-for="(item,index) in myUnionData.catagory_name" :key="index">{{item}}&nbsp;&nbsp;</span>
            </p>
            <p>
              <span>盟&emsp;&emsp;主</span>
              <span>{{myUnionData.user_name}}</span>
            </p>
            <p>
              <span>创盟时间</span>
              <span>{{getTime(myUnionData.create_time)}}</span>
            </p>
            <p v-if="!isAllies">
              <span>分成比例</span>
              <span>{{myUnionData.share_per}}</span>
            </p>
            <p>
              <span>分成总额</span>
              <span>{{myUnionData.amount}}元</span>
            </p>
          </div>
        </div>
        <el-button type="primary" class="modify-btn" @click="toggleDialog" v-if="isAllies">修改</el-button>
        <el-button type="primary" class="exit-btn" v-else @click="exitUnion">退出</el-button>
        <div class="table-wrapper" v-if="!isAllies">
          <el-table :data="tableData" stripe>
            <el-table-column prop="goods_name" label="拍品" align='center'>
            </el-table-column>
            <el-table-column prop="auction_name" label="拍场" align='center'>
            </el-table-column>
            <el-table-column prop="amount" label="成交额" align='center'>
            </el-table-column>
            <el-table-column prop="commission" label="佣金/元" align='center'>
            </el-table-column>
            <el-table-column prop="union_share_per" label="分成" align='center'>
            </el-table-column>
            <el-table-column prop="user_name" label="买家" align='center'>
            </el-table-column>
            <el-table-column prop="create_time" label="成交时间" align='center'>
              <template slot-scope="scope">
                <span>{{getTime(scope.row.create_time)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="订单状态" align='center'>
              <template slot-scope="scope">
                <span>{{scope.row.status==1?'待支付':scope.row.status==2?'待发货':'已完成'}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-if="page.total>page.pageSize" @current-change="getTableData" background :current-page="page.current" :page-size="page.pageSize" layout="prev,pager,next,total,jumper" :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog class="dialog" title="修改信息" :visible.sync="dialog.show" width="40%" :before-close="toggleDialog">
      <ul class="dialog-cont">
        <li class="item">
          <span>联盟图片</span>
          <el-upload class="avatar-uploader" accept="image/jpeg,image/jpg,image/png" action="https://upload.qiniup.com" :show-file-list="false" :data="postData" :on-success="handleAvatarSuccess">
            <img v-if="cover.key" :src="cover.src" class="avatar">
            <i v-if="!cover.key" class="el-icon-plus avatar-uploader-icon"></i>
            <p v-if="!cover.key" class="note">添加图片（限一张）</p>
          </el-upload>
        </li>
        <li class="item">
          <span>名&emsp;&emsp;称</span>
          <el-input placeholder="请输入名称" v-model="dialog.data.name" size="small"></el-input>
        </li>
        <li class="item">
          <span>类&emsp;&emsp;别</span>
          <el-checkbox-group v-model="dialog.data.catagory">
            <el-checkbox :label="item.id" v-for="(item,index) in cateList" :key="index">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifySubmit">确定</el-button>
        <el-button @click="toggleDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      postData: {
        token: ""
      },
      createData: {
        catagory_id: [],
        logo: "",
        name: ""
      }, //创建联盟传递的信息
      myUnionData: {}, //我的联盟信息
      cateList: [], //类别列表
      dialog: {
        show: false,
        data: {
          logo: "",
          name: "",
          catagory: []
        }
      },
      tableData: [],
      page: {
        pageSize: 10,
        total: 0,
        current: 1
      },
      cover: {
        key: "",
        src: ""
      }
    };
  },
  mounted() {
    this.getToken();
    this.getCategory();
    this.getMyUnion();
  },
  computed: {
    isAllies() {
      return JSON.parse(localStorage.getItem("userInfo")).id ===
        this.myUnionData.user_id
        ? true
        : false;
    }
  },
  methods: {
    // 获取token
    getToken() {
      this.$get({
        api: "/qiniu/token"
      }).then(({ data }) => {
        this.postData.token = data;
      });
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
          location.reload();
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    // 获取我的联盟信息
    getMyUnion() {
      this.$get({
        api: "/seller/union/getMyUnion"
      })
        .then(({ data }) => {
          this.myUnionData = data;
          if (data.id) {
            if (this.isAllies) {
              this.dialog.data = {
                name: data.name,
                logo: data.key,
                catagory: data.catagory_id
              };
              this.cover = { src: data.logo, key: data.key };
            } else {
              this.getTableData();
            }
          }
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    // 获取盟众下的表格信息
    getTableData(param) {
      if (param) {
        this.page.current = param;
      }
      this.$get({
        api: "/seller/union/order",
        data: {
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
    //类别
    getCategory() {
      this.$get({
        api: "/category/list"
      })
        .then(({ data }) => {
          this.cateList = data;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    // 创建联盟提交事件
    createSubmit() {
      if (!this.createData.logo) {
        this.$message.error("联盟图片不能为空！");
      } else if (!this.createData.name) {
        this.$message.error("联盟名称不能为空！");
      } else if (!this.createData.catagory_id.length) {
        this.$message.error("联盟类别不能为空！");
      } else {
        this.$post({
          api: "/seller/union/create",
          data: this.createData
        })
          .then(({ data }) => {
            this.getUserInfo();
          })
          .catch(err => {
            this.$message.error(err.response.data.msg);
          });
      }
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.cover = {
        key: res.key,
        src: URL.createObjectURL(file.raw)
      };
      if (this.isAllies) {
        this.dialog.data.logo = res.key;
      } else {
        this.createData.logo = res.key;
      }
    },
    // 退出联盟
    exitUnion() {
      this.$confirm("此操作将永久退出该联盟, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post({
            api: "/seller/union/exitUnion"
          })
            .then(({ data }) => {
              this.getUserInfo();
            })
            .catch(err => {
              this.$message.error(err.response.data.msg);
            });
        })
        .catch(() => {});
    },
    // 修改联盟的弹窗显示隐藏
    toggleDialog() {
      this.dialog.show = !this.dialog.show;
    },
    modifySubmit() {
      if (!this.dialog.data.logo) {
        this.$message.error("联盟图片不能为空！");
      } else if (!this.dialog.data.name) {
        this.$message.error("联盟名称不能为空！");
      } else if (!this.dialog.data.catagory.length) {
        this.$message.error("联盟类别不能为空！");
      } else {
        this.$post({
          api: "/seller/union/updateOwnUnion",
          data: this.dialog.data
        })
          .then(({ data }) => {
            this.$router.go(0);
          })
          .catch(err => {
            this.$message.error(err.response.data.msg);
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.myAlliance {
  padding: 15px;
  .wrapper {
    background: #fff;
    min-height: calc(100vh - 160px);
    padding: 25px;
  }
}
.section1 {
  .title {
    color: #409eff;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 50px;
  }
  .create-option {
    margin-bottom: 16px;
    span {
      display: inline-block;
      margin-right: 10px;
      font-size: 14px;
      font-weight: bold;
    }
    .avatar-uploader {
      display: inline-block;
      vertical-align: top;
    }
    .el-checkbox-group {
      display: inline-block;
      vertical-align: top;
      width: 400px;
      label {
        margin: 0 15px 15px 0;
      }
    }
    .el-input {
      display: inline-block;
      width: 180px;
    }
  }
  .create-btn {
    margin-top: 50px;
  }
}
.section2 {
  .intro {
    overflow: hidden;
    margin-bottom: 40px;
    img {
      float: left;
      margin-right: 50px;
    }
    .right {
      float: left;
      .title {
        font-weight: bold;
        font-size: 18px;
      }
      p {
        line-height: 36px;
        font-size: 14px;
        span:first-child {
          font-weight: bold;
          margin-right: 32px;
        }
      }
    }
  }
  .table-wrapper {
    margin-top: 15px;
  }
}
.dialog-cont {
  padding-left: 15px;
  .item {
    margin-bottom: 15px;
  }
  span {
    display: inline-block;
    margin-right: 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
  }
  .el-checkbox-group {
    display: inline-block;
    vertical-align: top;
    width: 400px;
    label {
      margin: 0 15px 15px 0;
    }
  }
  .el-input {
    display: inline-block;
    width: 180px;
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.note {
  position: absolute;
  top: 115px;
  left: 0;
  right: 0;
  font-size: 14px;
  color: #8c939d;
}
</style>

