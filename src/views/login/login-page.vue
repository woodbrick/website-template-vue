<style lang="less" type="text/less" rel="stylesheet/less">
  @import "../../less/defination";

  .login-page {
    width: 100%;
    height: 100%;
    background: #203734;
    overflow: hidden;
    .login-container {
      position: relative;
      width: 40%;
      margin: 10% auto;
      .login-right {
        width: 100%;
        background: #fff;
        h2 {
          text-align: center;
          font-size: 30px;
          font-weight: 500;
        }
        .login-content {
          width: 400px;
          margin: 30px auto;
          padding-bottom: 30px;
          .form-login {
            text-align: center;
          }
          .el-form-item__error{
            margin-left: 5%;
          }
          .el-input{
            width: 91%;
          }
          .el-input.captcha {
            width: 60%;
          }
          .error{
            display: inline-block;
            font-size: 16px;
            color: @color-error;
            height: 23px;
            line-height: 23px;
          }
          .submit-btn {
            width: 50%;
          }
          img {
            position: relative;
            top: -1px;
            width: 110px;
            height: 36px;
            margin-left: 10px;
            cursor: pointer;
            vertical-align: middle;
            border-radius: 5px;
          }
        }
      }
    }
  }
</style>
<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-right">
        <h2>登录嘉兴账号</h2>
        <div class="login-content">
          <el-form :model="formData" :rules="rules" ref="formData" class="form-login">
            <el-form-item prop="username">
              <el-input v-model="formData.username" placeholder="用户名" @keyup.enter.native="submitForm"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="formData.password" placeholder="密码" @keyup.enter.native="submitForm"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-input v-model="formData.captcha" class="captcha" placeholder="验证码" @keyup.enter.native="submitForm"></el-input>
              <img class="verify-img" :src="imgUrl" @click="refreshVerify"/>
            </el-form-item>
            <el-form-item>
              <span class="error">{{message}}</span>
            </el-form-item>
            <el-form-item>
              <el-button class="submit-btn" type="primary" @click="submitForm()">登 录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import md5 from 'md5'
  import {doGet, doPost} from '../../utils/resource'
  export default {
    name: 'login-page',
    data() {
      let checkCaptcha = (rule, value, callback) => {
        switch (value.length) {
          case 0:
            callback(new Error('请输入验证码'))
            break
          case 4:
            console.log(value)
            doGet('/nova/captcha/validation', {captcha: value})
              .then(res => {
                if (res.status === 200) {
                  callback()
                }
              })
              .catch(err => {
                callback(new Error(err.msgs))
              })
            break
          default:
            callback(new Error('验证码错误'))
            break
        }
      }
      return {
        formData: {
          username: '',
          password: '',
          captcha: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {validator: checkCaptcha, trigger: 'change'}
          ]
        },
        imgUrl: '/nova/captcha',
        message: ''
      }
    },
    mounted() {
      this.$http.post('/nova/logout')
        .then(res => {
          console.log(res)
        })
    },
    methods: {
      refreshVerify() {
        this.imgUrl = '/nova/captcha?t=' + (new Date()).getTime()
      },
      // 获取已登录用户信息
      getUserInfo() {
        this.$http.get('/nova/userinfo')
          .then(res => {
            if (res.data.status === 200 && res.data.username) {
              location.href = '/backstage'
            }
          })
          .catch(err => {
            console.error(err)
          })
      },
      submitForm() {
        this.$refs.formData.validate((valid) => {
          if (valid) {
            this.message = ''
            doPost('/nova/login?username=' + this.formData.username + '&password=' + md5(this.formData.password) + '&captcha=' + this.formData.captcha)
              .then(res => {
                if (res.status === 200) {
                  location.href = '/admin'
                }
              })
              .catch(err => {
                this.message = err.msgs
                this.refreshVerify()
              })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
