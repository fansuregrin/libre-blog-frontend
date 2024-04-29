<template>
  <Nav></Nav>
  <n-card v-if="article" :title="article.title" class="article">
    <n-flex class="article-meta-info">
      <span>
        <n-icon><user-alt /></n-icon>
        {{ article.author_name }}
      </span>
      <span>
        <n-icon><calendar-alt /></n-icon>
        {{ article.create_time }}
      </span>
      <span>
        <n-icon><hashtag /></n-icon>
        {{ article.category_name }}
      </span>
      <span v-if="article.editable">
        <n-icon><edit/></n-icon>
        <a :href="editLink">修改</a>
      </span>
    </n-flex>
    <div v-html="render_content()"></div>
  </n-card>
</template>

<script>
  import { useMessage, NCard, NFlex } from 'naive-ui';
  import { CalendarAlt, UserAlt, Hashtag, Edit } from '@vicons/fa';
  import axios from 'axios';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github.css'
  import Nav from '@/components/Nav.vue';

  export default {
    name: 'Article',
    components: {
      CalendarAlt, UserAlt, Hashtag, Edit,
      Nav
    },
    data() {
      return {
        article: null,
        editLink: null,
      }
    },
    created() {
      // watch 路由的参数，以便再次获取数据
      this.$watch(
        () => this.$route.params,
        () => {
          this.fetchData();
        },
        // 组件创建完后获取数据，
        // 此时 data 已经被 observed 了
        { immediate: true }
      );
    },
    methods: {
      fetchData() {
        const message = useMessage();
        this.error = this.article = null
        this.loading = true
        const id = this.$route.params.id;
        console.log(`获取id为${id}的文章...`);
        
        const userToken = sessionStorage.getItem('userToken');
        axios.get(
          '/api/blog/article/'+id,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        )
        .then(response => {
          console.log("response status:", response.status);
          if (response.data.status == 0) {
            this.article = response.data.article;
            this.editLink = '/admin/edit-article/' + this.article.id;
          } else {
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
          ul.className = 'pre-numbering'
          // 4.将ul节点加到 代码块
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

<style>
.article {
  width: 60%;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}

.article-meta-info {
  margin-top: -15px;
  margin-bottom: 20px;
}

pre {
  position: relative;
}
 
.pre-numbering {
  position: absolute;
  top: 0px;
  width: 10px;
  /* border-right: 1px solid #C3CCD0; */
  /* background-color: #1C1D21; */
  text-align: center;
  padding: 1em 0;
}

.pre-numbering li {
  list-style: none;
  color: #AAA;
  font-size: 1em;
}
</style>