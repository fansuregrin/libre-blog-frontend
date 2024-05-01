<template>
  <Nav></Nav>
  <div class="container">
    <h2>分类 {{ categoryName }} 下的文章</h2>
  </div>
</template>

<script>
  import Nav from '@/components/Nav.vue';
  import '@/assets/main.css';

  export default {
    name: 'Category',
    components: {
      Nav
    },
    data() {
      return {
        categoryName: ''
      };
    },
    created() {
      this.$watch(
        () => this.$route.params.slug,
        (newVal, oldVal) => {  },
        { immediate: true }
      );
    },
    methods: {

    }
  };
</script>