import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getPosts } from '../actions/posts'
import { withStyles } from '@material-ui/styles'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import { Helmet } from "react-helmet";
import env from '../utils/env'
import { pageview } from '../utils/analytics'

const styles = (theme) => { 
    return {
        root: {
            flexGrow: 1,
            display: 'flex',
            'flex-wrap': 'wrap',
            'justify-content': 'center',
            'align-self': 'center',
            [theme.breakpoints.down('xl')]: {
                width: '95%',
            },
            [theme.breakpoints.down('lg')]: {
                width: '95%',
            },
            [theme.breakpoints.down('md')]: {
                width: '95%',
            },
            [theme.breakpoints.down('sm')]: {
                width: '95%',
            },
            [theme.breakpoints.down('xs')]: {
                width: '95%',
            },
            marginTop: 20,
        },
        card: {
            [theme.breakpoints.down('xl')]: {
                'flex-basis': '33%',
            },
            [theme.breakpoints.down('lg')]: {
                'flex-basis': '33%',
            },
            [theme.breakpoints.down('md')]: {
                'flex-basis': '50%',
            },
            [theme.breakpoints.down('sm')]: {
                'flex-basis': '100%',
            },
            [theme.breakpoints.down('xs')]: {
                'flex-basis': '100%',
            },
            margin: '5px',
        },
        media: {
            height: 140,
        },
        peek: {
            margin: 25,
            fontFamily: theme.typography.body1Next.fontFamily,
            fontSize: 14,
            fontWeight: theme.typography.body1Next.fontWeight,
            lineHeight: theme.typography.body1Next.lineHeight,
        },
        cardTitle: {
            color: theme.palette.text,
            '&:hover': {
                textDecoration: 'none',
            },
            fontSize: 36,
        },
        cardTitleContainer: {
            margin: 20,
        }
    }
}

class Home extends Component {
    componentDidMount() {
        this.props.getPosts()
        document.title = "Piefayth's Devblog"
        pageview(window, `/`)
    }
    
    render() {
        const { classes, posts } = this.props;

        return (
            <div className={classes.root}>
                <Helmet>
                    <meta name="keywords" content="unity, ecs, unity ecs, game development, gamedev" />
                    <meta name="description" content="A blog (mostly) about game development in Unity." />
                    
                    {posts.map((post, i) => {
                        return (
                            <link rel="canonical" href={`https://piefayth.github.io/blog/#!/posts/${post.meta.id}`} />
                        )
                    })}
                </Helmet>
                {posts.map((post, i) => {
                    return (
                        <Card key={`${post.meta.id}${i + 1}`} className={classes.card}>
                                <CardMedia
                                    className={classes.media}
                                    image={`${env.url}/media/${post.meta.image}.jpg`}
                                />
                            <p className={classes.cardTitleContainer}>
                                <Link to={`/posts/${post.meta.id}`} variant="h2" component={RouterLink} className={classes.cardTitle}> {post.meta.title} </Link>
                            </p>
                            <Typography className={classes.peek} component="p">
                                { post.meta.peek }
                            </Typography>
                        </Card>
                        
                    )
                })}
            </div>
        )
    }
}

Home.propTypes = {
    getPosts: PropTypes.func.isRequired,
    posts: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
}


Home.defaultProps = {
    posts: [],
}

const mapDispatchToProps = (dispatch) => (bindActionCreators({
    getPosts
}, dispatch))

const mapStateToProps = (state) => {
    return {
        posts: state.posts.posts,
    }
}

export default(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home)))