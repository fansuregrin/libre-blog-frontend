<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>添加用户</h2>
    <n-flex v-if="user" class="edit-area">
      <n-form size="large" :rules="rules" class="edit-form" :model="user">
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="user.username" placeholder="请输入用户名"/>
        </n-form-item>
        <n-form-item label="用户真实名称" path="realname" rule-path="username">
          <n-input v-model:value="user.realname" placeholder="请输入用户真实名称"/>
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="user.email" placeholder="请输入邮箱"/>
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input type="password" v-model:value="user.password" placeholder="请输入密码" />
        </n-form-item>
        <n-form-item label="密码确认" path="repeatPassword">
          <n-input type="password" v-model:value="user.repeatPassword" placeholder="请确认密码" />
        </n-form-item>
        <n-form-item label="角色">
          <n-select v-model:value="user.role" :options="roles"
            label-field="name" value-field="id"
            placeholder="请选择角色"
          />
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
    name: 'UserAdd',
    data() {
      return {
        user: {
          username: '',
          realname: '',
          email: '',
          password: '',
          repeatPassword: '',
          role: 4,
        },
        
        roles: [],
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
    components: {
      AdminNav, AdminFoot
    },
    created() {
      this.getRoles();
    },
    methods: {
      validatePasswordLength(rule, value) {
        return value!=null && value.length >= 6;
      },
      validatePasswordSame(rule, value) {
        return value === this.user.password;
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
        if (this.user.password.trim() === '') {
          message.error('密码不能为空');
          return;
        }
        if (this.user.password.trim() !== this.user.repeatPassword.trim()) {
          message.error('两次密码不一致');
          return;
        }
        const userToken = sessionStorage.getItem('userToken');
        axios.post(
          '/api/user/add',
          this.user,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        ).then(response => {
          if (response.data.status === 0) {
            message.success('添加成功');
            this.$router.push({name: 'ManageUser'});
          } else if (response.data.status === 3) {
            message.error('登录失效，请重新登录');
            sessionStorage.removeItem('userToken');
            this.$router.push({name: 'Login'});
          } else if (response.data.status === 4) {
            message.error('您没有权限添加新的用户');
          } else {
            message.info('添加失败');
          }
        }).catch(error => {
          console.log(error.message);
          message.info('添加失败');
        });
      }
    }
  };
</script>