import { T as TSS_SERVER_FUNCTION, c as createServerFn, s as setCookie, d as deleteCookie, a as getCookie } from "./index.mjs";
import { createHmac, createHash } from "node:crypto";
import "node:async_hooks";
import "node:stream";
import "../_chunks/_libs/react.mjs";
import "../_chunks/_libs/@tanstack/react-router.mjs";
import "../_libs/tiny-warning.mjs";
import "../_chunks/_libs/@tanstack/router-core.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "node:stream/web";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const env = {
  AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME || "auth_token",
  REFRESH_COOKIE_NAME: process.env.REFRESH_COOKIE_NAME || "refresh_token",
  TOKEN_EXPIRES_COOKIE_NAME: process.env.TOKEN_EXPIRES_COOKIE_NAME || "token_expires_at",
  AUTH_BACKEND: process.env.AUTH_BACKEND || "laravel",
  LARAVEL_API_URL: process.env.LARAVEL_API_URL || "http://localhost:8000",
  BFF_HMAC_SECRET: process.env.BFF_HMAC_SECRET || process.env.BFF_SECRET,
  BFF_ID: process.env.BFF_ID || "tanstack-bff",
  SYMFONY_API_URL: process.env.SYMFONY_API_URL || "http://localhost:8002",
  SYMFONY_AUTH_PREFIX: process.env.SYMFONY_AUTH_PREFIX || "/api/v1/auth",
  NODE_API_URL: process.env.NODE_API_URL || "http://localhost:8003",
  NODE_AUTH_PREFIX: process.env.NODE_AUTH_PREFIX || "/api/v1/auth"
};
const COOKIE_NAMES$2 = {
  ACCESS_TOKEN: env.AUTH_COOKIE_NAME,
  REFRESH_TOKEN: env.REFRESH_COOKIE_NAME,
  TOKEN_EXPIRES_AT: env.TOKEN_EXPIRES_COOKIE_NAME
};
const TOKEN_CONFIG = {
  ACCESS_TOKEN_MAX_AGE: 60 * 60,
  REFRESH_TOKEN_MAX_AGE: 60 * 60 * 24 * 30
};
const COOKIE_NAMES$1 = COOKIE_NAMES$2;
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
function calculateExpirationTimestamp(expiresIn = TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE) {
  return Math.floor(Date.now() / 1e3) + expiresIn;
}
function formatExpirationForCookie(expiresAt) {
  return new Date(expiresAt * 1e3).toISOString();
}
class AdapterError extends Error {
  constructor(message, statusCode, code, details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = "AdapterError";
  }
  static fromResponse(response, body) {
    let message = `HTTP ${response.status}: ${response.statusText}`;
    let code;
    let details;
    if (body && typeof body === "object") {
      const bodyObj = body;
      message = bodyObj.message || bodyObj.error || message;
      code = bodyObj.code;
      details = bodyObj.errors || bodyObj.details;
    }
    return new AdapterError(message, response.status, code, details);
  }
}
const BASE_COOKIE_CONFIG = {
  secure: true,
  sameSite: "lax",
  path: "/"
};
const COOKIE_NAMES = COOKIE_NAMES$1;
const DEFAULT_TIMEOUT = 3e4;
class BaseAdapter {
  config;
  constructor(config) {
    this.config = { timeout: DEFAULT_TIMEOUT, ...config };
  }
  async makeRequest(method, path, options = {}) {
    const { body, headers = {}, includeAuth = true } = options;
    const url = `${this.config.baseUrl}${path}`;
    const requestHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers
    };
    if (includeAuth) {
      const authHeaders = await this.getAuthHeaders();
      Object.assign(requestHeaders, authHeaders);
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : void 0,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        let errorBody;
        try {
          errorBody = await response.json();
        } catch {
        }
        throw AdapterError.fromResponse(response, errorBody);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) return {};
      const text = await response.text();
      if (!text) return {};
      return JSON.parse(text);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof AdapterError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new AdapterError("Request timeout", 408, "TIMEOUT");
      }
      throw new AdapterError(
        error instanceof Error ? error.message : "Network error",
        0,
        "NETWORK_ERROR"
      );
    }
  }
  async getAuthHeaders() {
    const token = await this.getAccessToken();
    if (token) return { Authorization: `Bearer ${token}` };
    return {};
  }
  async storeTokens(tokens) {
    let expiresIn = tokens.expires_in || TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE;
    if (tokens.access_token) {
      const payload = decodeJwtPayload(tokens.access_token);
      if (payload?.exp) {
        const now = Math.floor(Date.now() / 1e3);
        expiresIn = Math.max(payload.exp - now, 0);
      }
    }
    if (tokens.access_token) {
      setCookie(COOKIE_NAMES.ACCESS_TOKEN, tokens.access_token, {
        ...BASE_COOKIE_CONFIG,
        httpOnly: true,
        maxAge: expiresIn
      });
      const expiresAt = calculateExpirationTimestamp(expiresIn);
      setCookie(COOKIE_NAMES.TOKEN_EXPIRES_AT, formatExpirationForCookie(expiresAt), {
        ...BASE_COOKIE_CONFIG,
        httpOnly: false,
        maxAge: expiresIn
      });
    }
    if (tokens.refresh_token) {
      setCookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refresh_token, {
        ...BASE_COOKIE_CONFIG,
        httpOnly: true,
        maxAge: TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE
      });
    }
  }
  async clearTokens() {
    deleteCookie(COOKIE_NAMES.ACCESS_TOKEN);
    deleteCookie(COOKIE_NAMES.REFRESH_TOKEN);
    deleteCookie(COOKIE_NAMES.TOKEN_EXPIRES_AT);
  }
  async getAccessToken() {
    return getCookie(COOKIE_NAMES.ACCESS_TOKEN) ?? null;
  }
  async getRefreshToken() {
    return getCookie(COOKIE_NAMES.REFRESH_TOKEN) ?? null;
  }
}
const BFF_SECRET = process.env.BFF_HMAC_SECRET || "";
const BFF_ID = process.env.BFF_ID || "tanstack-bff";
function ensureHmacConfigured() {
  if (!BFF_SECRET) {
    throw new Error("BFF_HMAC_SECRET environment variable is not set");
  }
}
function hashBody(body) {
  if (!body) return "";
  const normalized = sortObjectKeys(body);
  const jsonString = JSON.stringify(normalized, (_key, value) => {
    if (typeof value === "number" && Number.isInteger(value)) return value;
    return value;
  }, 0);
  const compactJson = jsonString.replace(/\s/g, "");
  return createHash("sha256").update(compactJson, "utf8").digest("hex");
}
function sortObjectKeys(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  const sorted = Object.keys(obj).sort().reduce((acc, key) => {
    acc[key] = sortObjectKeys(obj[key]);
    return acc;
  }, {});
  return sorted;
}
function generateSignature(method, path, body) {
  ensureHmacConfigured();
  const timestamp = Math.floor(Date.now() / 1e3).toString();
  const bodyHash = hashBody(body);
  const payload = `${timestamp}:${method}:${path}:${bodyHash}`;
  const signature = createHmac("sha256", BFF_SECRET).update(payload, "utf8").digest("hex");
  const headers = {
    "X-BFF-Id": BFF_ID,
    "X-BFF-Timestamp": timestamp,
    "X-BFF-Signature": signature
  };
  let normalizedBody;
  if (body !== null && body !== void 0) {
    const normalized = sortObjectKeys(body);
    normalizedBody = JSON.stringify(normalized);
  }
  return { ...headers, normalizedBody };
}
function transformUser$2(laravelUser) {
  return {
    id: laravelUser.id,
    email: laravelUser.email,
    name: laravelUser.name,
    email_verified_at: laravelUser.email_verified_at,
    avatar_url: laravelUser.avatar_url ?? null,
    created_at: laravelUser.created_at,
    updated_at: laravelUser.updated_at,
    roles: laravelUser.roles?.map((r) => ({ id: r.id, name: r.name, slug: r.slug })),
    permissions: laravelUser.permissions?.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      resource: p.resource,
      action: p.action
    }))
  };
}
function transformAuthResponse$2(response) {
  const tokens = {
    access_token: response.data.access_token,
    token_type: response.data.token_type || "Bearer",
    expires_in: response.data.expires_in
  };
  return { user: transformUser$2(response.data.user), tokens };
}
function transformMeResponse$2(response) {
  return transformUser$2(response.data);
}
function transformOAuthProviders$2(response) {
  return response.data;
}
function transformOAuthRedirect$2(response) {
  return response.data.redirect_url;
}
const ENDPOINTS$1 = {
  LOGIN: "/api/v1/auth/login",
  REGISTER: "/api/v1/auth/register",
  LOGOUT: "/api/v1/auth/logout",
  REFRESH: "/api/v1/auth/refresh",
  ME: "/api/v1/me",
  OAUTH_PROVIDERS: "/api/v1/auth/providers",
  OAUTH_REDIRECT: (provider) => `/api/v1/auth/${provider}/redirect`
};
class LaravelAdapter extends BaseAdapter {
  config;
  constructor(config = {}) {
    const fullConfig = {
      baseUrl: process.env.LARAVEL_API_URL || "http://localhost:8000",
      timeout: 3e4,
      secret: config.secret || BFF_SECRET,
      bffId: config.bffId || BFF_ID,
      ...config
    };
    super(fullConfig);
    this.config = fullConfig;
  }
  async makeRequest(method, path, options = {}) {
    const { body, headers = {}, includeAuth = true } = options;
    const { normalizedBody, ...hmacHeaders } = generateSignature(method, path, body);
    const url = `${this.config.baseUrl}${path}`;
    const requestHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...hmacHeaders,
      ...headers
    };
    if (includeAuth) {
      const token = await this.getAccessToken();
      if (token) requestHeaders["Authorization"] = `Bearer ${token}`;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: normalizedBody,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        let errorBody;
        try {
          errorBody = await response.json();
        } catch {
        }
        throw AdapterError.fromResponse(response, errorBody);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) return {};
      const text = await response.text();
      if (!text) return {};
      return JSON.parse(text);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof AdapterError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new AdapterError("Request timeout", 408, "TIMEOUT");
      }
      throw new AdapterError(
        error instanceof Error ? error.message : "Network error",
        0,
        "NETWORK_ERROR"
      );
    }
  }
  async login(credentials) {
    const response = await this.makeRequest("POST", ENDPOINTS$1.LOGIN, { body: credentials, includeAuth: false });
    const authResponse = transformAuthResponse$2(response);
    await this.storeTokens(authResponse.tokens);
    return authResponse;
  }
  async register(data) {
    const response = await this.makeRequest("POST", ENDPOINTS$1.REGISTER, { body: data, includeAuth: false });
    const authResponse = transformAuthResponse$2(response);
    await this.storeTokens(authResponse.tokens);
    return authResponse;
  }
  async logout() {
    try {
      await this.makeRequest("POST", ENDPOINTS$1.LOGOUT);
    } finally {
      await this.clearTokens();
    }
  }
  async refresh(request) {
    const refreshToken = request?.refresh_token || await this.getRefreshToken();
    const response = await this.makeRequest("POST", ENDPOINTS$1.REFRESH, {
      body: refreshToken ? { refresh_token: refreshToken } : void 0
    });
    const authResponse = transformAuthResponse$2(response);
    await this.storeTokens(authResponse.tokens);
    return authResponse;
  }
  async getUser() {
    try {
      const response = await this.makeRequest("GET", ENDPOINTS$1.ME);
      return transformMeResponse$2(response);
    } catch (error) {
      if (error instanceof AdapterError && (error.statusCode === 401 || error.statusCode === 403)) {
        return null;
      }
      throw error;
    }
  }
  async getOAuthProviders() {
    const response = await this.makeRequest(
      "GET",
      ENDPOINTS$1.OAUTH_PROVIDERS,
      { includeAuth: false }
    );
    return transformOAuthProviders$2(response);
  }
  async getOAuthUrl(provider) {
    const response = await this.makeRequest(
      "GET",
      ENDPOINTS$1.OAUTH_REDIRECT(provider),
      { includeAuth: false }
    );
    return transformOAuthRedirect$2(response);
  }
}
function transformUser$1(symfonyUser) {
  const roles = symfonyUser.roles?.map((role, index) => ({
    id: index + 1,
    name: role.replace("ROLE_", "").toLowerCase(),
    slug: role.replace("ROLE_", "").toLowerCase()
  }));
  return {
    id: symfonyUser.id,
    email: symfonyUser.email,
    name: symfonyUser.name,
    email_verified_at: symfonyUser.email_verified_at ?? null,
    avatar_url: symfonyUser.avatar_url ?? null,
    created_at: symfonyUser.created_at,
    updated_at: symfonyUser.updated_at,
    roles,
    permissions: []
  };
}
function transformAuthResponse$1(response) {
  const tokens = {
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    token_type: response.token_type || "Bearer",
    expires_in: response.expires_in
  };
  return { user: transformUser$1(response.user), tokens };
}
function transformMeResponse$1(response) {
  const user = "user" in response ? response.user : response;
  return transformUser$1(user);
}
function transformOAuthProviders$1(response) {
  if (Array.isArray(response)) return response;
  return response.providers;
}
function transformOAuthRedirect$1(response) {
  if ("url" in response) return response.url;
  return response.redirect_url;
}
const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  ME: "/auth/me",
  OAUTH_PROVIDERS: "/auth/oauth/providers",
  OAUTH_REDIRECT: (provider) => `/auth/oauth/${provider}/redirect`
};
class SymfonyAdapter extends BaseAdapter {
  constructor(config = {}) {
    const fullConfig = {
      baseUrl: process.env.SYMFONY_API_URL || "http://localhost:8002",
      timeout: 3e4,
      ...config
    };
    super(fullConfig);
  }
  async login(credentials) {
    const response = await this.makeRequest("POST", ENDPOINTS.LOGIN, { body: credentials, includeAuth: false });
    const authResponse = transformAuthResponse$1(response);
    await this.storeTokens(authResponse.tokens);
    return authResponse;
  }
  async register(data) {
    const registrationData = {
      name: data.name,
      email: data.email,
      password: data.password
    };
    const response = await this.makeRequest("POST", ENDPOINTS.REGISTER, { body: registrationData, includeAuth: false });
    const authResponse = transformAuthResponse$1(response);
    await this.storeTokens(authResponse.tokens);
    return authResponse;
  }
  async logout() {
    try {
      await this.makeRequest("POST", ENDPOINTS.LOGOUT);
    } finally {
      await this.clearTokens();
    }
  }
  async refresh(request) {
    const refreshToken = request?.refresh_token || await this.getRefreshToken();
    if (!refreshToken) throw new AdapterError("No refresh token available", 401, "NO_REFRESH_TOKEN");
    const response = await this.makeRequest("POST", ENDPOINTS.REFRESH, { body: { refresh_token: refreshToken }, includeAuth: false });
    const authResponse = transformAuthResponse$1(response);
    await this.storeTokens(authResponse.tokens);
    return authResponse;
  }
  async getUser() {
    try {
      const response = await this.makeRequest("GET", ENDPOINTS.ME);
      return transformMeResponse$1(response);
    } catch (error) {
      if (error instanceof AdapterError && (error.statusCode === 401 || error.statusCode === 403)) return null;
      throw error;
    }
  }
  async getOAuthProviders() {
    try {
      const response = await this.makeRequest(
        "GET",
        ENDPOINTS.OAUTH_PROVIDERS,
        { includeAuth: false }
      );
      return transformOAuthProviders$1(response);
    } catch {
      return [];
    }
  }
  async getOAuthUrl(provider) {
    const response = await this.makeRequest(
      "GET",
      ENDPOINTS.OAUTH_REDIRECT(provider),
      { includeAuth: false }
    );
    return transformOAuthRedirect$1(response);
  }
}
function transformUser(nodeUser) {
  const roles = nodeUser.roles?.map((role, index) => {
    if (typeof role === "string") return { id: index + 1, name: role.replace("ROLE_", "").toLowerCase(), slug: role.replace("ROLE_", "").toLowerCase() };
    return role;
  });
  const permissions = nodeUser.permissions?.map((perm, index) => {
    if (typeof perm === "string") {
      const [resource, action] = perm.split(":");
      return { id: index + 1, name: perm, slug: perm, resource: resource || perm, action: action || "read" };
    }
    return perm;
  });
  return {
    id: nodeUser.id,
    email: nodeUser.email,
    name: nodeUser.name,
    email_verified_at: nodeUser.emailVerifiedAt ?? nodeUser.email_verified_at ?? null,
    avatar_url: nodeUser.avatarUrl ?? nodeUser.avatar_url ?? null,
    created_at: nodeUser.createdAt ?? nodeUser.created_at,
    updated_at: nodeUser.updatedAt ?? nodeUser.updated_at,
    roles,
    permissions
  };
}
function transformAuthResponse(response) {
  const tokens = {
    access_token: response.accessToken || response.access_token || "",
    refresh_token: response.refreshToken || response.refresh_token,
    token_type: response.tokenType || response.token_type || "Bearer",
    expires_in: response.expiresIn || response.expires_in
  };
  return { user: transformUser(response.user), tokens };
}
function transformMeResponse(response) {
  const user = "user" in response && response.user ? response.user : response;
  return transformUser(user);
}
function transformOAuthProviders(response) {
  if (Array.isArray(response)) return response;
  if ("data" in response) return response.data;
  return response.providers;
}
function transformOAuthRedirect(response) {
  if ("url" in response) return response.url;
  if ("redirectUrl" in response) return response.redirectUrl;
  return response.redirect_url;
}
function buildEndpoints(prefix) {
  return {
    LOGIN: `${prefix}/login`,
    REGISTER: `${prefix}/register`,
    LOGOUT: `${prefix}/logout`,
    REFRESH: `${prefix}/refresh`,
    ME: `${prefix}/me`,
    OAUTH_PROVIDERS: `${prefix}/oauth/providers`,
    OAUTH_REDIRECT: (provider) => `${prefix}/oauth/${provider}/redirect`
  };
}
class NodeAdapter extends BaseAdapter {
  config;
  endpoints;
  constructor(config = {}) {
    const fullConfig = {
      baseUrl: process.env.NODE_API_URL || "http://localhost:8003",
      timeout: 3e4,
      authPrefix: config.authPrefix || process.env.NODE_AUTH_PREFIX || "/api/auth",
      ...config
    };
    super(fullConfig);
    this.config = fullConfig;
    this.endpoints = buildEndpoints(this.config.authPrefix);
  }
  async login(credentials) {
    const response = await this.makeRequest("POST", this.endpoints.LOGIN, { body: credentials, includeAuth: false });
    const authResponse = transformAuthResponse(response);
    await this.storeTokens(authResponse.tokens);
    return authResponse;
  }
  async register(data) {
    const response = await this.makeRequest("POST", this.endpoints.REGISTER, { body: data, includeAuth: false });
    const authResponse = transformAuthResponse(response);
    await this.storeTokens(authResponse.tokens);
    return authResponse;
  }
  async logout() {
    try {
      await this.makeRequest("POST", this.endpoints.LOGOUT);
    } finally {
      await this.clearTokens();
    }
  }
  async refresh(request) {
    const refreshToken = request?.refresh_token || await this.getRefreshToken();
    if (!refreshToken) throw new AdapterError("No refresh token available", 401, "NO_REFRESH_TOKEN");
    const response = await this.makeRequest("POST", this.endpoints.REFRESH, {
      body: { refreshToken, refresh_token: refreshToken },
      includeAuth: false
    });
    const authResponse = transformAuthResponse(response);
    await this.storeTokens(authResponse.tokens);
    return authResponse;
  }
  async getUser() {
    try {
      const response = await this.makeRequest("GET", this.endpoints.ME);
      return transformMeResponse(response);
    } catch (error) {
      if (error instanceof AdapterError && (error.statusCode === 401 || error.statusCode === 403)) return null;
      throw error;
    }
  }
  async getOAuthProviders() {
    try {
      const response = await this.makeRequest(
        "GET",
        this.endpoints.OAUTH_PROVIDERS,
        { includeAuth: false }
      );
      return transformOAuthProviders(response);
    } catch {
      return [];
    }
  }
  async getOAuthUrl(provider) {
    const response = await this.makeRequest(
      "GET",
      this.endpoints.OAUTH_REDIRECT(provider),
      { includeAuth: false }
    );
    return transformOAuthRedirect(response);
  }
}
function toUser(normalized) {
  return {
    id: typeof normalized.id === "string" ? parseInt(normalized.id, 10) : normalized.id,
    name: normalized.name,
    email: normalized.email,
    email_verified_at: normalized.email_verified_at ?? null,
    avatar_url: normalized.avatar_url ?? void 0,
    created_at: normalized.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: normalized.updated_at ?? (/* @__PURE__ */ new Date()).toISOString(),
    roles: (normalized.roles ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    })),
    permissions: (normalized.permissions ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      resource: p.resource,
      action: p.action,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }))
  };
}
function getBackendType() {
  const backend = process.env.AUTH_BACKEND || "laravel";
  if (backend !== "laravel" && backend !== "symfony" && backend !== "node") {
    console.warn(`Unknown AUTH_BACKEND "${backend}", defaulting to "laravel"`);
    return "laravel";
  }
  return backend;
}
function getAdapterConfig(backend) {
  switch (backend) {
    case "laravel":
      return {
        baseUrl: process.env.LARAVEL_API_URL || "http://localhost:8000",
        secret: process.env.BFF_HMAC_SECRET || process.env.BFF_SECRET,
        bffId: process.env.BFF_ID
      };
    case "symfony":
      return { baseUrl: process.env.SYMFONY_API_URL || "http://localhost:8002" };
    case "node":
      return {
        baseUrl: process.env.NODE_API_URL || "http://localhost:8003",
        authPrefix: process.env.NODE_AUTH_PREFIX || "/api/auth"
      };
  }
}
let adapterInstance = null;
let lastBackendType = null;
function getAuthAdapter() {
  const backendType = getBackendType();
  if (adapterInstance && lastBackendType === backendType) return adapterInstance;
  const config = getAdapterConfig(backendType);
  switch (backendType) {
    case "laravel":
      adapterInstance = new LaravelAdapter(config);
      break;
    case "symfony":
      adapterInstance = new SymfonyAdapter(config);
      break;
    case "node":
      adapterInstance = new NodeAdapter(config);
      break;
  }
  lastBackendType = backendType;
  return adapterInstance;
}
const loginFn_createServerFn_handler = createServerRpc({
  id: "c833b877e95a830e50a8701ab1f8d7e4ee0d91d0ff26c91b9d2a6d517510dc99",
  name: "loginFn",
  filename: "src/lib/server/auth.ts"
}, (opts) => loginFn.__executeServer(opts));
const loginFn = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(loginFn_createServerFn_handler, async ({
  data
}) => {
  const adapter = getAuthAdapter();
  const response = await adapter.login(data);
  return {
    user: toUser(response.user)
  };
});
const registerFn_createServerFn_handler = createServerRpc({
  id: "45280bcad0cbaef0249b9266840e3e84186ba9c130d7fd65c23401620db41dc9",
  name: "registerFn",
  filename: "src/lib/server/auth.ts"
}, (opts) => registerFn.__executeServer(opts));
const registerFn = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(registerFn_createServerFn_handler, async ({
  data
}) => {
  const adapter = getAuthAdapter();
  const response = await adapter.register(data);
  return {
    user: toUser(response.user)
  };
});
const logoutFn_createServerFn_handler = createServerRpc({
  id: "11187666f1dc17722763bd44c34030ba5781e256f7e5d4089eb6d560714404b9",
  name: "logoutFn",
  filename: "src/lib/server/auth.ts"
}, (opts) => logoutFn.__executeServer(opts));
const logoutFn = createServerFn({
  method: "POST"
}).handler(logoutFn_createServerFn_handler, async () => {
  const adapter = getAuthAdapter();
  await adapter.logout();
  return {
    success: true
  };
});
const getCurrentUserFn_createServerFn_handler = createServerRpc({
  id: "52b278cd5f2cd78059dd8070825943e5d7231514ed87d25bb929795cc5caff4a",
  name: "getCurrentUserFn",
  filename: "src/lib/server/auth.ts"
}, (opts) => getCurrentUserFn.__executeServer(opts));
const getCurrentUserFn = createServerFn({
  method: "GET"
}).handler(getCurrentUserFn_createServerFn_handler, async () => {
  const adapter = getAuthAdapter();
  const normalized = await adapter.getUser();
  if (!normalized) return null;
  return toUser(normalized);
});
const refreshTokenFn_createServerFn_handler = createServerRpc({
  id: "781d51dc057199d9ddf12871dc6144ddd9ec4a84e0b4ba2055cea3a022e3ea89",
  name: "refreshTokenFn",
  filename: "src/lib/server/auth.ts"
}, (opts) => refreshTokenFn.__executeServer(opts));
const refreshTokenFn = createServerFn({
  method: "POST"
}).handler(refreshTokenFn_createServerFn_handler, async () => {
  const adapter = getAuthAdapter();
  const response = await adapter.refresh();
  return {
    user: toUser(response.user)
  };
});
const getOAuthUrlFn_createServerFn_handler = createServerRpc({
  id: "cba48e5dfb9016e9b2d8c03f0636ce8582b3a98d31652ab501f25b9043fab876",
  name: "getOAuthUrlFn",
  filename: "src/lib/server/auth.ts"
}, (opts) => getOAuthUrlFn.__executeServer(opts));
const getOAuthUrlFn = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(getOAuthUrlFn_createServerFn_handler, async ({
  data
}) => {
  const adapter = getAuthAdapter();
  const url = await adapter.getOAuthUrl(data.provider);
  return {
    url
  };
});
export {
  getCurrentUserFn_createServerFn_handler,
  getOAuthUrlFn_createServerFn_handler,
  loginFn_createServerFn_handler,
  logoutFn_createServerFn_handler,
  refreshTokenFn_createServerFn_handler,
  registerFn_createServerFn_handler
};
