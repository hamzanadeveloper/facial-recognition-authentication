import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import App from './App.jsx'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1eb980',
      dark: '#009c68'
    },
    secondary: {
      main: '#f75500',
      dark: '#e83400',
    }
  },
  overrides: {
    MuiButton: {
      containedPrimary: {
        color: 'white'
      }
    },
    MuiCheckbox: {
      root: {
        padding: 4
      }
    },
    MuiRadio: {
      root: {
        padding: 4
      }
    },
    MuiInputLabel: {
      root: {
        fontSize: 14
      }
    },
    MuiFormControlLabel:{
      root: {
        marginLeft: 0
      },
      label: {
        fontSize: 12
      }
    },
  }
})

ReactDOM.render(
<MuiThemeProvider theme={theme}>
  <App />
  </MuiThemeProvider>,
document.getElementById('app')
)
