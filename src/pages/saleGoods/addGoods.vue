<template>
  <div class="addGoods">
    <Breadcrumb primaryTitle='拍品列表' link='/saleList' title='新增拍品'></Breadcrumb>
    <ul class="add-wrapper">
      <li class="add-option">
        <span>拍品名称</span>
        <el-input placeholder="请输入拍品名称" v-model="manageData.name" size="small"></el-input>
      </li>
      <li class="add-option">
        <span>拍品介绍</span>
        <el-input resize="none" :autosize="{minRows: 5, maxRows: 5}" type="textarea" v-model="manageData.description" placeholder="请输入拍品介绍" size="small"></el-input>
      </li>
      <li class="add-option">
        <span>添加图片</span>
        <div class="upload-wrapper">
          <el-upload class="avatar-uploader" accept="image/jpeg,image/jpg,image/png" :file-list="imgUrl" list-type="picture-card" :on-remove="handleRemove" multiple action="https://upload.qiniup.com" :data="postData" :on-success="handleAvatarSuccess">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </li>
      <li class="add-option">
        <span>添加视频</span>
        <div class="upload-wrapper">
          <el-upload class="video-uploader" accept="video/*" action="https://upload.qiniup.com" :file-list="videoUrl" :on-success="handleVideoSuccess" :on-remove="handleRemoveVideo" :data="postData">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <video width="662" height="368" controls loop v-if="videoUrl.length" class="video-player">
          <source :src="videoUrl[0].url" type="video/mp4">
          <source :src="videoUrl[0].url" type="video/ogg"> 您的浏览器不支持 video 标签。
        </video>
      </li>
      <li class="add-option">
        <el-button type="primary" @click="submit">提交</el-button>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgList:[],
      imgUrl: [],
      videoUrl: [],
      postData: {
        token: ""
      },
      manageData: {
        name: "",
        description: "",
        images: [],
        videoes: ""
      }
    };
  },
  mounted() {
    this.getToken();
    if (this.$route.query.id) {
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      this.$get({
        api: "/seller/goods/view/" + this.$route.query.id
      })
        .then(({ data }) => {
          this.manageData = data;
          this.imgUrl = [];
          data.images.forEach((item, index) => {
            this.imgUrl.push({ url: data.imghost + item, link: item });
            this.imgList.push(item)
          });
          if (data.videoes) {
            this.videoUrl = [
              { name: "", url: data.imghost + data.videoes, link: data.videoes }
            ];
          } else {
            this.videoUrl = [];
          }
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    getToken() {
      this.$get({
        api: "/qiniu/token"
      }).then(({ data }) => {
        this.postData.token = data;
      });
    },
    // video删除
    handleRemoveVideo(file, fileList) {
      this.videoUrl = [];
    },
    // video上传成功
    handleVideoSuccess(res, file) {
      this.videoUrl = [{ url: file.url, link: res.key, name: file.name }];
    },
    // 图片上传移除
    handleRemove(file, fileList) {
      this.imgList.forEach((item,index)=>{
        if((file.response && item==file.response.key) || (file.link && item==file.link)){
          this.imgList.splice(index,1);
        }
      })   
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.imgList.push(res.key)
    },
    submit() {
      if (!this.manageData.name) {
        this.$message.error("拍品名称不能为空！");
        return;
      } else if (!this.manageData.description) {
        this.$message.error("拍品介绍不能为空！");
        return;
      } else if (!this.imgList.length) {
        this.$message.error("图片不能为空！");
        return;
      }
      let link;
      if (this.$route.query.id) {
        link = "/seller/goods/update";
      } else {
        link = "/seller/goods/save";
      }
      let arr = [];
      this.imgList.forEach(item => {
        arr.push(item);
      });
      this.manageData.images = arr;
      this.manageData.videoes = this.videoUrl.length
        ? this.videoUrl[0].link
        : "";
      this.$post({
        api: link,
        data: this.manageData
      })
        .then(({ data }) => {
          this.$router.go(-1);
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    }
  }
};
</script>
<style>
.upload-wrapper .el-upload-list--picture-card .el-upload-list__item {
  width: 95px;
  height: 95px;
}
.upload-wrapper .el-upload--picture-card {
  width: 95px;
  height: 95px;
  line-height: 95px;
}
.video-uploader {
  width: 95px;
  height: 95px;
  line-height: 95px;
  text-align: center;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  background: #fbfdff;
}
.video-uploader .el-upload {
  width: 100%;
  height: 100%;
}
.video-uploader .el-icon-plus {
  font-size: 28px;
  color: #8c939d;
}
.video-uploader:hover {
  border: 1px dashed #409eff;
}
</style>
<style lang="scss" scoped>
.addGoods {
  padding: 0 15px;
}
.add-wrapper {
  padding: 54px 26px;
  background: #fff;
  .add-option {
    margin-bottom: 20px;
    &:last-child {
      padding-left: 72px;
    }
    span {
      display: inline-block;
      vertical-align: top;
      line-height: 32px;
      margin-right: 10px;
    }
    .upload-wrapper {
      display: inline-block;
      vertical-align: top;
    }
    .el-textarea,
    .el-input {
      width: 680px;
      vertical-align: top;
    }
  }
}
.video-player {
  background: #ccc;
  border-radius: 6px;
}
</style>
