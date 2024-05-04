<template>
  <n-menu :options="menuOptions" mode="horizontal" responsive @update:value="onChange">
  </n-menu>
</template>
  
<script>
import { h } from 'vue';
import { NMenu, NIcon, createDiscreteApi } from 'naive-ui';
import { RouterLink } from 'vue-router';
import axios from 'axios';

const { message } = createDiscreteApi(['message']);

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuItems = {
  manage: {
    article: {
      label: () => h(
        RouterLink,
        {
          to: { name: 'ManageArticle'}
        },
        { default: () => '文章' }
      ),
      key: 'article'
    }
  }
};

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
    logout() {
      sessionStorage.removeItem("userToken");
      message.info("您已经登出");
      this.$router.push({name: 'Login'});
    },
    onChange(key, item) {
      if (key === 'logout') {
        this.logout();
      }
    },
    genMenuOptions() {
      const userToken = sessionStorage.getItem('userToken');
      if (!userToken) {
        this.$router.push({name: 'Login'});
        return;
      }
      axios.get(
        '/api/user/role',
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      ).then(response => {
        if (response.data.status === 0) {
          const role = response.data.role;
          console.log(role);
          this.menuOptions = [];
          this.menuOptions.push(
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
            }
          );
          // "管理"菜单选项
          if (role.manage) {
            this.menuOptions.push({
              label: '管理',
              key: 'management',
              children: []
            });
            for (const name of role.manage) {
              this.menuOptions[1].children.push(menuItems.manage[name]);
            }
          }
          // "首页"菜单选项
          this.menuOptions.push(
            {
              label: () => h(
                RouterLink,
                {
                  to: {
                    path: '/'
                  }
                },
                { default: () => '首页' }
              ),
              key: 'index'
            }
          );
          // "登出"菜单选项
          this.menuOptions.push(
            {
              label: '登出',
              key: 'logout'
            }
          );
        }
      }).catch(error => {
        console.log(error.message);
      })
    }
  }
}
</script>

<style scoped>

</style>