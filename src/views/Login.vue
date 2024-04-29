<template>
  <n-card :bordered=false>
    <n-tabs
      class="card-tabs"
      v-model:value="selectedTab"
      animated
      pane-wrapper-style="margin: 0 -4px"
    >
      <n-tab-pane name="signin" tab="登录">
        <n-form :rules="rules" :model="loginForm">
          <n-form-item-row label="用户名" path="username">
            <n-input v-model:value="loginForm.username" placeholder="请输入用户名"/>
          </n-form-item-row>
          <n-form-item-row label="密码" path="password">
            <n-input type="password" v-model:value="loginForm.password" placeholder="请输入密码"/>
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong @click="submitLoginForm">
          登录
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <n-form :model="signForm" :rules="rules">
          <n-form-item-row label="用户名" path="username">
            <n-input v-model:value="signForm.username" placeholder="请输入用户名"/>
          </n-form-item-row>
          <n-form-item-row label="邮箱" path="email">
            <n-input type="email" v-model:value="signForm.email" placeholder="请输入邮箱"/>
          </n-form-item-row>
          <n-form-item-row label="密码" path="password1" rule-path="password">
            <n-input type="password" v-model:value="signForm.password1" placeholder="请输入密码"/>
          </n-form-item-row>
          <n-form-item-row label="重复密码" path="password2" rule-path="password">
            <n-input type="password" v-model:value="signForm.password2" placeholder="请输入密码"/>
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
  import { useMessage } from "naive-ui";
  import { ref, onMounted, defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  export default defineComponent({
    name: 'Login',
    setup() {
      const router = useRouter();
      const message = useMessage();
      const loginForm = ref({
        username: '',
        password: ''
      });
      const signForm = ref({
        username: '',
        password1: '',
        password2: '',
        email: ''
      });
      const selectedTab = ref('signin');
  
      // 定义登录方法
      const login = () => {
        axios.post('/api/login', {
          username: loginForm.value.username,
          password: loginForm.value.password
        })
        .then(response => {
          console.log("response status:", response.status);
          console.log("data:", response.data);
          if (response.data.status == 0) {
            sessionStorage.setItem('userToken', response.data.token);
            console.log("userToken:", sessionStorage.getItem('userToken'))
            router.push({name: 'UserCenter'});
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
      };
  
      const register = () => {
        axios.post('/api/user/add', {
          username: signForm.value.username,
          password: signForm.value.password1,
          email: signForm.value.email
        })
        .then(response => {
          console.log(response.data);
          
          if(response.data.status == 0){
            message.success("注册成功，请登录");
            selectedTab.value = "signin";
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
          console.error('注册失败:', error);
        });
      };

      const checkLoginStatus = () => {
        const token = sessionStorage.getItem('userToken');
        if (token) {
          console.log("Already logged in, userToken:", token)
          router.push({ name: 'UserCenter' });
        }
      }
  
      // 定义提交登录表单方法
      const submitLoginForm = () => {
        console.log(loginForm.value);
  
        if (loginForm.value.username.trim() === '') {
          message.error('请输入用户名');
          return;
        }
        if (loginForm.value.password.trim() === '') {
          message.error('请输入密码');
          return;
        }
        
        // 继续后续逻辑
        login();
      };
  
      // 定义提交注册表单方法
      const submitSignForm = () => {
        console.log(signForm.value);
  
        if (signForm.value.username.trim() === '') {
          message.error('请输入用户名');
          return;
        }
        if (signForm.value.email.trim() === '') {
          message.error('请输入邮箱');
          return;
        }
        if (signForm.value.password1.trim() === '') {
          message.error('请输入密码');
          return;
        }
        if (signForm.value.password1.trim() !== signForm.value.password2.trim()) {
          message.error('两次密码不一致');
          return;
        }
        // 继续后续逻辑
        register();
      };
  
      onMounted(() => {
        checkLoginStatus();
      });
  
      // 返回需要在模板中使用的数据和方法
      return {
        loginForm,
        signForm,
        submitLoginForm,
        submitSignForm,
        selectedTab,
        rules: {
          username: {
            required: true,
            message: "请输入用户名",
            trigger: ["blur", "input"]
          },
          password: {
            required: true,
            message: "请输入密码",
            trigger: ["blur", "input"]
          },
          email: {
            required: true,
            message: "请输入邮箱",
            trigger: ["blur", "input"]
          },
        }
      };
    },
  });
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