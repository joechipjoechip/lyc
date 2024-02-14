// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	ssr: false,

	css: ['@/assets/styles/main.scss'],

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@import "@/assets/styles/_variables.scss"; @import "@/assets/styles/_base.scss"; @import "@/assets/styles/_mixins.scss";'
				}
			}
		}
	},

	// build: {
	// 	postcss: {
	// 		plugins: {
	// 			'postcss-import': {},
	// 			'postcss-nested': {},
	// 			'postcss-custom-properties': {},
	// 			'autoprefixer': {}
	// 		}
	// 	}
	// },
  
})
