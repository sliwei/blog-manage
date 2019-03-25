<template>
  <div class="bg">
    <div class="mask"></div>
    <div class="login">
      <div class="title">登录</div>
      <el-form status-icon label-position="top" :model="dat" ref="login" @submit.native.prevent>
        <el-form-item prop="user" label="账号" :rules="[{ required: true, message: '账号不能为空'}]">
          <el-input v-model="dat.user" style="width: 220px" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" :rules="[{ required: true, message: '密码不能为空'}]">
          <el-input v-model="dat.password" style="width: 220px" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码" :rules="[{ required: true, message: '验证码不能为空'}]">
          <el-input class="code_input" v-model="dat.code" style="width: 114px" autocomplete="off"></el-input>
          <div class="code" v-html="svg" @click="getCode"></div>
        </el-form-item>
        <el-form-item>
          <!--<el-button type="primary" @click="submitForm()">登录</el-button>-->
          <el-button type="primary" @click="submitForm()" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
  import MD5 from 'js-md5'
  import {login} from '@/api/login'
  import {code} from '@/api/verification'

  export default {

    data() {
      return {
        svg: '',
        dat: {
          user: '',
          password: '',
          code: '',
          key: '',
        }
      }
    },
    created() {
      this.getCode();
    },
    methods: {
      getCode() {
        code({w: 100, h: 40}).then(res => {
          if (res.code === 200) {
            this.svg = res.data.svg;
            this.dat.key = res.data.key;
          } else {
            this.$message.error(res.message);
          }
        })
      },
      submitForm() {
        this.$refs.login.validate((valid) => {
          if (valid) {
            let dat = {
              user: this.dat.user,
              password: MD5(this.dat.password),
              code: this.dat.code,
              key: this.dat.key,
            };
            login(dat).then(res => {
              if (res.code === 200) {
                this.$message.success('登录成功');
                this.$router.replace({path: '/admin'});
                sessionStorage.setItem('token', res.data.token);
                sessionStorage.setItem('name', res.data.name);
                sessionStorage.setItem('user', res.data.user);
                sessionStorage.setItem('id', res.data.id);
                this.$Axios.setAuthorization(res.data.token);
              } else if (res.code === 1) {
                this.getCode();
              } else {
                this.$message.error(res.message);
              }
            })
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/theme.less";

  .bg {
    width: 100%;
    height: 100vh;
    background: url('./img/bg.jpg') no-repeat center;
    background-size: cover;
    padding-top: 200px;
    display: flex;
    -webkit-box-orient: vertical;
    flex-direction: column;
    flex: auto;

    .mask {
      width: 100%;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, .5);
    }
  }

  .login {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px 70px 20px;
    /* width: 300px; */
    margin: 0 auto;
    z-index: 2;

    .title {
      color: #666666;
      font-size: 18px;
      font-weight: bold;
      margin: 20px 0 30px 0;
      width: 220px;
      text-align: center;
    }

    button {
      width: 220px;
    }

    /deep/ .el-form-item__label {
      line-height: initial;
      padding: 0;
    }

    .code_input {
      vertical-align: middle;
    }

    .code {
      vertical-align: middle;
      background-color: white;
      display: inline-block;
      width: 100px;
      height: 40px;
      border-radius: 4px;
      box-sizing: border-box;
      border: 1px solid rgba(0, 0, 0, 0);
      cursor: pointer;

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
