import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import UserCenter from '../views/UserCenter.vue'
import ArticleList from '../views/ArticleList.vue'
import Article from '../views/Article.vue'
import ArticleEdit from '../views/ArticleEdit.vue'
import ManageArticle from '../views/ManageArticle.vue'
import Category from '@/views/Category.vue'


const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin/user-center',
      name: 'UserCenter',
      component: UserCenter
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
      path: '/blog/article/:id',
      name: 'Article',
      component: Article
    },
    {
      path: '/admin/edit-article/:id',
      name: 'ArticleEdit',
      component: ArticleEdit
    },
    {
      path: '/admin/manage-articles',
      name: 'ManageArticle',
      component: ManageArticle
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

export default router
