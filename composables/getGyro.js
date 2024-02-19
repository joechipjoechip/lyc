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

export function gyroPermission(){
    let gyroIsAllowed = false

    DeviceMotionEvent.requestPermission()
        .then( response => {
            // (optional) Do something after API prompt dismissed.
            if ( response == "granted" ) {
                gyroIsAllowed = true
            }
            return gyroIsAllowed
        })
        .catch(() => {
            gyroIsAllowed = false
            return gyroIsAllowed
        })
        
}