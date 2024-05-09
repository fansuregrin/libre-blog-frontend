<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>添加标签</h2>
    <n-flex v-if="tag" class="edit-area">
      <n-form size="large" :model="tag" :rules="rules" class="edit-form">
        <n-form-item label="标签名称" path="name">
          <n-input v-model:value="tag.name" placeholder="请输入标签的名称"/>
        </n-form-item>
        <n-form-item label="标签缩略名" path="slug">
          <n-input v-model:value="tag.slug" placeholder="请输入标签的缩略名"/>
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
    name: 'TagAdd',
    data() {
      return {
        tag: {
          name: '',
          slug: ''
        },
        rules: {
          name: {
            required: true,
            message: "标签的名称不能为空",
            trigger: ["blur", "input"]
          },
          slug: {
            required: true,
            message: "标签的缩略名不能为空",
            trigger: ["blur", "input"]
          }
        }
      };
    },
    components: {
      AdminNav, AdminFoot
    },
    methods: {
      submitData() {
        if (this.tag.name.trim() === '') {
          message.warning('标签的名称不能为空');
          return;
        }
        if (this.tag.slug.trim() === '') {
          message.warning('标签的缩略名不能为空');
          return;
        }
        const userToken = sessionStorage.getItem('userToken');
        axios.post(
          '/api/blog/tag/add',
          this.tag,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        ).then(response => {
          if (response.data.status === 0) {
            message.success('添加成功');
            this.$router.push({name: 'ManageTag'});
          } else if (response.data.status === 3) {
            message.error('登录失效，请重新登录');
            sessionStorage.removeItem('userToken');
            this.$router.push({name: 'Login'});
          } else if (response.data.status === 4) {
            message.error('您没有权限添加新的标签');
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