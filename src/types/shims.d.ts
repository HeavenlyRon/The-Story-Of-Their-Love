// Minimal shims to ease TypeScript checks in the editor for this project.
// These are lightweight and only used to silence missing types during editing.

declare module 'react';
declare module 'react-dom';
declare module 'react/jsx-runtime';
declare module 'react/jsx-dev-runtime';
declare module 'lucide-react';
declare module 'motion/react';

// Provide a very small JSX IntrinsicElements so TSX compiles in editors without @types/react.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
