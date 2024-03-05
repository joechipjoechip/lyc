import { defineStore } from 'pinia'

export const useLocalStorageStore = defineStore('storedLocalStorage', {

		state: () => ({
			gyroIsAllowed: false,
		}),

		actions: {
			setGyroIsAllowed( bool ){
				this.gyroIsAllowed = bool
			},
		},

		persist: true
	}

)
