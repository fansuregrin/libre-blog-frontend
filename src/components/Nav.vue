<template>
  <n-menu 
    :options="menuOptions" mode="horizontal" responsive 
    @update:value="onChange" 
  />
</template>

<script>
import { h } from 'vue';
import { RouterLink } from 'vue-router';
import { NMenu } from 'naive-ui';
import axios from 'axios';


export default {
  name: 'Nav',
  data() {
    return {
      menuOptions: [
        {
          label: '首页',
          key: 'index'
        }
      ]
    }
  },
  created() {
    this.addCategoryToMenu();
    this.addLoginOrUsercenterToMenu();
  },
  methods: {
    addCategoryToMenu() {
      axios.get('/api/blog/categories')
      .then(response => {
        if (response.data.status === 0) {
          var categoryItems = [];
          for (const cat of response.data.categories) {
            var item = {};
            item.label = () => h(
              RouterLink,
              {
                to: {
                  name: 'ArticleListByCategory',
                  params: {slug: cat.slug}
                }
              },
              { default: () => cat.name}
            );
            item.key = cat.slug;
            categoryItems.push(item);
          }
          if (categoryItems.length > 0) {
            this.menuOptions.push({
              label: '分类',
              key: 'category',
              children: categoryItems
            });
          }
        } else {
          message.error('获取分类信息失败');
        }
      }).catch(error => {
        console.log(error.message);
        message.error('获取分类信息失败');
      });
    },
    addLoginOrUsercenterToMenu() {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        this.menuOptions.push({
          label: '登录',
          key: 'login'
        });
      } else {
        this.menuOptions.push({
          label: '后台',
          key: 'user-center'
        });
      }
    },
    onChange(key, item) {
      if (key === 'index') {
        this.$router.push({path: '/'});
      } else if (key === 'login') {
        this.$router.push({name: 'Login'});
      } else if (key === 'user-center') {
        this.$router.push({name: 'UserCenter'});
      }
    }
  }
}
</script>