import { useEventListener } from "@vueuse/core";
const { $emit } = useNuxtApp()

export function gyroDetection(){

    if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
        // (optional) Do something before API request prompt.
        return true
        
    } else {
        console.log( "DeviceMotionEvent is not defined" );
        return false
    }
}

export async function gyroPermission(){
    return new Promise(res => {

        DeviceMotionEvent.requestPermission()
            .then( response => {
                // (optional) Do something after API prompt dismissed.
                if ( response == "granted" ) {
                    res(true)
                } else {
                    res(false)
                }
            })
            .catch(() => {
                res(false)
            })

    })
}

const handleDeviceMotion = (event) => {
    $emit("main-device-motion", event)
}

export function addGyroListeners(){
    useEventListener("devicemotion", handleDeviceMotion)
}

