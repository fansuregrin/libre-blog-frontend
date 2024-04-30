<template>
  <n-flex v-if="article" class="edit-area">
    <n-form size="large" class="edit-form">
      <n-form-item label="标题">
        <n-input v-model:value="article.title"></n-input>
      </n-form-item>
      <n-form-item label="摘要">
        <n-input v-model:value="article.excerpt"></n-input>
      </n-form-item>
      <n-form-item label="内容">
        <n-input type="textarea" v-model:value="article.content"></n-input>
      </n-form-item>
    </n-form>
    <n-button @click="submitData">提交</n-button>
  </n-flex>
</template>

<script>
import { NFlex, NInput, NForm, NFormItem } from 'naive-ui';
import { createDiscreteApi } from 'naive-ui';
import axios from 'axios';
import { useRouter } from 'vue-router';

const { message } = createDiscreteApi(['message']);

export default {
  name: 'ArticleEdit',
  data() {
    return {
      article: null,
    };
  },
  methods: {
    fetchData() {
      this.article = null;
      const id = this.$route.params.id;
      console.log(`获取id为${id}的文章...`);
      
      axios.get(
        '/api/blog/article/'+id
      )
      .then(response => {
        console.log("response status:", response.status);
        if (response.data.status == 0) {
          console.log('获取文章成功');
          this.article = response.data.article;
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
      const id = this.$route.params.id;
      axios.post(
        '/api/blog/article/update',
        this.article,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      ).then(response => {
        if (response.data.status == 0) {
          message.info('更新成功');
          this.router.push('/blog/article/'+id);
        }
      }).catch(error => {
        message.info('更新失败');
      });
    }
  },
  created() {
    this.router = useRouter();
    this.$watch(
      () => this.$route.params.id,
      () => this.fetchData(),
      { immediate: true } 
    );
  },
};
</script>

<style scoped>
.edit-area {
  width: 80%;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}

.edit-form {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
</style>