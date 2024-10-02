<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>管理用户
      <n-button text @click="goToAdd" class="new-item">新增</n-button>
    </h2>
    <n-flex>
      <n-dropdown trigger="click" :options="options" @select="handleSelect">
        <n-button size="small">选中项</n-button>
      </n-dropdown>
      <n-data-table 
        :columns="columns"
        :data="users"
        :pagination=false
        :rowKey="rowKey"
        :checkedRowKeys="checkedRowKeys"
        @update:checked-row-keys="handleCheck"
      />
      <n-pagination 
        v-model:page="pagination.page" 
        v-model:page-count="pagination.pageCount" 
        :page-slot="5" 
        @update:page="fetchData(pagination.page)"
      />
    </n-flex>
  </div>
  <admin-foot></admin-foot>
</template>
  
<script>
import { createDiscreteApi, NButton } from 'naive-ui';
import axios from 'axios';
import { h } from 'vue';
import '@/assets/main.css'
import AdminNav from '@/components/AdminNav.vue'
import AdminFoot from '@/components/AdminFoot.vue';

const { dialog, message } = createDiscreteApi(['dialog', 'message']);
const createColumns = ({edit}) => {
  return [
    {
      type: 'selection'
    },
    {
      title: '用户名',
      key: 'username'
    },
    {
      title: '真实名称',
      key: 'realname'
    },
    {
      title: '角色',
      key: 'role'
    },
    {
      title: '操作',
      key: 'operations',
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => edit(row)
          },
          { default: () => '编辑'}
        );
      }
    }
  ];
};

export default {
  name: 'ManageTag',
  data() {
    return {
      users: [],
      columns: createColumns({edit: this.goToEdit}),
      pagination: {
        pageCount: 1,
        page: 1
      },
      rowKey: (row) => row.id,
      checkedRowKeys: [],
      options: [
        {
          label: '删除',
          key: 'delete'
        }
      ]
    };
  },
  components: {
    AdminNav, AdminFoot
  },
  created() {
    this.fetchData(1);
  },
  methods: {
    fetchData(page) {
      this.page = Number(page);
      const userToken = sessionStorage.getItem('userToken');
      axios.get(
        `/api/users/${page}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      )
      .then(response => {
        if (response.data.status === 0) {
          this.pagination.pageCount = response.data.num_pages;
          this.users = response.data.users;
        } else {
          message.error('获取用户失败');
        }
      }).catch(error => {
        message.error('获取用户失败');
        console.log(error.message);
      })
    },
    goToEdit(row) {
      this.$router.push({
        name: 'UserEdit', 
        params: {id: row.id}
      });
    },
    goToAdd() {
      this.$router.push({
        name: 'UserAdd',
      });
    },
    deleteUsers() {
      const userToken = sessionStorage.getItem('userToken');
      axios.post(
        '/api/user/delete',
        {
          ids: this.checkedRowKeys
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      ).then(response => {
        if (response.data.status === 0) {
          this.fetchData(this.page);
          this.checkedRowKeys = [];
          message.success('删除成功');
        } else if (response.data.status === 3) {
          sessionStorage.removeItem('userToken');
          message.error('登录失效，请重新登录');
          this.$router.push({name: 'Login'});
        } else {
          message.error('删除失败');
        }
      }).catch(error => {
        console.log(error.message);
        message.error('删除失败');
      });
    },
    handleCheck(rowKeys) {
      this.checkedRowKeys = rowKeys;
    },
    handleSelect(key) {
      if (key === 'delete') {
        dialog.warning({
          title: '警告',
          content: '删除用户将会删除其发布的所有文章！您确定删除这些用户吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            if (this.checkedRowKeys.length <= 0) {
              message.warning('没有用户被删除');
              return;
            }
            this.deleteUsers();
          }
        });
      }
    },
  }
};
</script>