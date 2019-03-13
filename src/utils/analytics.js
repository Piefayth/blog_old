function pageview(window, url) {
    if (window.ga && window.ga.getAll) {
        const tracker = window.ga.getAll()[0]
        tracker.set('page', url)
        tracker.set('location', `https://piefayth.github.io/blog${url}`)
        tracker.send('pageview')
    } else {
        setTimeout(() => {
            pageview(window, url)
        }, 500)
    }
}

export { pageview }