<template>
  <Nav></Nav>
  <div class="container">
    <div v-if="article" id="markdown">
      <h1>{{ article.title }}</h1>
      <n-flex class="article-meta-info" :inline=true>
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
        <span>
          <n-icon class="icon"><hashtag /></n-icon>
          <router-link :to="'/blog/category/'+article.category.slug">
            {{ article.category.name }}
          </router-link>
        </span>
        <span v-if="article.tags">
          <n-icon class="icon"><tags /></n-icon>
          <n-flex :inline=true>
            <router-link v-for="tag in article.tags" :to="'/blog/tag/'+tag.slug">
              {{ tag.name }}
            </router-link>
          </n-flex>
        </span>
        <span v-if="editable">
          <n-icon class="icon"><edit/></n-icon>
          <router-link :to="'/admin/edit-article/'+article.id">
            修改
          </router-link>
        </span>
      </n-flex>
      <div v-html="render_content()"></div>
    </div>
  </div>
  <foot />
</template>

<script>
import { createDiscreteApi } from 'naive-ui';
import { CalendarAlt, UserAlt, Hashtag, Edit, Tags } from '@vicons/fa';
import axios from 'axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import Nav from '@/components/Nav.vue';
import Foot from '@/components/Foot.vue';
import { formatDate, formatDateTime } from '@/utils/common';
import '@/assets/main.css';
import '@/assets/markdown.css';
import 'highlight.js/styles/github.css';

const { message } = createDiscreteApi(['message']);

export default {
  name: 'Article',
  components: {
    CalendarAlt, UserAlt, Hashtag, Edit, Tags,
    Nav, Foot
  },
  methods: {
    fetchData() {
      this.error = this.article = null
      this.loading = true
      const id = this.$route.params.id;
      
      axios.get(
        '/api/blog/article/'+id
      )
      .then(response => {
        if (response.data.status == 0) {
          this.article = response.data.article;
          document.title = `${this.article?.title} - Libre Blog`;
        } else {
          console.log(response.data.status);
          message.error("获取文章失败");
        }
      })
      .catch(error => {
        console.log(error.message);
        message.error("获取文章失败");
      });
    },
    render_content() {
      const dirty = marked(this.article.content);
      const clean = DOMPurify.sanitize(dirty);
      return clean;
    },
    hight_code() {
      hljs.highlightAll();
      // const block = document.querySelectorAll('pre code');
      // block.forEach((ele) => {
      //   hljs.highlightElement(ele);
      // })
    }
  },
  data() {
    return {
      article: null,
      editable: false,
      formatDate, formatDateTime
    }
  },
  created() {
    this.$watch(
      () => this.$route.params,
      (newVal, oldVal) => {
        this.fetchData();
      },
      { immediate: true }
    );
  },
  updated() {
    this.hight_code();
  }
}
</script>