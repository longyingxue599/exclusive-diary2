// toggle-theme.js
// 提供全局函数 toggleLightMode() 来切换浅色/深色主题，并将选择持久化到 localStorage
(function(){
  function setTheme(isLight){
    document.body.classList.toggle('light-mode', !!isLight);
    try { localStorage.setItem('site-light-mode', !!isLight ? '1' : '0'); } catch(e){}
  }

  // 页面加载时恢复之前的设置
  try {
    var saved = localStorage.getItem('site-light-mode');
    if(saved !== null) setTheme(saved === '1');
  } catch(e){}

  // 暴露给全局：页面可以使用 onclick="toggleLightMode()" 或者在脚本中调用
  window.toggleLightMode = function(){
    var isLight = document.body.classList.contains('light-mode');
    setTheme(!isLight);
  };
})();
