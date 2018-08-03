<template>
  <div class="allianceCheck">
    <div class="table-wrapper">
      <p class="title">审核列表</p>
      <el-table :data="tableData" stripe>
        <el-table-column prop="name" label="申请人" align='center'>
        </el-table-column>
        <el-table-column prop="create_time" label="申请时间" align='center'>
          <template slot-scope="scope">
            <span>{{getTime(scope.row.create_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.status==1?'申请中':scope.row.status==2?'已撤销':scope.row.status==3?'已通过':'已驳回'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="pass-btn" @click="submit(scope.row.id,3)" v-if="scope.row.status ==1">通过</el-button>
            <el-button type="text" size="small" class="return-btn" @click="submit(scope.row.id,4)" v-if="scope.row.status ==1">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="page.total>page.pageSize" @current-change="getTableData" background :current-page="page.current" :page-size="page.pageSize" layout="prev,pager,next,total,jumper" :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      page: {
        total: 0,
        pageSize: 15,
        current: 1
      },
      tableData: []
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
        api: "/seller/union/applyMessage",
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
    submit(id, type) {
      let text = type == 3 ? "通过" : "驳回";
      this.$confirm("确定进行" + text + "操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post({
            api: "/seller/union/verify",
            data: {
              id: id,
              type: type
            }
          })
            .then(({ data }) => {
              this.getTableData();
            })
            .catch(err => {
              this.$message.error(err.response.data.msg);
            });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.allianceCheck {
  padding: 25px;
  margin: 15px;
  background: #fff;
  overflow: hidden;
  min-height: calc(100vh - 160px);
}
.table-wrapper {
  width: 770px;
  .title {
    font-size: 18px;
    line-height: 30px;
  }
  .return-btn {
    color: red;
  }
}
</style>
