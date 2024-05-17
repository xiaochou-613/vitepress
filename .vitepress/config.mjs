import { defineConfig } from 'vitepress'
import { set_sidebar } from "../utils/auto_sidebar.mjs";	
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Project",
  description: "A VitePress Site",
  themeConfig: {
    head: [["link", { rel: "icon", href: "/logo.png" }]],
    outlineTitle:"文章目录",
    outline: [1,4],
    logo: "/logo.png",
    // https://vitepress.dev/reference/default-theme-config 
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Markdown 笔记', link: '/vue-study/CSS' },
      { text: 'vitepress 搭建', link: '/vitepress-setupy' }
    ],

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

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' },
    //       { text: 'vue全笔记', link: '/vue study' },
    //     ]
    //   }
    // ],

    sidebar: [
      {text:'vue笔记',items:set_sidebar("/vue-study")},
      {text:'课后笔记',items:set_sidebar("/class-end-study")}
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xiaochou-613' }
    ],

    footer: {
      copyright: 'Copyright © 2024-present John Kim'
      }
  }
})
