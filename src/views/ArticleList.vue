<template>
  <Nav></Nav>
  <div class="container">
    <n-card v-for="article in articles" class="article-item" :title="article.title" hoverable>
      <template #header-extra>
        <n-button round size="small" @click="goToArticle(article.id)">阅读更多</n-button>
      </template>
      <n-flex class="article-meta-info">
        <span >
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
    <n-pagination v-model:page="page" v-model:page-count="num_pages"
      @update:page="goToPage" :page-slot="5"></n-pagination>
  </div>
  <foot />
</template>

<script>
import { CalendarAlt, UserAlt } from '@vicons/fa'
import { createDiscreteApi } from 'naive-ui'
import axios from 'axios'
import { formatDate, formatDateTime } from '@/utils/common'
import Nav from '@/components/Nav.vue'
import Foot from '@/components/Foot.vue'
import '@/assets/main.css'

const { message } = createDiscreteApi(['message']);

export default {
  name: 'ArticleList',
  components: {
    CalendarAlt, UserAlt,
    Nav, Foot
  },
  methods: {
    goToPage(page) {
      this.$router.push({
        name: 'ArticleList',
        params: { page: page }
      });
    },
    fetchData(params) {
      if (params.page) {
        this.page = Number(params.page);
      }
      console.log(`获取第${this.page}页...`)
      axios.get(`/api/blog/articles/${this.page}`)
      .then(response => {
        if (response.data.status == 0) {
          console.log('num_pages:', response.data.num_pages);
          this.num_pages = response.data.num_pages;
          this.articles = response.data.articles;
        } else {
          message.error('获取文章失败');
        }
      })
      .catch(error => {
        console.log(error);
        message.error('获取文章失败');
      });
    },
    goToArticle(id) {
      this.$router.push(`/blog/article/${id}`);
    }
  },
  data() {
    return {
      articles: [],
      page: 1,
      num_pages: 1,
      formatDate,
      formatDateTime
    }
  },
  created() {
    this.$watch(
      () => this.$route.params,
      (newVal, oldVal) => {
        if (newVal.page) {
          document.title = `第${newVal.page}页 - LibreBlog`;
        }
        this.fetchData(newVal);
      },
      { immediate: true }
    );
  }
};
</script>