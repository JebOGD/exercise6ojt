import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  modules: ['@ant-design-vue/nuxt',],

  css: ['assets/styles.css'],

  build: {
    transpile: [], 
  },

  devServer: {
    port: 3000, 
  },

  compatibilityDate: '2025-03-24',
});