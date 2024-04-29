<template>
  <n-menu :options="menuOptions" mode="horizontal" responsive>

  </n-menu>
</template>

<script>
import { h } from 'vue';
import { NFlex, NMenu, NIcon } from 'naive-ui';
import { RouterLink } from 'vue-router';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: "BlogIndex",
        }
      },
      { default: () => '主页'}
    ),
    key: 'index'
  },
  {
    label: '分类',
    key: 'category'
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
}
</script>

<style scoped>
</style>