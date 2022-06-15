export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'annotech',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      // Twitter
      // Test on: https://cards-dev.twitter.com/validator
      {
        hid: "twitter:card",
        name: "twitter:card",
        content: "summary_large_image"
      },
      {
        hid: "twitter:url",
        name: "twitter:url",
        content: "https://annotech.netlify.app/"
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: "AnnoTech"
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: "Annotations on texts and documents."
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: "https://annotech.netlify.app/social-media.png"
      },

      // Open Graph
      // Test on: https://developers.facebook.com/tools/debug/
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: "AnnoTech"
      },
      { hid: "og:type", property: "og:type", content: "website" },
      {
        hid: "og:url",
        property: "og:url",
        content: "https://annotech.netlify.app/"
      },
      {
        hid: "og:title",
        property: "og:title",
        content: "AnnoTech"
      },
      {
        hid: "og:description",
        property: "og:description",
        content: "Annotations on texts and documents."
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "https://annotech.netlify.app/social-media.png"
      },
      {
        hid: "og:image:secure_url",
        property: "og:image:secure_url",
        content: "https://annotech.netlify.app/social-media.png"
      },
      {
        hid: "og:image:alt",
        property: "og:image:alt",
        content: "AnnoTech"
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'bootstrap-vue/nuxt'
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
      name: "AnnoTech",
      short_name: "AnnoTech",
      description: "Annotations on texts and documents.",
      theme_color: "#222"
    },
    icon: {
      fileName: "app-icon.png"
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  bootstrapVue: {
    // Install the `IconsPlugin` plugin (in addition to `BootstrapVue` plugin)
    icons: true
  }
}
