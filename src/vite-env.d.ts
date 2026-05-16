// Minimal declarations for Vite glob helpers used in this project.
interface ImportMeta {
  glob(pattern: string, options?: { eager?: boolean }): Record<string, any>;
  globEager(pattern: string): Record<string, any>;
}

export {};
