import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { PreRenderedAsset, RenderedChunk } from 'rollup';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tsconfigPaths from 'vite-tsconfig-paths'


let buildconfig = require("./clientbuild.json");
let bundleconfig = buildconfig.bundles;
let modulesconfig = buildconfig.modules;
let modulestyles = buildconfig.styles.modules;
let styleconfig = buildconfig.styles.compile;
let libsconfig = buildconfig.libs;
let environment = process.env.NODE_ENV // Expected "development" or "production";

let isDebug = (mode: string) => mode === "development";

console.log('Running in ' + process.env.NODE_ENV);


// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => ({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2
          }
        }
      },
      style: {

      }
    }),
    vueJsx(),
    tsconfigPaths({
      root: __dirname,
      loose: true
    })
  ],
  resolve: {
    alias: {
      vue: '@vue/compat/dist/vue.esm-bundler.js',
      '@ClientApp': '/ClientApp',
      "@Account": "/Areas/Account/Features",
      "@Tools": "/Areas/Tools/Features",
      "@Portal":"/Features",
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      input: modulesconfig,
      output: {
        dir: 'wwwroot/bundles',
        entryFileNames: '[name].bundle.js',
        assetFileNames: (asset) => {
          return "style/" + asset.name;
        },
        format: 'esm',
        sourcemap: isDebug(mode)
      }
    },
  },
})

)
