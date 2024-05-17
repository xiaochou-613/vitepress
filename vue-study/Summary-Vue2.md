# 1、api

1、首先我们应该封装axios，对同一个服务器上的请求响应作一个统一

utils/request.js

```js
import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'
// 创建axios实例，不会污染原本的axios
const instance = axios.create({
  //基地值
  baseURL: 'http://cba.itlike.com/public/index.php?s=/api/',
  timeout: 5000
//   headers: { 'X-Custom-Header': 'foobar' }--- - 用不上
})

// 配置
// 添加请求拦截器
// ****将模板中的axios改成instance****
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么

  // 添加一个加载中，并且禁用背景按钮
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    duration: 0 // 表示不会自动关闭，需手动关闭
  })

  // 如果有token，我们就带上token
  const token = store.getters.token
  if (token) { // 属性带字符的，必须用数组包字符串的方式 --- 对象的中括号语法
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么

  // response需要先解构一下
  const res = response.data
  if (res.status === 500) { // 500就是错误的标志，200就是对的
    Toast(res.message)
    return Promise.reject(res.message)
  }
  // 关闭加载中
  Toast.clear()
  return response.data
// ****因为传来的数据一般都是多层的，我们在这里分层会容易处理一些****
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})
// 导出
export default instance

```

2、api购物车模块

```js
import request from '@/utils/request'
// 加入购物车
export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// 购物车列表
export const getCart = () => {
  return request.get('/cart/list')
}

```

3、导入

```js
import { getYZM, getNote, Login } from '@/api/login' // 按需导入
```

4、调用

```js
async created () {
    const result = await getHome()
    const res = result.data.pageData.items
    this.banner = res[1].data
  }
```

# 2、assets

这里面就是放图片

引用

```html
<div class="main">
    <img src="@/assets/main.png" alt="">
</div>
```

# 3、mixins

混入，将一些常用的方法或者什么封装到这个文件夹（根目录）

```js
// loginConfirm.js
export default {
  // 此处编写的就是vue实例的配置项，可以直接嵌入到组件内部
  // data methods 。。。都能
  // 但是如果和组件内出现同名，组建内部优先级更高
  methods: {
    loginconfirm () {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '请登录！',
        confirmButtonText: '去登录',
        cancelButtonText: '再逛逛'
      })
        .then(() => {
          // on confirm
          this.$router.replace({
            path: '/login',
            query: {
              backurl: this.$route.fullPath
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}

```

导入

```js
import loginconfirm from '@/mixins/loginConfirm'
```

注册调用

```js
// 首先注册
mixins: [loginconfirm], // 数组越靠后，优先级更高，会覆盖前面的

// 调用
this.loginconfirm()
```

# 4、components

这里面存放一些小的组件，比如按钮

```vue
<template>
 <div class="box">
  <button class="minus" @click="revise(-1)">-</button>
  <input type="text" class="inp" :value=value @change="revisecount">
  <button class="add" @click="revise(1)">+</button>
 </div>
</template>

<script>
export default {
  props: {   // 双向绑定
    value: Number
  },
  methods: {
    revise (count) {
      if (this.value + count <= 0) return
      this.$emit('input', this.value + count)  // 双向绑定
    },
    revisecount (e) {
      const num = +e.target.value // 转数字。转不了的就是NaN
      if (isNaN(num) || num < 1) {
        e.target.value = this.value
        return
      }
      this.$emit('input', num)
    }
  }

}
</script>

<style lang="less" scoped>
。。。。
</style>

```

2、注册调用

```html
<!-- 在页面使用时要导入注册 -->
import countBox from '@/components/conntBox.vue'
components: { countBox },

<countBox></countBox>
```

# 5、router

首先导入并打开router

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
```

创建router实例

```js
const router = new VueRouter({
  routes: [
    { path: '/login', component: login },
    // 默认进来就是这个页面，主页
    {
      path: '/',
      component: layout,
      redirect: '/shouye',
      children: [
        { path: '/shouye', component: shouye },
        { path: '/fenxiangye', component: fenxiangye },
        { path: '/gouwuche', component: gouwuche },
        { path: '/mine', component: mine }
      ]
    },
    { path: '/search', component: search },
    // 动态路由传参，搜索的的后需要的
    { path: '/searchlist/:id', component: searchlist },
  ]
})
```

导入路径

```js
// 这种是打包优化  - 路由懒加载
const login = () => import('@/views/login')
const search = () => import('@/views/search')
const searchlist = () => import('@/views/searchlist')

// 经常使用的页面不用
import shouye from '@/views/tow-router/shouye'
import fenxiangye from '@/views/tow-router/fenxiangye'
import gouwuche from '@/views/tow-router/gouwuche'
import mine from '@/views/tow-router/mine'
```

 创建前置拦截

```js
// 需要拦截的页面
const authUrls = ['/payfor', '/myOrder']

router.beforeEach((to, from, next) => {
  // 看to.path （要去的页面）是否在authUrls中
  if (!authUrls.includes(to.path)) { // 不包括
    next() //放行
    return
  }

  // 权限页面，需要判断是否有token
  // const token = store.getters.token
  const token = store.state.user.userinfo.token
  if (token) next()
  else next('/login') //没有token就拦截到登录
})
```

导出

```js
export default router
```

在mian.js里面导入使用

```js
import router from './router'

new Vue({
  router, //注册（应该是叫做这个吧。。我也不造啊）
  render: h => h(App)
}).$mount('#app')
```

在页面中设置路由出口

```html
<router-view></router-view>
```

导航链接

```html
<template>
   <div class="footer_wrap">
       <router-view></router-view>
       
       // 也可以使用vant组件库
      <router-link to="/find">发现音乐</router-link>
      <router-link to="/my">我的音乐</router-link>
      <router-link to="/person">朋友</router-link>
      <!-- 选择了哪个，哪个就会有router-link-exact-active，router-link-active两个类 -->
    </div>
</template>
```



## 路由传参

父子传参（注意是route）

```html
查询参数传参

   在路由配置里不用加什么
   <router-link to="./search ?key=传的参数">搜索<router-link>
       
   接收
   this.$route.quary.key
       
动态路由传参
       
   需要在路由配置
   { path: '/prodetail/:id', component: prodetail } id就是要传的值
       
   传参
   <router-link to="./search/1001">搜索<router-link>
       
   接收
   this.$route.params.id    这个的值就是1001
```



# 6、store

创建一个index.js，导入vuex

```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
```

创建一个vuex实例

```js
export default new Vuex.Store({
  state: {    // 存放数据
  },
  mutations: { // 存放修改state数据的函数
  },
  actions: {   // 存放异步函数，请求之类的
  },
  getters: {   // 存放一些基于state的数据，类似计算属性
    token (state) {
      return state.user.userinfo.token
    }
  },
  modules: {   // 注册分的模块
  }
})
```

modules可以分模块放数据，在`store/modules/user.js`

```js
// 创建一个user模块，专门存放用户信息

export default {
  namespaced: true, //开启命名空间，好处多多，不列举是因为我忘了
  state () {
    return {
      userinfo: {token: ''，id: ''}
    }
  },
  mutations: { 
    updataUser (state, obj) {
      state.userinfo = obj
    }
  },
  actions: {},
  getters: {}
}

```

在主vuex中安装注册 `store/index.js`

```js
// 导入
import user from './modules/user'
export default new Vuex.Store({
	...
	...
	modules: {   
		user
  	}
})
```

在mian实例挂载

```js
import store from './store'

new Vue({
  router, 
  store,
  render: h => h(App)
}).$mount('#app')
```

## 调用

### 1、直接调用

调用index里面的

```js
1、
// 导入
import store from '@/store/index' 
// 使用
store.state.count

2、
// 不导入使用
this.$store.state.count
```

其他的同理

```js
// 调用state
this.$store.state.count

// 调用mutations
this.$store.commit('min'，n) // min为muations函数名，n为参数，就一个

// 调用actions
this.$store.dispatch('actions名字'，传递的参数)

// 调用getters
this.$store.getters.filterList
```

调用模块中的

```js
// 调用state
this.$store.state.模块名.xxx

// 调用mutations
this.$store.commit['模块名/xxx'，额外参数]

// 调用actions
this.$store.dispatch ( '模块名/xxx ', 额外参数)

// 调用getters
this.$store.getters['模块名/xxx']
```

### 2、使用辅助函数

跟级别

```js
// 首先要按需导入
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'

	computed：｛              //映射属性放在computed里面
    	...mapState(['count'])
		...mapGetters(['filterList'])
    ｝，
    methods：｛              //映射的方法放在methods里面
    	...mapMUtations(['revise']) //可以多个函数或者属性 
		...mapActions(['yimiaohougaibian'])
    ｝
```

模块级别

==默认mutations和actions都是挂载到全局，只有开启命名空间才会挂载到子模块==

```js
computed：｛             
    	...mapState('模块名',['数据'])
		...mapGetters('模块名',['uppername'])
    ｝，
methods：｛             
    	...mapMutations('模块名',['方法']])
		 ...mapActions('模块名',['updateUser'])
    ｝
```

# 7、style

`common.less` 公共的样式

```less
// 重置默认样式
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
// 文字溢出省略号
.text-ellipsis-2 {
    overflow: hidden;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

//顶部导航的返回颜色
.van-nav-bar {
    .van-icon-arrow-left {
      color: #333;
    }
  }
```

在`main.js`导入

```
import '@/style/common.less'
```

# 8、utils

## 1、request

封装一个axios实例，不会污染原本的axios，可以添加一些配置

```
import axios from 'axios'
```

创建axios实例

```js
const instance = axios.create({
  baseURL: 'http://cba.itlike.com/public/index.php?s=/api/',基地址
  timeout: 5000 //可以超时5s
//   headers: { 'X-Custom-Header': 'foobar' }--- - 用不上，没理解过
})
```

配置 - - 请求拦截器

```js
// ****将模板中的axios改成instance****
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么

  // 添加一个加载中，并且禁用背景按钮
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    duration: 0 // 表示不会自动关闭，需手动关闭
  })

  // 如果有token，我们就带上token
  const token = store.getters.token
  if (token) { //属性带字符的，必须用数组包字符串的方式  --- 对象的中括号语法
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
```

配置 - - 响应拦截器

```js
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么

  // response需要先解构一下
  const res = response.data
  if (res.status === 500) { // 500就是错误的标志，200就是对的
    Toast(res.message)
    return Promise.reject(res.message)
  }
  // 关闭加载中
  Toast.clear()
  return response.data
// ****因为传来的数据一般都是多层的，我们在这里分层会容易处理一些****
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})
```

导出

```js
export default instance
```

在此基地址的api文件中导入

```js
import request from '@/utils/request'
```

## 2、storage

命名

```js
const INFO_KEY = 'jk_shopping_info' 为本地存储的名字，太长了定义一个常量表示
```

获取

```js
// 获取个人信息，默认获取本地
export const getINFO = () => {
  const defaultInfo = { userId: '', token: '' }
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : defaultInfo
}
```

设置

```js
export const setINFO = (info) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(info))
}
```

移除

```js
export const removeINFO = () => {
  localStorage.removeItem(INFO_KEY)
}
```

使用

```js
// 先在页面导入
import { gethisList, sethisList } from '@/utils/storage'

// 使用
data () {
    return {
      search: '',
      history: gethisList()  // 已经在函数里设置默认值了
    }
  },
      
设置
sethisList(this.history)
```

## 3、vant-ui

导入vue

```js
import Vue from 'vue'
```

导入vant的库的组件，并注册

```js
import { CellGroup, Switch, Cell, Rate, Tabbar, TabbarItem, NavBar, Search, Swipe, SwipeItem, Grid, GridItem, Icon, ActionSheet, Dialog, Checkbox, Tab, Tabs } from 'vant'

Vue.use(Switch)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Rate)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(NavBar)
Vue.use(GridItem)
Vue.use(Search)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Grid)
Vue.use(Icon)
Vue.use(ActionSheet)
Vue.use(Dialog)
Vue.use(Checkbox)
Vue.use(Tab)
Vue.use(Tabs)
```

在`main.js`导入就能在页面中使用了

```js
import '@/utils/vant-ui'
```

# 9、views

里面存放页面，一整个页面

例如login.vue

```vue
<template>
  
</template>

<script>
export default {
    name:'LoginIndex'，
	...	
}
</script>
```





- 小知识点见 study-vue
