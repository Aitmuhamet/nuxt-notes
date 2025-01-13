// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: "en", translate: "no" },
    },
  },
  router: {
    base: '/nuxt-notes/',
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
  css: ["~/assets/scss/main.scss"],
});
