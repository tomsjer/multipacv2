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
    this.wss.on('wss:connection:new', this.newConnection.bind(this));
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
    this.colors = ['#ff0', '#f00', '#0f0', '#00f'];
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
  newConnection(ws) {
    logger.log(`[engine] newConnection: ${ws.id}`);
    this.connectedPlayers[ws.id] = ws.id;
    this.gameEngine.addPlayer({
      color: this.colors[Math.floor(Math.random() * 4)],
      id: ws.id,
      tablero: this.gameEngine.tablero,
    });
    // Con ws.id le mando solo a esa conexion
    this.wss.emit('ws:send', ws.id, 'engine:playerJoined', {
      id: ws.id,
      stepCount: this.stepCount,
      game: this.gameEngine.state,
      color: this.colors[Math.floor(Math.random() * 4)],
    });
    // Sin id le mando a todas las conexiones
    this.wss.emit('ws:send', ws.id, 'engine:newConnection', {
      id: ws.id,
      game: this.gameEngine.state,
    });

  }
  closeConnection(ws, code, message) {
    logger.log(`[engine] closeConnection: ${ws.id}\n code: ${code}\n message: ${message}`);
    delete this.connectedPlayers[ws.id];
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
        });
      });
      this.clientInput = [];
    }
  }

}

module.exports = ServerEngine;
