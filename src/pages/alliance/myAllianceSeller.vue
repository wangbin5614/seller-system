<template>
  <div class="myAllianceSeller">
    <div class="query">
      <span>卖家名称</span>
      <el-input placeholder="请输入卖家名称" size="small" v-model="queryName" style="width:270px;"></el-input>
      <el-button type="primary" @click="getTableData(1)">查询</el-button>
    </div>
    <div class="seller-cont">
      <div class="table-wrapper">
        <el-table :data="tableData" stripe>
          <el-table-column prop="name" label="卖家名称" align='center'>
          </el-table-column>
          <el-table-column prop="create_time" label="加盟日期" align='center'>
            <template slot-scope="scope">
              <span>{{getTime(scope.row.create_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="share_per" label="分成比例" align='center'>
          </el-table-column>
          <el-table-column prop="amount" label="分成总额" align='center'>
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <el-button @click="view(scope.row)" type="text" size="small" class="view-btn">查看</el-button>
              <el-button type="text" size="small" class="edit-btn" @click="edit(scope.row.id)">编辑</el-button>
              <el-button type="text" size="small" class="delete-btn" @click="deleteSeller(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="page.total>page.pageSize" @current-change="getTableData" background :current-page="page.current" :page-size="page.pageSize" layout="prev,pager,next,total,jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="dialog" title="查看" :visible.sync="viewDialog.show" width="38%" :before-close="handleClose">
      <div class="dialog-cont">
        <ul class="intro">
          <li class="item">
            <span>加盟商</span>
            <span>{{viewDialog.name}}</span>
          </li>
          <li class="item">
            <span>加盟日期</span>
            <span>{{getTime(viewDialog.create_time)}}</span>
          </li>
          <li class="item">
            <span>分成比例</span>
            <span>{{viewDialog.share_per}}</span>
          </li>
        </ul>
        <div class="dialog-table">
          <p class="title">分成记录</p>
          <el-table :data="sharePerTable" stripe style="width: 100%">
            <el-table-column prop="goods_name" label="拍品" align='center'>
            </el-table-column>
            <el-table-column prop="auction_name" label="拍场" align='center'>
            </el-table-column>
            <el-table-column prop="amount" label="成交额" align='center'>
            </el-table-column>
            <el-table-column prop="union_share_per" label="分成" align='center'>
            </el-table-column>
            <el-table-column prop="user_name" label="买家" align='center'>
            </el-table-column>
            <el-table-column prop="create_time" label="成交日期" align='center'>
              <template slot-scope="scope">
                <span>{{getTime(scope.row.create_time)}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-if="sharePerPage.total>sharePerPage.pageSize" @current-change="getSharePer" background :current-page="sharePerPage.current" :page-size="sharePerPage.pageSize" layout="prev,pager,next,total,jumper" :total="sharePerPage.total">
          </el-pagination>
        </div>
        <div class="dialog-table">
          <p class="title">加盟拍场</p>
          <el-table :data="unionAuctionTable" stripe style="width: 100%">
            <el-table-column prop="name" label="拍场名称" align='center'>
            </el-table-column>
            <el-table-column prop="create_time" label="时间" align='center'>
              <template slot-scope="scope">
                <span>{{getTime(scope.row.create_time)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="拍品数量" align='center'>
            </el-table-column>
          </el-table>
          <el-pagination v-if="unionAuctionPage.total>unionAuctionPage.pageSize" @current-change="getUnionAuction" background :current-page="unionAuctionPage.current" :page-size="unionAuctionPage.pageSize" layout="prev,pager,next,total,jumper" :total="unionAuctionPage.total">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="dialog" title="编辑" :visible.sync="editDialog.show" width="25%" :before-close="toggleEditDialog">
      <div class="edit-cont">
        <span>分成比例：</span>
        <el-input size="small" type="number" v-model.number="editDialog.sharePer1" placeholder="盟主"></el-input>
        <span>:</span>
        <el-input size="small" type="number" v-model.number="editDialog.sharePer2" placeholder="盟众"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifySharePer">确定</el-button>
        <el-button @click.native="toggleEditDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryName: "", //搜索的name
      tableData: [],
      page: {
        total: 0,
        pageSize: 10,
        current: 1
      },
      editDialog: {
        show: false,
        id: "",
        sharePer1: "",
        sharePer2: ""
      },
      sharePerTable: [], //分成记录列表
      sharePerPage: {
        // 分成记录分页
        total: 0,
        pageSize: 5,
        current: 1
      },
      unionAuctionTable: [], //加盟拍场列表
      unionAuctionPage: {
        //加盟拍场分页
        total: 0,
        pageSize: 5,
        current: 1
      },
      viewDialog: {
        show: false,
        id: "",
        create_time: "",
        name: "",
        share_per: ""
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
        api: "/seller/union/allUnionSeller",
        data: {
          name: this.queryName,
          page: this.page.current,
          size: this.page.pageSize
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
    //分成记录列表
    getSharePer(param) {
      if (param) {
        this.sharePerPage.current = param;
      }
      this.$get({
        api: "/seller/union/order",
        data: {
          id: this.viewDialog.id,
          page: this.sharePerPage.current,
          size: this.sharePerPage.pageSize
        }
      })
        .then(({ data }) => {
          this.sharePerTable = data.content;
          this.sharePerPage.total = data.total_elements;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    //加盟拍场列表
    getUnionAuction(param) {
      if (param) {
        this.unionAuctionPage.current = param;
      }
      this.$get({
        api: "/seller/union/allJoinUnionAuction",
        data: {
          id: this.viewDialog.id,
          page: this.unionAuctionPage.current,
          size: this.unionAuctionPage.pageSize
        }
      })
        .then(({ data }) => {
          this.unionAuctionTable = data.content;
          this.unionAuctionPage.total = data.total_elements;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    edit(id) {
      this.editDialog.show = true;
      this.editDialog.id = id;
    },
    toggleEditDialog(val) {
      this.editDialog.show = !this.editDialog.show;
    },
    modifySharePer() {
      let share_per=(this.editDialog.sharePer1 / (this.editDialog.sharePer2+this.editDialog.sharePer1)).toFixed(2);
      this.$post({
        api: "/seller/union/updateSharePer",
        data: {
          id: this.editDialog.id,
          share_per: share_per
        }
      })
        .then(({ data }) => {
          this.editDialog = {
            show: false,
            id: "",
            sharePer1: "",
            sharePer2: ""
          };
          this.getTableData();
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    deleteSeller(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post({
            api: "/seller/union/exitUnion?unionMenberId=" + id
          })
            .then(({ data }) => {
              this.getTableData();
            })
            .catch(err => {
              this.$message.error(err.response.data.msg);
            });
        })
        .catch(() => {});
    },
    view(data) {
      this.viewDialog = {
        show: true,
        id: data.id,
        create_time: data.create_time,
        name: data.name,
        share_per: data.share_per
      };
      this.getSharePer();
      this.getUnionAuction();
    },
    handleClose() {
      this.viewDialog.show = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.myAllianceSeller {
  padding: 15px;
}
.query {
  background: #fff;
  padding: 18px 26px;
  .el-input {
    margin: 0 60px 0 10px;
  }
}
.seller-cont {
  min-height: calc(100vh - 315px);
  padding: 60px 30px;
  margin-top: 15px;
  background: #fff;
  .table-wrapper {
    width: 770px;
    .edit-btn,
    .view-btn {
      color: #333;
    }
    .delete-btn {
      color: red;
    }
  }
}
.dialog-cont {
  .intro {
    overflow: hidden;
    .item {
      float: left;
      &:nth-child(2) {
        margin: 0 50px;
      }
    }
    span:first-child {
      display: inline-block;
      font-weight: bold;
    }
  }
  .dialog-table {
    overflow: hidden;
    margin-top: 40px;
    .title {
      font-weight: bold;
    }
  }
}
.edit-cont {
  padding-left: 20px;
  .el-input {
    width: 100px;
  }
}
.dialog-footer {
  .el-button {
    width: 108px;
    padding: 8px 20px;
  }
}
</style>
