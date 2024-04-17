import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import Components from 'unplugin-vue-components/vite';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@r': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      nodePolyfills(),
      Components({
        dirs: ['src/components'],
        dts: true,
        deep: true,
        include: [/\.vue$/, /\.vue\?vue/],
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/]
      })
    ]
  }
});
