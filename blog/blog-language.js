(()=>{
  const body=document.body;
  const current=(document.documentElement.lang||"en").slice(0,2);
  const stored=localStorage.getItem("eil_language");
  const desired=stored||((navigator.language||"en").toLowerCase().startsWith("hu")?"hu":"en");
  const target=desired==="hu"?body.dataset.huUrl:body.dataset.enUrl;
  if(target&&desired!==current){location.replace(target);return}
  const style=document.createElement("style");
  style.textContent='.language-switch{position:fixed;right:18px;bottom:18px;z-index:999;display:flex;gap:5px;padding:5px;border:1px solid rgba(22,199,238,.35);border-radius:999px;background:rgba(7,19,34,.95);box-shadow:0 12px 30px rgba(0,0,0,.35)}.language-switch button{border:0;border-radius:999px;padding:8px 11px;background:transparent;color:#a8b7c9;font-weight:900;cursor:pointer}.language-switch button.active{background:#16c7ee;color:#04101b}';
  document.head.appendChild(style);
  const picker=document.createElement("div");
  picker.className="language-switch";
  picker.setAttribute("aria-label","Language / Nyelv");
  picker.innerHTML='<button type="button" data-lang="en">EN</button><button type="button" data-lang="hu">HU</button>';
  picker.querySelectorAll("button").forEach(button=>{
    button.classList.toggle("active",button.dataset.lang===current);
    button.addEventListener("click",()=>{
      const lang=button.dataset.lang;
      localStorage.setItem("eil_language",lang);
      location.href=lang==="hu"?body.dataset.huUrl:body.dataset.enUrl;
    });
  });
  body.appendChild(picker);
})();
