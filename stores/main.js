import { defineStore } from 'pinia'

export const useUserStore = defineStore('storedUser',
	{

		state: () => ({
			gyroIsAllowed: false,
            isMobile: window.matchMedia("(max-width: 667px), (pointer: coarse)").matches
		}),

		actions: {
			setGyroIsAllowed( bool ){
				this.gyroIsAllowed = bool
			},

			
		},

		// @TODO : restablish at true later
		// persist: false

	}

)
