<template>
  <admin-nav></admin-nav>
  <div class="container">
    <h2>管理标签
      <n-button text @click="goToAdd" class="new-item">新增</n-button>
    </h2>
    <n-flex>
      <n-dropdown trigger="click" :options="options" @select="handleSelect">
        <n-button size="small">选中项</n-button>
      </n-dropdown>
      <n-data-table 
        :columns="columns"
        :data="tags"
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
  name: 'ManageTag',
  data() {
    return {
      tags: [],
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
      axios.get(`/api/blog/tags/${page}`)
      .then(response => {
        if (response.data.status === 0) {
          this.pagination.pageCount = response.data.num_pages;
          this.tags = response.data.tags;
        } else {
          message.error('获取标签失败');
        }
      }).catch(error => {
        message.error('获取标签失败');
        console.log(error.message);
      })
    },
    goToEdit(row) {
      this.$router.push({
        name: 'TagEdit', 
        params: {id: row.id}
      });
    },
    goToAdd() {
      this.$router.push({
        name: 'TagAdd',
      });
    },
    deleteTags() {
      const userToken = sessionStorage.getItem('userToken');
      axios.post(
        '/api/blog/tag/delete',
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
          content: '您确定删除这些标签吗？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            if (this.checkedRowKeys.length <= 0) {
              message.warning('没有标签被删除');
              return;
            }
            this.deleteTags();
          }
        });
      }
    },
  }
};
</script>