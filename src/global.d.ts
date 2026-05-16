declare module 'react';
declare module 'react-dom';
declare module 'react/jsx-runtime';
declare module 'react/jsx-dev-runtime';
declare module '*.css';
declare module '*.scss';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.webp';
declare module '*.svg';
declare module './index.css';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
