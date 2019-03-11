import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

class Post extends Component {
    render() {
        let postId = this.props.match.params.id
        let post = require(`../../posts/${postId}.md`)
        return (
            <div>
                HelloPost {postId}
            </div>
        )
    }
}

export default Post