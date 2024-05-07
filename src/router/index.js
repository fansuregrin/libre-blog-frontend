import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import UserCenter from '@/views/UserCenter.vue'
import ArticleList from '@/views/ArticleList.vue'
import Article from '@/views/Article.vue'
import ArticleEdit from '@/views/ArticleEdit.vue'
import ManageArticle from '@/views/ManageArticle.vue'
import ManageCategory from '@/views/ManageCategory.vue'
import Category from '@/views/Category.vue'
import Author from '@/views/Author.vue'
import Tag from '@/views/Tag.vue'
import CategoryEdit from '@/views/CategoryEdit.vue'
import ArticleAdd from '@/views/ArticleAdd.vue'


const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录 - Libre Blog'
      }
    },
    {
      path: '/admin/user-center',
      name: 'UserCenter',
      component: UserCenter,
      meta: {
        title: '用户中心 - Libre Blog'
      }
    },
    {
      path: '/blog/page/:page?',
      name: 'ArticleList',
      component: ArticleList,
      alias: ['/blog', '/']
    },
    {
      path: '/blog/category/:slug/:page?',
      name: 'Category',
      component: Category
    },
    {
      path: '/blog/author/:id/:page?',
      name: 'Author',
      component: Author
    },
    {
      path: '/blog/tag/:slug/:page?',
      name: 'Tag',
      component: Tag,
    },
    {
      path: '/blog/article/:id',
      name: 'Article',
      component: Article,
    },
    {
      path: '/admin/edit-article/:id',
      name: 'ArticleEdit',
      component: ArticleEdit
    },
    {
      path: '/admin/manage-articles',
      name: 'ManageArticle',
      component: ManageArticle,
      meta: {
        title: '管理文章 - Libre Blog'
      }
    },
    {
      path: '/admin/add-article',
      name: 'ArticleAdd',
      component: ArticleAdd,
      meta: {
        title: '添加新文章 - Libre Blog'
      }
    },
    {
      path: '/admin/manage-categories',
      name: 'ManageCategory',
      component: ManageCategory,
      meta: {
        title: '管理分类 - Libre Blog'
      }
    },
    {
      path: '/admin/edit-category/:id',
      name: 'CategoryEdit',
      component: CategoryEdit
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

router.beforeEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = 'Libre Blog';
  }
});

export default router;
