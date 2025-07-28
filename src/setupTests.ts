import '@testing-library/jest-dom';

// Add TextEncoder polyfill
class TextEncoderPolyfill {
  encode(str: string): Uint8Array {
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i);
    }
    return arr;
  }
}

// Add TextDecoder polyfill
class TextDecoderPolyfill {
  decode(arr: Uint8Array): string {
    return String.fromCharCode.apply(null, Array.from(arr));
  }
}

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoderPolyfill as any;
}

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoderPolyfill as any;
}

import type { ResizeObserver } from '@juggle/resize-observer';

// Mock ResizeObserver which is not available in jsdom
window.ResizeObserver = class MockResizeObserver implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
window.IntersectionObserver = class MockIntersectionObserver implements IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [0];
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Suppress console errors during tests
console.error = jest.fn();