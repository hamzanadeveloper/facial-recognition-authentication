import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import responsive from 'FRS/components/responsive.jsx'
import Login from 'FRS/components/login.jsx'
import Signup from 'FRS/components/signup.jsx'

@responsive
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <Router>
        <div
          style={{
            backgroundImage: 'url("/images/bg-02.jpg")',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <Switch>
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/login' component={Login} />
            <Route path='/' component={Signup} />
          </Switch>
        </div>
      </Router>
    )
  }
}
