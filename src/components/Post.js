import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getPost } from '../actions/posts'

class Post extends Component {
    componentDidMount() {
        const postId = this.props.match.params.id
        this.props.getPost(postId)
    }
    
    render() {
        return (
            <div>
                <ReactMarkdown source={this.props.post} />
            </div>
        )
    }
}

Post.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired
    }).isRequired,
    getPost: PropTypes.func.isRequired,
    post: PropTypes.string,
}

Post.defaultProps = {
    post: "",
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
    getPost
}, dispatch))

const mapStateToProps = (state) => {
    // 
    return {
        post: state.posts.post,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)