// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  app: {
    baseURL: '/', // вместо router.base
    buildAssetsDir: '/_nuxt/' // добавляем это для правильного пути к ассетам
  },

  modules: [
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxtjs/tailwindcss",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Roboto: true,
          "Josefin+Sans": true,
          Lato: [100, 300],
          Raleway: {
            wght: [100, 400],
            ital: [100],
          },
          Inter: "200..700",
          "Crimson Pro": {
            wght: "200..900",
            ital: "200..700",
          },
        },
      },
    ],
  ],

  css: ["~/assets/scss/global.scss"],
  compatibilityDate: "2025-01-17",
  build:{
    // vue-toastification - old commonjs module 
    transpile: ['vue-toastification'],
  }
});