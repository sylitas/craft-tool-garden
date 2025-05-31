import { Tool } from '@/types/Tool';

export const toolsData: Tool[] = [];

const capitalizeWords = (str: string) => {
  return str.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

// Use Vite's import.meta.glob to load tool info files at build time
const infoModules: any = import.meta.glob('../tools/*/info.tsx', {
  eager: true,
});

// Process the modules to extract tool data
const tools = Object.keys(infoModules).map((modulePath) => {
  // Extract folder name from path (e.g., '../tools/tool-name/info.tsx' -> 'tool-name')
  const folder = modulePath.split('/').slice(-2)[0];

  // Get the info from the imported module
  const info = infoModules[modulePath].default || {};

  return {
    id: folder,
    name: capitalizeWords(folder),
    ...info,
  };
});

toolsData.push(...(tools as Tool[]));
