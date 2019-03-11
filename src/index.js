import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store'
import Routes from './routes'
import './styles/globalStyles.css'
import * as serviceWorker from './utils/serviceWorker'
import { ThemeProvider } from '@material-ui/styles';
import theme from './styles/theme'

render(
  <Provider store={configureStore()}>
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
