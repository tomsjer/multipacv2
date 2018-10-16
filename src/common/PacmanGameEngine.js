const Logger = require('../utils/logger.js');
const logger = new Logger({
  label: 'PacmanGameEngine',
});
const GameEngine = require('./GameEngine');

const TableroControlador = require('../common/TableroControlador.js');
const estadoGrilla = require('./estadoGrilla.js'); // Traer de db
const Player = require('./Player');
const PacmanPlayer = require('./PacmanPlayer.js');
const GhostPlayer = require('./GhostPlayer.js');

class PacmanGameEngine extends GameEngine {
  constructor(options) {
    super(options);
    logger.log('info', 'Initializing PacmanGameEngine...');

    this.tableroConfig = {
      estadoGrilla: estadoGrilla,
    };
    this.tablero = new TableroControlador(this.tableroConfig);
  }
  start(game) {
    super.start(game);

    // El cliente recibe el juego del server
    if (this.isClient && game) {
      this.stepCount = game.stepCount;
      for(const i in game.players) {
        // Strategy p diff tipo jugador?
        game.players[i].id = i;
        game.players[i].tablero = this.tablero;
        this.players[i] = game.players[i].tipo === 'pacman' ? new PacmanPlayer(game.players[i]) : new GhostPlayer(game.players[i]);
        this.players[i].position_buffer = [];
      }
    }

    // this.state = Object.assign(this.state, {
    //   grilla: this.tablero.estado,
    // });
  }
  step() {
    super.step();
    // nose para que es esto
    this.state = Object.assign(this.state, {
      players: this.getPlayers()
      // grilla: this.tablero.grilla(),
    });
    this.emit('gameengine:poststep');
  }
  addPlayer(opts) {
    if (!opts.tablero) {
      opts.tablero = this.tablero;
    }
    this.players[opts.id] = opts.tipo === 'pacman' ? new PacmanPlayer(opts) : new GhostPlayer(opts);;
    this.players[opts.id].position_buffer = [];
    this.state.players = this.getPlayers();
    logger.log(`addPlayer ${opts.id}`);
  }
  removePlayer(opts) {
    delete this.players[opts.id];
    logger.log(`deletePlayer ${opts.id}`);
  }
}

module.exports = PacmanGameEngine;
