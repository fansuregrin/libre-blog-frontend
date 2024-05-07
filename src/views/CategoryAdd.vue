<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>添加分类</h2>
    <n-flex v-if="category" class="edit-area">
      <n-form size="large" class="edit-form">
        <n-form-item label="分类名称">
          <n-input v-model:value="category.name" placeholder="请输入分类的名称"/>
        </n-form-item>
        <n-form-item label="分类缩略名">
          <n-input v-model:value="category.slug" placeholder="请输入分类的缩略名"/>
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
    name: 'CategoryAdd',
    data() {
      return {
        category: {
          name: '',
          slug: ''
        },
      };
    },
    components: {
      AdminNav, AdminFoot
    },
    methods: {
      submitData() {
        if (this.category?.name.trim() === '') {
          message.warning('分类的名称不能为空');
          return;
        }
        if (this.category?.slug.trim() === '') {
          message.warning('分类的缩略名不能为空');
          return;
        }
        const userToken = sessionStorage.getItem('userToken');
        axios.post(
          '/api/blog/category/add',
          this.category,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        ).then(response => {
          if (response.data.status === 0) {
            message.success('添加成功');
            this.$router.push({name: 'ManageCategory'});
          } else if (response.data.status === 3) {
            message.error('登录失效，请重新登录');
            sessionStorage.removeItem('userToken');
            this.$router.push({name: 'Login'});
          } else if (response.data.status === 4) {
            message.error('您没有权限添加新的分类');
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