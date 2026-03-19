// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/content",
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@vee-validate/nuxt",
    "@pinia/nuxt",
  ],
  components: [
    { path: "~/components" },
    {
      path: "~/pages/auth/login/components",
      prefix: "AuthLogin",
      extensions: ["vue"],
    },
  ],
  devtools: { enabled: true },
  compatibilityDate: "2024-04-03",
  runtimeConfig: {
    public: {
      env: "dev",
    },
  },
  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/login",
    },
  },
  css: ["~/assets/css/main.css"],
});
