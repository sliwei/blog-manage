<template>
  <app-layout>
    <router-view/>
  </app-layout>
</template>

<script>
  import Layout from '@/components/Layout';

  export default {
    components: {
      'app-layout': Layout,
    },
    methods: {
      info() {
        this.$Axios.get('/yun/blog/info');
      },
    },
    created() {
      this.info();
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/theme.less";

</style>
