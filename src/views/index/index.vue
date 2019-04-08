<template>
  <app-layout>
    <router-view/>
  </app-layout>
</template>

<script>
  import Layout from '@/components/Layout';
  import {info} from '@/api/login'

  export default {
    components: {
      'app-layout': Layout,
    },
    methods: {
      info() {
        info()
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
