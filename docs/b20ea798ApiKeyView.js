import{d as a,H as o,c as n,i as e,u as s,o as i}from"./assets/index.74146591.js";const r={class:"p-3 prose md-content maxw-100 dark:prose-invert"},c=e("h2",null,"Api key",-1),d=e("div",{class:"mt-3"},"Add an api key Authorization header to each request:",-1),p=["innerHTML"],m=a({__name:"ApiKeyView",setup(l){const t=o.highlight('const apiKey = "xxx";\napi.addHeader("Authorization", `Bearer ${apiKey}`)',{language:"typescript"}).value;return(_,h)=>(i(),n("div",r,[c,d,e("pre",null,[e("code",{innerHTML:s(t)},null,8,p)])]))}});export{m as default};
