export function useNormalizePosition( baseX, baseY, element ) {
    // Can handle :
    // - HTMLElement : specific element as reference for the compute
    // - empty : general window as reference for the compute

    // The aim of this function is to provide mouse position
    // with this format : [-1, 1] (from -1 to 1)
    // for both x and y

    let normalizedX = 0
    let normalizedY = 0
    const isWindow = !element

    // DO THE MAGIC

    // console.log("element : ", element)
    // console.log("compute in winow")

    if( isWindow ){

        normalizedX = (((baseX +  window.innerWidth / 2) /  window.innerWidth) - 1) * 2

        normalizedY = (((baseY +  window.innerHeight / 2) /  window.innerHeight) - 1) * -2

    } else {
        const { width, height, left, top } = element.getBoundingClientRect()
        // console.log("element.getBoundingClientRect()", element.getBoundingClientRect())
        const goodWidth = width + (left * 2)    

        normalizedX = (((baseX +  goodWidth / 2) /  goodWidth) - 1) * 2
        normalizedY = ((((baseY - top) +  height / 2) /  height) - 1) * -2
    }





    return { normalizedX, normalizedY }

}
