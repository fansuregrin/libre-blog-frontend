<template>
  <Nav></Nav>
  <div class="container">
    <h2>标签 {{ tag.name }} 下的文章</h2>
    <n-card v-for="article in articles" class="article-item" :title="article.title" hoverable>
      <template #header-extra>
        <n-button round size="small" @click="goToArticle(article.id)">阅读更多</n-button>
      </template>
      <n-flex class="article-meta-info">
        <span>
          <n-icon class="icon"><user-alt /></n-icon>
          <router-link :to="'/blog/author/'+article.author.id">
            {{ article.author.realname }}
          </router-link>
        </span>
        <span>
          <n-icon class="icon"><calendar-alt /></n-icon>
          <n-tooltip trigger="hover">
            <template #trigger>
              <span>{{ formatDate(article.create_time) }}</span>
            </template>
            {{ formatDateTime(article.create_time) }}
          </n-tooltip>
        </span>
      </n-flex>
      {{ article.excerpt }}
      <template #footer>
        <n-flex>
          <n-tag v-for="tag in article.tags" :bordered="false" type="info" size="small" round>
            {{ tag.name }}
          </n-tag>
        </n-flex>
      </template>
    </n-card>
    <n-pagination v-model:page="page" v-model:page-count="numPages" @update:page="goToPage" :page-slot="5"></n-pagination>
  </div>
  <foot />
</template>

<script>
import { createDiscreteApi } from 'naive-ui';
import axios from 'axios';
import { CalendarAlt, UserAlt } from '@vicons/fa'
import Nav from '@/components/Nav.vue';
import Foot from '@/components/Foot.vue';
import '@/assets/main.css';
import { formatDate, formatDateTime } from '@/utils/common';

const { message } = createDiscreteApi(['message']);

export default {
  name: 'ArticleListByTag',
  components: {
    Nav, Foot, CalendarAlt, UserAlt
  },
  data() {
    return {
      tag: {},
      articles: [],
      numPages: 1,
      page: 1,
      formatDate, formatDateTime
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
      this.$router.push(`/blog/tag/${slug}/${page}`);
    },
    fetchData(params) {
      if (params.page) {
        this.page = Number(params.page);
      }
      const slug = encodeURIComponent(params.slug);
      axios.get(`/api/blog/tag/${slug}/${this.page}`)
      .then(response => {
        if (response.data.status === 0) {
          this.tag = response.data.tag;
          this.numPages = response.data.num_pages;
          this.articles = response.data.articles;
          document.title = `标签 ${this.tag?.name} 下的文章 - Libre Blog`;
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