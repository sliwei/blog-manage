<template>
  <div class="error">
    <div>
      <img src="./img/404.jpg" alt="">
    </div>
    <div>
      <p>你要访问的页面没找到！</p>
      <router-link to="/admin">去控制台</router-link> &emsp;
      <a href="javascript:;" @click="$router.go(-1)">返回上一页</a>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="less" scoped>
  .error {
    margin: 0 auto;
    width: 500px;
    height: 100vh;
    padding-top: 200px;
    text-align: center;
    display: flex;

    div {
      height: 250px;
      vertical-align: middle;
      margin: 0 10px;

      p {
        text-align: center;
      }

      &:last-child {
        text-align: left;
        padding: 100px 0;

        a {
          color: #1754fa;
        }
      }
    }
  }
</style>
