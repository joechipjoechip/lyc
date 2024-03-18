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

	modules: [
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
		"nuxt3-lenis"
	],

	// piniaPersistedstate: {
	// 	storage: 'localStorage'
	// },

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
			},

			link: [
				{ rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
				{ rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
				{ rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
				{ rel: "manifest", href: "/site.webmanifest" },
				{ rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
			  ],
			meta: [
				{ property: "og:title", content: "LOOT YOUR CITY | Crypto Treasure Hunt | Augmented Reality Mobile Game" },
				{ property: "og:description", content: "Loot Your City web3 play-to-earn is the next biggest crypto treasure hunt on the blockchain Solana, playable soon on your mobile all over the World. Get your Key NFT now in early access and get in Looters Community." },
				{ property: "og:url", content: "https://www.lootyourcity.com" },
				{ property: "og:image", content: "/images/core/ogbanner.png" },
		
				{ name: "msapplication-TileColor", content: "#da532c" },
				{ name: "theme-color", content: "#ffffff" }
			],

			twitterCard: 'summary_large_image',
			twitterSite: '@lootyourcity',

			title: "LOOT YOUR CITY | Crypto Treasure Hunt | Augmented Reality Mobile Game" ,
			description: "Loot Your City web3 play-to-earn is the next biggest crypto treasure hunt on the blockchain Solana, playable soon on your mobile all over the World. Get your Key NFT now in early access and get in Looters Community.",
		}


	// 	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
	// <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	// <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	// <link rel="manifest" href="/site.webmanifest">
	// <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
	// <meta name="msapplication-TileColor" content="#da532c">
	// <meta name="theme-color" content="#ffffff">

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
