import { useEventListener, useDebounceFn } from "@vueuse/core";
const { $emit } = useNuxtApp()

export function gyroDetection(){
    let gyroIsDetected = false

    if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
        // (optional) Do something before API request prompt.
        gyroIsDetected = true
        return gyroIsDetected
        
    } else {
        console.log( "DeviceMotionEvent is not defined" );
        return gyroIsDetected
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

export function addGyroListeners(){
    useEventListener("devicemotion", (event) => {
        handleDeviceMotion(event)
    })

    const handleDeviceMotion = useDebounceFn((event) => {
        $emit("main-device-motion", event)
    }, 150, { maxWait: 200 })
    
}

