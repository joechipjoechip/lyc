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

	// modules: [
	// 	'@vueuse/motion/nuxt',
	// 	'@pinia/nuxt',
	// 	'@pinia-plugin-persistedstate/nuxt'
	// ],

	app: {
		pageTransition: { 
			name: 'page', 
			mode: 'out-in' 
		},
		// layoutTransition: { 
		// 	name: 'layout', 
		// 	mode: 'out-in' 
		// },

		head: {
			htmlAttrs: {
				class: 'dark'
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
