<template>
  <div class="menu_cont">
    <el-menu
        :collapse-transition="false"
        :collapse="isCollapse"
        router
        @select="handleSelect"
        :default-active="actives">
      <el-submenu :key="i" :index="item.name" v-for="(item, i) in menu"
                  v-if="item.meta && item.meta.isShow && item.children">
        <template slot="title">
          <i :class="item.meta.icon"></i>
          <span>{{item.meta && item.meta.title}}</span>
        </template>
        <el-menu-item
            :key="index"
            :route="{name: it.name}"
            :index="it.name"
            v-for="(it, index) in item.children"
            v-if="it.meta && it.meta.isShow">
          {{it.meta && it.meta.title}}
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-else :index="item.name" :route="{name: item.name}">
        <i :class="item.meta.icon"></i>
        <span>{{item.meta && item.meta.title}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import router from '../router'

  export default {
    props: {
      isCollapse: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        menu: router.options.routes[1].children,
        actives: 'IndexMain',
      }
    },
    methods: {
      handleSelect(e) {
        this.actives = e;
      },
      init() {
        this.actives = this.$route.name;
      },
    },
    created() {
      this.init();
    }
  }
</script>

<style lang="less" scoped>
  @import "./less/menu.less";
</style>
