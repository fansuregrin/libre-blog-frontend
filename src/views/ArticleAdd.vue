<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>添加文章</h2>
    <n-flex v-if="article" class="edit-area">
      <n-form size="large" class="edit-form">
        <n-form-item label="标题">
          <n-input v-model:value="article.title" placeholder="请输入标题" />
        </n-form-item>
        <n-form-item label="分类">
          <n-select v-model:value="article.category" :options="categories"
            label-field="name" value-field="id"
            placeholder="请选择分类"
          />
        </n-form-item>
        <n-form-item label="标签">
          <n-dynamic-tags v-model:value="article.tags" />
        </n-form-item>
        <n-form-item label="摘要">
          <n-input type="textarea" autosize v-model:value="article.excerpt"
          placeholder="请输入摘要"
          />
        </n-form-item>
        <n-form-item label="内容">
          <n-input type="textarea" :autosize="textareSize" 
            v-model:value="article.content" placeholder="请输入内容"
          />
        </n-form-item>
      </n-form>
      <n-button @click="submitData">提交</n-button>
    </n-flex>
  </div>
  <admin-foot></admin-foot>
</template>

<script>
  import { NFlex, NInput, NForm, NFormItem, NSelect, NDynamicTags } from 'naive-ui';
  import { createDiscreteApi } from 'naive-ui';
  import axios from 'axios';
  import '@/assets/main.css'
  import AdminNav from '@/components/AdminNav.vue'
  import AdminFoot from '@/components/AdminFoot.vue';

  const { message } = createDiscreteApi(['message']);

  export default {
    name: 'ArticleAdd',
    components: {
      AdminNav, AdminFoot
    },
    data() {
      return {
        article: {
          title: '',
          category: null,
          excerpt: '',
          content: '',
          tags: [],
        },
        categories: [],
        
        textareSize: {
          minRows: 1,
          maxRows: 20
        },
      };
    },
    methods: {
      getCategories() {
        axios.get('/api/blog/category')
        .then(response => {
          if (response.data.status === 0) {
            this.categories = response.data.categories;
          } else {
            message.error('获取分类信息失败');
          }
        }).catch(error => {
          console.log(error.message);
          message.error('获取分类信息失败');
        });
      },
      submitData() {
        const userToken = sessionStorage.getItem('userToken');
        axios.post(
          '/api/blog/article/add',
          this.article,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        ).then(response => {
          if (response.data.status === 0) {
            message.info('添加成功');
            this.$router.push({name: 'ManageArticle'});
          } else if (response.data.status === 3) {
            message.error('登录失效，请重新登录');
            sessionStorage.removeItem('userToken');
            this.$router.push({name: 'Login'});
          } else if (response.data.status === 4) {
            message.error('您没有权限添加');
          } else {
            message.error('添加失败');
          }
        }).catch(error => {
          console.log(error.message);
          message.info('添加失败');
        });
      }
    },
    created() {
      this.getCategories();
    }
  };
</script>