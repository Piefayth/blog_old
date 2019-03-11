import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getPost } from '../actions/posts'
import { withStyles } from '@material-ui/styles';

const styles = (theme) => { 
    return {
        code: {
            display: 'block',
            'white-space': 'pre-wrap',
            padding: '5px'
        },
        content: {
            'text-align': 'left',
            [theme.breakpoints.down('xl')]: {
                width: '60%',
            },
            [theme.breakpoints.down('lg')]: {
                width: '70%',
            },
            [theme.breakpoints.down('md')]: {
                width: '70%',
            },
            [theme.breakpoints.down('sm')]: {
                width: '80%',
            },
            [theme.breakpoints.down('xs')]: {
                width: '95%',
            }
        },
        container: {
            display: 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
        }
    }
}

class Post extends Component {
    componentDidMount() {
        const postId = this.props.match.params.id
        this.props.getPost(postId)
            .then(() => {
                window.PR.prettyPrint()
            })
    }

    componentDidUpdate() {
        window.PR.prettyPrint()
    }
    
    render() {
        const { classes, post } = this.props

        if (!post.post) {
            return null
        }

        return (
            <div className={classes.container}>
                <ReactMarkdown 
                    source={post.post.replace(/\n/g, "\n\n")}
                    className={classes.content}
                    renderers={{
                        code: (node) => {
                            console.log(node)
                            return <p><code className={`prettyprint ${node.language}-html ${classes.code}`}>{node.value ? node.value.replace(/\\n/g, "\n") : null }</code></p>
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
    post: PropTypes.object,
    classes: PropTypes.object.isRequired,
}

Post.defaultProps = {
    post: {},
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