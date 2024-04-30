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
      <n-p>{{ checkedRowKeys.length }}</n-p>
    </n-flex>
  </div>
</template>

<script>
  import AdminNav from '@/components/AdminNav.vue'
  import { NFlex, NDataTable, NDropdown, NButton } from 'naive-ui';
  import { createDiscreteApi } from 'naive-ui';
  import '@/assets/main.css'

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
      AdminNav
    },
    data() {
      return {
        data,
        columns: createColumns(),
        pagination: {pageSize: 8},
        rowKey: (row) => row.title,
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
          console.log('deleting');
          dialog.warning({
            title: '警告',
            content: '您确定删除这些文章吗？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
              message.success('成功删除');
            }
          });
        }
      }
    }
  };
</script>