// Global type definitions for better TypeScript support

declare global {
  // Testing environment globals
  var describe: (name: string, fn: () => void) => void;
  var it: (name: string, fn: () => void) => void;
  var test: (name: string, fn: () => void) => void;
  var expect: (value: any) => any;
  var beforeEach: (fn: () => void) => void;
  var afterEach: (fn: () => void) => void;
  var beforeAll: (fn: () => void) => void;
  var afterAll: (fn: () => void) => void;
  var vi: any;

  // Browser API augmentations
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
    IntersectionObserver: any;
    ResizeObserver: any;
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }

  // Performance API
  interface Performance {
    mark(name: string): void;
    measure(name: string, startMark?: string, endMark?: string): void;
    getEntriesByName(name: string, type?: string): PerformanceEntry[];
    clearMarks(name?: string): void;
    clearMeasures(name?: string): void;
  }

  // WebSocket global
  var WebSocket: {
    new (url: string, protocols?: string | string[]): WebSocket;
    prototype: WebSocket;
    readonly CLOSED: number;
    readonly CLOSING: number;
    readonly CONNECTING: number;
    readonly OPEN: number;
  };
}

// Module declarations for libraries
declare module 'dompurify' {
  interface Config {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
    FORBID_TAGS?: string[];
    FORBID_ATTR?: string[];
    ADD_TAGS?: string[];
    ADD_ATTR?: string[];
    SANITIZE_DOM?: boolean;
    WHOLE_DOCUMENT?: boolean;
    RETURN_DOM?: boolean;
    RETURN_DOM_FRAGMENT?: boolean;
    RETURN_DOM_IMPORT?: boolean;
    RETURN_TRUSTED_TYPE?: boolean;
    FORCE_BODY?: boolean;
    SANITIZE_NAMED_PROPS?: boolean;
    KEEP_CONTENT?: boolean;
    IN_PLACE?: boolean;
    USE_PROFILES?: { mathMl?: boolean; svg?: boolean; svgFilters?: boolean; html?: boolean };
  }

  function sanitize(dirty: string | Node, config?: Config): string;
  function sanitize(dirty: string | Node, config: Config & { RETURN_DOM_FRAGMENT: true }): DocumentFragment;
  function sanitize(dirty: string | Node, config: Config & { RETURN_DOM: true }): HTMLElement;
  
  function addHook(hook: string, cb: Function): void;
  function removeHook(hook: string): void;
  function removeHooks(hook: string): void;
  function removeAllHooks(): void;

  export = { sanitize, addHook, removeHook, removeHooks, removeAllHooks };
}

declare module 'marked' {
  export interface MarkedOptions {
    gfm?: boolean;
    breaks?: boolean;
    pedantic?: boolean;
    sanitize?: boolean;
    smartLists?: boolean;
    smartypants?: boolean;
    xhtml?: boolean;
    headerIds?: boolean;
    mangle?: boolean;
    silent?: boolean;
    baseUrl?: string;
    headerPrefix?: string;
    langPrefix?: string;
    renderer?: Renderer;
    walkTokens?: (token: Token) => void;
  }

  export interface Renderer {
    heading?: (text: string, level: number, raw: string, slugger: any) => string;
    paragraph?: (text: string) => string;
    link?: (href: string, title: string, text: string) => string;
    image?: (href: string, title: string, text: string) => string;
    code?: (code: string, language: string, escaped: boolean) => string;
    codespan?: (text: string) => string;
    blockquote?: (quote: string) => string;
    list?: (body: string, ordered: boolean, start: number) => string;
    listitem?: (text: string, task: boolean, checked: boolean) => string;
    checkbox?: (checked: boolean) => string;
    table?: (header: string, body: string) => string;
    tablerow?: (content: string) => string;
    tablecell?: (content: string, flags: { header: boolean; align: 'center' | 'left' | 'right' | null }) => string;
    strong?: (text: string) => string;
    em?: (text: string) => string;
    del?: (text: string) => string;
    hr?: () => string;
    br?: () => string;
    text?: (text: string) => string;
  }

  export interface Token {
    type: string;
    raw: string;
    [key: string]: any;
  }

  export function marked(src: string, options?: MarkedOptions): string;
  export function setOptions(options: MarkedOptions): void;
  export { Renderer };
}

export {};