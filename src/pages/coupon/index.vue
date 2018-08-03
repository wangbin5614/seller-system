<template>
  <div class="couponList">
    <div class="add-wrapper">
      <el-button type="primary" @click="dialogShow(1)">新增优惠券</el-button>
    </div>
    <div class="table-wrapper">
      <p class="title">优惠券列表</p>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="180" align='center'>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align='center'>
        </el-table-column>
        <el-table-column prop="requirement" label="订单最低金额" align='center'>
        </el-table-column>
        <el-table-column prop="scope" label="适用范围" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.scope==1?'全场':'单场'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="有效期/月" align='center'>
        </el-table-column>
        <el-table-column prop="dead_day" label="截至日期" align='center'>
          <template slot-scope="scope">
            <span>{{getTime(scope.row.dead_day)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="数量" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.limited==1?scope.row.total:'不限量'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remain" label="剩余数量" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.limited==1?scope.row.remain:'不限量'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.status==1?'草稿':'发布'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button @click="view(scope.row.id)" type="text" size="small" class="view-btn">查看</el-button>
            <el-button type="text" size="small" class="edit-btn" @click="dialogShow(2,scope.row)" v-if="scope.row.status ==1">修改</el-button>
            <el-button type="text" size="small" class="delete-btn" @click="deleteCoupon(scope.row.id)" v-if="scope.row.status ==1">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="page.total>page.pageSize" @current-change="getTableData" background :current-page="page.current" :page-size="page.pageSize" layout="prev,pager,next,total,jumper" :total="page.total">
      </el-pagination>
    </div>
    <el-dialog class="dialog" :title="dialog.type===1?'新增优惠券':'修改优惠券'" :visible.sync="dialog.show" width="37%" :before-close="handleClose">
      <ul class="dialog-cont">
        <li class="item">
          <span>金&emsp;&emsp;额</span>
          <el-input placeholder="请输入金额" type="number" v-model.number="dialog.data.amount" size="small"></el-input>
        </li>
        <li class="item">
          <span>前置条件</span>
          <span>满</span>
          <el-input placeholder="请输入金额" size="small" type="number" v-model.number="dialog.data.requirement" style="width:150px;"></el-input>
          <span>元</span>
        </li>
        <li class="item">
          <span>适用范围</span>
          <el-select placeholder="请选择" size="small" v-model="dialog.data.scope">
            <el-option label="单一拍场可用" :value="2"></el-option>
            <el-option label="所有拍场可用" :value="1"></el-option>
          </el-select>
        </li>
        <li class="item">
          <span>种&emsp;&emsp;类</span>
          <el-select placeholder="请选择" size="small" v-model="dialog.data.type">
            <el-option label="抵用券" :value="1"></el-option>
          </el-select>
        </li>
        <li class="item">
          <span>有 效 期</span>
          <el-select placeholder="请选择" size="small" v-model="dialog.data.deadline">
            <el-option label="30天内" :value="1"></el-option>
            <el-option label="2个月内" :value="2"></el-option>
            <el-option label="3个月内" :value="3"></el-option>
            <el-option label="6个月内" :value="6"></el-option>
            <el-option label="1年内" :value="12"></el-option>
          </el-select>
        </li>
        <li class="item">
          <span>数量限额</span>
          <el-select placeholder="请选择" size="small" v-model="dialog.data.limited">
            <el-option label="不限量" :value="2"></el-option>
            <el-option label="限量" :value="1"></el-option>
          </el-select>
          <div v-show="dialog.data.limited===1" style="padding-left:75px;margin-top:10px;">
            <el-input placeholder="请输入数量" size="small" type="number" v-model.number="dialog.data.total" style="width:170px;"></el-input>
            <span>张</span>
          </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit(1)">保存为草稿</el-button>
        <el-button type="primary" @click="submit(2)">发布</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: {
        type: 1,
        show: false,
        data: {
          status: "", //草稿 或者 发布
          amount: "", //金额
          requirement: "", //满多少金额
          scope: "", //适用范围
          type: "", //种类
          deadline: "", //有效期
          limited: "", //是否限额
          total: "" //限额数量
        }
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
    this.getTableData();
  },
  methods: {
    getTableData(param) {
      if (param) {
        this.page.current = param;
      }
      this.$get({
        api: "/seller/coupon/query",
        data: {
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
    // 删除优惠券
    deleteCoupon(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post({
            api: "/seller/coupon/delete/" + id
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
    view(id) {
      this.$router.push({ path: "/couponDetail", query: { id: id } });
    },
    dialogShow(type, params) {
      this.dialog.type = type;
      this.dialog.show = true;
      if (type == 1) {
        this.dialog.data = {
          status: "",
          amount: "",
          requirement: "",
          scope: "",
          type: "",
          deadline: "",
          limited: "",
          total: ""
        };
      } else {
        this.dialog.data.id = params.id;
        for (var attr in this.dialog.data) {
          this.dialog.data[attr] = params[attr];
        }
      }
    },
    handleClose() {
      this.dialog.show = false;
    },
    submit(status) {
      this.dialog.data.status = status;
      let link;
      if (this.dialog.data.id) {
        link = "/seller/coupon/update";
      } else {
        link = "/seller/coupon/save";
      }
      if (this.dialog.data.amount <= 0) {
        this.$message.error("请输入正数的金额！");
        return;
      } else if (this.dialog.data.requirement <= 0) {
        this.$message.error("请输入正数的前置条件！");
        return;
      } else if (!this.dialog.data.scope) {
        this.$message.error("适用范围不能为空！");
        return;
      } else if (!this.dialog.data.type) {
        this.$message.error("种类不能为空！");
        return;
      } else if (!this.dialog.data.deadline) {
        this.$message.error("有效期不能为空！");
        return;
      } else if (!this.dialog.data.limited) {
        this.$message.error("是否限额不能为空！");
        return;
      } else if (this.dialog.data.limited == 1 && this.dialog.data.total<=0) {
        this.$message.error("请输入正数的限额数量！");
        return;
      }
      this.$post({
        api: link,
        data: this.dialog.data
      })
        .then(({ data }) => {
          this.getTableData();
          this.dialog.show = false;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.couponList {
  padding: 15px;
}
.add-wrapper {
  height: 68px;
  line-height: 68px;
  background: #fff;
  padding-left: 25px;
  margin-bottom: 15px;
}
.table-wrapper {
  background: #fff;
  padding: 25px;
  .title {
    font-size: 18px;
    line-height: 30px;
  }
  .edit-btn,
  .view-btn {
    color: #333;
  }
  .delete-btn {
    color: red;
  }
}

.dialog-cont {
  overflow: hidden;
  padding: 20px 0 60px 14px;
  .item {
    float: left;
    margin: 0 28px 10px;
    font-size: 14px;
    font-weight: bold;
    span:first-child {
      display: inline-block;
      width: 70px;
      vertical-align: middle;
    }
    .el-input,
    .el-select {
      display: inline-block;
      width: 188px;
    }
  }
}
</style>
