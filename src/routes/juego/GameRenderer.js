
const Logger = require('../../utils/logger.js');
const logger = new Logger({
  label: 'gameRenderer',
});
const { EventEmitter } = require('events');

export default class GameRenderer extends EventEmitter {
  constructor(options) {
    super(options);
    logger.log('info', 'Initializing...', options);
    this.gameEngine = options.gameEngine;
  }
  start() {
    this.emit('gamerenderer:prestart');
  }
  render() {
    this.emit('gamerenderer:prerender');
  }
}
