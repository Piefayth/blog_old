import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import * as one from '../posts/1.md'

class Post extends Component {
    render() {
        // const postId = this.props.match.params.id
        return (
            <div>
                <ReactMarkdown source={one} />,
            </div>
        )
    }
}

Post.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired
    }).isRequired
}

export default Post