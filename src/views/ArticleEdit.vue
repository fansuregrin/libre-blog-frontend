<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>编辑文章</h2>
    <n-flex v-if="article" class="edit-area">
      <n-form size="large" class="edit-form">
        <n-form-item label="标题">
          <n-input v-model:value="article.title" placeholder="请输入标题" />
        </n-form-item>
        <n-form-item label="分类">
          <n-select v-model:value="article.category.id" :options="categories"
            label-field="name" value-field="id" placeholder="请选择分类"
          />
        </n-form-item>
        <n-form-item label="标签">
          <n-select v-model:value="tags"
            label-field="name" value-field="name" placeholder="请选择或添加标签"
            filterable multiple tag :options="allTags"
          />
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
import AdminNav from '@/components/AdminNav.vue';
import AdminFoot from '@/components/AdminFoot.vue';
import '@/assets/main.css';

const { message } = createDiscreteApi(['message']);

export default {
  name: 'ArticleEdit',
  data() {
    return {
      categories: [],
      allTags: [],
      tags: [],
      article: null,
      textareSize: {
        minRows: 1,
        maxRows: 20
      },
    };
  },
  components: {
    AdminNav, AdminFoot
  },
  methods: {
    getCategories() {
      axios.get('/api/blog/categories')
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
    getTags() {
      axios.get('/api/blog/tags')
      .then(response => {
        if (response.data.status === 0) {
          this.allTags = response.data.tags;
        } else {
          message.error('获取标签信息失败');
        }
      }).catch(error => {
        console.log(error.message);
        message.error('获取标签信息失败');
      });
    },
    fetchData() {
      this.article = null;
      const id = this.$route.params.id;
      
      axios.get(
        '/api/blog/article/'+id
      )
      .then(response => {
        if (response.data.status == 0) {
          console.log('获取文章成功');
          this.article = response.data.article;
          document.title = `编辑 ${this.article?.title} - Libre Blog`;
          if (response.data.article.tags) {
            for (const tag of response.data.article.tags) {
              this.tags.push(tag.name);
            }
          }
        } else {
          message.error("获取文章失败");
        }
      })
      .catch(error => {
        console.log(error.message);
        message.error("获取文章失败");
      });
    },
    submitData() {
      const userToken = sessionStorage.getItem('userToken');
      axios.post(
        '/api/blog/article/update',
        {
          id: this.article.id,
          title: this.article.title,
          author: this.article.author.id,
          category: this.article.category.id,
          tags: this.tags,
          excerpt: this.article.excerpt,
          content: this.article.content
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      ).then(response => {
        if (response.data.status === 0) {
          message.info('更新成功');
          this.$router.push({name: 'ManageArticle'});
        } else if (response.data.status === 3) {
          message.error('登录失效，请重新登录');
          sessionStorage.removeItem('userToken');
          this.$router.push({name: 'Login'});
        } else if (response.data.status === 4) {
          message.error('您没有权限编辑');
        } else {
          message.error('更新失败');
        }
      }).catch(error => {
        console.log(error.message);
        message.info('更新失败');
      });
    }
  },
  created() {
    this.getCategories();
    this.getTags();
    this.$watch(
      () => this.$route.params.id,
      () => this.fetchData(),
      { immediate: true } 
    );
  },
};
</script>

<style scoped>

</style>