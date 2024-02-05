import{a as p,i as l,S}from"./assets/vendor-b52d9f5e.js";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function s(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerpolicy&&(r.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?r.credentials="include":e.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(e){if(e.ep)return;e.ep=!0;const r=s(e);fetch(e.href,r)}})();p.defaults.baseURL="https://pixabay.com/api/";const q="42056951-259306f3e2aef1f0902f3daf3",h=document.querySelector(".search-form"),i=document.querySelector(".gallery"),c=document.querySelector(".loader-container"),d=document.querySelector(".show-btn");let u=1,y="";function M(t){t.style.display="flex"}function f(t){t.style.display="none"}function m(){d.style.display="none"}function E(){d.style.display="block"}async function H(){u++;const t=await g(y);v(t.hits),P(),u*15>=t.totalHits&&(d.style.display="none",l.info({title:"Sorry",message:"We're sorry, but you've reached the end of search results."}))}function P(){const t=document.querySelector(".image-card").getBoundingClientRect().height;window.scrollBy({top:t*2,behavior:"smooth"})}m();i.innerHTML="";h.addEventListener("submit",T);f(c);async function T(t){t.preventDefault(),i.innerHTML="",M(c);const s=t.currentTarget.elements.query.value;if(y=s,s===""){l.error({title:"Error",message:"Please enter a search term"}),f(c),m(),i.innerHTML="";return}i.innerHTML="",m();try{await g(s).then(o=>{o.hits.length===0?l.error({title:"Error",message:"Sorry, there are no images matching your search query. Please try again!"}):v(o.hits),f(c)}).finally(()=>{h.reset()})}catch{l.error({title:"Error",message:"Failed to fetch images. Please try again later."})}}d.addEventListener("click",H);async function g(t){return await p({params:{key:q,q:t,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:15,page:u}}).then(({data:s})=>s)}function v(t){const a=t.map(({webformatURL:o,tags:e,likes:r,views:n,comments:b,downloads:L,largeImageURL:w})=>`
    
      <div class="image-card">
      <a href = "${w}" ><img class="img" src="${o}" alt="${e}" /></a>
      <div class="image-stats">
        <div class="stat-item">
          <p class="stat-label">Likes:</p>
          <p class="stat-value">${r}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Views:</p>
          <p class="stat-value">${n}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Comments:</p>
          <p class="stat-value">${b}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Downloads:</p>
          <p class="stat-value">${L}</p>
        </div>
      </div>
    </div>
    `).join("");i.insertAdjacentHTML("beforeend",a),new S(".gallery a",{captionsData:"alt",captionDelay:250}).refresh(),E()}
//# sourceMappingURL=commonHelpers.js.map
