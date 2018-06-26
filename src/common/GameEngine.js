const Logger = require('../utils/logger.js');
const logger = new Logger({
  label: 'gameEngine',
});
const EventEmitter = require('events');
const Player = require('./Player.js');

class GameEngine extends EventEmitter {
  constructor({
    players = {},
    isClient = false,
    isServer = false,
  }) {
    super(null);
    this.players = players;
    this.stepCount = 0;
    this.state = {
      players: this.getPlayers(),
      stepCount: this.stepCount,
    };
    this.isClient = isClient;
    this.isServer = isServer;
    return this;
  }
  start(game) {
    this.emit('gameengine:start');
    
    // El cliente recibe el estado del juego
    if (this.isClient && game) {
      this.players = game.players;
      this.stepCount = game.stepCount;
    }
  }
  step() {
    this.emit('gameengine:prestep');
    this.stepCount++;
    this.state.stepCount++;
    for(const i in this.players) {
      this.players[i].actualizar();
    }
    // logger.log('info', `step: ${this.stepCount}`);
  }
  stop() {
  }
  addPlayer(){}
  removePlayer(){}
  getStatus() {
    return this.status;
  }
  getPlayers() {
    const d = {};
    for(const i in this.players) {
      d[i] = this.players[i].broadcastData();
    }
    return d;
  }
  processInput(input) {
    // logger.log('info', 'Processing input: ', input);
    
    /*----------------------------------------------------*/ 
    // Aca se aplican todos los cambios que estan en la cola
    /*----------------------------------------------------*/ 
    if (this.players[input.playerId]) {
      this.players[input.playerId].emit(input.type, input.input);
    }
  }
}

module.exports = GameEngine;
