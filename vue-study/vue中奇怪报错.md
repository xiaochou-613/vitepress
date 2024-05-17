# 1、音频使用

当我们给本地路径的时候是不行，无法找到资源，除非是在服务器上。

```html
  <audio ref="audioRef" src="@/music/暗号.mp3"></audio>
```

想要使用就将它导入进来

```js
import anhao from '@/music/暗号.mp3'
<audio ref="audioRef" :src="anhao"></audio>
```

或者

```html
  <audio ref="audioRef" @timeupdate="log">
    <source src="@/music/暗号.mp3" />
  </audio>
```

#  2、window变量

当我把一个变量设置为全局变量后，并简单设置了只读

```js
//控制音频
const audioRef = ref(null)

onMounted(() => {
  //设置全局变量，并且简单设置无法修改
  Object.defineProperty(window, 'audio', {
    value: audioRef.value,
    writable: false, //可重写
    enumerable: false, //可遍历
    configurable: false //可重修改描述属性
  })
})

//当我在别的地方访问，赋值的时候却显示错误
const audio = window.audio
console.log(audio) //undefine
console.log(window.audio)//正确
```

# 3、tomcat的history模式

在ROOT文件夹下面添加一个文件夹，里面存放`web.xml`

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://java.sun.com/xml/ns/javaee
                      http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
  version="3.0"
  metadata-complete="true">

  <display-name>webapp</display-name>
  <description>
     webapp
  </description>
  <error-page>  
   <error-code>404</error-code>  
   <location>/</location>  
</error-page>  
</web-app>
```

