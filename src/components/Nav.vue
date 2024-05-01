<template>
  <n-menu :options="menuOptions" mode="horizontal" responsive />
</template>

<script>
import { h } from 'vue';
import { NMenu, NIcon } from 'naive-ui';
import { RouterLink } from 'vue-router';
import axios from 'axios';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: "Index",
        }
      },
      { default: () => '首页'}
    ),
    key: 'index'
  },
  {
    label: '分类',
    key: 'category',
    children: []
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: "Login",
        }
      },
      { default: () => '登录'}
    ),
    key: 'login'
  },
];

export default {
  name: 'Nav',
  data() {
    return {
      menuOptions
    }
  },
  created() {
    this.getCategories();
  },
  methods: {
    getCategories() {
      axios.get('/api/blog/category')
      .then(response => {
        if (response.data.status === 0) {
          var categoryItems = [];
          for (const cat of response.data.categories) {
            var item = {};
            item.label = () => h(
              RouterLink,
              {
                to: {
                  name: 'Category',
                  params: {slug: cat.slug}
                }
              },
              { default: () => cat.name}
            );
            item.key = cat.slug;
            categoryItems.push(item);
          }
          this.menuOptions[1].children = categoryItems;
        } else {
          message.error('获取分类信息失败');
        }
      }).catch(error => {
        console.log(error.message);
        message.error('获取分类信息失败');
      });
    },
  }
}
</script>

<style scoped>
</style>