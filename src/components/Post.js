import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getPost } from '../actions/posts'
import { withStyles } from '@material-ui/styles';

const styles = {
    code: {
        display: 'block',
        'white-space': 'pre-wrap'
    },
    content: {
        'text-align': 'left',
    }
}

class Post extends Component {
    componentDidMount() {
        const postId = this.props.match.params.id
        this.props.getPost(postId)
    }
    
    render() {
        const { classes, post } = this.props

        return (
            <div>
                <ReactMarkdown 
                    source={post}
                    className={classes.content}
                    renderers={{
                        code: (node) => {
                            return <p><code className={`prettyprint ${node.language}-html ${classes.code}`}> {node.value} </code></p>
                        }
                    }}
                />
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
    classes: PropTypes.object.isRequired,
}

Post.defaultProps = {
    post: "",
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
    getPost
}, dispatch))

const mapStateToProps = (state) => {
    return {
        post: state.posts.post,
    }
}

export default(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Post)))