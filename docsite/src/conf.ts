import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);

const libName = "Restmix";

const links: Array<{ href: string; name: string }> = [
  { href: "/apidoc", name: "Api doc" },
  { href: "/examples", name: "Examples" },
];

const examplesExtension = ".ts";

export { libName, links, examplesExtension, hljs }