<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>管理文章
      <n-button text :bordered=false class="new-item" @click="goToAdd">新增</n-button>
    </h2>
    <n-flex>
      <n-dropdown trigger="click" :options="options" @select="handleSelect">
        <n-button size="small">选中项</n-button>
      </n-dropdown>
      <n-data-table 
        :columns="columns"
        :data="articles"
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
        type: 'selection',
      },
      {
        title: '标题',
        key: 'title',
        maxWidth: 600,
        ellipsis: {
          tooltip: true
        }
      },
      {
        title: '作者',
        key: 'author_name',
      },
      {
        title: '分类',
        key: 'category_name'
      },
      {
        title: '创建时间',
        key: 'create_time'
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

  const options = [
    {
      label: '删除',
      key: 'delete'
    },
  ];

  export default {
    name: 'ManageArticle',
    components: {
      AdminNav, AdminFoot
    },
    created() {
      this.fetchData(1);
    },
    data() {
      return {
        articles: [],
        columns: createColumns({edit: this.goToEdit}),
        pagination: {
          pageCount: 1,
          page: 1
        },
        rowKey: (row) => row.id,
        checkedRowKeys: [],
        options
      };
    },
    methods: {
      fetchData(page) {
        console.log(`获取第${page}页...`)
        this.page = Number(page);
        const userToken = sessionStorage.getItem('userToken');
        if (!userToken) {
          this.$router.push({name: 'Login'});
          return;
        }
        axios.get(
          `/api/blog/admin/articles/${page}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          }
        ).then(response => {
          if (response.data.status == 0) {
            console.log('num_pages:', response.data.num_pages);
            this.pagination.pageCount = response.data.num_pages;
            this.articles = response.data.articles;
          } else {
            message.error('获取文章失败');
          }
        })
        .catch(error => {
          console.log(error);
          message.error('获取文章失败');
        });
      },
      handleCheck(rowKeys) {
        this.checkedRowKeys = rowKeys;
      },
      handleSelect(key) {
        if (key === 'delete') {
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
      goToEdit(row) {
        this.$router.push({
          name: 'ArticleEdit', 
          params: {id: row.id}
        });
      },
      goToAdd() {
        this.$router.push({
          name: 'ArticleAdd'
        });
      }
    }
  };
</script>