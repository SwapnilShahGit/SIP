import * as path from 'path';

export const ngAppResolve = (resolvePath: string): string => {
  return path.resolve(process.cwd(), resolvePath);
};

export const webpackOutputOptions = {
  colors: true,
  chunks: true,
  modules: false,
  reasons: false,
  chunkModules: false
};

export const webpackDevServerOutputOptions = {
  assets: true,
  colors: true,
  version: true,
  hash: true,
  timings: true,
  chunks: false,
  chunkModules: false
};
