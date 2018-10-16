// http://docs.lance.gg/develop/tutorial-overview_architecture.html
import Logger  from '../../utils/logger.js'
// const config = require('../../../config.json');
import WsConnection from './wsconnection'
const logger = new Logger({
  label: 'clientEngine',
});

/**
 *
 * @class ClientEngine
 * @return {Object} ClientEngine instance.
 */
export default class ClientEngine {
  constructor(options) {

    /**
     *
     * Config
     *
     */
    this.updateFrequency = options.updateFrequency || 60;
    this.st = (1000 / this.updateFrequency) | 0;
    this.stepDrift = 10;
    this.interpolarJugadores = true;

    /**
     *
     * Connections
     *
     */
    this.ws = new WsConnection({
      // wsServer: window.location.origin.replace(/^http/, 'ws') + ':443',
      wsServer: window.location.origin.replace(/^http/, 'ws'),
    });
    this.ws.on('ws:open', this.wsOnOpen.bind(this));
    this.ws.on('ws:close', this.wsOnClose.bind(this));
    this.ws.on('ws:error', this.wsOnError.bind(this));
    this.ws.on('engine:playerJoined', this.playerJoined.bind(this));
    this.ws.on('engine:playerQuit', this.playerQuit.bind(this));
    this.ws.on('engine:gameupdate', this.gameUpdate.bind(this));
    this.ws.init()
    .then(r => {
      console.log(r);
    })
    .catch(this.handlerError.bind(this));

    /**
     *
     * Game Engine
     *
     */
    this.gameEngine = options.gameEngine;
    this.controls = options.controls;
    this.update_sequence_number = 0;
    this.pending_updates = [];

    this.playerId = null;
    this.playerTipo = options.playerTipo;

    /**
     * Game Renderer
     */
    this.gameRenderer = options.gameRenderer;

    /*
     * Setup packets
     *
     */
    this.clientInput = [];
    this.controls.on('controls:input', this.processInput.bind(this));
  }

  /*
   *
   * Connections
   *
   */
  wsOnOpen(response) {
    logger.log('info', 'wsOnOpen', response);
    this.ws.emit('ws:send:playerTipo', this.playerTipo);
  }
  wsOnClose(message) {
    logger.warn('wsOnClose', message);
    this.gameEngine.stop();
  }
  wsOnError(error) {
    logger.error('wsOnError', error);
    this.gameEngine.stop();
  }
  playerJoined(response) {
    logger.log('playerJoined', response);
    this.playerId = response.id;
    this.stepCount = response.stepCount;
    this.start(response.game);
  }
  playerQuit(response) {
    logger.log('playerQuit', response);
    this.gameEngine.removePlayer(response);
  }
  /*
   *
   * Engine logic
   *
   */
  start(game) {

    this.gameEngine.start(game);
    this.gameRenderer.start.call(this.gameRenderer);
    this.delta = 0;
    this.step();
  }
  // Hay un desfasaje entre el stepCount del juego y del servidor,
  // se deberia handlear para que sean iguales.
  step() {
    if(this.clientInput.length) {
      this.ws.emit('ws:send:input', this.clientInput);
      this.clientInput = [];
    }
    if (this.interpolarJugadores) {
      for(var i in this.gameEngine.players) {
        this.interpolarPosicion(this.gameEngine.players[i]);
      }
    }
    this.gameEngine.step();
    this.stepCount++;
    setTimeout(this.step.bind(this), this.st);
  }

  gameUpdate(update) {

    if (Math.abs(this.gameEngine.stepCount - update.stepCount) > this.stepDrift ) {
      this.gameEngine.stepCount = update.stepCount;
    }

    for(const i in update.game.players) {
      if (i !== this.playerId) {
        if(typeof this.gameEngine.players[i] === 'undefined') {
          update.game.players[i].wsId = i;
          this.gameEngine.addPlayer(update.game.players[i]);
        }
        else {
          if (this.interpolarJugadores) {
            // Add it to the position buffer.
            var timestamp = +new Date();
            this.gameEngine.players[i].position_buffer.push([timestamp, update.game.players[i].ubicacion]);
          }
          this.applyUpdate(this.gameEngine.players[i], update.game.players[i]);

        }
      }
      if (i === this.playerId) {
        this.syncPlayer(this.gameEngine.players[i], update.game.players[i], update.stepCount);
      }
    }
  }
  applyUpdate(player, data) {
    for(const i in data) {
      if (typeof data[i] === 'object') {
        // por ahora solo la ubicacion es objeto
        if (this.interpolarJugadores) {
          this.interpolarPosicion(player)
        } else {
          for(const j in data[i]) {
            player[i][j] = data[i][j];
          }
        }
      } else {
        player[i] = data[i];
      }
    }
  }
  interpolarPosicion(jugador) {
    // Compute render timestamp.
    var now = +new Date();
    var render_timestamp = now - (1000.0 / 2);

    // Find the two authoritative positions surrounding the rendering timestamp.
    var buffer = jugador.position_buffer;

    // Drop older positions.
    while (buffer.length >= 2 && buffer[1][0] <= render_timestamp) {
      buffer.shift();
    }

    // Interpolate between the two surrounding authoritative positions.
    if (buffer.length >= 2 && buffer[0][0] <= render_timestamp && render_timestamp <= buffer[1][0]) {
      var x0 = buffer[0][1].x;
      var x1 = buffer[1][1].x;
      var y0 = buffer[0][1].y;
      var y1 = buffer[1][1].y;
      var t0 = buffer[0][0];
      var t1 = buffer[1][0];

      jugador.ubicacion.x = x0 + (x1 - x0) * (render_timestamp - t0) / (t1 - t0);
      jugador.ubicacion.y = y0 + (y1 - y0) * (render_timestamp - t0) / (t1 - t0);
    }
  }

  // FIXME: aca tengo alto bug que hace que el movimiento sea malo
  syncPlayer(player, data, stepCount) {

    player.ubicacion.x = data.ubicacion.x;
    player.ubicacion.y = data.ubicacion.y;
    player.setearUbicacionGrilla(player.ubicacion);

    let j = 0;
    while (j < this.pending_updates.length) {
      var input = this.pending_updates[j];
      if (input.update_sequence_number <= data.last_processed_input) {

        // Already processed. Its effect is already taken into account into the world update
        // we just got, so we can drop it.
        this.pending_updates.splice(j, 1);

      } else {

        // Not processed by the server yet. Re-apply it.
        this.gameEngine.processInput(input);
        j++;
      }
    }
  }
  processInput(input) {

    input.playerId = this.playerId;
    input.stepCount = this.gameEngine.stepCount;
    input.update_sequence_number = this.update_sequence_number++;
    this.pending_updates.push(input);

    logger.log('info', `Processing inpit: ${JSON.stringify(input)}`);
    logger.log('info', `input.stepcount: ${JSON.stringify(input.stepCount)}
    clientEngine.stepcount: ${this.stepCount}`);

    this.clientInput.push(input);

    // setTimeout(() => {
      this.gameEngine.processInput(input);
    // }, 50);
  }
  handlerError(error) {
    console.log(error);
  }
}
