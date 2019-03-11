import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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
            'align-self': 'center',
        },
        container: {
            display: 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
            'align-self': 'center',
            padding: 20,
            marginTop: 20,
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
                width: '88%',
            }
        },
        media: {
            height: 300,
            width: '100%',
        },
        postTitle: {
            color: theme.palette.text,
            marginTop: 25,
            marginBottom: 25,
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
            <Card className={classes.container}>
                <CardMedia
                    className={classes.media}
                    image={`/static/media/${post.meta.image}.jpg`}
                />
                <Typography className={classes.postTitle} variant='h2' component="p">
                    { post.meta.title }
                </Typography>
                <ReactMarkdown 
                    source={post.post}
                    className={classes.content}
                    renderers={{
                        code: (node) => {
                            return <p><code className={`prettyprint ${node.language}-html ${classes.code}`}>{ node.value }</code></p>
                        }
                    }}
                />
            </Card>
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