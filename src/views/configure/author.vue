<template>
  <div class="configure">
    <div slot="header" class="clearfix">
      <span>标识设置</span>
    </div>
    <div>
      <el-alert
          style="margin-top: 10px"
          title="文章以及评论作者的特殊现实标识，如原作者、博主"
          type="info"
          show-icon>
      </el-alert>
      <div class="set_author">
        <el-input v-model="author"></el-input>
        <el-button type="primary" plain @click="saveConfigure('author')">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        configure: [], // 配置
        author: '', // 标识
      }
    },
    created() {
      this.getConfigure();
    },
    methods: {

      // 获取设置
      getConfigure() {
        this.$Axios.get('/yun/blog/get_configure').then(res => {
          if (res.code === 200) {
            this.configure = res.data;
            this.configure.map(item => {
              this[item.c_key] = item.val;
            })
          } else {
            this.$message.error(res.message);
          }
        })
      },

      // 保存设置
      saveConfigure(name) {
        let dat = {
          c_key: name,
          val: this[name],
        };
        this.$Axios.post('/yun/blog/set_configure', dat).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功');
          } else {
            this.$message.error(res.message);
          }
        })
      },

    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/theme.less";

  .configure {
    .set_author {
      margin-top: 20px;

      button {
        margin-top: 10px;
      }
    }
  }

</style>
