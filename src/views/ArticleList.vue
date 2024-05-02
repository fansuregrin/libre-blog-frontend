<template>
  <Nav></Nav>
  <div class="container">
    <n-card v-for="article in articles" class="article-item" :title="article.title" hoverable>
      <template #header-extra>
        <n-button round size="small" @click="goToArticle(article.id)">阅读更多</n-button>
      </template>
      <n-flex class="article-meta-info">
        <span>
          <n-icon><user-alt /></n-icon>
          {{ article.author_name }}
        </span>
        <span>
          <n-icon><calendar-alt /></n-icon>
          {{ article.create_time }}
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
</template>

<script>
import { defineComponent } from 'vue';
import { NCard, NButton, NIcon, NFlex, NPagination } from 'naive-ui'
import { CalendarAlt, UserAlt } from '@vicons/fa'
import { createDiscreteApi } from 'naive-ui';
import axios from 'axios';
import Nav from '@/components/Nav.vue';
import '@/assets/main.css';

const { message } = createDiscreteApi(['message']);

export default defineComponent({
  name: 'ArticleList',
  components: {
    CalendarAlt, UserAlt,
    Nav
  },
  data() {
    return {
      articles: [],
      page: 1,
      num_pages: 1
    }
  },
  methods: {
    goToPage(page) {
      this.$router.push(`/blog/page/${page}`);
    },
    fetchData(params) {
      if (params.page) {
        this.page = Number(params.page);
      }
      console.log(`获取第${this.page}页...`)
      axios.get(`/api/blog/page/${this.page}`)
      .then(response => {
        console.log("response status:", response.status);
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
  created() {
    this.$watch(
      () => this.$route.params,
      (newVal, oldVal) => { this.fetchData(newVal) },
      { immediate: true }
    );
  }
});

</script>