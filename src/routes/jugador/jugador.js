import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/header/header'
import './jugador.css'
// import PropTypes from 'prop-types'

export class Jugador extends React.Component {
  constructor() {
    super()
    this.state = {
      availablePlayers: [],
      players: [
        {
          id: 'pacman',
          nombre: 'PACMAN',
          apodo: 'Akabei',
          disabled: false
        },
        {
          id: 'rojo',
          nombre: 'Oikake',
          apodo: 'Pinky',
          disabled: false
        },
        {
          id: 'rosa',
          nombre: 'Machibuse',
          apodo: '',
          disabled: false
        },
        {
          id: 'naranja',
          nombre: 'Otoboke',
          apodo: 'Guzuta',
          disabled: false
        },
        {
          id: 'cian',
          nombre: 'Kimagure',
          apodo: 'Aosuke',
          disabled: false
        }
      ]
    };
  }
  componentDidMount() {
    setTimeout(() => {

      this.getAvailablePlayers();
    }, 100)
  }
  getAvailablePlayers() {
    fetch('/availablePlayers')
    .then( response => response.json())
    .then( json => {
      this.setState({
        availablePlayers: json,
        players: this.state.players.map(p => {
          p.disabled = json.indexOf(p.id) === -1
          return p;
        })
      })
      console.log(this.state);
    })
    .catch( err => console.log(err));
  }
  render() {
    return (
      <div>
        <Header></Header>
        <p>Elegi un jugador</p>
        <ul>
          { this.state.players.map(p =>
            <li key={ p.id } className={ p.disabled ? 'disabled' : ''}>
              {/* <a href={ 'jugador/' + p.id }> */}
                <Link to={ '/jugador/' + p.id }  onClick={e => p.disabled ? e.preventDefault() : null }>
                  <span  className={ 'jugador-sprite ' + p.id }></span>{ p.apodo }
                </Link>
              {/* </a> */}
            </li>
          )}
          {/* <li>
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
          </li> */}
        </ul>
      </div>
    )
  }
}
