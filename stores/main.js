import { defineStore } from 'pinia'

export const useMainStore = defineStore('storedMain', {

		state: () => ({
            isMobile: window.matchMedia("(max-width: 667px), (pointer: coarse)").matches,
            isIOS: navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad"),
			userWantAudio: true
		}),

		actions: {
			//
			setUserWantAudio( bool ){
				this.userWantAudio = bool
			}
		},

		// persist: true
		// persist: {
		// 	storage: persistedState.sessionStorage,
		// },
	}

)
