<template>
  <n-menu 
    :options="menuOptions"
    mode="horizontal" 
    responsive 
    @update:value="onChange" 
  />
</template>
  
<script>
import { createDiscreteApi } from 'naive-ui';
import axios from 'axios';

const { message } = createDiscreteApi(['message']);


export default {
  name: 'AdminNav',
  data() {
    return {
      menuOptions: []
    }
  },
  created() {
    this.genMenuOptions();
  },
  methods: {
    onChange(key, item) {
      if (key === 'logout') {
        sessionStorage.removeItem("userToken");
        message.info("您已经登出");
        this.$router.push({name: 'Login'});
      } else if (key === 'index') {
        this.$router.push({path: '/'});
      } else if (key === 'userCenter') {
        this.$router.push({name: 'UserCenter'});
      } else if (key === 'article') {
        this.$router.push({name: 'ManageArticle'});
      } else if (key === 'category') {
        this.$router.push({name: 'ManageCategory'});
      } else if (key === 'user') {
        this.$router.push({name: 'ManageUser'});
      } else if (key === 'tag') {
        this.$router.push({name: 'ManageTag'});
      }
    },
    genMenuOptions() {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        this.$router.push({name: 'Login'});
        return;
      }
      axios.get(
        '/api/blog/admin/menu',
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      ).then(response => {
        if (response.data.status === 0) {
          this.menuOptions = response.data.menu;
        } else if (response.data.status === 3) {
          message.error('登录失效，请重新登录');
          sessionStorage.removeItem('userToken');
          this.$router.push({name: 'Login'});
        }
      }).catch(error => {
        console.log(error.message);
      })
    },
    
  }
}
</script>