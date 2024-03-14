import { defineStore } from 'pinia'

var ua = window.navigator.userAgent;
var iOS = ua.match(/iPad/i) || ua.match(/iPhone/i);
var webkit = ua.match(/WebKit/i);

export const useMainStore = defineStore('storedMain', {

		state: () => ({
            isMobile: window.matchMedia("(max-width: 667px), (pointer: coarse)").matches,
            isIOS: iOS,
			userWantsAudio: false,
			iOSSafari: iOS && webkit && !ua.match(/CriOS/i)
		}),

		actions: {
			//
			setUserWantsAudio( bool ){
				this.userWantsAudio = bool
			}
		},

		// persist: true
		// persist: {
		// 	storage: persistedState.sessionStorage,
		// },
	}

)
