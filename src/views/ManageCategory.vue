<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>管理分类
      <n-button text @click="goToAdd" class="new-item">新增</n-button>
    </h2>
    <n-flex>
      <n-dropdown trigger="click" :options="options" @select="handleSelect">
        <n-button size="small">选中项</n-button>
      </n-dropdown>
      <n-data-table 
        :columns="columns"
        :data="categories"
        :pagination=false
        :rowKey="rowKey"
        :checkedRowKeys="checkedRowKeys"
        @update:checked-row-keys="handleCheck"
      />
    </n-flex>
  </div>
  <admin-foot></admin-foot>
</template>

<script>
  import { NFlex, NDataTable, NDropdown, NButton, NPagination } from 'naive-ui';
  import { createDiscreteApi } from 'naive-ui';
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
        title: '名称',
        key: 'name'
      },
      {
        title: '缩略名',
        key: 'slug'
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
    name: 'ManageCategory',
    data() {
      return {
        categories: [],
        columns: createColumns({edit: this.goToEdit}),
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
      this.fetchData();
    },
    methods: {
      fetchData() {
        axios.get('/api/blog/categories')
        .then(response => {
          if (response.data.status === 0) {
            this.categories = response.data.categories;
          } else {
            message.error('获取分类失败');
          }
        }).catch(error => {
          message.error('获取分类失败');
          console.log(error.message);
        })
      },
      goToEdit(row) {
        this.$router.push({
          name: 'CategoryEdit', 
          params: {id: row.id}
        });
      },
      goToAdd() {
        this.$router.push({
          name: 'CategoryAdd',
        });
      },
      deleteCategories() {
        const userToken = sessionStorage.getItem('userToken');
        axios.post(
          '/api/blog/category/delete',
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
            this.fetchData();
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
            content: '您确定删除这些分类吗？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
              if (this.checkedRowKeys.length <= 0) {
                message.warning('没有分类被删除');
                return;
              }
              this.deleteCategories();
            }
          });
        }
      },
    }
  };
</script>