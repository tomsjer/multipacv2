// http://docs.lance.gg/develop/tutorial-overview_architecture.html
const Logger = require('../src/utils/logger.js');
const logger = new Logger({
  label: 'serverEngine',
});

/**
 * @class ServerEngine
 * @param {Object} options Configuration options object
 */
class ServerEngine {
  constructor(options) {

    if(!options.gameEngine) {
      throw new Error({
        code: 1,
        message: 'No GameEngine passed to ServerEngine',
      });
    }
    /**
     *
     * Connections
     *
     */
    this.wss = options.wss;
    this.wss.on('wss:client:playerTipo', this.newConnection.bind(this));
    this.wss.on('wss:connection:close', this.closeConnection.bind(this));
    this.wss.on('wss:connection:error', this.connectionError.bind(this));
    this.wss.on('wss:client:update', this.clientUpdate.bind(this));
    this.wss.on('wss:client:input', this.appendClientInput.bind(this));
    this.wss.on('wss:server:updateRate', (ws, msg) => {
      this.broadcastFrequency = msg.val | 0;
      console.log(this.broadcastFrequency);
    })

    /**
     *
     * Game
     *
     */
    this.updateFrequency = options.updateFrequency || 60;
    this.st = (1000 / this.updateFrequency) | 0;
    this.broadcastFrequency = options.broadcastFrequency || 20;
    this.gameEngine = options.gameEngine;
    this.connectedPlayers = {};
    this.playerInputQues = {};
    this.clientInput = [];
    this.stepCount = 0;
    this.colors = {
      'pacman': '#ff0',
      'rojo': '#f00',
      'cian': 'cyan',
      'rosa': 'pink',
      'naranja': 'orange'
    };
    this.last_processed_input = {};
    this.availablePlayers = ['pacman', 'rojo', 'cian', 'rosa', 'naranja'];

    try {
      this.start();
    }
    catch(e) {
      console.error(e);
    }
  }

  /*
   *
   * Connections
   *
   */
  newConnection(ws, tipo) {
    logger.log(`[engine] newConnection: ${ws.id}`);
    this.connectedPlayers[ws.id] = ws.id;
    this.last_processed_input[ws.id] = 0;

    this.gameEngine.addPlayer({
      color: this.colors[tipo],
      id: ws.id,
      tablero: this.gameEngine.tablero,
      tipo: tipo
    });
    // Con ws.id le mando solo a esa conexion
    this.wss.emit('ws:send', ws.id, 'engine:playerJoined', {
      id: ws.id,
      stepCount: this.stepCount,
      game: this.gameEngine.state,
      color: this.colors[Math.floor(Math.random() * 4)],
      tipo: tipo
    });
    // Sin id le mando a todas las conexiones
    this.wss.emit('ws:send', ws.id, 'engine:newConnection', {
      id: ws.id,
      game: this.gameEngine.state,
      tipo: tipo
    });

  }
  closeConnection(ws, code, message) {
    logger.log(`[engine] closeConnection: ${ws.id}\n code: ${code}\n message: ${message}`);
    delete this.connectedPlayers[ws.id];
    this.restoreAvailablePlayer(this.gameEngine.players[ws.id].tipo);
    this.gameEngine.removePlayer(ws);
    this.wss.emit('ws:send', null, 'engine:playerQuit', {
      id: ws.id,
      stepCount: this.stepCount,
      game: this.gameEngine.state,
    });
  }
  connectionError(ws, error) {
    logger.log(`[engine] connectionError: ${ws.id}\n error: ${error}`);
    delete this.connectedPlayers[ws.id];
    this.gameEngine.removePlayer(ws);
  }
  clientUpdate(ws, message) {
    logger.log(ws, message);
  }

  /*
   *
   * Engine logic
   *
   */
  start() {
    this.stepCount = 0; // Date.now() / 1000 | 0;
    this.gameEngine.start();
    this.step();
  }
  step() {
    this.processClientInput();
    this.gameEngine.step();
    this.stepCount++;

    if(this.stepCount % this.broadcastFrequency === 0) {
      this.broadcastUpdate();
    }

    setTimeout(this.step.bind(this), this.st);
  }
  stop() {

  }
  appendClientInput(ws, input) {
    this.clientInput.push(input);
  }
  broadcastUpdate() {
    for(const i in this.gameEngine.state.players) {
      this.gameEngine.state.players[i].last_processed_input = this.last_processed_input[i];
    }

    this.wss.emit('ws:send', false, 'engine:gameupdate', {
      stepCount: this.stepCount,
      game: this.gameEngine.state,
    });
  }
  processClientInput() {
    if(this.clientInput.length) {
      this.clientInput.forEach((inputs)=> {
        inputs.forEach(input => {
          logger.log('info', `Processing input: ${JSON.stringify(input)}`);
          logger.log('info', `input.stepcount: ${JSON.stringify(input.stepCount)}
          serverEngine.stepcount: ${this.stepCount}`);
          this.gameEngine.processInput(input);
          this.last_processed_input[input.playerId] = input.update_sequence_number;
        });
      });
      this.clientInput = [];
    }
  }
  getAvailablePlayers() {
    return this.availablePlayers;
  }
  updateAvailablePlayers(tipo) {
    if (this.availablePlayers.indexOf(tipo) === -1) {
      throw 'Player anavailable';
    } else {
      this.availablePlayers.splice(this.availablePlayers.indexOf(tipo), 1);
    }
  }
  restoreAvailablePlayer(tipo) {
    if (this.availablePlayers.indexOf(tipo) !== -1) {
      throw 'Player already exists';
    } else {
      this.availablePlayers.push(tipo);
    }
  }

}

module.exports = ServerEngine;
