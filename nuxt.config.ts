// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/content",
    "@nuxt/ui",
    "@nuxt/hints",
    "@nuxtjs/supabase",
    "@vee-validate/nuxt",
  ],
  components: [
    { path: "~/components" },
    {
      path: "~/pages/auth/login/components",
      prefix: "AuthLogin",
      extensions: ["vue"],
    },
  ],
  ignore: ["**/pages/**/components/**", "**/pages/**/composables/**"],
  devtools: { enabled: true },
  compatibilityDate: "2024-04-03",
  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/login",
    },
  },
  css: ["~/assets/css/main.css"],
});
