<template>
  <Nav></Nav>
  <div class="container">
    <h2>分类 {{ categoryName }} 下的文章</h2>
    <n-card v-for="article in articles" class="article-item" :title="article.title" hoverable>
      <template #header-extra>
        <n-button round size="small" @click="goToArticle(article.id)">阅读更多</n-button>
      </template>
      <n-flex class="article-meta-info">
        <span>
          <n-icon class="icon"><user-alt /></n-icon>
          <router-link :to="'/blog/author/'+article.author" class="hyperlink">
            {{ article.author_name }}
          </router-link>
        </span>
        <span>
          <n-icon class="icon"><calendar-alt /></n-icon>
          <span>{{ article.create_time }}</span>
        </span>
      </n-flex>
      {{ article.excerpt }}
      <template #footer>
        <n-flex>
          <n-tag v-for="tag in article.tags" :bordered="false" type="info" size="small" round>
            {{ tag }}
          </n-tag>
        </n-flex>
      </template>
    </n-card>
    <n-pagination v-model:page="page" v-model:page-count="num_pages" @update:page="goToPage" :page-slot="5"></n-pagination>
  </div>
  <foot />
</template>

<script>
  import { createDiscreteApi } from 'naive-ui';
  import axios from 'axios';
  import { CalendarAlt, UserAlt } from '@vicons/fa'
  import { NCard, NButton, NIcon, NFlex, NPagination } from 'naive-ui'
  import Nav from '@/components/Nav.vue';
  import Foot from '@/components/Foot.vue';
  import '@/assets/main.css';

  const { message } = createDiscreteApi(['message']);

  export default {
    name: 'Category',
    components: {
      Nav, Foot, CalendarAlt, UserAlt
    },
    data() {
      return {
        categoryName: '',
        articles: [],
        num_pages: 1,
        page: 1
      };
    },
    created() {
      this.$watch(
        () => this.$route.params,
        (newVal, oldVal) => { this.fetchData(newVal); },
        { immediate: true }
      );
    },
    methods: {
      goToArticle(id) {
        this.$router.push(`/blog/article/${id}`);
      },
      goToPage(page) {
        const slug = this.$route.params.slug;
        this.$router.push(`/blog/category/${slug}/${page}`);
      },
      fetchData(params) {
        if (params.page) {
          this.page = Number(params.page);
        }
        axios.get(`/api/blog/category/${params.slug}/${this.page}`)
        .then(response => {
          if (response.data.status === 0) {
            this.categoryName = response.data.name;
            this.num_pages = response.data.num_pages;
            this.articles = response.data.articles;
          } else {
            message.error('获取文章列表失败');
          }
        }).catch(error => {
          message.error('获取文章列表失败');
          console.log(error.message);
        });
      }
    }
  };
</script>