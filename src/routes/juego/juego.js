import React from 'react'
import Header from '../../components/header/header'
import ClientEngine from './ClientEngine'
import GameEngine from '../../common/PacmanGameEngine'
import GameRenderer from './PacmanGameRenderer'
import TouchControls from './TouchControls'
import KeyboardControls from './KeyboardControls'
import RandomControls from './RandomControls'
// import PropTypes from 'prop-types'
import './juego.css';

export class Juego extends React.Component {
  constructor( opts ){
    super(opts);

    this.canvas = React.createRef();
    this.state = {
      dirSymbol: ''
    }

    this.loginOpts = {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      // credentials: 'same-origin',
      body: JSON.stringify({
        tipo: this.props.match.params.tipo
      })
    };

    this.gameEngine = new GameEngine({
      isClient: true,
      isServer: false,
      playerVel: 4,
    });
    if (window.location.hash.indexOf('autopilot') !== -1) {
      this.controls = new RandomControls();
    } else if ('ontouchstart' in window) {
      this.initTouchControls();
    } else {
      this.controls = new KeyboardControls();
    }
  }
  initTouchControls() {
    this.controls = new TouchControls();
    this.controls.on('controls:input', e => {
      switch(e.input) {
      case 'IZQUIERDA':
        this.setState({
          dirSymbol: '◁'
        });
        break;
      case 'DERECHA':
        this.setState({
          dirSymbol: '▷'
        });
        break;
      case 'ARRIBA':
        this.setState({
          dirSymbol: '△'
        });
        break;
      case 'ABAJO':
        this.setState({
          dirSymbol: '▽'
        });
        break;
      }
    });
  }
  componentDidMount() {
    /*
    * Initialize app
    *
    */
    this.login(this.loginOpts)
    .then((response) => {
      console.log(response);
      try {
        this.engine = new ClientEngine({
          gameEngine: this.gameEngine,
          updateFrequency: 30,
          controls: this.controls,
          playerTipo: this.props.match.params.tipo,
          gameRenderer: new GameRenderer({
            canvas: this.canvas,
            gameEngine: this.gameEngine,
            // tablero: gameEngine.tablero,
          }),
        });
        console.log(this.engine);
      }
      catch(e) {
        console.error(e);
      }
    });
  }
  /**
  * Fetches a login resource and return a promise.
  *
  * @param {Object} opts Login options such as HTTP methos, credenctials, etc.
  * @return { Promise }
  */
  login(opts) {
    const promise = new Promise((resolve, reject)=>{
      fetch('/login', opts)
      .then((response)=>{
        return response.json().then((json) => resolve(json));
      })
      .catch((err)=>{
        console.log(err);
        reject(err);
      });
    });

    return promise;
  }
  componentWillUnmount() {
    this.engine.ws.ws.close();
    fetch('/logout', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      // credentials: 'same-origin',
      body: JSON.stringify({
        tipo: this.props.match.params.tipo
      })
    })
    .then(response => response.json())
    .catch(err => console.log(err));
  }
  onUpdateRateChange(e) {
    this.engine.ws.send('wss:server:updateRate', { val: e.currentTarget.value });
  }
  onCheckboxChage(e) {
    this.engine.interpolarJugadores = e.currentTarget.checked;
  }
  render() {
    return (
      <div>
        <Header></Header>
        <canvas ref={this.canvas}></canvas>
        <div id="mobile-dir">{this.state.dirSymbol}</div>
        <div id="debug">
          <label htmlFor="broadcastFreq">
            Broadcast freq
            <input type="number" name="broadcastFreq" onBlur={event => this.onUpdateRateChange(event)} />
          </label>
          <label htmlFor="interpolation">
            Interpolation
            <input type="checkbox" onChange={event => this.onCheckboxChage(event)}/>
          </label>
        </div>
      </div>
    )
  }
}