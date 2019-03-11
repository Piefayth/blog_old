import React from 'react'
import Header from '../components/Header'
import Home from '../components/Home'
import Post from '../components/Post'
import { HashRouter, Route, Switch } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import styled from '@emotion/styled'

const Container = styled.div`
  text-align: center;
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
