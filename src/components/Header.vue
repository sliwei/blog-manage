<template>
  <div class="header">
    <router-link to="/admin">
      <h1>博客后台管理系统</h1>
    </router-link>

    <div class="menu">
      <el-dropdown trigger="click" @command="fun">
        <el-tag>
          <span class="el-dropdown-link">
            你好,{{name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </el-tag>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="menu_item_pad" command="set">配置</el-dropdown-item>
          <el-dropdown-item class="menu_item_pad" command="out">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: sessionStorage.getItem('name'),
      }
    },
    methods: {

      // 菜单事件
      fun(type) {
        switch (type) {
          case 'set': // 配置
            this.$router.push('/admin/configure')
            break;
          case 'out': // 退出
            sessionStorage.clear();
            this.$router.push('/');
            break;
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "./less/header.less";

</style>
