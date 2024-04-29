<template>
  <n-menu :options="menuOptions" mode="horizontal" responsive></n-menu>
</template>
  
<script>
import { h } from 'vue';
import { NMenu, NIcon } from 'naive-ui';
import { RouterLink } from 'vue-router';

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
];

export default {
  name: 'AdminNav',
  data() {
    return {
      menuOptions
    }
  },
}
</script>

<style scoped>

</style>