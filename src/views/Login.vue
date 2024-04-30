<template>
  <n-card :bordered=false>
    <n-tabs
      class="card-tabs"
      v-model:value="selectedTab"
      animated
      pane-wrapper-style="margin: 0 -4px"
    >
      <n-tab-pane name="login" tab="登录">
        <n-form :rules="rules" :model="loginForm">
          <n-form-item-row label="用户名" path="username">
            <n-input v-model:value="loginForm.username" placeholder="请输入用户名" name="username"/>
          </n-form-item-row>
          <n-form-item-row label="密码" path="password">
            <n-input type="password" v-model:value="loginForm.password" placeholder="请输入密码" name="password"/>
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong @click="submitLoginForm">
          登录
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="sign" tab="注册">
        <n-form :model="signForm" :rules="rules">
          <n-form-item-row label="用户名" path="username">
            <n-input v-model:value="signForm.username" placeholder="请输入用户名" name="username"/>
          </n-form-item-row>
          <n-form-item-row label="邮箱" path="email">
            <n-input type="email" v-model:value="signForm.email" placeholder="请输入邮箱" name="email"/>
          </n-form-item-row>
          <n-form-item-row label="密码" path="password1" rule-path="password">
            <n-input type="password" v-model:value="signForm.password1" placeholder="请输入密码" name="password1"/>
          </n-form-item-row>
          <n-form-item-row label="重复密码" path="password2" rule-path="repeatPassword">
            <n-input type="password" v-model:value="signForm.password2" placeholder="请输入密码" name="password2"/>
          </n-form-item-row>
          
        </n-form>
        <n-button type="primary" block secondary strong @click="submitSignForm">
          注册
        </n-button>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script>
  import { createDiscreteApi } from "naive-ui";
  import axios from 'axios';

  const { message } = createDiscreteApi(['message']);
  
  export default {
    name: 'Login',
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        signForm: {
          username: '',
          password1: '',
          password2: '',
          email: ''
        },
        selectedTab: 'login',
        rules: {
          username: {
            required: true,
            message: "请输入用户名",
            trigger: ["blur", "input"]
          },
          password: [
            {
              required: true,
              message: "请输入密码",
              trigger: ["blur", "input"]
            },
            {
              validator: this.validatePasswordLength,
              message: "密码长度至少为6位",
              trigger: ["input", "blur"]
            }
          ],
          repeatPassword: [
          {
              required: true,
              message: "请输入密码",
              trigger: ["blur", "input"]
            },
            {
              validator: this.validatePasswordLength,
              message: "密码长度至少为6位",
              trigger: ["input", "blur"]
            },
            {
              validator: this.validatePasswordSame,
              message: "两次密码输入不一致",
              trigger: ["input", "blur"]
            }
          ],
          email: {
            required: true,
            message: "请输入邮箱",
            trigger: ["blur", "input"]
          },
        }
      };
    },
    methods: {
      // 定义登录方法
      login() {
        axios.post('/api/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        })
        .then(response => {
          console.log("response status:", response.status);
          console.log("data:", response.data);
          if (response.data.status == 0) {
            sessionStorage.setItem('userToken', response.data.token);
            this.$router.push({name: 'UserCenter'});
          } else {
            message.error('用户名或密码错误');
          }
        })
        .catch(error => {
          message.error('登录失败');
          if (error.response) {
            console.log('status:', error.response.status);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error:', error.message);
          }
        });
      },
      register() {
        axios.post('/api/user/add', {
          username: this.signForm.username,
          password: this.signForm.password1,
          email: this.signForm.email
        })
        .then(response => {
          console.log(response.data);
          
          if(response.data.status == 0){
            message.success("注册成功，请登录");
            this.selectedTab = "login";
          }else if(response.data.status == 1){
            message.warning(response.data.warning);
          }else if(response.data.status == 2){
            message.error(response.data.error);
          }else{
            message.error("注册过快，请10秒后注册");
          }
        })
        .catch(error => {
          message.error('注册失败');
          console.error('注册失败:', error.message);
        });
      },
      checkLoginStatus() {
        const token = sessionStorage.getItem('userToken');
        if (token) {
          console.log("Already logged in!")
          this.$router.push({ name: 'UserCenter' });
        }
      },
      // 定义提交登录表单方法
      submitLoginForm() {
        console.log(this.loginForm);
  
        if (this.loginForm.username.trim() === '') {
          message.error('请输入用户名');
          return;
        }
        if (this.loginForm.password.trim() === '') {
          message.error('请输入密码');
          return;
        }
        this.login();
      },
      // 定义提交注册表单方法
      submitSignForm() {
        console.log(this.signForm);
  
        if (this.signForm.username.trim() === '') {
          message.error('请输入用户名');
          return;
        }
        if (this.signForm.email.trim() === '') {
          message.error('请输入邮箱');
          return;
        }
        if (this.signForm.password1.trim() === '') {
          message.error('请输入密码');
          return;
        }
        if (this.signForm.password1.trim() !== this.signForm.password2.trim()) {
          message.error('两次密码不一致');
          return;
        }
        this.register();
      },
      validatePasswordLength(rule, value) {
        return value!=null && value.length >= 6;
      },
      validatePasswordSame(rule, value) {
        return value === this.signForm.password1;
      }
    },
    mounted() {
      this.checkLoginStatus();
    }
  };
</script>

<style scoped>
.card-tabs {
  box-sizing: border-box;
  padding: 0 30%;
  margin-left: auto;
  margin-right: auto;
}

@media screen and (max-width: 768px) {
  .card-tabs {
    box-sizing: border-box;
    padding: 0 5%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>