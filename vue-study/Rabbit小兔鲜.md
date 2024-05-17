# 一、复习

## 1、computed

```vue
<script setup>
import {computed} from 'vue'
const computedList = computed(()=>{
    return  依赖xiang做计算
})
</script>
```

## 2、watch

```vue
<script setup>
<!--单个参数
<!-- count是ref对象，但是不需要写.value
watch(count,()=>{
  <!--执行逻辑
})

<!--多个参数，立即执行
watch([count,name],([newcount,newnmame],[oldcount,oldname])=>{
	<!--执行逻辑
},{immediate : true}) 
</script>


<!-- 深度监听-->
<!-- 对象里面的非所有数据修改不会触发监听，所以需要深度监听 -->
watch(count,()=>{
  <!--执行逻辑-->
},{
	deep:true <!-- 不建议开启，递归遍历有损耗，推荐精确监听
})

<!-- 精确监听-->
watch(
	()=>object.value.count,
	()=>{  <!--执行逻辑 -->
})
```

## 3、defineExpose

在vue3父组件无法访问子组件的数据或方法，如果需要则在子组件内通过此方法进行暴露给父组件。

## 4、Pinia

 

 

# 二、项目初期配置

创建项目

​	==pnpm create vue==

==-*切换pnpm仓库*-==

```
npm config set registry https://registry.npm.taobao.org
```

**配置文件 .eslintrc.cjs**

1. prettier 风格配置 [https://prettier.io](https://prettier.io/docs/en/options.html )

	1. 单引号

	2. 不使用分号

	3. 每行宽度至多80字符

	4. 不加对象|数组最后逗号

	5. 换行符号不限制（win mac 不一致）

2. vue组件名称多单词组成（忽略index.vue）

3. props解构（关闭）

```jsx
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true, // 单引号
        semi: false, // 无分号
        printWidth: 80, // 每行宽度至多80字符
        trailingComma: 'none', // 不加对象|数组最后逗号
        endOfLine: 'auto' // 换行符号不限制（win mac 不一致）
      }
    ],
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index'] // vue组件名称多单词组成（忽略index.vue）
      }
    ],
    'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验
  }
```

## 配置@联想

创建一个  jsconfig.json

```json
{
  "compilerOptions" : {
    "baseUrl" : "./",
    "paths" : {
      "@/*":["src/*"]
    }
  }
}
// 这个只是能触发联想，@的g
```

安装element plus

```apl
pnpm install element-plus
pnpm install -D unplugin-vue-components unplugin-auto-import
//***自动导入，彩蛋：组件也自动导入了
// -D 表示只在开发阶段依赖
```

# 三、*配置elementPlus主题色

安装scss依赖

```
pnpm i sass -D
```

配置不同的颜色

必须路径： `styles/element/index.scss`

```scss
/* 只需要重写你需要的即可 */
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      // 主色
      'base': #27ba9b,
    ),
    'success': (
      // 成功色
      'base': #1dc779,
    ),
    'warning': (
      // 警告色
      'base': #ffb302,
    ),
    'danger': (
      // 危险色
      'base': #e26237,
    ),
    'error': (
      // 错误色
      'base': #cf4444,
    ),
  )
```

通知element采用scss语言

```js
在vite.config.js里面
更改
 Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
    })
```

导入定值scss文件

```js
在resolve下面添加
css: {
    preprocessorOptions: {
      scss: {
        // 自动导入定制化样式文件进行样式覆盖
        additionalData: `
          @use "@/styles/element/index.scss" as *;
        `
      }
    }
  }
```

# 四、图片的懒加载

场景：网页的首页比较长，用户不一定都会看到，页面靠下半部分的图片没必要加载，只有进入视口区域的时候才发送图片请求

`main.js`

```js
//图片懒加载
app.directive('img-lazy', {
  mounted(el, binding) {
    // el : 是指令绑定的元素 img
    // binding ： 是指令等于号后面绑定的表达式的值  图片的URL；

    //使用useVue插件 - 是否在可视区
    useIntersectionObserver(el, ([{ isIntersecting }]) => {
      if (isIntersecting)
        //进入可视区域了
        el.src = binding.value
    })
  }
})
```

给需要懒加载的图片绑定指令，将原来的src去掉

```vue
<img v-img-lazy = "item.picture" />
```

## 懒加载的优化

首先懒加载的逻辑卸载main里面不合理，main里面主要写一些初始化以及插件的引用，这里我们将懒加载封装成一个插件并引用

创建一个 `utils/directive.js`

```js
import { useIntersectionObserver } from '@vueuse/core'

export const directivePing = {
  install(app) {
    //图片懒加载
    app.directive('img-lazy', {
      mounted(el, binding) {
        // el : 是指令绑定的元素 img
        // binding ： 是指令等于号后面绑定的表达式的值  图片的URL；

        //使用useVue插件的是否在可视区
        const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
          if (isIntersecting) {
            //进入可视区域了
            console.log('到视口区域了')
            el.src = binding.value
            stop()
          }
        })
      }
    })
  }
}
```

并在main里面导入，并且use

```js
import { directivePing } from '@/utils/directive'
app.use(directivePing)
```

2、useIntersectionObserver这个插件会==一直执行==，浪费资源，我们从这个函数的方法中结构出stop方法，并在到视口区域的时候执行。

# 奇怪的错误

## 对象错误

1、在js中声明一个响应式对象，必须确认是对象

```js
const student = ref({}) //否则在temp使用student.name会报错
```

2、对应上面的问题

 

当对象为空的时候，去读取里面的值就会报错，可以采用两种方法解决。

> 可选链：
>
> ```js
> student?.id   //当对象不为空的时候访问里面的id
> ```
>
> v-if：
>
> ```html
> <div v-if="student">  // 数据还没来的时候现不展示 
> </div>
> ```



## 路由跳转错误

当我使用useRouter实例跳转的时候，报错，提示我未定义push和replace

```js
// import { useRouter } from 'vue-router'
// const router = useRouter()
// router.push('/login')
```

解决办法

```js
import router from '@/router'  //这个是我们创建的路由
router.push('/login')
```

## 路由实例位置错误

```
const router = useRouter()
```

这个如果写在函数里面会报错，提示只能写在setup生命周期里面

# 五、路由缓存问题

产生的原因： 路由只有参数发生变化时，会复用组件实例，不刷新页面

## 解决方法一：

给router-view添加一个 `:key`

```vue
<router-view :key="$route.fullPath"></router-view>
```

:key可以用于强制替换一个元素/组件而不是复用他。缺点是比较耗资源，东西全要重新加载

## 解决方法二：

使用onBeforeRouteUpdate钩子，在每次路由更新的之前执行，可以有选择性的调用api请求获取更新的数据。性能更强

```js
onBeforeRouteUpdate((to) => {  //to是目标对象
  getCategory(to.params.id)
})
```

## 小知识：

```js
const getCategory = async (id = route.params.id) => {
  const res = await getTopCategory(id)
  category.value = res.result
}
//意思是：如果你不传参数，那么id的默认值为route.params.id，否则就以传的参数为主
```

# 六、拆分业务逻辑

将一个页面的多个逻辑才分出去，就近创建一个`composable`的文件夹。

创建一个use+作用的名字

```js
// 封装banner部分的逻辑
import { getBanner } from '@/api/Home/index.js'
import { ref } from 'vue'

export const useBanner = () => {
  const bannerlist = ref([])

  const getBannerlist = async () => {
    const res = await getBanner('2')
    bannerlist.value = res.result
  }
  //获取list
  getBannerlist()
  return {        //return出需要导出的数据或者函数
    bannerlist
  }
}
```

调用结构需要的数据

```js
import {useBanner} from ...

const {bannerlist} = useBanner()
```

# 七、定制路由滚动行为

```js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
		...
  ],
  //定制路由的滚动行为，更新路由跳到页面最顶部
  scrollBehavior() { 
    return {
      top: 0
    }
  }
})
```

# 八、表单校验

用于el-form

## 1、创建ref对象，和rules

```js
const form = ref({   //必须是响应式的
  account: '',
  password: ''
})

const rules = {
  account: [
	...
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'                     //失焦的时候触发
    },
    {
      min: 6,
      max: 14,
      message: '密码长度为6-14个字符',
      trigger: 'blur'
    }
  ]
}
```

## 2、给form整个的绑定form和rules

```vue
<el-form
    :model="form"   //这里是 :model不是 v-model
    :rules="rules"
>
```

## 3、给el-form-item指定那个规则

```vue
<el-form-item label="账户" prop="account">
```

## 4、给input双向绑定表单对象

```vue
<el-input v-model="form.account" />
```

## 5、自定义校验

```js
const rules = {
  account: [
...
  ],
  password: [
...
  ],
  agree: [
    {
      validator: (rule, value, callback) => {
        //自定义校验，写逻辑就用这个
        if (value) callback()
        else callback(new Error('请同意用户协议再登录。'))
      }
    }
  ]
}
```

绑定元素 -  复选框

```vue
<el-form-item label-width="22px" prop="agree">
    <el-checkbox size="large" v-model="form.agree">
        我已同意隐私条款和服务条款
    </el-checkbox>
</el-form-item>
```

##  6、最后统一校验

如果用户不输入任何内容，就可以跳过指定的规则，所以需要最后的校验来做好保护。

```js
//最后统一校验
const router = useRouter()
const formRef = ref()
const goLogin = () => {
  formRef.value.validate((valid) => {
      //valid : 当所有验证都通过则为true
    if (valid) router.push('/')
  })
}

form表单实例自带validate方法
```

# 九、pinia持久化插件

1、安装插件

```
pnpm install pinia-plugin-persistedstate
```

2、给pinia安装插件`main.js`

```js
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

3、给需要持久化的store，添加第三个对象，把persist设置true

```js
export const useTokenStore = defineStore('Token', () => {
  const Token = ref()
  const getTKN = async(account,password) =>{
    const res = await getToken(account,password)
    Token.value = res.result.token
  }
  return { Token,getTKN }
},
{
    persist:true         //持久化，存到本地LoalStorage
})
```

# 十、函数额外传参

当我们的单选框的change函数有一个默认参数为是否选中，我们还想传递上级，例如v-for里面的item的时候，我们可以采用回调函数的写法

```vue
 <tr v-for="i in cartStore.cartList" :key="i.id">
<td>
<el-checkbox
:model-value="i.selected"
@change="(selected) => Isselect(i, selected)"
/>
...
v-model适合双向的数据绑定，当我们需要写逻辑的时候可以采取原始的写法，分开为：model-value和change，小兔鲜P80见详情
```

# 十一、封装倒计时函数

```js
import { ref, computed, onUnmounted } from 'vue'
//安装格式化插件  - pnpm i dayjs
import dayjs from 'dayjs'
//封装倒计时函数
export const countDown = () => {
  let timer = null
  const time = ref()
  //转化成mm分nn秒的形式
  const formatTime = computed(() => {
    return dayjs.unix(time.value).format('mm分ss秒')
  })
  const start = (currentTime) => {
    //初始化时间
    time.value = currentTime
    //每一秒减减
    timer = setInterval(() => {
      time.value--
    }, 1000)
  }
  //组件销毁时清除定时器
  onUnmounted(() => {
    //如果timer存在，则清除timer
    timer && clearInterval(timer)
  })

  return { formatTime, start }
}
```

调用

```js
import { countDown } from './composable/countDown.js'
const { formatTime, start } = countDown()
setTimeout(() => {  //由于刚开始可能没有数据，等待一秒后传递
  start(payInfo.value?.countdown)
}, 1000)
```

# 十二、SKU的封装

>  需要用到的话，再去学习
