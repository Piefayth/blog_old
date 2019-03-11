
module.exports = {
    loaders: [
        {
            test: /\.md$/,
            loader: 'babel!react-markdown'
        }
    ],
    optimization: {
        minimize: false,
    }
}