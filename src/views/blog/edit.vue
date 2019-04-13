<template>
  <div>

    <el-form ref="blog" :model="detail" :rules="rules" label-width="120px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="detail.title"></el-input>
      </el-form-item>
      <!--<el-form-item label="类型">-->
      <!--<el-select v-model="detail.region" placeholder="请选择活动区域">-->
      <!--<el-option label="类型1" value="shanghai"></el-option>-->
      <!--<el-option label="类型12" value="beijing"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->

      <el-form-item label="内容" prop="markdown">

        <div id="editor">
          <mavon-editor
              ref="mavon"
              @imgAdd="imgAdd"
              :boxShadow="false"
              @change="change"
              codeStyle="monokai-sublime"
              style="height: 100%"
              v-model="detail.markdown"></mavon-editor>
        </div>

      </el-form-item>

      <el-form-item label="首图" prop="img">
        <el-upload
            class="avatar-uploader"
            :http-request="upImg"
            :show-file-list="false">
          <img v-if="detail.img" :src="detail.img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <el-alert
            style="margin-top: 10px"
            title="首图尺寸 3 : 2 最佳"
            type="info"
            show-icon>
        </el-alert>

      </el-form-item>

      <el-form-item label="分类" prop="category_id">
        <el-select v-model="detail.category_id" placeholder="请选择">
          <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标签" prop="tag_id">
        <el-checkbox-group v-model="detail.tag_id">
          <el-checkbox :label="item.id" v-for="(item, i) in tagList" :key="i">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="自定义发布时间" prop="time">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="detail.time"></el-date-picker>
      </el-form-item>
      <el-form-item label="允许评论">
        <el-switch v-model="detail.is_evaluate"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="wait" @click="save(0)">{{id ? '修改' : '发布'}}</el-button>
        <el-button type="primary" :loading="wait" @click="save(1)">存为草稿</el-button>
        <el-button v-if="id" @click="getDetail" type="primary" plain>恢复</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import moment from 'moment'
  import {upload} from '@/api/common'
  import {detail, edit} from '@/api/blog'
  import {tag_list} from '@/api/tag'
  import {category_list} from '@/api/category'

  export default {

    components: {
      mavonEditor,
    },
    data() {
      return {
        wait: false, // 等待状态
        detail: { // 博客详情
          title: '',
          content: '',
          markdown: '',
          img: '',
          tag_id: [],
          time: '',
          is_draft: 0,
          is_evaluate: true,
        },
        id: this.$route.query.id, // 修改时传的id
        tagList: [], // 标签的列表
        categoryList: [], // 标签的列表
        rules: { // 校验
          title: [{required: true, message: '请输入标题', trigger: 'blur'},],
          markdown: [{required: true, message: '请输入内容', trigger: 'blur'},],
          img: [{required: true, message: '请上传首图', trigger: 'blur'},],
          tag_id: [{required: true, message: '请选择标签', trigger: 'blur'},],
          category_id: [{required: true, message: '请选择分类', trigger: 'blur'},],
        },
      }
    },
    created() {
      this.getTag();
      this.getCategory();
      if (this.id) {
        this.getDetail();
      }
    },
    methods: {

      // 获取标签列表
      getTag() {
        tag_list().then(res => {
          if (res.code === 200) {
            this.tagList = res.data;
          } else {
            this.$message.error(res.message);
          }
        })
      },

      // 获取标签列表
      getCategory() {
        category_list().then(res => {
          if (res.code === 200) {
            this.categoryList = res.data;
          } else {
            this.$message.error(res.message);
          }
        })
      },

      // 获取博客详情
      getDetail() {
        let dat = {
          id: this.id
        };
        detail(dat).then(res => {
          if (res.code === 200) {
            let tag_id = [];
            let tag_list = res.data.tag_list || [];
            tag_list.map(item => {
              tag_id.push(item.id);
            });
            this.detail = {
              ...res.data,
              tag_id: tag_id,
              is_evaluate: res.data.is_evaluate ? false : true,
              time: moment(res.data.time),
            };
            console.log(this.detail);
          } else {
            this.$message.error(res.message);
          }
        })
      },

      // 新增、编辑保存
      save(is_draft) {
        this.$refs.blog.validate((valid) => {
          if (valid) {
            this.wait = true;
            let dat = {
              ...this.detail,
              is_draft: is_draft ? 1 : 0,
              is_evaluate: this.detail.is_evaluate ? 0 : 1,
            };
            edit(dat).then(res => {
              this.wait = false;
              if (res.code === 200) {
                this.$message.success('保存成功');
                this.$router.push('/admin/blog')
              } else {
                this.$message.error(res.message);
              }
            })

          } else {
            console.log(this.detail);
            console.log('error submit!!');
            return false;
          }
        });
      },

      // 动态赋html
      change(dat, e) {
        this.detail.content = e;
      },

      // 编辑器图片上传
      imgAdd(name, file) {
        this.up(file, url => {
          this.$refs.mavon.$img2Url(name, url);
        });
      },

      // 首图图片上传
      upImg(file) {
        this.up(file.file, url => {
          this.detail.img = url;
        });
      },

      // 上传图片到ali oss
      up(file, callback) {
        let formdata = new FormData();
        formdata.append('file', file);
        upload(formdata).then(res => {
          if (res.code === 200) {
            callback(res.data.url)
          } else {
            this.$message.error(res.message);
          }
        })
      },

      // 重置表单
      reset() {
        this.$refs.blog.resetFields();
      },
    }

  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/theme.less";

  #editor {
    width: 100%;
    height: 580px;
    margin: 0;
    /*/deep/ .v-note-op {*/
    /*box-shadow: none;*/
    /*border: 1px solid #e0e0e0;*/
    /*}*/
    /*/deep/ .v-note-panel {*/
    /*box-shadow: none;*/
    /*border: 1px solid #e0e0e0;*/
    /*margin-top: -1px;*/
    /*}*/
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #c0ccda;
    cursor: pointer;
  }

  .avatar {
    height: 178px;
    display: block;
    border: 2px solid #e1e1e1;
  }
</style>
