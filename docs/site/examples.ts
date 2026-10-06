import type { ComponentType } from 'react';

// Every file in docs/examples is both rendered live AND shown as source code,
// so the code users copy is exactly the code that runs.
const modules = import.meta.glob<{ default: ComponentType }>('../examples/**/*.tsx', { eager: true });
const sources = import.meta.glob<string>('../examples/**/*.tsx', { eager: true, query: '?raw', import: 'default' });

export interface ExampleModule {
  Component: ComponentType;
  source: string;
}

export function getExample(path: string): ExampleModule | undefined {
  const key = `../examples/${path}.tsx`;
  const mod = modules[key];
  if (!mod) return undefined;
  return { Component: mod.default, source: sources[key] };
}
