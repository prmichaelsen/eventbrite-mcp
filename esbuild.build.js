import * as esbuild from 'esbuild';

const serverBuildOptions = {
  entryPoints: ['src/server.ts'],
  bundle: true,
  outdir: 'dist',
  platform: 'node',
  target: 'node18',
  format: 'esm',
  sourcemap: true,
  external: [
    '@modelcontextprotocol/sdk',
    'dotenv'
  ],
  logLevel: 'info',
  minify: false,
  keepNames: true,
  banner: {
    js: '#!/usr/bin/env node'
  }
};

const indexBuildOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  platform: 'node',
  target: 'node18',
  format: 'esm',
  sourcemap: true,
  external: [
    '@modelcontextprotocol/sdk',
    'dotenv'
  ],
  logLevel: 'info',
  minify: false,
  keepNames: true
};

const factoryBuildOptions = {
  entryPoints: ['src/factory.ts'],
  bundle: true,
  outdir: 'dist',
  platform: 'node',
  target: 'node18',
  format: 'esm',
  sourcemap: true,
  external: [
    '@modelcontextprotocol/sdk',
    'dotenv'
  ],
  logLevel: 'info',
  minify: false,
  keepNames: true
};

async function build() {
  try {
    console.log('Building with esbuild...');
    await esbuild.build(serverBuildOptions);
    await esbuild.build(indexBuildOptions);
    await esbuild.build(factoryBuildOptions);
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
