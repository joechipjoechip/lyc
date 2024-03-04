function disposeScene( scene, renderer ){

    sceneTraverse(scene, o => {
        console.log("disposer action")

        if (o.geometry) {
            o.geometry.dispose();
        }

        if (o.material) {
            if (o.material.length) {
                for (let i = 0; i < o.material.length; ++i) {
                    o.material[i].dispose();
                }
            }
            else {
                o.material.dispose();
            }
        }
    })
    
    
    renderer.forceContextLoss()
    // scene = null;
    // renderer = null;

}

function sceneTraverse(obj, fn){

    if (!obj) return

    fn(obj)

    if (obj.children && obj.children.length > 0) {
        obj.children.forEach(o => {
            sceneTraverse(o, fn)
        })
    }

}

export { disposeScene };