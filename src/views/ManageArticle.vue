<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>管理文章</h2>
    <n-flex>
      <n-dropdown trigger="click" :options="options" @select="handleSelect">
        <n-button size="small">选中项</n-button>
      </n-dropdown>
      <n-data-table 
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :rowKey="rowKey"
        :checkedRowKeys="checkedRowKeys"
        @update:checked-row-keys="handleCheck"
      />
    </n-flex>
  </div>
  <admin-foot></admin-foot>
</template>

<script>
  import { NFlex, NDataTable, NDropdown, NButton } from 'naive-ui';
  import { createDiscreteApi } from 'naive-ui';
  import axios from 'axios';
  import '@/assets/main.css'
  import AdminNav from '@/components/AdminNav.vue'
  import AdminFoot from '@/components/AdminFoot.vue';

  const { dialog, message } = createDiscreteApi(['dialog', 'message']);
  const createColumns = () => {
    return [
      {
        type: 'selection',
      },
      {
        title: '标题',
        key: 'title'
      },
      {
        title: '作者',
        key: 'author',
      },
      {
        title: '分类',
        key: 'category'
      },
      {
        title: '创建时间',
        key: 'create_time'
      }
    ];
  };

  const data = Array.from({length: 30}).map((_, index) => ({
    id: index,
    title: `嘿嘿嘿 ${index}`,
    author: '小华',
    category: '随笔'
  }));

  const options = [
    {
      label: '删除',
      key: 'delete'
    },
    {
      label: '标记为私密',
      key: 'private'
    }
  ];

  export default {
    name: 'ManageArticle',
    components: {
      AdminNav, AdminFoot
    },
    data() {
      return {
        data,
        columns: createColumns(),
        pagination: {pageSize: 8},
        rowKey: (row) => row.id,
        checkedRowKeys: [],
        options
      };
    },
    methods: {
      handleCheck(rowKeys) {
        this.checkedRowKeys = rowKeys;
      },
      handleSelect(key) {
        if (key === 'delete') {
          console.log('deleting...');
          dialog.warning({
            title: '警告',
            content: '您确定删除这些文章吗？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
              if (this.checkedRowKeys.length <= 0) {
                message.warning('没有文章被删除');
                return;
              }
              this.deleteArticles();
            }
          });
        }
      },
      deleteArticles() {
        const userToken = sessionStorage.getItem('userToken');
        axios.post(
          '/api/blog/article/delete',
          {
            ids: this.checkedRowKeys
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        ).then(response => {
          console.log('data.status:', response.data.status);
          if (response.data.status === 0) {
            this.data = this.data.filter(
              item => !this.checkedRowKeys.includes(item.id)
            );
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
      }
    }
  };
</script>