<template>
  <div class="configure">

    <!--骨架屏-->
    <!--<div class="skeleton">-->
    <!--<div class="skeleton-head"></div>-->
    <!--<div class="skeleton-body">-->
    <!--<div class="skeleton-title"></div>-->
    <!--<div class="skeleton-content"></div>-->
    <!--</div>-->
    <!--</div>-->

    <el-tabs v-model="activeName" @tab-click="change">
      <el-tab-pane label="友链列表" name="friend">
        <el-card class="box-card" shadow="hover">
          <awei-friend/>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="分类列表" name="category">
        <el-card class="box-card" shadow="hover">
          <awei-category/>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="标签列表" name="tag">
        <el-card class="box-card" shadow="hover">
          <awei-tag/>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="标识设置" name="author">
        <el-card class="box-card" shadow="hover">
          <awei-author/>
        </el-card>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import Friend from './friend'
  import Category from './category'
  import Tag from './tag'
  import Author from './author'

  export default {
    components: {
      'awei-friend': Friend,
      'awei-category': Category,
      'awei-tag': Tag,
      'awei-author': Author,
    },
    data() {
      return {
        activeName: this.$route.query.name || 'friend'
      }
    },
    methods: {

      // 切换标签页设置到地址栏(刷新时用)
      change(val) {
        window.history.pushState(null, null, this.changeURLArg(window.location.href, 'name', val.name));
      },

      // 修改地址栏参数
      changeURLArg(url, arg, arg_val) {
        let pattern = arg + '=([^&]*)';
        let replaceText = arg + '=' + arg_val;
        if (url.match(pattern)) {
          let tmp = '/(' + arg + '=)([^&]*)/gi';
          tmp = url.replace(eval(tmp), replaceText);
          return tmp;
        } else {
          if (url.match('[\?]')) {
            return url + '&' + replaceText;
          } else {
            return url + '?' + replaceText;
          }
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/theme.less";

  .skeleton {
    padding: 10px 0;
  }

  .skeleton .skeleton-head,
  .skeleton .skeleton-title,
  .skeleton .skeleton-content {
    background: rgb(194, 207, 214);
  }

  .skeleton-head {
    width: 100px;
    height: 100px;
    float: left;
  }

  .skeleton-body {
    margin-left: 110px;
  }

  .skeleton-title {
    width: 500px;
    height: 60px;
  }

  .skeleton-content {
    width: 260px;
    height: 30px;
    margin-top: 10px;
  }

  .skeleton .skeleton-head,
  .skeleton .skeleton-title,
  .skeleton .skeleton-content {
    background: rgb(194, 207, 214);
    background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%);
    background-size: 20rem 20rem;
    animation: skeleton-stripes 1s linear infinite;
  }

  @keyframes skeleton-stripes {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 20rem 0;
    }
  }
</style>
