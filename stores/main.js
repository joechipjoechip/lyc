import { defineStore } from 'pinia'

export const useMainStore = defineStore('storedMain', {

		state: () => ({
			gyroIsAllowed: false,
            isMobile: window.matchMedia("(max-width: 667px), (pointer: coarse)").matches,
            isIOS: navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad"),
			menuIsOpen: false
		}),

		actions: {
			setGyroIsAllowed( bool ){
				this.gyroIsAllowed = bool
			},

			
		},

		// @TODO : restablish at true later
		persist: {
			storage: persistedState.localStorage,
		},

	}

)
