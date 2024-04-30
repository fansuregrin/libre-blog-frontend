<template>
  <n-menu :options="menuOptions" mode="horizontal" responsive @update:value="onChange">
  </n-menu>
</template>
  
<script>
import { h } from 'vue';
import { NMenu, NIcon, createDiscreteApi } from 'naive-ui';
import { RouterLink } from 'vue-router';

const { message } = createDiscreteApi(['message']);

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: '控制台',
    key: 'console',
    children: [
      {
        label: () => h(
          RouterLink,
          {
            to: {
              name: "UserCenter",
            }
          },
          { default: () => '个人中心'}
        ),
        key: 'user-center'
      }
    ]
  },
  {
    label: '管理',
    key: 'management',
    children: [
      {
        label: () => h(
          RouterLink,
          {
            to: { name: 'ManageArticle'}
          },
          { default: () => '文章' }
        ),
        key: 'article'
      }
    ]
  },
  {
    label: '登出',
    key: 'logout'
  }
];

export default {
  name: 'AdminNav',
  data() {
    return {
      menuOptions
    }
  },
  methods: {
    logout() {
      sessionStorage.removeItem("userToken");
      message.info("您已经登出");
      this.$router.push({name: 'Login'});
    },
    onChange(key, item) {
      if (key === 'logout') {
        this.logout();
      }
    }
  }
}
</script>

<style scoped>

</style>