<template>
  <div class="goodsList">
    <div class="add-wrapper">
      <el-button type="primary" @click="$router.push({path:'/addGoods'})">新增拍品</el-button>
    </div>
    <div class="query">
      <span>关键字</span>
      <el-input placeholder="请输入对应关键字" size="small" v-model="query.name" style="width:265px;margin:0 30px 0 10px;"></el-input>
      <div class="date-select">
        <span>开拍时间</span>
        <el-date-picker type="date" placeholder="选择日期" value-format="timestamp" size="small" v-model="query.start">
        </el-date-picker>
        <span>至</span>
        <el-date-picker type="date" placeholder="选择日期" value-format="timestamp" size="small" v-model="query.end">
        </el-date-picker>
      </div>
      <div class="status-select">
        <span>状态</span>
        <el-select v-model="query.status" placeholder="请选择" size="small" style="width:114px;">
          <el-option label="全部" value=""></el-option>
          <el-option label="已拍出" :value="1"></el-option>
          <el-option label="拍卖中" :value="2"></el-option>
          <el-option label="已发布" :value="0"></el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="getTableData(1)">查询拍品</el-button>
    </div>
    <div class="table-wrapper">
      <p class="title">拍品列表</p>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="拍品ID" width="180" align='center'>
        </el-table-column>
        <el-table-column prop="name" label="拍品名称" align='center'>
        </el-table-column>
        <el-table-column prop="starting_price" label="起拍价" align='center'>
        </el-table-column>
        <el-table-column prop="status" label="状态" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.status==2?'拍卖中':scope.row.status==1?'已拍出':'已发布'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="auction_name" label="拍场" align='center'>
        </el-table-column>
        <el-table-column prop="start_time" label="开拍时间" align='center'>
          <template slot-scope="scope">
            <span>{{getTime(scope.row.start_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button @click="view(scope.row.id)" type="text" size="small" class="view-btn">查看</el-button>
            <el-button type="text" size="small" class="edit-btn" @click="edit(scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" class="delete-btn" @click="deleteGood(scope.row.id)">删除</el-button>
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
      query: {
        status: "",
        name: "",
        start: "",
        end: ""
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
    this.getTableData(1);
  },
  methods: {
    getTableData(param) {
      if (param) {
        this.page.current = param;
      }
      this.$get({
        api: "/seller/goods/query",
        data: {
          page: this.page.current,
          size: this.page.pageSize,
          name: this.query.name,
          status: this.query.status,
          start: this.query.start,
          end: this.query.end
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
    deleteGood(id) {
      let that = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post({
            api: "/seller/goods/delete/" + id
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
    edit(id) {
      this.$router.push({ path: "/addGoods", query: { id: id } });
    },
    view(id) {
      this.$router.push({ path: "/goodsDetail", query: { id: id } });
    }
  }
};
</script>
<style lang="scss" scoped>
.goodsList {
  padding: 15px;
}
.add-wrapper {
  height: 68px;
  line-height: 68px;
  background: #fff;
  padding-left: 25px;
}
.query {
  padding: 0 25px;
  background: #fff;
  margin: 10px 0;
  color: #333333;
  .date-select {
    display: inline-block;
    margin: 18px 60px 18px 0;
    span {
      margin: 0 5px;
    }
  }
  .status-select {
    display: inline-block;
    margin: 18px 60px 18px 0;
    span {
      margin-right: 5px;
    }
  }
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
</style>
