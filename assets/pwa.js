(function(){
  const depth=document.currentScript?.dataset.depth||'';
  if('serviceWorker' in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register(depth+'service-worker.js',{scope:depth}).catch(()=>{}));
  let promptEvent;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;document.querySelectorAll('[data-install]').forEach(b=>b.hidden=false)});
  document.addEventListener('click',async e=>{const b=e.target.closest('[data-install]');if(!b||!promptEvent)return;promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;b.hidden=true});
  window.addEventListener('appinstalled',()=>document.querySelectorAll('[data-install]').forEach(b=>b.hidden=true));
})();
