function pageview(window, url) {
    if (window.ga) {
        window.ga('set', 'page', url)
        window.ga('send', 'pageview')
    }
}

export { pageview }