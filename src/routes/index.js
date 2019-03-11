import React from 'react'
import Header from '../components/Header'
import Home from '../components/Home'
import Post from '../components/Post'
import Grid from '@material-ui/core/Grid';
import { HashRouter, Route, Switch } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import styled from '@emotion/styled'
import theme from '../styles/theme'

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: ${theme.palette.background}
`
export const history = createBrowserHistory()

function Routes() {
  return (
    <HashRouter>
      <Container>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/posts/:id" component={Post} />
          </Switch>
      </Container>
    </HashRouter>
  )
}

export default Routes
