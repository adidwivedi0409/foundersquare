/* Runs in <head> before the stylesheet: theme choice (no flash) + deep-link parking. */

(function(){var t=null;try{t=localStorage.getItem('bn-theme')}catch(e){}
var h=document.documentElement.dataset.theme;   /* a host page may have set an explicit choice */
document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:(h==='light'?'light':'dark');
document.documentElement.classList.add('js');
/* Deep links: take the hash away before the browser scrolls to it (that jump
   happens before the pinned section has its spacer). The main script lands on
   it once positions are final and puts the hash back. */
if(location.hash&&location.hash.length>1){window.__deepHash=location.hash;try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}})();
