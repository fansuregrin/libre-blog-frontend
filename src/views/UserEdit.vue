<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>编辑用户</h2>
    <n-flex v-if="user" class="edit-area">
      <n-form size="large" class="edit-form" :model="user" :rules="rules">
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="user.username" placeholder="请输入用户名"/>
        </n-form-item>
        <n-form-item label="用户真实名称" path="realname" rule-path="username">
          <n-input v-model:value="user.realname" placeholder="请输入用户真实名称"/>
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="user.email" placeholder="请输入邮箱"/>
        </n-form-item>
        <n-form-item label="角色">
          <n-select v-model:value="user.role.id" :options="roles"
            label-field="name" value-field="id"
            placeholder="请选择角色"
          />
        </n-form-item>
      </n-form>
      <n-form size="large" class="edit-form" :model="passwd" :rules="rules">
        <n-form-item label="密码" path="newPassword">
          <n-input type="password" v-model:value="passwd.newPassword" placeholder="请输入密码" />
        </n-form-item>
        <n-form-item label="密码确认" path="repeatPassword">
          <n-input type="password" v-model:value="passwd.repeatPassword" placeholder="请确认密码" />
        </n-form-item>
      </n-form>
      <n-button @click="submitData">提交</n-button>
    </n-flex>
  </div>
  <admin-foot></admin-foot>
</template>

<script>
import { NFlex, NInput, NForm, NFormItem, NButton } from 'naive-ui';
import { createDiscreteApi } from 'naive-ui';
import axios from 'axios';
import AdminNav from '@/components/AdminNav.vue';
import AdminFoot from '@/components/AdminFoot.vue';
import '@/assets/main.css';

const { message } = createDiscreteApi(['message']);

export default {
  name: 'UserEdit',
  data() {
    return {
      user: null,
      passwd: {
        newPassword: '',
        repeatPassword: ''
      },
      roles: [],
      rules: {
        username: {
          required: true,
          message: "请输入用户名",
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
  components: {
    AdminNav, AdminFoot
  },
  created() {
    this.getRoles();
    this.$watch(
      () => this.$route.params.id,
      () => this.fetchData(),
      { immediate: true } 
    );
  },
  methods: {
    fetchData() {
      const id = this.$route.params.id;
      const userToken = sessionStorage.getItem('userToken');
      axios.get(
        `/api/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      )
      .then(response => {
        if (response.data.status === 0) {
          this.user = response.data.user;
          document.title = `编辑用户 ${this.user?.username} - Libre Blog`;
        } else {
          message.error('获取用户信息失败');
        }
      }).catch(error => {
        message.error('获取用户信息失败');
        console.log(error.message);
      });
    },
    getRoles() {
      const userToken = sessionStorage.getItem('userToken');
      axios.get(
        '/api/roles',
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      )
      .then(response => {
        if (response.data.status === 0) {
          this.roles = response.data.roles;
        } else {
          message.error('获取角色信息失败');
        }
      }).catch(error => {
        console.log(error.message);
        message.error('获取角色信息失败');
      });
    },
    submitData() {
      if (this.user.username.trim() === '') {
        message.warning('用户名不能为空');
        return;
      }
      if (this.user.realname.trim() === '') {
        message.warning('真实名称不能为空');
        return;
      }
      if (this.user.email.trim() === '') {
        message.warning('邮箱不能为空');
        return;
      }
      if (this.passwd.newPassword) {
        if (this.passwd.newPassword.trim()==='') {
          message.warning('密码不能为空');
        } else if (this.passwd.newPassword.length < 6) {
          message.warning('密码长度至少为6位');
        }
        return;
      }
      if (this.passwd.repeatPassword) {
        if (this.passwd.repeatPassword.trim()==='') {
          message.warning('密码不能为空');
        } else if (this.passwd.repeatPassword !== this.passwd.newPassword) {
          message.warning('两次密码不一致');
        }
        return;
      }
      const userToken = sessionStorage.getItem('userToken');
      axios.post(
        '/api/user/update',
        {
          id: this.user.id,
          username: this.user.username,
          realname: this.user.realname,
          email: this.user.email,
          password: this.passwd.newPassword,
          role: this.user.role.id
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      ).then(response => {
        if (response.data.status === 0) {
          message.success('更新成功');
          this.$router.push({name: 'ManageUser'});
        } else if (response.data.status === 3) {
          message.error('登录失效，请重新登录');
          sessionStorage.removeItem('userToken');
          this.$router.push({name: 'Login'});
        } else if (response.data.status === 4) {
          message.error('您没有权限编辑');
        } else {
          message.info('更新失败');
        }
      }).catch(error => {
        console.log(error.message);
        message.info('更新失败');
      });
    }
  }
};
</script>