import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
    },
    define: {
      global: {},
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ['import', 'legacy-js-api'],
        },
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://152.67.211.72:18080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        //토스 테스트용 서버 -> 나중에 백엔드 완성되면 바꾸기?
        '/sandbox-dev/api': {
          target: 'http://localhost:4242',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/sandbox-dev\/api/, ''),
        },
      },
    },
  }
})
