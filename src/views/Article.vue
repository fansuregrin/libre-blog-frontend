<template>
  <Nav></Nav>
  <div class="container">
    <n-card v-if="article" :title="article.title" class="article">
      <n-flex class="article-meta-info" :inline=true>
        <span>
          <n-icon class="icon"><user-alt /></n-icon>
          <router-link :to="'/blog/author/'+article.author.id" class="hyperlink">
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
          <router-link :to="'/blog/category/'+article.category.slug" class="hyperlink">
            {{ article.category.name }}
          </router-link>
        </span>
        <span v-if="article.tags">
          <n-icon class="icon"><tags /></n-icon>
          <n-flex :inline=true>
            <router-link v-for="tag in article.tags" :to="'/blog/tag/'+tag.slug" class="hyperlink">
              {{ tag.name }}
            </router-link>
          </n-flex>
        </span>
        <span v-if="editable">
          <n-icon class="icon"><edit/></n-icon>
          <router-link :to="'/admin/edit-article/'+article.id" class="hyperlink">
            修改
          </router-link>
        </span>
      </n-flex>
      <div v-html="render_content()"></div>
    </n-card>
  </div>
  <foot />
</template>

<script>
  import { NCard, NFlex, createDiscreteApi } from 'naive-ui';
  import { CalendarAlt, UserAlt, Hashtag, Edit, Tags } from '@vicons/fa';
  import axios from 'axios';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github.css'
  import Nav from '@/components/Nav.vue';
  import Foot from '@/components/Foot.vue';
  import '@/assets/main.css';

  const { message } = createDiscreteApi(['message']);

  export default {
    name: 'Article',
    components: {
      CalendarAlt, UserAlt, Hashtag, Edit, Tags,
      Nav, Foot
    },
    data() {
      return {
        article: null,
        editable: false
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
    methods: {
      formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString(this.$i18n.locale);
      },
      formatDateTime(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString(this.$i18n.locale);
      },
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
        const block = document.querySelectorAll('pre code');
        block.forEach((ele) => {
          // 1.创建ul节点
          let ul = document.createElement("ul");
          // 2.根据换行符获取行数，根据获取的行数生成行号
          let rowCount = ele.outerHTML.split('\n').length-1;
          for (let i=1; i <= rowCount; i++) {
            //创建li节点，创建文本节点
            let li = document.createElement("li")
            let text = document.createTextNode(i)
            //为li追加文本节点，将li加入ul
            li.appendChild(text)
            ul.appendChild(li)
          }
          // 3.给行号添加类名
          ul.className = 'codeblock-numbering'
          // 4.将ul节点加到代码块
          ele.parentNode.appendChild(ul)
          hljs.highlightElement(ele);
        })
      }
    },
    mounted() {
      this.hight_code();
    },
    updated() {
      this.hight_code();
    }
}
</script>