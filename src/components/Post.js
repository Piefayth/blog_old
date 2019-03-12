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
import env from '../utils/env'

const styles = (theme) => { 
    return {
        code: {
            display: 'block',
            'white-space': 'pre-wrap',
            'word-wrap': 'break-word', 
            padding: '15px'
        },
        inlineCode: {
            'white-space': 'pre-wrap',
            'word-wrap': 'break-word', 
        },
        content: {
            'text-align': 'left',
            'align-self': 'center',
            width: '100%',
            fontFamily: theme.typography.body1Next.fontFamily,
            fontSize: theme.typography.body1Next.fontSize,
            lineHeight: theme.typography.body1Next.lineHeight,
            fontWeight: theme.typography.body1Next.fontWeight,
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
            width: '90%',
            'white-space': 'pre-wrap',
            'word-wrap': 'break-word', 
            [theme.breakpoints.down('xs')]: {
                fontSize: 44,
            }
        },
        postSubtitle: {
            marginTop: 10,
            marginBottom: 25,
        },
        markdownImage: {
            display: 'block',
            width: '80%',
            height: '80%',
        },
        markdownImageContainer: {
            display: 'flex',
            'justify-content': 'center',
            padding: 20,
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
        console.log(this.props.post);
        document.title = this.props.post.meta.title
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
                    image={`${env.url}/media/${post.meta.image}.jpg`}
                />
                <Typography className={classes.postTitle} variant='h2' component="p">
                    { post.meta.title }
                </Typography>

                <Typography className={classes.postSubtitle} variant='h5' component="p">
                    { post.meta.subtitle }
                </Typography>

                <ReactMarkdown 
                    source={post.post}
                    className={classes.content}
                    renderers={{
                        code: (node) => {
                            return <p><code className={`prettyprint ${node.language}-html ${classes.code}`}>{ node.value }</code></p>
                        },
                        inlineCode: (node) => {
                            return <span><code className={classes.inlineCode}>{ node.value }</code></span>
                        },
                        image: (node) => {
                            return (
                                <span className={classes.markdownImageContainer}>
                                    <img className={classes.markdownImage} src={`${env.url}/media/${node.src}.jpg`} alt={node.alt} />
                                </span>
                            )
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