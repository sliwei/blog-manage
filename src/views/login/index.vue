<template>
  <div class="bg">
    <div class="mask"></div>
    <div class="login">
      <div class="title">博客后台管理系统</div>
      <el-form status-icon label-position="top" :rules="rules" :model="dat" ref="login" @submit.native.prevent>
        <el-form-item prop="user" label="账号">
          <el-input v-model="dat.user" style="width: 220px" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="dat.password" style="width: 220px" type="password" autocomplete="off"></el-input>
        </el-form-item>
<!--        <el-form-item prop="code" label="验证码" :rules="[{ required: true, message: ' '}]">-->
<!--          <el-input class="code_input" v-model="dat.code" style="width: 114px" autocomplete="off"></el-input>-->
<!--          <div class="code" v-html="svg" @click="getCode"></div>-->
<!--        </el-form-item>-->

        <el-form-item prop="gtCode" label="验证">
          <div id="captcha">
            <p class="code_load" v-if="codeLoadSta">正在加载验证码......</p>
          </div>
        </el-form-item>

        <el-form-item>
          <!--<el-button type="primary" @click="submitForm()">登录</el-button>-->
          <el-button type="primary" @click="submitForm()" native-type="submit">登&emsp;录</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
  import MD5 from 'js-md5'
  import {gt_login} from '@/api/login'
  import {code, gtCode} from '@/api/verification'
  import '@/assets/js/gt'

  export default {

    data() {
      const gtCodeRule = (rule, value, callback) => {
        if (document.querySelector("input[name='geetest_challenge']").value && document.querySelector("input[name='geetest_validate']").value) {
          callback();
        } else {
          callback(new Error(' '));
        }
      };
      return {
        rules: {
          user: [{ required: true, message: ' '}],
          password: [{ required: true, message: ' '}],
          // code: [{ required: true, message: ' '}],
          gtCode: [{validator: gtCodeRule, trigger: ['blur', 'change']}],
        },
        svg: '',
        dat: {
          user: '',
          password: '',
          code: '',
          key: '',
        },
        codeLoadSta: true
      }
    },
    created() {
      // this.getCode();
      this.getGtCode();
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
      handler(captchaObj) {
        console.log(captchaObj);
        let _this = this;
        captchaObj.appendTo('#captcha'); // 同时插入三个input表单时，geetest_challenge, geetest_validate, geetest_seccode
        captchaObj.onReady(function () {
          // $("#wait").hide();
          _this.codeLoadSta = false;
        });
      },
      getGtCode() {
        gtCode({t: (new Date()).getTime()}).then(res => {
          let data = res.data;
          // 调用 initGeetest 进行初始化
          // 参数1：配置参数
          // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它调用相应的接口
          initGeetest({
            // 以下 4 个配置参数为必须，不能缺少
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success, // 表示用户后台检测极验服务器是否宕机
            new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机

            product: 'float', // 产品形式，包括：float，popup
            width: '220px'
            // 更多配置参数说明请参见：http://docs.geetest.com/install/client/web-front/
          }, this.handler);
        })
      },
      submitForm() {
        this.$refs.login.validate((valid) => {
          if (valid) {
            // let dat = {
            //   user: this.dat.user,
            //   password: MD5(this.dat.password),
            //   code: this.dat.code,
            //   key: this.dat.key,
            // };
            let dat = {
              user: this.dat.user,
              password: MD5(this.dat.password),
              geetest_challenge: document.querySelector("input[name='geetest_challenge']").value,
              geetest_validate: document.querySelector("input[name='geetest_validate']").value,
              geetest_seccode: document.querySelector("input[name='geetest_seccode']").value,
            };
            gt_login(dat).then(res => {
              if (res.code === 200) {
                this.$message.success('登录成功');
                this.$router.replace({path: '/admin'});
                sessionStorage.setItem('token', res.data.token);
                sessionStorage.setItem('head_img', res.data.head_img);
                sessionStorage.setItem('name', res.data.name);
                sessionStorage.setItem('user', res.data.user);
                sessionStorage.setItem('id', res.data.id);
              } else if (res.code === 1) {
                // this.getCode();
                this.$message.error(res.message);
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

  /deep/ .el-input__inner {
    border: 1px solid #333;
    background-color: transparent;
    border-radius: 2px;
    box-shadow: 4px 4px 0 rgba(51, 51, 51, .5);
  }

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
    box-shadow: 4px 4px 0 rgba(255, 255, 255, 0.4);

    .title {
      color: #333333;
      font-size: 20px;
      font-weight: 400;
      margin: 20px 0 30px 0;
      width: 220px;
      text-align: center;
    }

    button {
      width: 220px;
      border-radius: 2px;
      box-shadow: 4px 4px 0 rgba(64, 158, 255, .5);
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
      background-color: rgba(255, 255, 255, .5);
      display: inline-block;
      width: 100px;
      height: 40px;
      border-radius: 0;
      box-sizing: border-box;
      cursor: pointer;
      box-shadow: 4px 4px 0 rgba(51, 51, 51, .5);
      border: 1px solid #333;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .code_load {
      margin: 0;
      color: #999;
    }
    /deep/ .geetest_holder {
      min-width: 220px;
      .geetest_radar_btn {
        border-color: #FFFFFF;
        box-shadow: 4px 4px 0 rgba(51, 51, 51, 0.5);
      }
    }
  }
</style>
