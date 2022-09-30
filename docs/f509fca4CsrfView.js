import{d as r,H as n,a as d,i as e,u as o,q as t,o as h}from"./assets/index.a6bdbb5c.js";const _={class:"p-3 prose md-content maxw-100 dark:prose-invert"},u=e("h2",null,"Csrf tokens",-1),p=e("div",{class:"mt-3"},"Set a csrf token to be sent in the header:",-1),k=["innerHTML"],g=e("div",{class:"mt-3"},"This will add a header to all requests:",-1),T=["innerHTML"],f=e("h3",null,"Options",-1),m=e("div",{class:"mt-3"},[t("To change the default "),e("kbd",null,"X-CSRFToken"),t(" header key use the options:")],-1),v=["innerHTML"],C=e("h3",null,"Set the csrf token from a cookie",-1),H=["innerHTML"],x=e("div",{class:"mt-3"},[t("This will look for a readable "),e("kbd",null,"csrftoken"),t(" cookie and read it's value to set the csrf token. To change the cookie name: ")],-1),M=["innerHTML"],w=r({__name:"CsrfView",setup(L){const s=n.highlight(`const token="xxx";
api.setCsrfToken(token)`,{language:"typescript"}).value,i=n.highlight(`{
  "X-CSRFToken": "xxx"
}`,{language:"json"}).value,a=n.highlight(`const api = useApi({
  csrfHeaderKey: "CUSTOM-CSRFToken-KEY",
});`,{language:"typescript"}).value,l=n.highlight("const hasCsrfTokenBeenSet: boolean = api.setCsrfTokenFromCookie()",{language:"typescript"}).value,c=n.highlight(`const api = useApi({
  csrfCookieName: "my-csrf-cookie-name",
});`,{language:"typescript"}).value;return(y,S)=>(h(),d("div",_,[u,p,e("pre",null,[e("code",{innerHTML:o(s)},null,8,k)]),g,e("pre",null,[e("code",{innerHTML:o(i)},null,8,T)]),f,m,e("pre",null,[e("code",{innerHTML:o(a)},null,8,v)]),C,e("pre",null,[e("code",{innerHTML:o(l)},null,8,H)]),x,e("pre",null,[e("code",{innerHTML:o(c)},null,8,M)])]))}});export{w as default};