# CSS

用于CSS的简约笔记，详情可以看vs code。

CSS看这个就够了，全面打通 CSS3 知识点，前端程序员必学（更新到第15章）[https://www.bilibili.com/video/BV1tJ411Y7fB?p=100&vd_source=04e0336982b82d29c9fced7380d21066](https://www.bilibili.com/video/BV1tJ411Y7fB?p=100&vd_source=04e0336982b82d29c9fced7380d21066)

- [x]  已完成

# 基础

## 属性选择器

包含这个属性即可

```css
div[title][id]{
..
}
```

包含这个属性，并且值相等

```css
div[title = "content"]{
..
}
```

当这个属性的值以 其 开头

```css
[title^="con"]{
    background-color: green;
}
```

只要是以这个结尾的属性，就作用

```css
[title$="-1"] {
  font-size: 40px;
}
```

只要在属性值任何位置出现这个此就作用

```css
[title*="tent"] {
  font-weight: bold;
}
```

在里面是一个独立的单词才作用

```css
p[title~="content"] {
  margin-left: 40px;
}
```

以content开头，并且以-加别的内容结尾的才行

```css
span[title|="content"] {
  color: purple;
}

例如
    <span title="content-masd">are you content?</span>
```

## 伪元素

::befor   可在其前面添加内容

```css
span::before {
  content: "Hello";
  color: red;
}
```

::after  可在其后面添加内容

```css
span::after {
  content: "World";
  color: blue;
}
```

也可以让内容为自定义属性的值

```css
h2:hover::before {
  content: attr(data-title);
  border: 1px solid red;
  background-color: thistle;
}
```

```html
<!-- 自定义属性一般在前面加上data -->
<h2 data-title="Hello World">nihao</h2>
```

借此我们可以用来画一个好看的下划线

```css
.filed::after {
  content: "";
  width: 100px;
  height: 2px;
  background: linear-gradient(to right, #4ca1af, #c4e0e5, #681515);
  /* 让其宽高生效 */
  display: block;
}
```

## 选择器的优先级

| 选择器 | 权重 |
| --- | --- |
| 继承 | null |
| *(通用符) | 0 |
| 标签选择器 | 1 |
| 类选择器 | 10 |
| 属性选择器 | 10 |
| id选择器 | 100 |
| 内联选择器 | 1000 |

当然也可以强制提高优先级，但是仅建议用于修改ui库

```css
span {
  color: blue !important;
}
```

## 字体

      当我们在浏览器选择字体的时候，一般使用多个字体来确保能加载成功，否则使用浏览器默认字体字体。不建议加载中文字体，偏大。行高建议用em单位，可以适应不同屏幕大小，这样即便是更**改了字体的大小，行高依旧相对不变**

```css
span {
  font-size: large;
  line-height: 1.5em;
}
```

## 阴影

文本阴影

```css
span {
  text-shadow: rgba(0, 0, 34, 0.5) 10px 10px 10px;
																	 /* xy偏移量，最后是模糊度  */
}
```

盒子阴影

```css
/* x 偏移量 | y 偏移量 | 阴影颜色 */
box-shadow: 60px -16px teal;

/* x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影颜色 */
box-shadow: 10px 5px 5px black;

/* x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
```

阴影颜色获取当前文本颜色

```css
div {
  width: 100px;
  height: 100px;
  background-color: red;
  /* 最后的属性是获取当前元素的文本的颜色 */
  box-shadow: 100px 0px 0 currentColor;
  color: rgb(133, 13, 113);
}
```

## 换行和空格

这样可以设置正常显示空格

```css
span {
  /* 这样设置就不会吞空格 */
  white-space: pre;
}
```

不换行，并且文本溢出显示省略号

```css
div {
  width: 300px;
  overflow: hidden;
  border: 1px solid black;
  /* 表示不换行，并且文本溢出显示省略号 */
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

也可以直接使用pre标签

## 盒子大小

当我们有一个盒子的时候，我们不喜欢因为padding什么的，把盒子撑大

```css
div {
  width: 200px;
  height: 200px;
  padding: 50px;
  border: 1px solid black;

  /* 不希望被撑大 */
  box-sizing: border-box;
}
```

## 行块

只有块级元素可以设置宽高，如果我们希望修改文本的宽高就指定 行块

```css
ul li {
  /* display: inline-block; */

  /* 单纯设计为行级元素则无法设置宽高 */
  display: inline;
  width: 100px;
  height: 100px;
  border: 1px solid black;
}
```

## 自动宽高

根据内容的宽度为宽度

```css
div {
  background-color: red;
  /* 自动设置宽度 */
  width: fit-content;
  margin: 0 auto;
  padding: 10px;
}
```

根据最短内容的宽度为宽度

```css
main {
  width: min-content;
  height: 200px;
}
```

根据最长内容的宽度为宽度

```css
main {
  width: max-content;
  height: 200px;
}
```

# 背景

## 图片文字对其

将图片后的文字根据图片的大小 垂直居中

```css
img {
  width: 300px;
  height: 300px;
  /* 让文字垂直居中 */
  vertical-align: middle;
}
```

## 图片的裁剪

根据内容的位置裁剪

```css
.box {
  background-clip: content-box;
}
```

根据padding裁剪，会填充padding

```css
.box2 {
  padding: 30px;
  background-clip: padding-box;
}
```

根据边框裁剪，会填充border

```css
.box3 {
  background-clip: border-box;
}
```

## 背景图片的使用

使用背景图片

```css
background-../image: url(https://picsum.photos/id/237/1000/500)
```

设置是否重复，默认重复

```css
background-repeat: no-repeat;
```

设置图片定位

```css
background-attachment: fixed;  固定位置
background-attachment: scroll; 可以滚动
```

设置图片的位置

```css
background-position: center;
background-position: top left;
```

改变图片的大小

```css
background-size: 300px;
background-size: cover;    保证图片完全覆盖
background-size: contain;  保证图片显示全部，可能会有空白 
```

简单搞定

```css
background: red url(https://picsum.photos/id/237/1000/500) no-repeat scroll top left;
```

## 渐变颜色

线性渐变

可以设置角度或者多种颜色

```css
background:linear-gradient(45deg, #f2c779, #f27979, #f2c779, #f27979)
```

镜像渐变

可以设置角度或者多个颜色，貌似得用正方形盒子

```css
background: radial-gradient(at 50% 50%, #f2c779, #f27979,#f23f32);
```

设置渐变量（太阳）

```css
background: radial-gradient(red, yellow 30%,black 70%,rgb(122, 41, 41) 100%);
```

设置渐变点

```css
background: linear-gradient(90deg, #f2c779,30%, #f27979)
```

重复线性渐变

```css
background: repeating-linear-gradient(
  90deg,
  #f2c779,
  #f27979 20px,
  #f2c779 20px,
  #f27979 40px
);
```

重复镜像渐变

```css
background: repeating-radial-gradient(
  circle,
  #f2c779,
  #f27979 20px,
  #f2c779 20px,
  #f27979 40px
);
```

## 表格和列表

可以用css来写一个表格，但是我觉得没那个必要。

给表格进行空表格隐藏

```css
table {
  /* border-collapse: collapse; 如果设置单边框不太明显 */
  width: 300px;
  border: 1px solid black;
  /* 空表格隐藏 */
  empty-cells: hide;
  padding: 10px;
}
```

选择表格的奇数行或者偶数行

```css
/* even偶数行、 odd奇数行  */
tr:nth-child(odd) {
  background-color: lightgray;
}
```

列表前缀样式

```css
ul {
  /* 数字 */
  list-style-type: decimal;
  list-style-type: none;
  /* 图片 */
  list-style-../image: url(https://www.w3schools.com/css/img_bullet.png);
  /* 渐变 */
  list-style-../image: linear-gradient(to right, #f00, #0f0, #00f);
  list-style-../image: radial-gradient(10px 10px, red 1px, yellow 5px, blue);
}
```

# 浮动

## 浮动的使用

让两个盒子重叠

```css
.box {
  float: left;
}
.box2 {
  /* float: left ; */
}
```

让两个盒子并排

```css
.box {
  float: left;
}
.box2 {
  float: left ;
}
```

如果第二个盒子浮动，不会改变第一个盒子。

## 浮动布局

当两个盒子在一个大盒子里面的时候，我们可以设置一个左浮动，一个右浮动，可以达到很好的并排效果

```css
main {
  width: 640px;
  height: 400px;
  padding: 20px;
}
.box {
  width: 300px;
  height: 300px;
  background-color: red;
  float: left;
}
.box2 {
  width: 300px;
  height: 300px;
  background-color: blue;
  float: right;
}
```

并且，通过浮动，可以让行级标签变成块级标签，可以设置宽高

```css
span {
  width: 100px;
  height: 100px;
  background-color: yellow;
  float: left;
}
```

## 清除浮动撑开盒子

当我们在一个盒子里面放浮动的盒子的时候，父组件感受不到其大小，所以无法撑开盒子。

解决办法一 ： 在下面添加一个空标签。

```html
<main>
  <!-- 两个浮动的盒子 -->
  <div class="box"></div>
  <div class="box2"></div>
  <div style="clear: both;"></div>
</main>
```

解决办法二 ： 用伪元素

```css
main::after {
  content: "";
  display: block;
  clear: both;
}
```

解决办法三 ： 通过overflow来触发BFC机制

```css
main {
  overflow: hidden;
}
```

## 字体环绕

必须在浮动的条件下。

```css
span {
  width: 100px;
  height: 100px;
  background-color: aqua;
  padding: 20px;
  /* border: 20px solid black; */
  /* margin: 30px; */
  float: left;

  /* 围绕着边框环绕 */
  /* shape-outside: border-box; */

  /* 围绕着内容环绕 */
  /* shape-outside: content-box; */

  /* 围绕着边距环绕 */
  /* shape-outside: margin-box; */

  /* 围绕着内边距环绕 */
  /* shape-outside: padding-box; */

  /* 形状的改变 */
  /* clip-path: circle(50%); */
  /* clip-path: circle(50% at 0 100%);  x，y */
  /* 椭圆 */
  /* clip-path: ellipse(50% 20%); */
  /* 三角 */
  /* clip-path: polygon(50% 0, 100% 100%, 0 100%); 通过画点来实现 */
  /* 直角 */
  /* clip-path: polygon(0 0, 100% 100%, 0 100%); */

  /* 围着这个形状环绕 */
  /* shape-outside: polygon(0 0, 100% 100%, 0 100%); */

  /* 围着⚪环绕 */
  clip-path: circle(50%);
  shape-outside: circle(50%);

  /* 如果你是一张图片，可以这样设置围着环绕 */
  /* shape-outside: url(./../images/1.jpg); */
}
```

# 定位

## 相对定位

相对定位会保留原来的位置空间

```css
mian {
  position: relative;
}
```

## 绝对定位

绝对定位默认参照body，如果父级有任何定位属性，则参照父级标签

```css
mian {
  position: relative;
  /* position: absolute; 等等*/
}
mian img {
  position: absolute;
}
```

## 左右偏移量

当我们绝对定位设置了宽高的时候，如果设置了left，则right为auto，top同理。

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled.png)

```css
main {
  width: 300px;
  height: 300px;
  border: 1px solid #000;
  position: relative;
}
main div {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: #f00;
  top: 100px;
  left: 100px;
  /* right: auto;
   bottom: auto; */
}
```

当我们没有设置宽高，则会类似于自己画。四个点

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%201.png)

```css
main {
  width: 300px;
  height: 300px;
  border: 1px solid #000;
  position: relative;
}
main div {
  position: absolute;
  /* width: 100px;
     height: 100px; */
  background-color: #f00;
  top: 100px;
  left: 100px;
  right: 0;
  bottom: 0;
}
```

## 绝对定位居中

```css
main div {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: #f00;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

相对定位或者绝对定位都可以设置层级。 z-index

## 固定定位

        固定定位的元素会始终在浏览器窗口的某个位置，不会受到滚动条的影响（绝对定位会），并且固定定位的元素与其他元素的关系会改变
        固定定位的元素是相对于浏览器窗口进行定位的

```css
main {
  width: 300px;
  height: 300px;
  background-color: pink;

  position: fixed;
}
```

## 粘性定位

当你页面发生滚动的时候，可以让其黏在某个地方

如果p和h3标签是同级的，粘性定位的h3会叠加，如果p和h3标签都是别的标签的子集，则会把粘性定位的h3顶走。

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%202.png)

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%203.png)

```css
h3 {
  position: sticky;
  top: 0;
  background-color: aqua;
}
p {
  margin-bottom: 100px;
}
```

# 弹性盒子

## 顺序和方向

将其设为flex就是弹性盒子，里面的元素称为弹性元素。能够很好的自适应

```css
main{
	display : flex;
}
```

排列顺序，方向

```css
main {
  display: flex;
  border: 2px solid #000;
  width: 400px;
  /* 横向排列（默认） */
  flex-direction: row;
  /* 横向反转 */
  flex-direction: row-reverse;
  /* 纵向排列 */
  flex-direction: column;
  /* 纵向反转 */
  flex-direction: column-reverse;
}
```

排列的时候，默认是会根据盒子尺寸来缩小元素尺寸的

```css
flex-direction: row;

/* 装不满默认会缩小盒子元素尺寸 */
flex-wrap: nowrap;
```

也可以设置，不缩小，而是换行

```css
/* 如果装不满则换行 */
flex-wrap: wrap;
/* 反向换行 */
flex-wrap: wrap-reverse;
```

简单写法

```css
/* 将两个合在一起 */
flex-flow: row wrap;
```

## 位置

可以在达到在盒子的九个任意位置，无论横向还是纵向

```css
/* 横向排列（默认） */
flex-direction: row;

/* 垂直位置 */
align-items: flex-end;
align-items: flex-start;
align-items: center;

/* 水平位置 */
justify-content: flex-end;
justify-content: flex-start;
justify-content: center;
```

如果元素没有设置高度，则可让其拉伸 填满。纵向排列就水平拉伸，反之

```css
align-items: stretch; 
```

## 多行

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%204.png)

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%205.png)

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%206.png)

```css
main {
  display: flex;
  border: 2px solid #000;
  width: 200px;
  height: 600px;
  flex-wrap: wrap;

  align-content: flex-start; /* 交叉轴的起点对齐 */
  align-content: flex-end; /* 交叉轴的终点对齐 */
  align-content: center; /* 交叉轴的中点对齐 */
}
```

多行的间隙分配

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%207.png)

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%208.png)

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%209.png)

```css
/* 交叉轴两端对齐，项目之间的间隔都相等 */
align-content: space-between;  
/* 交叉轴两端对齐，项目之间的间隔比项目与边框的间隔大一倍*/
align-content: space-around;
/* 交叉轴的起点对齐，项目之间的间隔都相等 */
align-content: space-evenly;
```

## 单个元素控制

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%2010.png)

```css
.box {
  align-self: flex-start;
}
.box2 {
  align-self: center;
}
.box3 {
  align-self: flex-end;
}
```

## 主轴基准尺寸

我其实没有搞懂这个。

min尺寸和max尺寸 > 基准尺寸 > 普通尺寸

```css
/* 主轴基准尺寸 设置对象为弹性元素*/
flex-basis: 100px;
```

## 元素空间分配

```css
.box {
  /* 给每个设置1,表示平均分配 */
  flex-grow: 0;
  /* 如果给设置0,则原来多大就多大 */
}
.box2 {
  flex-grow: 2;
  /* flex-shrink: 3; 缩小 我觉得没必要 */
}
.box3 {
  flex-grow: 2;
   /* 表示分配剩余空间的2份 */
}
```

简单写法

```css
/* 组合写法  放大 缩放 基准尺寸 */
flex: 1 0 100px;
```

## 元素的顺序

数子越小，越往上。

```css
/* 原来顺序的逆序 */
div:nth-child(1) {
  order: 3;
}
div:nth-child(2) {
  order: 2;
}
div:nth-child(3) {
  order: -2;
}
```

## 弹性盒子里面使用定位

```css
div {
  /* 会空出原来的位置进行偏移 */
  position: relative;
  left: 100px;

  /* 检测不到位置和大小,不保留原来的位置 */
  position: absolute;
  left: 200px;
}
```

## 弹性盒子自动撑满

当我们需要一个一个弹性盒子中的某一个元素撑满整个盒子使用。

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%2011.png)

```css
ul {
  list-style: none;
  /* 只需要在这个元素上加上这个属性 */
  margin-right: auto;
}
```

# 栅格布局

```css
display : grid;
```

## 画格子

```css
/* 分成三行三列，每行每列100px */
width: 300px;
height: 300px;
display: grid;
grid-template-columns: 100px 100px 100px;
grid-template-rows: 100px 100px 100px;
```

也可以这样写

```css
/* 分成四行四列，每行每列占25% */
width: 400px;
height: 400px;
display: grid;
grid-template-columns: 25% 25% 25% 25%;
grid-template-rows: 25% 25% 25% 25%;

/*或者*/
grid-template-rows: repeat(4, 25%);
grid-template-columns: repeat(4, 25%);
```

也可以第一行100px，第二行50px。前提是不能给元素设置宽高

```css
grid-template-rows: repeat(2, 100px 50px);
grid-template-columns: repeat(4, 20%);
```

## 按比例

```css
/* 分成四份，尺寸平均分配 */
grid-template-rows: repeat(4, 1fr);
grid-template-columns: repeat(4, 1fr);

/* 中间格子两倍尺寸 */
grid-template-rows: 1fr 2fr 1fr;
grid-template-columns: 1fr 2fr 1fr;
```

自动填充

```css
/* 自动填充 */
grid-template-rows: repeat(auto-fill, 100px);
grid-template-columns: repeat(auto-fill, 100px);
```

控制尺寸范围

```css
/* 控制尺寸范围 */
grid-template-rows: repeat(3, minmax(50px, 1fr));
grid-template-columns: repeat(3, minmax(50px, 1fr));
```

设置格子间距

```css
/* 行间距 */
row-gap: 10px;
/* 列间距 */
column-gap: 10px;

/* 间距合并 */
/* 行  列 */
gap: 20px 10px;
/* 行  列 都是10px */
gap: 10px;
```

## 选择格子

在三乘三格子中，选中间的格子

```css
div {
  /* 盒子上边的行数 */
  grid-row-start: 2;
  /* 盒子下边的行数 */
  grid-row-end: 3;
  /* 盒子的左边列数 */
  grid-column-start: 2;
  /* 盒子的右边列数 */
  grid-column-end: 3;
}
```

也可以命名

```css
main {
  width: 300px;
  height: 300px;
  display: grid;
  border: 1px solid #000;
  /* grid-template-rows: [r1-start]1fr [r1-end r2-start]1fr [r2-end r3-start]1fr [r3-end];
            grid-template-columns: [c1-start]1fr [c1-end c2-start]1fr [c2-end c3-start]1fr [c3-end]; */

  /* 重复命名 */
  grid-template-rows: repeat(3, [r-start]1fr[r-end]);
  grid-template-columns: repeat(3, [c-start]1fr[c-end]);
}
```

```css
div {
  /* 不设置尺寸会自动填满 */
  background-color: aquamarine;
  border: 1px solid #000;
  box-sizing: border-box;
  background-clip: content-box;

  /* 盒子上边的行数 */
  grid-row-start: r-end 1;
  /* 盒子下边的行数 */
  grid-row-end: r-end;
  /* 盒子的左边列数 */
  grid-column-start: c-start 2;
  /* 盒子的右边列数 */
  grid-column-end: span 1;

  /* 简写 - 都是按开始来分 */
  grid-row: 2/3;
  grid-column: 2/3;
  /* 也可以使用偏移  - 偏移2 就是 一共两个格子 */
  grid-row: 1 / span 2;
  grid-column: 1 / span 2;
}
```

## 划分尺寸

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%2012.png)

```css
main {
  width: 400px;
  /* height: 400px; */
  background-color: #ccc;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
}
div:nth-child(1) {
  background-color: #f00;
  grid-column: span 1;
}
div:nth-child(2) {
  background-color: #0f0;
  grid-column: span 8;
}
div:nth-child(3) {
  background-color: #00f;
  grid-column: span 1;
}
```

## 按区域画

```css
/* 使用区域设置 */
/* 行/列 行/列  - 依旧都是默认start，如果使用命名，可以使用end*/
grid-area: 2/2/3/3;
/* 也可以使用命名的 */
grid-area: r-start 2 / c-start 2 / r-start 3 / c-start 3;
```

区域的划分

```css
body {
  display: grid;
  /* 分成六块 */
  grid-template-rows: 60px 1fr 60px;
  grid-template-columns: 60px 1fr;

  /* 划分区域 */
  grid-template-areas:
    "header header"
    "nav main"
    "footer footer";
}
```

指定区域

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%2013.png)

```css
/* 指定区域 */
header {
  grid-area: header;
}
nav {
  grid-area: nav;
}
main {
  grid-area: main;
}
footer {
  grid-area: footer;
  /* 将底部继续划分为4块 */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
```

也可以简单区分，将不需要组合在一起的用” . ”来代替。

```css
body {
  grid-template-rows: 60px 1fr 60px;
  grid-template-columns: 60px 1fr;

  /* 划分区域 */
  grid-template-areas:
    ". ."
    ". ."
    "footer footer";
  /* 就是将不需要划分成一组的用点来代替，则会自动分配 */
}

/* 指定组要组合的就好 ， 其他的就按顺序分配了 */
footer {
  grid-area: footer;
}
```

## 栅格位置

当容器大小大于栅格大小，就需要考虑栅格的位置了。 可以水平垂直指定栅格的位置。

```css
main {
  width: 300px;
  height: 100px;
  display: grid;

  grid-template-columns: repeat(4, 30px);
  border: 2px solid #000;

  /* 当容器大于栅格的时候，需要考虑他的位置分布 */

  /* 水平方向的位置 */
  justify-content: start;
  justify-content: center;
  justify-content: end;
  /* 垂直方向的位置 */
  align-items: start;
  align-items: center;
  align-items: end;

  /* 水平方向的分配 */
  justify-content: space-between;
  justify-content: space-around;
  justify-content: space-evenly;
}
```

## 栅格元素的位置

```css
main {
  width: 300px;
  height: 100px;
  display: grid;

  grid-template-columns: repeat(4, 1fr);
  border: 2px solid #000;

  /* 控制元素的位置，默认是拉伸 */
  justify-items: stretch;
  align-items: stretch;
  /* 水平 */
  justify-items: start;
  justify-items: center;
  justify-items: end;
  /* 垂直 */
  align-items: start;
  align-items: center;
  align-items: end;
}
```

## 栅格里单个元素的控制

```css
div:nth-child(1) {
  justify-self: start;
  align-self: start;
}
```

## 简写

```css
/* 像这些都可以简写，只需要记住是self还是items */
					/* 垂直 水平 */
place-self: center end;
place-items: start end;
/* self是单个元素的控制，items是所有元素控制的简写 */
```

# 动画

## 移动和缩放

z轴缩放没搞懂

```css
/* 移动 */
div:hover {
  transform: translateX(100px);
  transform: translateY(100px);
  /* 简写 - 不包括z轴 */
  transform: translate(100px, 100px);
  
  /* Z轴 - 没有参考，无法使用百分比，添加了斜角，不然看不出效果 */
  transform: perspective(800px) rotateY(45deg) translateZ(200px);

  /* 简写 - 包括z轴  */
  transform: perspective(800px) rotateY(45deg) translate3d(100%, 100%, 100px);
}
```

```css
/*缩放*/
transform: scaleX(1.5);
transform: scaleY(1.5);
/* 简写 */
transform: scale(1.5);

transform: perspective(800px) rotateY(45deg) translate3d(100%, 100%, 100px)
  scale3d(2, 2, 5);
```

## 基点

默认为绕中心缩放

```css
transform-origin: center;
transform-origin: left top;

/*  有z轴的参考点 */
transform-origin: left top 100px;
```

## 图片模糊预览

```css
main:hover img {
	/* 模糊效果 */
  filter: blur(10px);
}

img:hover {
  transform: scale(1.5);
  filter: none !important;
}
```

## 旋转

```css
main {
  /*加上这个才能更好的观察到效果，呈现一个3d的效果*/
  transform-style: preserve-3d;
  transform: perspective(700px) rotateY(40deg);
}

main:hover div {
  transform: rotatex(70deg);
  transform: rotatey(-80deg);
  transform: rotatez(-80deg);
  /*沿着平面旋转、和z好像是一样的*/
  transform: rotate(-80deg);

  /* 三维 */
  /* 可以多个轴一起转，哪个轴数值大，就偏哪个轴*/
  transform: rotate3d(10, 1, 0, -180deg);

  /* 注意属性不会叠加，并且先转x轴再转y，与先y后x结果也不一样 */
}
```

## 倾斜

```css
main:hover div {
  transform: skewX(45deg);
  transform: skewY(45deg);
  /* 简写，x  y */
  transform: skew(40deg, 40deg);
}
```

利用倾斜写了一个按钮动画

```css
a::after {
  content: "";
  display: block;
  width: 0px;
  height: 50px;
  position: absolute;
  /* 必须让其为0的时候就在中心，变大了也在中心，这样
            当变大的时候，才会是从中心放大的效果 */
  align-self: center;
  background: linear-gradient(45deg, #f5a9a9, #bd5252 50%);
  transition: 0.5s;
  transform: skewX(-45deg);
  z-index: -1;
}
a:hover::after {
  width: 200%;
}
```

也可以在一个div左右两边添加两个倾斜的伪元素，可以做一个立体的按钮。

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%2014.png)

## 透视

可以看到x，y轴的翻转

当我们给父级元素设置属性形式的透视时，是子元素都透视。

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%2015.png)

```css
main {
  width: 300px;
  height: 100px;
  border: 1px solid #000;
  /* 给父级设置perspective属性 */
  perspective: 900px;
}
div {
  width: 100px;
  height: 100px;
  background-color: rgb(124, 70, 0);
  transform: rotateX(45deg);
}
```

当我们给父级元素设置函数形式的透视时。则是正父级元素整体透视

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%2016.png)

```css
main {
  width: 300px;
  height: 100px;
  border: 1px solid #000;
  /* 如果使用函数的形式，则是整体透视 */
  transform: perspective(600px) rotateY(45deg);
}
```

如果想看到z轴的效果，则需要开启三维空间

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%2017.png)

```css
main {
  width: 300px;
  height: 100px;
  border: 1px solid #000;
  display: flex;
  justify-content: space-between;
  /* 三维空间开启 */
  transform-style: preserve-3d;
  transform: perspective(600px) rotateY(45deg);
}
div:nth-child(1) {
  background-color: blueviolet;
  transform: translateZ(-150px);
}
```

## 背部隐藏

当让一个div反转180度后会看到盒子的背面，使用这个属性可以将其隐藏，可用于做反转动画

```css
div {
	...
  /* 背部不显示 */
  backface-visibility: hidden;
}
main:hover div {
  transform: rotateY(180deg);
}
```

# 过渡

```css
/* 这个属性会被继承，所以在hover里面也可以重新设置 */
/* 但是当hover移除，还是以父级的transition来动画 */
transition: 1s;
```

可以单独控制某些属性过渡

```css
/* 也可以控制那些属性过渡，哪些属性不过渡 */
transition-property: width, height;

/* transition-property: all; 一般都不写*/
/* transition-property: none; */
```

过渡时间

```css
transition-duration: 1s;

/*也可以分开设置动画时间*/
transition-duration: 1s, 5s;
```

设置动画的快慢流

可以参考网站设置 ： [https://cubic-bezier.com/](https://cubic-bezier.com/#0,.08,1,.03)

![Untitled](../image/CSS%20b73fe20b8d4d42ca9d92041895c1251a/Untitled%2018.png)

```css
transition-timing-function: cubic-bezier(0,.08,1,.03);
/*ease-in-out 或者lieaner*/
```

## 间断过渡

当设置间断动画，盒子会一卡一卡的移动过去

```css
div {
  transition: 1s;
  /* start会立即开始移动，而end则会停顿一会二再启动 */
  /* transition-timing-function: steps(4,start); */
  transition-timing-function: steps(4, end);
  /* steps(1,start) === setp-start  这两个属性效果一样 */
}
main:hover div {
  transform: translateX(400px);
}
```

## 动画延迟

```css
div {
  /* 设置过渡效果 */
  transition-property: border-radius, width, height, background-color;

  transition-duration: 3s;
  /* 依次启动动画,当3秒钟圆角动画结束后,宽度高度动画开始,背景颜色动画开始 */
  transition-delay: 0ms, 3s, 3s, 4s;
}
```

## 组合设置

```css
div {
  width: 100px;
  height: 100px;
  background-color: red;
  /* 设置过渡效果 */
  transition-property: border-radius, width, height, background-color;

  /* 组合设置 */
  /* 第一个时间动画时间，必须有，第二个是延迟时间 */
  transition: all 2s 1s linear;
  /* 也每个属性单独设置 */
  transition: border-radius 2s 1s linear, width 3s 2s ease-in-out,
    height 3s 2s linear, background-color 4s 3s ease-in-out;
}
```

# 帧动画

名称-时间-循环次数

```css
div {
  width: 100px;
  height: 100px;
  background-color: #0f9722;
  /* 设置读个动画，并且单独设置每个动画的时间 */
  animation-name: amove, radio;
  animation-duration: 4s, 1s;
  /* 动画的执行次数 */
  animation-iteration-count: 2, 1;
  /* 无限 */
  animation-iteration-count: infinite;
  /*动画效果*/
  animation-timing-function: cubic-bezier(0, 0.08, 1, 0.03);
}
@keyframes amove {
  25% {
    transform: translateX(300px);
  }
  50% {
    transform: translate(300px, 300px);
  }
  75% {
    transform: translateY(300px);
  }
}
```

## 心跳设计

```css
div {
  transform: rotate(45deg) scale(0.5);
  opacity: 0.5;
  animation-name: jump;
  animation-duration: 0.9s;
  animation-iteration-count: infinite;
  /* 从100迅速到0 */
  animation-direction: normal;
  /* 从0迅速到100% */
  animation-direction: reverse;
  /* 正向播放，并且缓大缓小 */
  animation-direction: alternate;
  /* 反向播放，并且缓大缓小 */
  animation-direction: alternate-reverse;
}
/* 最好不要设置from to或者100%的关键帧，否则会出现闪烁 */
/* 也可以使用描述属性更改 */
@keyframes jump {
  from {
    transform: rotate(45deg) scale(0.5);
    opacity: 0.5;
  }
  to {
    transform: rotate(45deg) scale(1);
    opacity: 1;
  }
}
```

## 间断帧动画

```css
animation-timing-function: steps(4, start);
```

## 动画的启停

```css
animation-play-state: paused;
animation-play-state: running;
```

## 填充方式

感觉就是前两个是最后以原始样式为主，

后两个动画结束以100%为主

```css
animation-fill-mode: normal;
animation-fill-mode: backwards;
animation-fill-mode: forwards;
animation-fill-mode: both;
```

# 媒体查询