<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>管理文章</h2>
    
  </div>
</template>

<script>
  import AdminNav from '@/components/AdminNav.vue'
  import { NFlex } from 'naive-ui';
  import '@/assets/main.css'

  export default {
    name: 'ManageArticle',
    components: {
      AdminNav
    }
  };
</script>