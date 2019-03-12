import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import theme from '../styles/theme'
import { Helmet } from "react-helmet";

const styles = {
  root: {
    backgroundColor: theme.palette.accent,
  },
  hoverNone: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    }
  },
}

class Header extends Component {
  render() {
    const { classes } = this.props;

    return (
      <AppBar className={classes.root} position="relative" >
        <Toolbar>
          <Link to="/" component={RouterLink} variant="h5" color="inherit" className={classes.hoverNone}>
            { "Piefayth's Devblog" }
          </Link>
        </Toolbar>
      </AppBar>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Header)
