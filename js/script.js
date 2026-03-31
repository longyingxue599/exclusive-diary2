// 等 DOM 结构加载完成后再执行，防止 JS 先跑导致元素为 null
document.addEventListener('DOMContentLoaded',()=>{
console.log('个人中心页面加载完成');

/* ======================= 一、页面基础交互 ======================= */

// 联系按钮：点击后让右侧主内容容器滚动到底部
const contactBtn=document.querySelector('.contact-btn'); // 获取“联系”按钮
const mainContainer=document.querySelector('.main-content-container'); // 获取可滚动主容器
if(contactBtn&&mainContainer){
contactBtn.addEventListener('click',()=>{
mainContainer.scrollTo({top:mainContainer.scrollHeight,behavior:'smooth'}); // scrollHeight=内容总高度
});
}

// 导航栏锚点平滑滚动（#xxx）
const navLinks=document.querySelectorAll('.main-nav a'); // 所有导航链接
navLinks.forEach(link=>{
link.addEventListener('click',function(e){
const href=this.getAttribute('href')||''; // 读取 href
if(href.startsWith('#')){ // 只处理锚点链接
e.preventDefault(); // 阻止默认瞬跳
const target=document.querySelector(href); // 查找目标元素
if(target)target.scrollIntoView({behavior:'smooth',block:'start'}); // 平滑滚动到目标
}
});
});

// 自动给当前页面导航加 active 样式
(function(){
try{
let currentFile=(location.pathname.split('/').pop())||'interface.html'; // 当前页面文件名
navLinks.forEach(link=>{
try{
const linkFile=new URL(link.href,location.href).pathname.split('/').pop(); // 导航指向文件
if(linkFile===currentFile)link.classList.add('active'); // 文件一致即当前页
}catch(e){}
});
}catch(e){}
})();

// 主题切换（深色 / 浅色）
const themeToggleBtn=document.querySelector('#theme-toggle'); // 切换按钮
const body=document.body; // body 用于控制整体主题 class
function applySavedTheme(){
try{
const saved=localStorage.getItem('site-light-mode'); // 读取本地主题状态
if(saved==='1'){body.classList.add('light-mode');themeToggleBtn&&(themeToggleBtn.textContent='切换深色');}
else{body.classList.remove('light-mode');themeToggleBtn&&(themeToggleBtn.textContent='切换浅色');}
}catch(e){}
}
function toggleTheme(){
const isLight=body.classList.toggle('light-mode'); // toggle 自动切换 class
try{localStorage.setItem('site-light-mode',isLight?'1':'0');}catch(e){}
themeToggleBtn&&(themeToggleBtn.textContent=isLight?'切换深色':'切换浅色');
}
applySavedTheme(); // 页面加载时立即应用主题
themeToggleBtn&&themeToggleBtn.addEventListener('click',toggleTheme); // 绑定点击事件

/* ======================= 二、博客文章功能 ======================= */

// 文章列表容器 / 发布按钮 / 清空按钮
const listContainer=document.getElementById('article-list');
const submitBtn=document.getElementById('submit-post');
const clearBtn=document.getElementById('clear-storage');
if(!listContainer||!submitBtn||!clearBtn){console.error('文章模块元素缺失');return;}

// 从 localStorage 加载文章并渲染
const loadPosts=()=>{
const posts=JSON.parse(localStorage.getItem('my_blog_posts'))||[]; // 获取文章数组
listContainer.innerHTML=''; // 清空旧内容
[...posts].reverse().forEach(post => renderPost(post)); // 最新文章优先显示
// 核心代码：更新侧边栏显示的动态条数
const countEl=document.getElementById('post-count');
if(countEl){
const oldCount=parseInt(countEl.innerText)||0;
const newCount=posts.length;
countEl.innerText=newCount;
// 添加动画效果
if(newCount!==oldCount){
countEl.classList.add('count-bump');
setTimeout(()=>{countEl.classList.remove('count-bump');},300);
}
}
posts.reverse().forEach(post=>renderPost(post)); // 最新文章优先显示
};
// 单篇文章渲染逻辑
const renderPost=(post)=>{
listContainer.insertAdjacentHTML('beforeend',`
<article class="blog-post">
<h4>${post.title}</h4>
<small style="color:#aaa;">📅 ${post.date}</small>
<p style="margin-top:10px;white-space:pre-wrap;">${post.content}</p>
</article>
`);
};

// 发布新文章
submitBtn.onclick=()=>{
const title=document.getElementById('post-title').value; // 标题输入
const content=document.getElementById('post-content').value; // 内容输入
if(!title||!content)return alert('写点什么再发布吧！'); // 基础校验
const newPost={title,content,date:new Date().toLocaleString()}; // 文章对象
const posts=JSON.parse(localStorage.getItem('my_blog_posts'))||[]; // 旧数据
posts.push(newPost); // 添加新文章
localStorage.setItem('my_blog_posts',JSON.stringify(posts)); // 持久化存储
loadPosts(); // 刷新页面
document.getElementById('post-title').value=''; // 清空输入框
document.getElementById('post-content').value='';
};

// 清空所有文章
clearBtn.onclick=()=>{
if(confirm('确定要删除所有记录吗？此操作不可恢复。')){
localStorage.removeItem('my_blog_posts'); // 删除本地数据
loadPosts(); // 刷新列表
}
};

// 页面初始化加载文章
loadPosts();
});

