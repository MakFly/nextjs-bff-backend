globalThis.__nitro_main__ = import.meta.url;
import { a as NodeResponse, s as serve } from "./_libs/srvx.mjs";
import { d as defineHandler, H as HTTPError, t as toEventHandler, a as defineLazyEventHandler, b as H3Core, c as toRequest } from "./_libs/h3.mjs";
import { d as decodePath, w as withLeadingSlash, a as withoutTrailingSlash, j as joinURL } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import "node:http";
import "node:stream";
import "node:https";
import "node:http2";
import "./_libs/rou3.mjs";
function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled;
  const status = error.status || 500;
  const url = event.url || new URL(event.req.url);
  if (status === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.req.method}] ${url}
`, error);
  }
  const headers2 = {
    "content-type": "application/json",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  if (status === 404 || !event.res.headers.has("cache-control")) {
    headers2["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    status,
    statusText: error.statusText,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status,
    statusText: error.statusText,
    headers: headers2,
    body
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key2, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key2, value);
  }
});
const assets = {
  "/logo192.png": {
    "type": "image/png",
    "etag": '"14e3-f08taHgqf6/O2oRVTsq5tImHdQA"',
    "mtime": "2026-02-16T18:43:27.932Z",
    "size": 5347,
    "path": "../public/logo192.png"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": '"f1e-ESBTjHetHyiokkO0tT/irBbMO8Y"',
    "mtime": "2026-02-16T18:43:27.932Z",
    "size": 3870,
    "path": "../public/favicon.ico"
  },
  "/manifest.json": {
    "type": "application/json",
    "etag": '"1f2-Oqn/x1R1hBTtEjA8nFhpBeFJJNg"',
    "mtime": "2026-02-16T18:43:27.932Z",
    "size": 498,
    "path": "../public/manifest.json"
  },
  "/noise.svg": {
    "type": "image/svg+xml",
    "etag": '"112-Hz32ZH6UgYnCNGcwq276pOvZMBI"',
    "mtime": "2026-02-16T18:43:27.932Z",
    "size": 274,
    "path": "../public/noise.svg"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": '"43-BEzmj4PuhUNHX+oW9uOnPSihxtU"',
    "mtime": "2026-02-16T18:43:27.932Z",
    "size": 67,
    "path": "../public/robots.txt"
  },
  "/logo512.png": {
    "type": "image/png",
    "etag": '"25c0-RpFfnQJpTtSb/HqVNJR2hBA9w/4"',
    "mtime": "2026-02-16T18:43:27.932Z",
    "size": 9664,
    "path": "../public/logo512.png"
  },
  "/assets/_auth-CJ3Iw4n4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"132-6UDJGHKbM1zghct2NMkkKkffuls"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 306,
    "path": "../public/assets/_auth-CJ3Iw4n4.js"
  },
  "/assets/badge-9VZOtbEA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"575-llGt/+O++J6z/CSrfpxVxikeJNc"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 1397,
    "path": "../public/assets/badge-9VZOtbEA.js"
  },
  "/tanstack-word-logo-white.svg": {
    "type": "image/svg+xml",
    "etag": '"3a9a-9TQFm/pN8AZe1ZK0G1KyCEojnYg"',
    "mtime": "2026-02-16T18:43:27.932Z",
    "size": 15002,
    "path": "../public/tanstack-word-logo-white.svg"
  },
  "/assets/WI3NLQMI-TD2Ir34n.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"21a6b-Iby0JCl++XpbhiAkuGGIDC99NaA"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 137835,
    "path": "../public/assets/WI3NLQMI-TD2Ir34n.js"
  },
  "/assets/button-BwYNT9Uz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c25-qCoVqDCC+4vx1F3zuur10pU+v1A"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 3109,
    "path": "../public/assets/button-BwYNT9Uz.js"
  },
  "/assets/card-CVPGixIM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"54b-NfJP+y6/WDxZ9n/B4uO5LdLwkDU"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 1355,
    "path": "../public/assets/card-CVPGixIM.js"
  },
  "/tanstack-circle-logo.png": {
    "type": "image/png",
    "etag": '"40cab-HZ1KcYPs7tRjLe4Sd4g6CwKW+W8"',
    "mtime": "2026-02-16T18:43:27.932Z",
    "size": 265387,
    "path": "../public/tanstack-circle-logo.png"
  },
  "/assets/clsx-B-dksMZM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"176-FAATnZjnCwN/ZZH/TBgLKs+l6Yk"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 374,
    "path": "../public/assets/clsx-B-dksMZM.js"
  },
  "/assets/dashboard-BXKXD7Oq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"80e5-iFfTamEgiu648z/k75xjfW3Z5i8"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 32997,
    "path": "../public/assets/dashboard-BXKXD7Oq.js"
  },
  "/assets/data-table-BrafGsLo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f1f8-ot52sGHc9hfOsKP1DcR1v/Nlkms"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 61944,
    "path": "../public/assets/data-table-BrafGsLo.js"
  },
  "/assets/grain-overlay-DXe8QWd5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fd-j/AkdwOxITKg+liCP5v78ml2YyQ"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 253,
    "path": "../public/assets/grain-overlay-DXe8QWd5.js"
  },
  "/assets/index-BofS-mjq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"158e-s+0nerENlcvzQ1/qCfb/eY20NXo"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 5518,
    "path": "../public/assets/index-BofS-mjq.js"
  },
  "/assets/dropdown-menu-ODS91ksJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"12b8b-oEubNC21j56XPJY8ojusR87Wzfc"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 76683,
    "path": "../public/assets/dropdown-menu-ODS91ksJ.js"
  },
  "/assets/index-Nl42Btqb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"100d-CFGwvNFhyJX8qouJGDp0hhG97+o"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 4109,
    "path": "../public/assets/index-Nl42Btqb.js"
  },
  "/assets/input-CytuY8-H.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"349-cmBMB1ngZnSoyssSmqPy9z/hLY0"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 841,
    "path": "../public/assets/input-CytuY8-H.js"
  },
  "/assets/inter-cyrillic-ext-wght-normal-BOeWTOD4.woff2": {
    "type": "font/woff2",
    "etag": '"6568-cF1iUGbboMFZ8TfnP5HiMgl9II0"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 25960,
    "path": "../public/assets/inter-cyrillic-ext-wght-normal-BOeWTOD4.woff2"
  },
  "/assets/inter-cyrillic-wght-normal-DqGufNeO.woff2": {
    "type": "font/woff2",
    "etag": '"493c-n3Oy9D6jvzfMjpClqox+Zo7ERQQ"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 18748,
    "path": "../public/assets/inter-cyrillic-wght-normal-DqGufNeO.woff2"
  },
  "/assets/inter-greek-ext-wght-normal-DlzME5K_.woff2": {
    "type": "font/woff2",
    "etag": '"2be0-BP5iTzJeB8nLqYAgKpWNi5o1Zm8"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 11232,
    "path": "../public/assets/inter-greek-ext-wght-normal-DlzME5K_.woff2"
  },
  "/assets/inter-greek-wght-normal-CkhJZR-_.woff2": {
    "type": "font/woff2",
    "etag": '"4a34-xor/hj4YNqI52zFecXnUbzQ4Xs4"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 18996,
    "path": "../public/assets/inter-greek-wght-normal-CkhJZR-_.woff2"
  },
  "/assets/inter-vietnamese-wght-normal-CBcvBZtf.woff2": {
    "type": "font/woff2",
    "etag": '"280c-nBythjoDQ0+5wVAendJ6wU7Xz2M"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 10252,
    "path": "../public/assets/inter-vietnamese-wght-normal-CBcvBZtf.woff2"
  },
  "/assets/inter-latin-wght-normal-Dx4kXJAl.woff2": {
    "type": "font/woff2",
    "etag": '"bc80-8R1ym7Ck2DUNLqPQ/AYs9u8tUpg"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 48256,
    "path": "../public/assets/inter-latin-wght-normal-Dx4kXJAl.woff2"
  },
  "/assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2": {
    "type": "font/woff2",
    "etag": '"14c4c-zz61D7IQFMB9QxHvTAOk/Vh4ibQ"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 85068,
    "path": "../public/assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2"
  },
  "/assets/jetbrains-mono-cyrillic-wght-normal-D73BlboJ.woff2": {
    "type": "font/woff2",
    "etag": '"2f4c-WiAGfn140d4QND3ayQWaCHF8rbE"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 12108,
    "path": "../public/assets/jetbrains-mono-cyrillic-wght-normal-D73BlboJ.woff2"
  },
  "/assets/jetbrains-mono-greek-wght-normal-Bw9x6K1M.woff2": {
    "type": "font/woff2",
    "etag": '"232c-Dnz9DhH4c266e6TziU1pxRkV6FY"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 9004,
    "path": "../public/assets/jetbrains-mono-greek-wght-normal-Bw9x6K1M.woff2"
  },
  "/assets/jetbrains-mono-latin-ext-wght-normal-DBQx-q_a.woff2": {
    "type": "font/woff2",
    "etag": '"3b5c-HLF7Wvs2Z1IA1cPRs6jnor8OUQ4"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 15196,
    "path": "../public/assets/jetbrains-mono-latin-ext-wght-normal-DBQx-q_a.woff2"
  },
  "/assets/key-cPJ4hRcn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"103-cr3zFr2hHvkzX+K4I1VchO9Mpsw"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 259,
    "path": "../public/assets/key-cPJ4hRcn.js"
  },
  "/assets/jetbrains-mono-vietnamese-wght-normal-Bt-aOZkq.woff2": {
    "type": "font/woff2",
    "etag": '"1d50-/Re0MyD6BV8h81wBPVijGZH5GBs"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 7504,
    "path": "../public/assets/jetbrains-mono-vietnamese-wght-normal-Bt-aOZkq.woff2"
  },
  "/assets/jetbrains-mono-latin-wght-normal-B9CIFXIH.woff2": {
    "type": "font/woff2",
    "etag": '"9dd4-5yd+cUUhzrXxdMyYebUeD0qml1M"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 40404,
    "path": "../public/assets/jetbrains-mono-latin-wght-normal-B9CIFXIH.woff2"
  },
  "/assets/label-D66ZGY5y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2a6-WU9jxNnwsndH4tFBwBlnyLxCQaI"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 678,
    "path": "../public/assets/label-D66ZGY5y.js"
  },
  "/assets/login-RKvwjEkE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"119e-enEj9Ef1klKgSqPpKTr3Vl0yiyQ"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 4510,
    "path": "../public/assets/login-RKvwjEkE.js"
  },
  "/assets/register-CFaiDbI_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"94f-C58EkE5Lddo/owgvP6OQ7aaTp8M"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 2383,
    "path": "../public/assets/register-CFaiDbI_.js"
  },
  "/assets/roles-DLLlzuRj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a16-YUqJzOt4cCjA7nr0BgKK4FsWTeA"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 2582,
    "path": "../public/assets/roles-DLLlzuRj.js"
  },
  "/assets/separator-BIGHRl-2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"32b-HTMg5wwEVLfGkq6Lfye002CP8SY"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 811,
    "path": "../public/assets/separator-BIGHRl-2.js"
  },
  "/assets/settings-QQOT96rF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8bd-wmFDtW4D2ZSlrFwt/9O1+DMCBu4"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 2237,
    "path": "../public/assets/settings-QQOT96rF.js"
  },
  "/assets/shield-CVuYXMl2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10b-XZAn01lYhS2rGQMPCq9opZc+CoA"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 267,
    "path": "../public/assets/shield-CVuYXMl2.js"
  },
  "/assets/theme-toggle-66MmkioU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8a6-JUDZu+QJrgoQfuBecbQCVZHIip8"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 2214,
    "path": "../public/assets/theme-toggle-66MmkioU.js"
  },
  "/assets/users-DfkdM8o_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a4f-ZU57NIjA+xg5j6Pk0j3TmDHrSzo"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 2639,
    "path": "../public/assets/users-DfkdM8o_.js"
  },
  "/assets/utils-C8hxLmZ_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6ce5-ddLxlcQFpycshQT5/z5dSrnG5b8"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 27877,
    "path": "../public/assets/utils-C8hxLmZ_.js"
  },
  "/assets/styles-CVAkwXKd.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"2450b-Ov/aogDKr/BPVfDgTv/nApGOZZI"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 148747,
    "path": "../public/assets/styles-CVAkwXKd.css"
  },
  "/assets/main-6Nm7VAMW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"62cce-5odxwepwOnhLwPDz19bkjGCgWp4"',
    "mtime": "2026-02-16T18:43:28.284Z",
    "size": 404686,
    "path": "../public/assets/main-6Nm7VAMW.js"
  }
};
function readAsset(id) {
  const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
  return promises.readFile(resolve(serverDir, assets[id].path));
}
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
function getAsset(id) {
  return assets[id];
}
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
  gzip: ".gz",
  br: ".br"
};
const _vaGd_i = defineHandler((event) => {
  if (event.req.method && !METHODS.has(event.req.method)) {
    return;
  }
  let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
  let asset;
  const encodingHeader = event.req.headers.get("accept-encoding") || "";
  const encodings = [...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
  if (encodings.length > 1) {
    event.res.headers.append("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.res.headers.delete("Cache-Control");
      throw new HTTPError({ status: 404 });
    }
    return;
  }
  const ifNotMatch = event.req.headers.get("if-none-match") === asset.etag;
  if (ifNotMatch) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  const ifModifiedSinceH = event.req.headers.get("if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  if (asset.type) {
    event.res.headers.set("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.headers.has("ETag")) {
    event.res.headers.set("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.headers.has("Last-Modified")) {
    event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.res.headers.has("Content-Encoding")) {
    event.res.headers.set("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.res.headers.has("Content-Length")) {
    event.res.headers.set("Content-Length", asset.size.toString());
  }
  return readAsset(id);
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/");
    s.length - 1;
    if (s[1] === "assets") {
      r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
    }
    return r;
  };
})();
const _lazy_rSoCuW = defineLazyEventHandler(() => Promise.resolve().then(function() {
  return ssrRenderer$1;
}));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_rSoCuW };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const globalMiddleware = [
  toEventHandler(_vaGd_i)
].filter(Boolean);
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function createNitroApp() {
  const hooks = void 0;
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({
          error,
          context: errorCtx
        });
      }
    }
  };
  const h3App = createH3App({ onError(error, event) {
    return errorHandler(error, event);
  } });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  const app = {
    fetch: appHandler,
    h3: h3App,
    hooks,
    captureError
  };
  return app;
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~middleware"].push(...globalMiddleware);
  {
    h3App["~getMiddleware"] = (event, route) => {
      const pathname = event.url.pathname;
      const method = event.req.method;
      const middleware = [];
      {
        const routeRules = getRouteRules(method, pathname);
        event.context.routeRules = routeRules?.routeRules;
        if (routeRules?.routeRuleMiddleware.length) {
          middleware.push(...routeRules.routeRuleMiddleware);
        }
      }
      middleware.push(...h3App["~middleware"]);
      if (route?.data?.middleware?.length) {
        middleware.push(...route.data.middleware);
      }
      return middleware;
    };
  }
  return h3App;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  for (const rule of Object.values(routeRules)) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
  process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
  process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
const port = Number.parseInt(process.env.NITRO_PORT || process.env.PORT || "") || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
serve({
  port,
  hostname: host,
  tls: cert && key ? {
    cert,
    key
  } : void 0,
  fetch: nitroApp.fetch
});
trapUnhandledErrors();
const nodeServer = {};
function fetchViteEnv(viteEnvName, input, init) {
  const envs = globalThis.__nitro_vite_envs__ || {};
  const viteEnv = envs[viteEnvName];
  if (!viteEnv) {
    throw HTTPError.status(404);
  }
  return Promise.resolve(viteEnv.fetch(toRequest(input, init)));
}
function ssrRenderer({ req }) {
  return fetchViteEnv("ssr", req);
}
const ssrRenderer$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: ssrRenderer
});
export {
  nodeServer as default
};
