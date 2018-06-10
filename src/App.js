import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Home, Juego, Jugador } from './routes'
import './App.css'

const App = () => (
  <Router>
    <div>
      <Route exact path='/' component={Home} />
      <Route exact path='/jugador' component={Jugador} />
      <Route exact path='/jugador/:tipo' component={Juego} />
    </div>
  </Router>
)

export default App