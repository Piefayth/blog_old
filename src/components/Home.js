import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getPosts } from '../actions/posts'
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom'

const styles = (theme) => { 
    return {
    }
}

class Home extends Component {
    componentDidMount() {
        this.props.getPosts()
    }

    render() {
        const { classes, posts } = this.props;

        return (
            <div>
                {posts.map((post) => {
                    return <p key={`${post.meta.id}`}>{ post.meta.id }. <Link to={`/posts/${post.meta.id}`}> {post.meta.title} </Link> </p>
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