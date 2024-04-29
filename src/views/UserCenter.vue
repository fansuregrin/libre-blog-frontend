<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>个人中心</h2>
    <n-flex>
      <n-skeleton v-if="loading" height="40px" :sharp="false" />
      <n-flex v-else>
        <n-avatar
          lazy
          size="large"
          src="https://picsum.photos/id/10/100/100"
          fallback-src="https://picsum.photos/id/10/100/100"
        />
        <h3 class="h3">{{ userInfo.realname }}</h3>
      </n-flex>
      <n-card title="个人资料" hoverable>
        <n-skeleton v-if="loading" height="100px" :sharp="false"/>
          <n-form v-else :model="userInfo" :rules="rules">
            <n-form-item label="用户ID">
              <n-input-number :value="userInfo.id"></n-input-number>
            </n-form-item>
            <n-form-item label="用户名" path="username">
              <n-input v-model:value="userInfo.username"></n-input>
            </n-form-item>
            <n-form-item label="电子邮箱" path="email">
              <n-input v-model:value="userInfo.email"></n-input>
            </n-form-item>
            <n-form-item label="创建时间">
              <n-input :value="userInfo.create_time"></n-input>
            </n-form-item>
          </n-form>
          <n-button secondary type="primary" @click="updateUserInfo">更新我的档案</n-button>
      </n-card>
      <n-card title="密码修改" hoverable>
        <n-skeleton v-if="loading" height="100px" :sharp="false"/>
        <n-form v-else :model="passwdForm" :rules="rules">
          <n-form-item label="新密码" path="newPassword" rule-path="password">
            <n-input type="password" v-model:value="passwdForm.newPassword" placeholder="输入6位以上密码"></n-input>
          </n-form-item>
          <n-form-item label="确认密码" path="repeatPassword" rule-path="repeatPassword">
            <n-input type="password" v-model:value="passwdForm.repeatPassword" placeholder="重复您的密码"></n-input>
          </n-form-item>
        </n-form>
        <n-button secondary type="primary" @click="updatePassword">更新密码</n-button>
      </n-card>
      <n-card title="博客设置" hoverable>
        <n-skeleton v-if="loading" height="100px" :sharp="false"/>
        
      </n-card>
      <n-button type="primary" @click="logout">退出登录</n-button>
    </n-flex>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { NCard, NFlex, NButton, NAvatar } from 'naive-ui';
import { NForm, NFormItem, NInput, NInputNumber } from 'naive-ui'
import { useMessage } from 'naive-ui';
import axios from 'axios';
import AdminNav from '@/components/AdminNav.vue'
import '@/assets/main.css'

export default {
  name: 'UserCenter',
  data() {
    return {
      userInfo: null,
      loading: true,
      passwdForm: {
        newPassword: null,
        repeatPassword: null
      },
      rules: {
        username: {
            required: true,
            message: "请输入用户名",
            trigger: ["blur", "input"]
          },
        password: {
          required: true,
          trigger: ["blur", "input"],
          validator(rule, value) {
            if (!value) {
              return new Error('请输入密码');
            }
            else if (value.length < 6) {
              return new Error('密码长度至少为6位');
            }
            return true;
          }
        },
        repeatPassword: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: ["input", "blur"]
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
  components: {
    AdminNav
  },
  created() {
    this.router = useRouter();
    this.message = useMessage();
  },
  methods: {
    logout() {
      sessionStorage.removeItem("userToken");
      this.message.info("您已经登出");
      this.router.push({name: 'Login'});
    },
    getUserInfo() {
      const userToken = sessionStorage.getItem('userToken');
      if (userToken === '') {
        this.router.push({name: 'Login'});
      }
      axios.get(
        '/api/user/center',
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      )
      .then( response => {
        console.log('response status:', response.status);
        if (response.status != 200 || response.data == null) {
          this.message.error('获取用户信息失败');
          console.log('获取用户信息失败');
          sessionStorage.removeItem('userToken');
          this.router.push({name: 'Login'});
        }  
        console.log('data:', response.data)
        if (response.data.status == 0) {
          this.userInfo = response.data.user;
          this.loading = false;
        } else {
          this.message.error('获取用户信息失败');
          console.log('获取用户信息失败');
          sessionStorage.removeItem('userToken');
          this.router.push({name: 'Login'});
        }
      })
      .catch (error => {
        this.message.error('获取用户信息失败');
        console.log(error);
      });
    },
    updateUserInfo() {
      const userToken = sessionStorage.getItem('userToken');
      if (userToken === '') {
        this.router.push({name: 'Login'});
      }
      axios.post(
        '/api/user/update',
        {
          username: this.userInfo.username,
          email: this.userInfo.email
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      ).then( response => {
        if (response.data.status == 0) {
          this.message.success('您的档案已更新');
        } else if (response.data.status == 3) {
          this.message.error('登录失效');
          this.router.push({name: 'Login'});
        } else if (response.data.status == 4) {
          this.message.error(response.data.error);
        } else if (response.data.status == 5) {
          this.message.error(response.data.error);
        } else {
          this.message.error('更新档案失败');
        }
      }).catch( error => {
        this.message.error('更新档案失败');
      })
    },
    updatePassword() {
      const userToken = sessionStorage.getItem('userToken');
      if (userToken === '') {
        this.router.push({name: 'Login'});
      }
      if (this.passwdForm.newPassword != this.passwdForm.repeatPassword) {
        this.message.warning('两次密码不一致');
        return;
      }
      axios.post(
        '/api/user/update/password',
        {
          password: this.passwdForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      ).then( response => {
        if (response.data.status == 0) {
          this.message.success('您的密码已更新');
        } else if (response.data.status == 3) {
          this.message.error('登录失效');
          this.router.push({name: 'Login'});
        } else if (response.data.status == 4) {
          this.message.error(response.data.error);
        } else {
          this.message.error('更新密码失败');
        }
      }).catch( error => {
        this.message.error('更新密码失败');
      })
    },
    validatePasswordLength(rule, value) {
      return value.length >= 6;
    },
    validatePasswordSame(rule, value) {
      return value === this.passwdForm.newPassword;
    }
  },
  mounted() {
    this.getUserInfo();
  }
};
</script>