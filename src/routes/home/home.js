import  React  from 'react'
import { Link} from 'react-router-dom'
import Header from '../../components/header/header'
import './home.css'
// import PropTypes from 'prop-types'

export class Home extends React.Component {
  render() {
    return (
      <div>
        <Header></Header>
        <div className="hero"></div>
        <p>Version multiplayer del famoso juego PACMAN. Todos los derechos del juego estan reservados a NAMCOM. Esto es solo un experimento de tecnologias opensource.</p>
        <button>
          <Link to="/jugador">JUGAR</Link>
        </button>
      </div>
    )
  }
}