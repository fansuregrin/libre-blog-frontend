<template>
  <Header></Header>
  <div class="article-list">
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
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Header from '@/components/Nav.vue';

export default defineComponent({
  name: 'ArticleList',
  components: {
    CalendarAlt, UserAlt,
    Header
  },
  data() {
    return {
      articles: [],
      page: null,
      num_pages: null
    }
  },
  methods: {
    goToPage(page) {
      this.router.push(`/blog/page/${page}`);
    },
    fetchData(page) {
      console.log(`获取第${page}页...`)
      this.page = Number(page);
      axios.get(`/api/blog/page/${page}`)
      .then(response => {
        console.log("response status:", response.status);
        if (response.data.status == 0) {
          console.log('num_pages:', response.data.num_pages);
          this.num_pages = response.data.num_pages;
          this.articles = response.data.articles;
        } else {
          this.message.error('获取文章失败');
        }
      })
      .catch(error => {
        console.log(error);
        this.message.error('获取文章失败');
      });
    },
    goToArticle(id) {
      this.router.push(`/blog/article/${id}`);
    }
  },
  created() {
    this.message = useMessage();
    this.router = useRouter();
    this.$watch(
      () => this.$route.params.page,
      (newVal, oldVal) => { this.fetchData(newVal) },
      { immediate: true }
    );
  }
});

</script>

<style scoped>
.article-list {
  margin-left: auto;
  margin-right: auto;
  width: 60%;
}

.article-item {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
}

.article-meta-info {
  margin-top: -15px;
  margin-bottom: 20px;
}
</style>