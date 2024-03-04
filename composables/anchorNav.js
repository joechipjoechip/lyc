const handleAnchorNav = async event => {
    const anchor = event.target.dataset.anchor
    const target = document.body.querySelector(anchor)
    if( target ){
        target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    } else {
        navigateTo({
            path: "/",
            query: {
                anchor
            }
        })
    }
}

export { handleAnchorNav }