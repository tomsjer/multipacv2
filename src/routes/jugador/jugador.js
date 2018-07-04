import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/header/header'
import './jugador.css'
// import PropTypes from 'prop-types'

export class Jugador extends React.Component {
  componentDidMount() {
    setTimeout(() => {

      this.getAvailablePlayers();
    }, 100)
  }
  getAvailablePlayers() {
    fetch('http://192.168.0.122:8080/availablePlayers')
    .then( response => response.json())
    .then( json => console.log(json))
    .catch( err => console.log(err));
  }
  render() {
    return (
      <div>
        <Header></Header>
        <p>Elegi un jugador</p>
        <ul>
          <li>
            <Link to="/jugador/pacman">
              <span  className="jugador-sprite pacman"></span>pacman
            </Link>
          </li>
          <li>
            <Link to="/jugador/rojo">
              <span  className="jugador-sprite rojo"></span>rojo
            </Link>
          </li>
          <li>
            <Link to="/jugador/cian">
              <span  className="jugador-sprite cian"></span>cian
            </Link>
          </li>
          <li>
            <Link to="/jugador/rosa">
              <span  className="jugador-sprite rosa"></span>rosa
            </Link>
          </li>
          <li>
            <Link to="/jugador/naranja">
              <span  className="jugador-sprite naranja"></span>naranja
            </Link>
          </li>
        </ul>
      </div>
    )
  }
}
