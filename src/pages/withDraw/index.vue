<template>
  <div class="withDraw">
    <div class="datas-cout">
      <ul class="datas-list">
        <li class="datas-item">
          <p>{{moneyData.total_amount}}</p>
          <p>总收入（元）</p>
        </li>
        <li class="datas-item">
          <p>{{moneyData.freezing_amount}}</p>
          <p>冻结金额（元）</p>
        </li>
        <li class="datas-item">
          <p>{{moneyData.disposable_amount}}</p>
          <p>可支配金额（元）</p>
        </li>
      </ul>
      <el-button type="primary" @click="toggleDialog">申请提现</el-button>
    </div>
    <div class="table-wrapper">
      <div class="table-cont">
        <p class="title">提现记录</p>
        <el-table :data="tableData" stripe>
          <!-- <el-table-column type="index" label="序号" width="100" align='center'>
          </el-table-column> -->
          <el-table-column prop="create_time" label="申请时间" align='center'>
            <template slot-scope="scope">
              <span>{{getTime(scope.row.create_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="提现金额（元）" align='center'>
          </el-table-column>
          <el-table-column prop="" label="状态" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.status==0?'关闭':scope.row.status==1?'申请中':'已提现'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align='center'>
          </el-table-column>
        </el-table>
        <el-pagination v-if="page.total>page.pageSize" @current-change="getTableData" background :current-page="page.current" :page-size="page.pageSize" layout="prev,pager,next,total,jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="dialog" title="申请提现" :visible.sync="dialog.show" width="25%" :before-close="toggleDialog">
      <div class="dialog-cont">
        <span>提现金额：</span>
        <el-input placeholder="请输入提现金额" type="number" v-model.number="dialog.outAmount" size="small"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmCash">确定</el-button>
        <el-button @click.native="toggleDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      moneyData: {},
      tableData: [],
      dialog: {
        show: false,
        outAmount: ""
      },
      page: {
        current: 1,
        total: 0,
        pageSize: 10
      }
    };
  },
  mounted() {
    this.getTableData();
    this.getMoneyData();
  },
  methods: {
    toggleDialog() {
      this.dialog.show = !this.dialog.show;
    },
    getTableData(param) {
      if (param) {
        this.page.current = param;
      }
      this.$get({
        api: "/seller/cash/record",
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
    getMoneyData() {
      this.$get({
        api: "/seller/cash/getMoney"
      })
        .then(({ data }) => {
          this.moneyData = data;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    confirmCash() {
      this.$post({
        api: "/seller/cash/out?outAmount=" + this.dialog.outAmount
      })
        .then(({ data }) => {
          this.dialog = {
            show: false,
            outAmount: ""
          };
          this.getTableData();
          this.getMoneyData();
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.withDraw {
  padding: 15px;
}
.dialog-cont {
  .el-input {
    width: 350px;
  }
}
.dialog-footer {
  .el-button {
    width: 108px;
    padding: 8px 20px;
  }
}
.datas-cout {
  background: #fff;
  padding: 15px 0 15px 25px;
  margin-bottom: 15px;
  .datas-list {
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    margin-right: 90px;
    .datas-item {
      float: left;
      padding: 12px 20px;
      color: #fff;
      text-align: center;
      p:first-child {
        font-size: 20px;
        margin-bottom: 15px;
      }
      p:last-child {
        font-size: 12px;
      }
      &:first-child {
        background: #409efe;
      }
      &:nth-child(2) {
        background: #f36d6a;
        margin: 0 25px;
      }
      &:last-child {
        background: #67c239;
      }
    }
  }
}
.table-wrapper {
  min-height: calc(100vh - 350px);
  .table-cont {
    width: 765px;
  }
  background: #fff;
  padding: 25px;
  .title {
    font-size: 18px;
    line-height: 30px;
  }
}
</style>
