import { resolve } from 'path'
import { loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import { createVitePlugins } from './build/vite'
import { include, exclude } from './build/vite/optimize'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import path from 'path'

// 当前执行node命令时文件夹的地址(工作目录)
const root = process.cwd()

// 路径查找
function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}
// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  let env = {} as any
  const isBuild = command === 'build'
  if (!isBuild) {
    env = loadEnv(process.argv[3] === '--mode' ? process.argv[4] : process.argv[3], root)
  } else {
    env = loadEnv(mode, root)
  }
  console.log(env.VITE_BASE_URL + env.VITE_API_URL, 'asd')
  return {
    root: root,
    // 服务端渲染
    server: {
      // 是否开启 https
      // 端口号
      port: env.VITE_PORT,
      // 本地跨域代理. 目前注释的原因：暂时没有用途，server 端已经支持跨域
      proxy: {
        ['/devs-api']: {
          target: env.VITE_BASE_URL + env.VITE_API_URL,
          changeOrigin: true, // 是否跨域
          rewrite: (path) => path.replace(/^\/devs-api/, '') // 重写路径
        }
      },
      host: '0.0.0.0',
      open: true
      // https: {
      //   cert: fs.readFileSync(path.join(__dirname, 'cert.crt')),
      //   key: fs.readFileSync(path.join(__dirname, 'cert.key'))
      // }
    },
    // 项目使用的vite插件。 单独提取到build/vite/plugin中管理
    plugins: createVitePlugins(),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/variables.scss";',
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
        },
        {
          find: /\@\//,
          replacement: `${pathResolve('src')}/`
        }
      ]
    },
    build: {
      minify: 'terser',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      // brotliSize: false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true'
        }
      },
      rollupOptions: {
        //取消test文件参与打包
      }
    },
    optimizeDeps: { include, exclude },
    define: {
      'import.meta.vitest': 'undefined'
    },
    // @ts-ignore
    test: {
      deps: {
        inline: ['element-plus']
      },
      includeSource: ['src/**/*.{js,ts}'],
      include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
      exclude: [
        'packages/template/*',
        'src/api/**/*.{js,ts}',
        'src/config/**/*.{js,ts}'
      ],
      global: true,
      //模拟浏览器环境
      environment: 'jsdom',
      browser: {
        enabled: false,
        name: 'chrome'
      },
      // root: fileURLToPath(new URL('./', import.meta.url)),
      root: './src',

      //测试报告
      reporters: ['verbose', 'html'],
      //报告输出
      outputFile: {
      },
      // subdir: './cover',
      //测试覆盖率
      coverage: {
        enabled: true,
        provider: 'v8',
        cleanOnRerun: true,
        clean: true,
        reporter: ['html'],
        reportsDirectory: '../tests/cover'
      },
      css: false,
      //依赖element-plus
      server: {
        deps: {
          inline: ['element-plus', 'vue-router', 'vue', 'pinia']
        }
      },
      pool: 'vmThreads',
      sequence: {
        shuffle: true
      }
    }
  }
}
