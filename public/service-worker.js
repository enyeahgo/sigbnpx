if(!self.define){const s=s=>{"require"!==s&&(s+=".js");let e=Promise.resolve();return r[s]||(e=new Promise((async e=>{if("document"in self){const r=document.createElement("script");r.src=s,document.head.appendChild(r),r.onload=e}else importScripts(s),e()}))),e.then((()=>{if(!r[s])throw new Error(`Module ${s} didn’t register its module`);return r[s]}))},e=(e,r)=>{Promise.all(e.map(s)).then((s=>r(1===s.length?s[0]:s)))},r={require:Promise.resolve(e)};self.define=(e,o,c)=>{r[e]||(r[e]=Promise.resolve().then((()=>{let r={};const i={uri:location.origin+e.slice(1)};return Promise.all(o.map((e=>{switch(e){case"exports":return r;case"module":return i;default:return s(e)}}))).then((s=>{const e=c(...s);return r.default||(r.default=e),r}))})))}}define("./service-worker.js",["./workbox-4bc4c9dd"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"__manifest.json",revision:"4c88793c2340eef791948f98ccece8b3"},{url:"assets/css/fonts/ionicons.eot@v=2.0.0",revision:"d66f6cd5f86dbf5ed108103812e870f8"},{url:"assets/css/fonts/ionicons.svg@v=2.0.0",revision:"8a9d681ff6fb881ceb604716be82ea09"},{url:"assets/css/fonts/ionicons.ttf@v=2.0.0",revision:"4ef2992f93232d7b1ddab297e3535554"},{url:"assets/css/fonts/ionicons.woff@v=2.0.0",revision:"6b904d3f305b72195458c6d76a78251e"},{url:"assets/css/ppu.css",revision:"c07dd1727877f23ad989c8f526979544"},{url:"assets/css/src/bootstrap/bootstrap.min.css",revision:"816af0eddd3b4822c2756227c7e7b7ee"},{url:"assets/css/src/ionicons.min.css",revision:"0d6763b67616cb9183f3931313d42971"},{url:"assets/css/src/owl-carousel/owl.carousel.min.css",revision:"f9250ab91f84bfc307cc3f1c2c7160a0"},{url:"assets/css/src/owl-carousel/owl.theme.default.css",revision:"6c830c91a0a08fca0fe883504abc7d2b"},{url:"assets/css/src/owl-carousel/owl.video.play.html",revision:"3d803d00b500c61df67add2a9dec9283"},{url:"assets/css/style.css",revision:"b32d56c84a12a6e0606a2924b6a2cdde"},{url:"assets/img/defaultprofilepic.png",revision:"6ecf43a70b9acdeda0d46c7c7881769a"},{url:"assets/img/getorade350.png",revision:"9a29b4ea021c6cec4f62d7bf6ed44064"},{url:"assets/img/logo-icon.png",revision:"4c0bc9553c99a5f44306ba6c54b0521e"},{url:"assets/img/marlboro.png",revision:"81f7a86f391a663d3e0764d7b3d2d718"},{url:"assets/img/pancitcanton.png",revision:"1d31e44131dbcb2dfee1b682860241ad"},{url:"assets/js/base.js",revision:"6b1215500470cf8f8c6f331323de7d04"},{url:"assets/js/lib/bootstrap.min.js",revision:"4786c9df2ef550f1bb1a1147198d8567"},{url:"assets/js/lib/jquery-3.4.1.min.js",revision:"f832e36068ab203a3f89b1795480d0d7"},{url:"assets/js/lib/popper.min.js",revision:"36affe2ca6cb85233ee7362c5d8b7893"},{url:"assets/js/plugins/jquery-circle-progress/circle-progress.min.js",revision:"c96bb8beaa6eb6a1a13771fadf8169e9"},{url:"assets/js/plugins/owl-carousel/owl.carousel.min.js",revision:"f416f9031fef25ae25ba9756e3eb6978"},{url:"assets/js/signinClient.js",revision:"720dc74de681908d0d19e78681fa1f31"},{url:"assets/js/signinStore.js",revision:"720dc74de681908d0d19e78681fa1f31"},{url:"bootstrap-4.3.1-dist/css/blog.css",revision:"7980b518cd042d4bcf6fd2e8451201a3"},{url:"bootstrap-4.3.1-dist/css/bootstrap-grid.css",revision:"59e3488e09a8bc96de5884586f3c67ec"},{url:"bootstrap-4.3.1-dist/css/bootstrap-grid.min.css",revision:"7aba9868c6ffadaf2c45d1bafe86d2c3"},{url:"bootstrap-4.3.1-dist/css/bootstrap-reboot.css",revision:"b53d1eaf9daeab26f2772281ae060120"},{url:"bootstrap-4.3.1-dist/css/bootstrap-reboot.min.css",revision:"220e4dc01283a9e9c5c146f984eb8934"},{url:"bootstrap-4.3.1-dist/css/bootstrap.css",revision:"bd551f56ce2be3eba2812e605ab4f5b2"},{url:"bootstrap-4.3.1-dist/css/bootstrap.min.css",revision:"a15c2ac3234aa8f6064ef9c1f7383c37"},{url:"bootstrap-4.3.1-dist/css/carousel.css",revision:"0dc1f0140d5552579595b16276a2221b"},{url:"bootstrap-4.3.1-dist/css/scanner.css",revision:"7e6ad6d1b7551c6a51548ae07af0a42b"},{url:"bootstrap-4.3.1-dist/js/bootstrap.bundle.js",revision:"a9247b1fe21ee409d0b37e74100de687"},{url:"bootstrap-4.3.1-dist/js/bootstrap.bundle.min.js",revision:"a454220fc07088bf1fdd19313b6bfd50"},{url:"bootstrap-4.3.1-dist/js/bootstrap.js",revision:"7f827fe484ec04346553202782b0664b"},{url:"bootstrap-4.3.1-dist/js/bootstrap.min.js",revision:"e1d98d47689e00f8ecbc5d9f61bdb42e"},{url:"bootstrap-4.3.1-dist/js/qrCodeScanner.js",revision:"4c7eaf9ba98c44bc04cf8c64b85d7cd2"},{url:"qrcode-generator/package.json",revision:"ae2b9d790b3bc50bae7d7784d9899cb5"},{url:"qrcode-generator/qrcode_SJIS.js",revision:"76edf0d1634c3000d85611bb7d48ad8b"},{url:"qrcode-generator/qrcode_UTF8.js",revision:"d6dcdaefb395827909ed7984a9819913"},{url:"qrcode-generator/qrcode.d.ts",revision:"6d1aa60a085681af43deec13f57d2198"},{url:"qrcode-generator/qrcode.js",revision:"6e6189e2b177b3d014321edad68fd73c"},{url:"qrcode-generator/README.md",revision:"911346cef02214ac0cffb56eecf58e3d"},{url:"qrcode-generator/sample.html",revision:"db82bd8847103aea4977b072d84a029a"},{url:"qrcode-generator/sample.js",revision:"5ee78e28c87a8c77b2493eeeb605f964"},{url:"qrcode-generator/test/qrcode.js",revision:"b30d2c28e8403ae17c5ec4e21e7f17f7"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
//# sourceMappingURL=service-worker.js.map
