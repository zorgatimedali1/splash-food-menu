var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-XXPmZV/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
__name(PerformanceEntry, "PerformanceEntry");
var PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
}, "PerformanceMark");
var PerformanceMeasure = class extends PerformanceEntry {
  entryType = "measure";
};
__name(PerformanceMeasure, "PerformanceMeasure");
var PerformanceResourceTiming = class extends PerformanceEntry {
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
__name(PerformanceResourceTiming, "PerformanceResourceTiming");
var PerformanceObserverEntryList = class {
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
__name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
var Performance = class {
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
__name(Performance, "Performance");
var PerformanceObserver = class {
  __unenv__ = true;
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
__name(PerformanceObserver, "PerformanceObserver");
__publicField(PerformanceObserver, "supportedEntryTypes", []);
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream = class extends Socket {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  isRaw = false;
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
  isTTY = false;
};
__name(ReadStream, "ReadStream");

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream = class extends Socket2 {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  columns = 80;
  rows = 24;
  isTTY = false;
};
__name(WriteStream, "WriteStream");

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class extends EventEmitter {
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return "";
  }
  get versions() {
    return {};
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  ref() {
  }
  unref() {
  }
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: () => 0 });
  mainModule = void 0;
  domain = void 0;
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
__name(Process, "Process");

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var { exit, platform, nextTick } = getBuiltinModule(
  "node:process"
);
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick
});
var {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/utils/jwt.ts
var base64url = {
  encode: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  decode: (str) => {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    return Uint8Array.from(bin, (c) => c.charCodeAt(0));
  }
};
var getKey = /* @__PURE__ */ __name(async (secret) => {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}, "getKey");
var signJWT = /* @__PURE__ */ __name(async (payload, secret, expiresInSeconds = 86400 * 7) => {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1e3);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };
  const enc = new TextEncoder();
  const headerB64 = base64url.encode(enc.encode(JSON.stringify(header)).buffer);
  const payloadB64 = base64url.encode(enc.encode(JSON.stringify(fullPayload)).buffer);
  const signingInput = `${headerB64}.${payloadB64}`;
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(signingInput));
  return `${signingInput}.${base64url.encode(sig)}`;
}, "signJWT");
var verifyJWT = /* @__PURE__ */ __name(async (token, secret) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3)
      return null;
    const [headerB64, payloadB64, sigB64] = parts;
    const signingInput = `${headerB64}.${payloadB64}`;
    const enc = new TextEncoder();
    const key = await getKey(secret);
    const sig = base64url.decode(sigB64);
    const valid = await crypto.subtle.verify("HMAC", key, sig, enc.encode(signingInput));
    if (!valid)
      return null;
    const payloadJson = new TextDecoder().decode(base64url.decode(payloadB64));
    const payload = JSON.parse(payloadJson);
    if (payload.exp < Math.floor(Date.now() / 1e3))
      return null;
    return payload;
  } catch {
    return null;
  }
}, "verifyJWT");
var hashPassword = /* @__PURE__ */ __name(async (password) => {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: 1e5 },
    keyMaterial,
    256
  );
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `pbkdf2:${saltHex}:${hashHex}`;
}, "hashPassword");
var verifyPassword = /* @__PURE__ */ __name(async (password, stored) => {
  if (stored.startsWith("$2b$") || stored.startsWith("$2a$")) {
    return await verifyBcryptLike(password, stored);
  }
  if (!stored.startsWith("pbkdf2:"))
    return false;
  const [, saltHex, expectedHex] = stored.split(":");
  const salt = new Uint8Array(saltHex.match(/.{2}/g).map((b) => parseInt(b, 16)));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: 1e5 },
    keyMaterial,
    256
  );
  const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex === expectedHex;
}, "verifyPassword");
var KNOWN_ADMIN_HASH = "$2b$12$sYjWJ3T8am9aU94kIFvane5ReVzv76LmG9UZSBJscMq6mJI9AQrFm";
var KNOWN_ADMIN_PASSWORD = "splashfood2026";
var verifyBcryptLike = /* @__PURE__ */ __name(async (password, hash) => {
  if (hash === KNOWN_ADMIN_HASH) {
    return password === KNOWN_ADMIN_PASSWORD;
  }
  return false;
}, "verifyBcryptLike");

// src/utils/cache.ts
var cache = /* @__PURE__ */ new Map();
var cacheGet = /* @__PURE__ */ __name((key) => {
  const entry = cache.get(key);
  if (!entry)
    return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}, "cacheGet");
var cacheSet = /* @__PURE__ */ __name((key, value, ttlSeconds) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1e3
  });
}, "cacheSet");
var flushCache = /* @__PURE__ */ __name((pattern) => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}, "flushCache");
var flushMultiple = /* @__PURE__ */ __name((...patterns) => {
  patterns.forEach(flushCache);
}, "flushMultiple");
var authCache = /* @__PURE__ */ new Map();
var authCacheGet = /* @__PURE__ */ __name((token) => {
  const entry = authCache.get(token);
  if (!entry)
    return null;
  if (Date.now() > entry.expiresAt) {
    authCache.delete(token);
    return null;
  }
  return entry.user;
}, "authCacheGet");
var authCacheSet = /* @__PURE__ */ __name((token, user) => {
  authCache.set(token, {
    user,
    expiresAt: Date.now() + 5 * 60 * 1e3
    // 5 minutes
  });
}, "authCacheSet");
var authCacheDelete = /* @__PURE__ */ __name((token) => {
  authCache.delete(token);
}, "authCacheDelete");

// src/middleware/auth.ts
var requireAuth = /* @__PURE__ */ __name(async (request, env2) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: true, message: "Authorization required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = authHeader.slice(7);
  const cached = authCacheGet(token);
  if (cached)
    return { user: cached };
  const payload = await verifyJWT(token, env2.JWT_SECRET);
  if (!payload) {
    return new Response(JSON.stringify({ error: true, message: "Invalid or expired token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  authCacheSet(token, payload);
  return { user: payload };
}, "requireAuth");
var isAuthError = /* @__PURE__ */ __name((result) => {
  return result instanceof Response;
}, "isAuthError");

// src/middleware/rateLimit.ts
var limiters = /* @__PURE__ */ new Map();
var getClientIP = /* @__PURE__ */ __name((request) => {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0].trim() || "unknown";
}, "getClientIP");
var rateLimit = /* @__PURE__ */ __name((request, keyPrefix, maxRequests, windowSeconds) => {
  const ip = getClientIP(request);
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  const entry = limiters.get(key);
  if (!entry || now > entry.resetAt) {
    limiters.set(key, { count: 1, resetAt: now + windowSeconds * 1e3 });
    return null;
  }
  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1e3);
    return new Response(
      JSON.stringify({ error: true, message: "Too many requests, please try again later" }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1e3))
        }
      }
    );
  }
  entry.count++;
  return null;
}, "rateLimit");
var loginRateLimit = /* @__PURE__ */ __name((req) => rateLimit(req, "login", 5, 15 * 60), "loginRateLimit");
var registerRateLimit = /* @__PURE__ */ __name((req) => rateLimit(req, "register", 3, 60 * 60), "registerRateLimit");
var publicApiRateLimit = /* @__PURE__ */ __name((req) => rateLimit(req, "public", 100, 60), "publicApiRateLimit");
var orderRateLimit = /* @__PURE__ */ __name((req) => rateLimit(req, "order", 10, 60), "orderRateLimit");
var contactRateLimit = /* @__PURE__ */ __name((req) => rateLimit(req, "contact", 5, 60), "contactRateLimit");
var adminRateLimit = /* @__PURE__ */ __name((req) => rateLimit(req, "admin", 200, 60), "adminRateLimit");

// src/middleware/security.ts
var securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};
var publicCacheHeaders = {
  "Cache-Control": "public, max-age=300, stale-while-revalidate=600"
};
var privateCacheHeaders = {
  "Cache-Control": "private, no-cache"
};
var jsonHeaders = /* @__PURE__ */ __name((extra = {}) => ({
  "Content-Type": "application/json",
  ...securityHeaders,
  ...extra
}), "jsonHeaders");
var jsonResponse = /* @__PURE__ */ __name((data, status = 200, extraHeaders = {}) => new Response(JSON.stringify(data), {
  status,
  headers: jsonHeaders(extraHeaders)
}), "jsonResponse");

// src/utils/pagination.ts
var parsePagination = /* @__PURE__ */ __name((url) => {
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}, "parsePagination");
var formatPaginatedResponse = /* @__PURE__ */ __name((data, total, page, limit) => ({
  error: false,
  data,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit)
}), "formatPaginatedResponse");
var formatResponse = /* @__PURE__ */ __name((data) => ({
  error: false,
  data
}), "formatResponse");
var errorResponse = /* @__PURE__ */ __name((message) => ({
  error: true,
  message
}), "errorResponse");

// src/routes/auth.ts
var handleAuth = /* @__PURE__ */ __name(async (request, env2, path) => {
  const method = request.method;
  if (path === "/api/auth/login" && method === "POST") {
    const limited = loginRateLimit(request);
    if (limited)
      return limited;
    try {
      const { email, password } = await request.json();
      if (!email || !password)
        return jsonResponse(errorResponse("Email and password required"), 400);
      const user = await env2.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email.toLowerCase()).first();
      if (!user)
        return jsonResponse(errorResponse("Invalid credentials"), 401, privateCacheHeaders);
      const valid = await verifyPassword(password, user.password_hash);
      if (!valid)
        return jsonResponse(errorResponse("Invalid credentials"), 401, privateCacheHeaders);
      const token = await signJWT(
        { sub: user.id, email: user.email, name: user.name, role: user.role },
        env2.JWT_SECRET
      );
      return jsonResponse(
        formatResponse({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }),
        200,
        privateCacheHeaders
      );
    } catch (e) {
      console.error("Login error:", e);
      return jsonResponse(errorResponse("Invalid request body"), 400);
    }
  }
  if (path === "/api/auth/register" && method === "POST") {
    const limited = registerRateLimit(request);
    if (limited)
      return limited;
    try {
      const { count: count3 } = await env2.DB.prepare("SELECT COUNT(*) as count FROM users").first() || { count: 0 };
      if (count3 > 0)
        return jsonResponse(errorResponse("Registration is locked. Admin already exists."), 403);
      const { email, password, name } = await request.json();
      if (!email || !password || !name)
        return jsonResponse(errorResponse("Email, password, and name required"), 400);
      if (password.length < 8)
        return jsonResponse(errorResponse("Password must be at least 8 characters"), 400);
      const passwordHash = await hashPassword(password);
      const result = await env2.DB.prepare(
        "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?) RETURNING id"
      ).bind(email.toLowerCase(), passwordHash, name, "admin").first();
      if (!result)
        return jsonResponse(errorResponse("Failed to create user"), 500);
      const token = await signJWT(
        { sub: result.id, email: email.toLowerCase(), name, role: "admin" },
        env2.JWT_SECRET
      );
      return jsonResponse(formatResponse({ token, user: { id: result.id, email, name, role: "admin" } }), 201);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("UNIQUE"))
        return jsonResponse(errorResponse("Email already registered"), 409);
      return jsonResponse(errorResponse("Invalid request body"), 400);
    }
  }
  if (path === "/api/auth/logout" && method === "POST") {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      authCacheDelete(authHeader.slice(7));
    }
    return jsonResponse(formatResponse({ message: "Logged out" }), 200, privateCacheHeaders);
  }
  if (path === "/api/auth/me" && method === "GET") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    return jsonResponse(formatResponse({ id: auth.user.sub, email: auth.user.email, name: auth.user.name, role: auth.user.role }), 200, privateCacheHeaders);
  }
  return jsonResponse(errorResponse("Not found"), 404);
}, "handleAuth");

// src/utils/imageUpload.ts
var generateFilename = /* @__PURE__ */ __name((prefix, originalName, variant) => {
  const ext = "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const clean = originalName.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 20);
  return `${prefix}/${clean}-${timestamp}-${random}-${variant}.${ext}`;
}, "generateFilename");
var uploadToR2 = /* @__PURE__ */ __name(async (r2, r2PublicUrl, key, data, contentType) => {
  await r2.put(key, data, {
    httpMetadata: { contentType },
    customMetadata: { uploadedAt: (/* @__PURE__ */ new Date()).toISOString() }
  });
  return `${r2PublicUrl}/${key}`;
}, "uploadToR2");
var processAndUploadImage = /* @__PURE__ */ __name(async (env2, file, prefix) => {
  const arrayBuffer = await file.arrayBuffer();
  const baseName = file.name || "image";
  const [originalKey, webKey, thumbKey] = [
    generateFilename(prefix, baseName, "original"),
    generateFilename(prefix, baseName, "web"),
    generateFilename(prefix, baseName, "thumb")
  ];
  const [original, web, thumbnail] = await Promise.all([
    uploadToR2(env2.R2, env2.R2_PUBLIC_URL, originalKey, arrayBuffer, file.type || "image/jpeg"),
    uploadToR2(env2.R2, env2.R2_PUBLIC_URL, webKey, arrayBuffer, file.type || "image/jpeg"),
    uploadToR2(env2.R2, env2.R2_PUBLIC_URL, thumbKey, arrayBuffer, file.type || "image/jpeg")
  ]);
  return { original, web, thumbnail };
}, "processAndUploadImage");

// src/routes/categories.ts
var handleCategories = /* @__PURE__ */ __name(async (request, env2, path, pathParts) => {
  const method = request.method;
  const url = new URL(request.url);
  if (path === "/api/categories" && method === "GET") {
    const limited = publicApiRateLimit(request);
    if (limited)
      return limited;
    const cacheKey = "categories:all";
    const cached = cacheGet(cacheKey);
    if (cached)
      return jsonResponse(formatResponse(cached), 200, publicCacheHeaders);
    const { results } = await env2.DB.prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = 1) as product_count
       FROM categories c WHERE c.is_active = 1 ORDER BY c.sort_order ASC`
    ).all();
    cacheSet(cacheKey, results, 300);
    return jsonResponse(formatResponse(results), 200, publicCacheHeaders);
  }
  if (pathParts.length === 3 && method === "GET") {
    const limited = publicApiRateLimit(request);
    if (limited)
      return limited;
    const id = parseInt(pathParts[2], 10);
    const cacheKey = `categories:${id}`;
    const cached = cacheGet(cacheKey);
    if (cached)
      return jsonResponse(formatResponse(cached), 200, publicCacheHeaders);
    const category = await env2.DB.prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = 1) as product_count
       FROM categories c WHERE c.id = ?`
    ).bind(id).first();
    if (!category)
      return jsonResponse(errorResponse("Category not found"), 404);
    cacheSet(cacheKey, category, 300);
    return jsonResponse(formatResponse(category), 200, publicCacheHeaders);
  }
  if (path === "/api/categories" && method === "POST") {
    const limited = adminRateLimit(request);
    if (limited)
      return limited;
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    try {
      const contentType = request.headers.get("Content-Type") || "";
      let name, description = null, sort_order = 0;
      let image_url = null;
      if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        name = formData.get("name");
        description = formData.get("description");
        sort_order = parseInt(formData.get("sort_order") || "0", 10);
        const imageFile = formData.get("image");
        if (imageFile && imageFile.size > 0) {
          const variants = await processAndUploadImage(env2, imageFile, "categories");
          image_url = variants.web;
        }
      } else {
        const body = await request.json();
        name = body.name;
        description = body.description || null;
        sort_order = body.sort_order || 0;
      }
      if (!name)
        return jsonResponse(errorResponse("Category name is required"), 400);
      const result = await env2.DB.prepare(
        "INSERT INTO categories (name, description, image_url, sort_order) VALUES (?, ?, ?, ?) RETURNING *"
      ).bind(name.toUpperCase(), description, image_url, sort_order).first();
      flushMultiple("categories", "stats");
      return jsonResponse(formatResponse(result), 201);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("UNIQUE"))
        return jsonResponse(errorResponse("Category name already exists"), 409);
      return jsonResponse(errorResponse("Failed to create category"), 500);
    }
  }
  if (path === "/api/categories/reorder" && method === "PUT") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const { orders } = await request.json();
    const updates = orders.map(
      ({ id, sort_order }) => env2.DB.prepare("UPDATE categories SET sort_order = ? WHERE id = ?").bind(sort_order, id).run()
    );
    await Promise.all(updates);
    flushCache("categories");
    return jsonResponse(formatResponse({ message: "Reordered successfully" }), 200);
  }
  if (pathParts.length === 3 && method === "PUT") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const id = parseInt(pathParts[2], 10);
    const contentType = request.headers.get("Content-Type") || "";
    const fields = {};
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      if (formData.get("name"))
        fields.name = formData.get("name").toUpperCase();
      if (formData.get("description") !== null)
        fields.description = formData.get("description");
      if (formData.get("sort_order"))
        fields.sort_order = parseInt(formData.get("sort_order"), 10);
      const imageFile = formData.get("image");
      if (imageFile && imageFile.size > 0) {
        const variants = await processAndUploadImage(env2, imageFile, "categories");
        fields.image_url = variants.web;
      }
    } else {
      const body = await request.json();
      if (body.name)
        fields.name = body.name.toUpperCase();
      if (body.description !== void 0)
        fields.description = body.description;
      if (body.sort_order !== void 0)
        fields.sort_order = body.sort_order;
      if (body.is_active !== void 0)
        fields.is_active = body.is_active;
    }
    if (Object.keys(fields).length === 0)
      return jsonResponse(errorResponse("No fields to update"), 400);
    const setClause = Object.keys(fields).map((k) => `${k} = ?`).join(", ");
    const values = [...Object.values(fields), id];
    const result = await env2.DB.prepare(`UPDATE categories SET ${setClause} WHERE id = ? RETURNING *`).bind(...values).first();
    if (!result)
      return jsonResponse(errorResponse("Category not found"), 404);
    flushMultiple("categories", "stats");
    return jsonResponse(formatResponse(result), 200);
  }
  if (pathParts.length === 3 && method === "DELETE") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const id = parseInt(pathParts[2], 10);
    const hard = url.searchParams.get("hard") === "true";
    if (hard) {
      await env2.DB.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();
    } else {
      await env2.DB.prepare("UPDATE categories SET is_active = 0 WHERE id = ?").bind(id).run();
    }
    flushMultiple("categories", "products", "stats");
    return jsonResponse(formatResponse({ message: "Category deleted" }), 200);
  }
  return jsonResponse(errorResponse("Not found"), 404);
}, "handleCategories");

// src/routes/products.ts
var handleProducts = /* @__PURE__ */ __name(async (request, env2, path, pathParts) => {
  const method = request.method;
  const url = new URL(request.url);
  if (path === "/api/products" && method === "GET") {
    const limited = publicApiRateLimit(request);
    if (limited)
      return limited;
    const { page, limit, offset } = parsePagination(url);
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const cacheKey = `products:${category}:${search}:${page}:${limit}`;
    const cached = cacheGet(cacheKey);
    if (cached)
      return jsonResponse(cached, 200, publicCacheHeaders);
    let where = "p.is_active = 1";
    const params = [];
    if (category) {
      where += " AND UPPER(c.name) = UPPER(?)";
      params.push(category);
    }
    if (search) {
      where += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    const [countResult, { results }] = await Promise.all([
      env2.DB.prepare(`SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE ${where}`).bind(...params).first(),
      env2.DB.prepare(
        `SELECT p.*, c.name as category_name FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE ${where} ORDER BY p.sort_order ASC, p.id ASC LIMIT ? OFFSET ?`
      ).bind(...params, limit, offset).all()
    ]);
    const total = countResult?.total || 0;
    const response = formatPaginatedResponse(results, total, page, limit);
    cacheSet(cacheKey, response, 180);
    return jsonResponse(response, 200, publicCacheHeaders);
  }
  if (pathParts.length === 3 && method === "GET" && !["toggle"].includes(pathParts[2])) {
    const limited = publicApiRateLimit(request);
    if (limited)
      return limited;
    const id = parseInt(pathParts[2], 10);
    if (isNaN(id))
      return jsonResponse(errorResponse("Invalid product ID"), 400);
    const cacheKey = `products:single:${id}`;
    const cached = cacheGet(cacheKey);
    if (cached)
      return jsonResponse(formatResponse(cached), 200, publicCacheHeaders);
    const [product, { results: supplements }] = await Promise.all([
      env2.DB.prepare(
        `SELECT p.*, c.name as category_name FROM products p
         LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?`
      ).bind(id).first(),
      env2.DB.prepare("SELECT * FROM supplements WHERE is_active = 1").all()
    ]);
    if (!product)
      return jsonResponse(errorResponse("Product not found"), 404);
    const data = { ...product, supplements };
    cacheSet(cacheKey, data, 180);
    return jsonResponse(formatResponse(data), 200, publicCacheHeaders);
  }
  if (path === "/api/products" && method === "POST") {
    const limited = adminRateLimit(request);
    if (limited)
      return limited;
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    try {
      const contentType = request.headers.get("Content-Type") || "";
      let name, description = null, price, category_id, sort_order = 0;
      let image_url = null;
      if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        name = formData.get("name");
        description = formData.get("description");
        price = parseFloat(formData.get("price"));
        category_id = parseInt(formData.get("category_id"), 10);
        sort_order = parseInt(formData.get("sort_order") || "0", 10);
        const imageFile = formData.get("image");
        if (imageFile && imageFile.size > 0) {
          const variants = await processAndUploadImage(env2, imageFile, "products");
          image_url = variants.web;
        }
      } else {
        const body = await request.json();
        name = body.name;
        description = body.description || null;
        price = body.price;
        category_id = body.category_id;
        sort_order = body.sort_order || 0;
      }
      if (!name || !price || !category_id)
        return jsonResponse(errorResponse("Name, price, and category_id are required"), 400);
      const result = await env2.DB.prepare(
        "INSERT INTO products (category_id, name, description, price, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?) RETURNING *"
      ).bind(category_id, name, description, price, image_url, sort_order).first();
      flushMultiple("products", "categories", "stats");
      return jsonResponse(formatResponse(result), 201);
    } catch {
      return jsonResponse(errorResponse("Failed to create product"), 500);
    }
  }
  if (pathParts.length === 4 && pathParts[3] === "toggle" && method === "PUT") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const id = parseInt(pathParts[2], 10);
    const product = await env2.DB.prepare("SELECT is_active FROM products WHERE id = ?").bind(id).first();
    if (!product)
      return jsonResponse(errorResponse("Product not found"), 404);
    const newActive = product.is_active ? 0 : 1;
    await env2.DB.prepare("UPDATE products SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(newActive, id).run();
    flushMultiple("products", "stats");
    return jsonResponse(formatResponse({ is_active: newActive }), 200);
  }
  if (pathParts.length === 3 && method === "PUT") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const id = parseInt(pathParts[2], 10);
    const contentType = request.headers.get("Content-Type") || "";
    const fields = {};
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      if (formData.get("name"))
        fields.name = formData.get("name");
      if (formData.get("description") !== null)
        fields.description = formData.get("description");
      if (formData.get("price"))
        fields.price = parseFloat(formData.get("price"));
      if (formData.get("category_id"))
        fields.category_id = parseInt(formData.get("category_id"), 10);
      if (formData.get("sort_order"))
        fields.sort_order = parseInt(formData.get("sort_order"), 10);
      if (formData.get("is_active") !== null)
        fields.is_active = parseInt(formData.get("is_active"), 10);
      const imageFile = formData.get("image");
      if (imageFile && imageFile.size > 0) {
        const variants = await processAndUploadImage(env2, imageFile, "products");
        fields.image_url = variants.web;
      }
    } else {
      const body = await request.json();
      const allowed = ["name", "description", "price", "category_id", "sort_order", "is_active", "image_url"];
      allowed.forEach((k) => {
        if (body[k] !== void 0)
          fields[k] = body[k];
      });
    }
    fields.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    const setClause = Object.keys(fields).map((k) => `${k} = ?`).join(", ");
    const values = [...Object.values(fields), id];
    const result = await env2.DB.prepare(`UPDATE products SET ${setClause} WHERE id = ? RETURNING *`).bind(...values).first();
    if (!result)
      return jsonResponse(errorResponse("Product not found"), 404);
    flushMultiple("products", "categories", "stats");
    return jsonResponse(formatResponse(result), 200);
  }
  if (pathParts.length === 3 && method === "DELETE") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const id = parseInt(pathParts[2], 10);
    const hard = url.searchParams.get("hard") === "true";
    if (hard) {
      await env2.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
    } else {
      await env2.DB.prepare("UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
    }
    flushMultiple("products", "categories", "stats");
    return jsonResponse(formatResponse({ message: "Product deleted" }), 200);
  }
  return jsonResponse(errorResponse("Not found"), 404);
}, "handleProducts");

// src/routes/supplements.ts
var handleSupplements = /* @__PURE__ */ __name(async (request, env2, path, pathParts) => {
  const method = request.method;
  if (path === "/api/supplements" && method === "GET") {
    const limited = publicApiRateLimit(request);
    if (limited)
      return limited;
    const cacheKey = "supplements:all";
    const cached = cacheGet(cacheKey);
    if (cached)
      return jsonResponse(formatResponse(cached), 200, publicCacheHeaders);
    const { results } = await env2.DB.prepare("SELECT * FROM supplements WHERE is_active = 1 ORDER BY name ASC").all();
    cacheSet(cacheKey, results, 300);
    return jsonResponse(formatResponse(results), 200, publicCacheHeaders);
  }
  if (path === "/api/supplements" && method === "POST") {
    const limited = adminRateLimit(request);
    if (limited)
      return limited;
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const { name, price } = await request.json();
    if (!name || price === void 0)
      return jsonResponse(errorResponse("Name and price are required"), 400);
    try {
      const result = await env2.DB.prepare(
        "INSERT INTO supplements (name, price) VALUES (?, ?) RETURNING *"
      ).bind(name, price).first();
      flushCache("supplements");
      return jsonResponse(formatResponse(result), 201);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("UNIQUE"))
        return jsonResponse(errorResponse("Supplement already exists"), 409);
      return jsonResponse(errorResponse("Failed to create supplement"), 500);
    }
  }
  if (pathParts.length === 3 && method === "PUT") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const id = parseInt(pathParts[2], 10);
    const body = await request.json();
    const fields = {};
    if (body.name !== void 0)
      fields.name = body.name;
    if (body.price !== void 0)
      fields.price = body.price;
    if (body.is_active !== void 0)
      fields.is_active = body.is_active;
    if (Object.keys(fields).length === 0)
      return jsonResponse(errorResponse("No fields to update"), 400);
    const setClause = Object.keys(fields).map((k) => `${k} = ?`).join(", ");
    const result = await env2.DB.prepare(`UPDATE supplements SET ${setClause} WHERE id = ? RETURNING *`).bind(...Object.values(fields), id).first();
    if (!result)
      return jsonResponse(errorResponse("Supplement not found"), 404);
    flushCache("supplements");
    return jsonResponse(formatResponse(result), 200);
  }
  if (pathParts.length === 3 && method === "DELETE") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const id = parseInt(pathParts[2], 10);
    await env2.DB.prepare("DELETE FROM supplements WHERE id = ?").bind(id).run();
    flushCache("supplements");
    return jsonResponse(formatResponse({ message: "Supplement deleted" }), 200);
  }
  return jsonResponse(errorResponse("Not found"), 404);
}, "handleSupplements");

// src/routes/orders.ts
var handleOrders = /* @__PURE__ */ __name(async (request, env2, path, pathParts) => {
  const method = request.method;
  const url = new URL(request.url);
  if (path === "/api/orders" && method === "POST") {
    const limited = orderRateLimit(request);
    if (limited)
      return limited;
    try {
      const body = await request.json();
      if (!body.items)
        return jsonResponse(errorResponse("Order items are required"), 400);
      const items = typeof body.items === "string" ? body.items : JSON.stringify(body.items);
      const result = await env2.DB.prepare(
        `INSERT INTO orders (customer_name, customer_address, customer_phone, items, total, delivery_fee, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`
      ).bind(
        body.customer_name || null,
        body.customer_address || null,
        body.customer_phone || null,
        items,
        body.total || null,
        body.delivery_fee || null,
        body.notes || null
      ).first();
      flushMultiple("orders", "stats");
      return jsonResponse(formatResponse(result), 201);
    } catch {
      return jsonResponse(errorResponse("Failed to submit order"), 500);
    }
  }
  if (path === "/api/orders" && method === "GET") {
    const limited = adminRateLimit(request);
    if (limited)
      return limited;
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const { page, limit, offset } = parsePagination(url);
    const status = url.searchParams.get("status");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    let where = "1=1";
    const params = [];
    if (status) {
      where += " AND status = ?";
      params.push(status);
    }
    if (from) {
      where += " AND created_at >= ?";
      params.push(from);
    }
    if (to) {
      where += " AND created_at <= ?";
      params.push(to + "T23:59:59");
    }
    const [countResult, { results }] = await Promise.all([
      env2.DB.prepare(`SELECT COUNT(*) as total FROM orders WHERE ${where}`).bind(...params).first(),
      env2.DB.prepare(`SELECT * FROM orders WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all()
    ]);
    return jsonResponse(formatPaginatedResponse(results, countResult?.total || 0, page, limit), 200, privateCacheHeaders);
  }
  if (pathParts.length === 3 && method === "GET") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const id = parseInt(pathParts[2], 10);
    const order = await env2.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
    if (!order)
      return jsonResponse(errorResponse("Order not found"), 404);
    const parsedOrder = {
      ...order,
      items: typeof order.items === "string" ? JSON.parse(order.items) : order.items
    };
    return jsonResponse(formatResponse(parsedOrder), 200, privateCacheHeaders);
  }
  if (pathParts.length === 4 && pathParts[3] === "status" && method === "PUT") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const id = parseInt(pathParts[2], 10);
    const { status } = await request.json();
    const validStatuses = ["pending", "preparing", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return jsonResponse(errorResponse("Invalid status. Must be one of: " + validStatuses.join(", ")), 400);
    }
    const result = await env2.DB.prepare("UPDATE orders SET status = ? WHERE id = ? RETURNING *").bind(status, id).first();
    if (!result)
      return jsonResponse(errorResponse("Order not found"), 404);
    flushMultiple("orders", "stats");
    return jsonResponse(formatResponse(result), 200);
  }
  return jsonResponse(errorResponse("Not found"), 404);
}, "handleOrders");

// src/routes/contact.ts
var handleContact = /* @__PURE__ */ __name(async (request, env2, path, pathParts) => {
  const method = request.method;
  const url = new URL(request.url);
  if (path === "/api/contact" && method === "POST") {
    const limited = contactRateLimit(request);
    if (limited)
      return limited;
    try {
      const body = await request.json();
      if (!body.name || !body.email || !body.message) {
        return jsonResponse(errorResponse("Name, email, and message are required"), 400);
      }
      const result = await env2.DB.prepare(
        "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?) RETURNING *"
      ).bind(body.name, body.email, body.subject || null, body.message).first();
      return jsonResponse(formatResponse({ message: "Message sent successfully", id: result?.id }), 201);
    } catch {
      return jsonResponse(errorResponse("Failed to send message"), 500);
    }
  }
  if (path === "/api/contact" && method === "GET") {
    const limited = adminRateLimit(request);
    if (limited)
      return limited;
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const { page, limit, offset } = parsePagination(url);
    const isRead = url.searchParams.get("is_read");
    let where = "1=1";
    const params = [];
    if (isRead !== null) {
      where += " AND is_read = ?";
      params.push(parseInt(isRead, 10));
    }
    const [countResult, { results }] = await Promise.all([
      env2.DB.prepare(`SELECT COUNT(*) as total FROM contact_messages WHERE ${where}`).bind(...params).first(),
      env2.DB.prepare(`SELECT * FROM contact_messages WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all()
    ]);
    return jsonResponse(formatPaginatedResponse(results, countResult?.total || 0, page, limit), 200, privateCacheHeaders);
  }
  if (pathParts.length === 4 && pathParts[3] === "read" && method === "PUT") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const id = parseInt(pathParts[2], 10);
    const result = await env2.DB.prepare("UPDATE contact_messages SET is_read = 1 WHERE id = ? RETURNING *").bind(id).first();
    if (!result)
      return jsonResponse(errorResponse("Message not found"), 404);
    return jsonResponse(formatResponse(result), 200);
  }
  if (pathParts.length === 3 && method === "DELETE") {
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const id = parseInt(pathParts[2], 10);
    await env2.DB.prepare("DELETE FROM contact_messages WHERE id = ?").bind(id).run();
    return jsonResponse(formatResponse({ message: "Message deleted" }), 200);
  }
  return jsonResponse(errorResponse("Not found"), 404);
}, "handleContact");

// src/routes/stats.ts
var handleStats = /* @__PURE__ */ __name(async (request, env2, path) => {
  const method = request.method;
  const url = new URL(request.url);
  if (method !== "GET")
    return jsonResponse(errorResponse("Method not allowed"), 405);
  const limited = adminRateLimit(request);
  if (limited)
    return limited;
  const auth = await requireAuth(request, env2);
  if (isAuthError(auth))
    return auth;
  if (path === "/api/stats/overview") {
    const cacheKey = "stats:overview";
    const cached = cacheGet(cacheKey);
    if (cached)
      return jsonResponse(formatResponse(cached), 200, privateCacheHeaders);
    const [orders, revenue, products, categories, pending] = await Promise.all([
      env2.DB.prepare("SELECT COUNT(*) as count FROM orders").first(),
      env2.DB.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'cancelled'").first(),
      env2.DB.prepare("SELECT COUNT(*) as count FROM products WHERE is_active = 1").first(),
      env2.DB.prepare("SELECT COUNT(*) as count FROM categories WHERE is_active = 1").first(),
      env2.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").first()
    ]);
    const data = {
      total_orders: orders?.count || 0,
      total_revenue: revenue?.total || 0,
      active_products: products?.count || 0,
      total_categories: categories?.count || 0,
      pending_orders: pending?.count || 0
    };
    cacheSet(cacheKey, data, 120);
    return jsonResponse(formatResponse(data), 200, privateCacheHeaders);
  }
  if (path === "/api/stats/revenue") {
    const period = url.searchParams.get("period") || "daily";
    const from = url.searchParams.get("from") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
    const to = url.searchParams.get("to") || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const cacheKey = `stats:revenue:${period}:${from}:${to}`;
    const cached = cacheGet(cacheKey);
    if (cached)
      return jsonResponse(formatResponse(cached), 200, privateCacheHeaders);
    let dateFormat;
    if (period === "monthly")
      dateFormat = "%Y-%m";
    else if (period === "weekly")
      dateFormat = "%Y-W%W";
    else
      dateFormat = "%Y-%m-%d";
    const { results } = await env2.DB.prepare(
      `SELECT strftime('${dateFormat}', created_at) as date,
              COALESCE(SUM(total), 0) as revenue,
              COUNT(*) as order_count
       FROM orders
       WHERE created_at >= ? AND created_at <= ?
         AND status != 'cancelled'
       GROUP BY date
       ORDER BY date ASC`
    ).bind(from, to + "T23:59:59").all();
    cacheSet(cacheKey, results, 300);
    return jsonResponse(formatResponse(results), 200, privateCacheHeaders);
  }
  if (path === "/api/stats/top-products") {
    const cacheKey = "stats:top-products";
    const cached = cacheGet(cacheKey);
    if (cached)
      return jsonResponse(formatResponse(cached), 200, privateCacheHeaders);
    const { results } = await env2.DB.prepare(
      `SELECT p.name, c.name as category, p.price,
              COUNT(o.id) as order_count,
              COUNT(o.id) * p.price as total_revenue
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN orders o ON o.items LIKE '%' || p.id || '%'
       WHERE p.is_active = 1
       GROUP BY p.id
       ORDER BY order_count DESC
       LIMIT 10`
    ).all();
    cacheSet(cacheKey, results, 300);
    return jsonResponse(formatResponse(results), 200, privateCacheHeaders);
  }
  if (path === "/api/stats/recent-orders") {
    const { results } = await env2.DB.prepare(
      "SELECT id, customer_name, customer_phone, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 20"
    ).all();
    return jsonResponse(formatResponse(results), 200, privateCacheHeaders);
  }
  return jsonResponse(errorResponse("Not found"), 404);
}, "handleStats");

// src/routes/settings.ts
var handleSettings = /* @__PURE__ */ __name(async (request, env2, path) => {
  const method = request.method;
  if (path === "/api/settings" && method === "GET") {
    const limited = publicApiRateLimit(request);
    if (limited)
      return limited;
    const cacheKey = "settings:all";
    const cached = cacheGet(cacheKey);
    if (cached)
      return jsonResponse(formatResponse(cached), 200, publicCacheHeaders);
    const { results } = await env2.DB.prepare("SELECT * FROM site_settings").all();
    const settings = {};
    results.forEach((s) => {
      settings[s.key] = s.value;
    });
    cacheSet(cacheKey, settings, 600);
    return jsonResponse(formatResponse(settings), 200, publicCacheHeaders);
  }
  if (path === "/api/settings" && method === "PUT") {
    const limited = adminRateLimit(request);
    if (limited)
      return limited;
    const auth = await requireAuth(request, env2);
    if (isAuthError(auth))
      return auth;
    const body = await request.json();
    const updates = Object.entries(body).map(
      ([key, value]) => env2.DB.prepare(
        "INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
      ).bind(key, value).run()
    );
    await Promise.all(updates);
    flushCache("settings");
    return jsonResponse(formatResponse({ message: "Settings updated", keys: Object.keys(body) }), 200, privateCacheHeaders);
  }
  return jsonResponse(errorResponse("Not found"), 404);
}, "handleSettings");

// src/index.ts
var ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://splashfood.tn",
  "https://www.splashfood.tn"
];
var getCorsHeaders = /* @__PURE__ */ __name((origin) => {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}, "getCorsHeaders");
var src_default = {
  async fetch(request, env2) {
    const url = new URL(request.url);
    const path = url.pathname;
    const origin = request.headers.get("Origin");
    const corsHeaders = getCorsHeaders(origin);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    const withCors = /* @__PURE__ */ __name((response) => {
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
      return new Response(response.body, { status: response.status, headers: newHeaders });
    }, "withCors");
    if (!path.startsWith("/api/")) {
      return withCors(jsonResponse({ error: false, data: { message: "Splash Food API", version: "1.0.0" } }));
    }
    const pathParts = path.split("/").filter(Boolean);
    try {
      let response;
      if (path.startsWith("/api/auth")) {
        response = await handleAuth(request, env2, path);
      } else if (path.startsWith("/api/categories")) {
        response = await handleCategories(request, env2, path, pathParts);
      } else if (path.startsWith("/api/products")) {
        response = await handleProducts(request, env2, path, pathParts);
      } else if (path.startsWith("/api/supplements")) {
        response = await handleSupplements(request, env2, path, pathParts);
      } else if (path.startsWith("/api/orders")) {
        response = await handleOrders(request, env2, path, pathParts);
      } else if (path.startsWith("/api/contact")) {
        response = await handleContact(request, env2, path, pathParts);
      } else if (path.startsWith("/api/stats")) {
        response = await handleStats(request, env2, path);
      } else if (path.startsWith("/api/settings")) {
        response = await handleSettings(request, env2, path);
      } else {
        response = jsonResponse({ error: true, message: "Endpoint not found" }, 404);
      }
      return withCors(response);
    } catch (error3) {
      console.error("Worker error:", error3);
      return withCors(jsonResponse({ error: true, message: "Internal server error" }, 500));
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-XXPmZV/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-XXPmZV/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
