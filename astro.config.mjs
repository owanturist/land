import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"
import robots from "astro-robots-txt"
import webmanifest from "astro-webmanifest"

// https://astro.build/config
export default defineConfig({
  build: {
    assets: "_assets",
    // always inline stylesheets for better performance
    inlineStylesheets: "always",
  },

  devToolbar: {
    enabled: false,
  },

  prefetch: {
    prefetchAll: true,
  },

  integrations: [
    sitemap(),

    robots({
      host: true,
      policy: [{ userAgent: "*", allow: "/" }],
    }),

    webmanifest({
      name: "",
      short_name: "",
      description: "",

      start_url: "/",
      theme_color: "#000",
      background_color: "#fff",
      display: "minimal-ui",

      icon: "public/favicon.svg",
      icons: [],
    }),

    tailwind({
      nesting: true,
    }),
  ],
})
