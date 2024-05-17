# **1、初始化vitepress**

首先创建一个空文件夹，并且安装依赖

```
 pnpm add vitepress -D
```

然后初始化vitepress

```
 pnpm vitepress init
```

这里会有选项

![image-20240516215401621.png](https://file.notion.so/f/f/c972ccf3-7fff-4ed6-9577-ce627c428f70/c909f75c-74f8-4020-9eb3-2815c840d189/image-20240516215401621.png?id=ba172021-bc3f-4ac8-b1a8-0b37f319826b&table=block&spaceId=c972ccf3-7fff-4ed6-9577-ce627c428f70&expirationTimestamp=1716076800000&signature=1LSyvPBRsG_demynlH_RhsjSZavUgkZwFPEOCzgEjM8&downloadName=image-20240516215401621.png)

# **2、编辑主页**

标题栏的修改，在`config.mjs defineConfig`下面配置

在`index.md`中寻找对应的文本进行更改。

![image-20240516215740473.png](https://file.notion.so/f/f/c972ccf3-7fff-4ed6-9577-ce627c428f70/7bbd2267-7fbb-454e-a5fb-11709cdeedc2/image-20240516215740473.png?id=7b58c895-75c7-446a-b2ab-d50792d40b54&table=block&spaceId=c972ccf3-7fff-4ed6-9577-ce627c428f70&expirationTimestamp=1716076800000&signature=WV-oyUusq02FzrUeTFOiqfvGtxKRfl2wPoie9XrL8TU&downloadName=image-20240516215740473.png)

最后有一个footer可以编辑 - 放置版权等。在`config.mjs defineConfig themeConfig`下面配置

```jsx
 export default defineConfig({
   title: "My Awesome Project",
   description: "A VitePress Site",
   themeConfig: {
     // https://vitepress.dev/reference/default-theme-config
     nav: [
     ],
 
     sidebar: [
     ],
 
     socialLinks: [
     ],
 
     footer: {
       copyright: 'Copyright © 2024-present John Kim'
       }
   }
 })
```

# **3、美化背景logo**

在`index.md`中可以进行背景的添加。

```jsx
 name: "My Knowledge Project"
 text: "A VitePress Site"
 tagline: 学无止尽，无止尽的学。
 image:
 src: /background.png
 alt: "Background Image"
 ...
```

在`config.mjs defineConfig themeConfig`中可以进行logo的添加

```jsx
 themeConfig: {
     logo: "/logo.png",
     nav: []
     ...
 }
```

修改网站图标

```jsx
 themeConfig: {
     head: [["link", { rel: "icon", href: "/logo.svg" }]],
     logo: "/logo.png",
     nav: []
     ...
 }
```

# **4、添加搜索**

在`config.mjs defineConfig themeConfig`，可以进行搜索框的添加，并且中文适配。

```jsx
     search: {
       provider: 'local',
       options: {
         translations: {
           button:{
             buttonText: 'Search',
             buttonAriaLabel: 'Search docs'
           },
           modal:{
             noResultsText: '无法找到相关结果',
             searchPlaceholder: '清除查询',
             footer:{
               selectText: '选择',
               navigateText: '切换',
               closeText: '关闭'
             },
           },
         },
       },
     },
```

# **5、文章部分**

## **1、设置目录**

更改目录的整体标题，并且显示更多级标题，默认只会显示一级标题。

```jsx
   themeConfig: {
     outlineTitle:"文章目录",
     outline: [2,4],
     logo: "/logo.png",
     。。。
  }
```

## **2、样式修改**

我发现有的pre标签，会超出视口，可以强制修改主题样式。

```css
 .vp-doc pre{
   white-space: normal !important; //必须提高权级
 }
```

## **3、两栏文章**

这个放在老地方，代替siderbar

```jsx
 sidebar: false, // 关闭侧边栏
 aside: "left", // 设置右侧侧边栏在左侧显示
```